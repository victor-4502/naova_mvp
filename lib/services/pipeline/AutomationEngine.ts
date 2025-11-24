// @ts-nocheck
// TODO: Activar cuando el schema POS esté activo

// Automation Engine - Reglas automáticas de transición

import { prisma } from '@/lib/prisma'
import { PipelineService } from './PipelineService'
import type { PipelineStage } from '@/lib/types/request'
import { PIPELINE_STAGES, REQUEST_STATUSES } from '@/lib/utils/constants'

export interface AutomationRule {
  id: string
  name: string
  condition: (request: any) => boolean
  action: (requestId: string) => Promise<void>
  priority: number
}

export class AutomationEngine {
  /**
   * Ejecuta reglas automáticas para un request
   */
  static async processRequest(requestId: string): Promise<void> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        specs: {
          include: {
            items: true,
          },
        },
        rfq: {
          include: {
            quotes: true,
          },
        },
        purchaseOrder: true,
      },
    })

    if (!request) return

    // Obtener reglas aplicables
    const rules = this.getRules()

    // Ejecutar reglas en orden de prioridad
    for (const rule of rules.sort((a, b) => a.priority - b.priority)) {
      if (rule.condition(request)) {
        await rule.action(requestId)
        break // Solo ejecutar una regla por vez
      }
    }
  }

  /**
   * Obtiene todas las reglas de automatización
   */
  private static getRules(): AutomationRule[] {
    return [
      {
        id: 'incomplete-specs',
        name: 'Mover a needs_info si specs incompletas',
        condition: (request) => {
          if (!request.specs) return true
          return request.specs.completeness < 0.7
        },
        action: async (requestId) => {
          await PipelineService.moveRequest(requestId, 'needs_info')
        },
        priority: 1,
      },
      {
        id: 'complete-specs',
        name: 'Mover a finding_suppliers si specs completas',
        condition: (request) => {
          if (!request.specs) return false
          return (
            request.specs.completeness >= 0.7 &&
            request.pipelineStage === 'needs_info'
          )
        },
        action: async (requestId) => {
          await PipelineService.moveRequest(requestId, 'finding_suppliers')
        },
        priority: 2,
      },
      {
        id: 'rfq-sent',
        name: 'Mover a quotes_in_progress cuando RFQ se envía',
        condition: (request) => {
          return (
            request.rfq !== null &&
            request.pipelineStage === 'finding_suppliers'
          )
        },
        action: async (requestId) => {
          await PipelineService.moveRequest(requestId, 'quotes_in_progress')
        },
        priority: 3,
      },
      {
        id: 'quotes-received',
        name: 'Mover a selecting_quote cuando hay >= 2 cotizaciones',
        condition: (request) => {
          return (
            request.rfq !== null &&
            request.rfq.quotes.length >= 2 &&
            request.pipelineStage === 'quotes_in_progress'
          )
        },
        action: async (requestId) => {
          await PipelineService.moveRequest(requestId, 'selecting_quote')
        },
        priority: 4,
      },
      {
        id: 'po-created',
        name: 'Mover a purchase_in_progress cuando se crea PO',
        condition: (request) => {
          return (
            request.purchaseOrder !== null &&
            request.pipelineStage === 'selecting_quote'
          )
        },
        action: async (requestId) => {
          await PipelineService.moveRequest(requestId, 'purchase_in_progress')
        },
        priority: 5,
      },
      {
        id: 'delivered',
        name: 'Mover a delivered cuando PO está entregado',
        condition: (request) => {
          return (
            request.purchaseOrder !== null &&
            request.purchaseOrder.status === 'delivered' &&
            request.pipelineStage === 'purchase_in_progress'
          )
        },
        action: async (requestId) => {
          await PipelineService.moveRequest(requestId, 'delivered')
        },
        priority: 6,
      },
    ]
  }

  /**
   * Procesa todos los requests pendientes
   */
  static async processAllPending(): Promise<void> {
    const requests = await prisma.request.findMany({
      where: {
        status: {
          not: 'closed',
        },
      },
    })

    await Promise.all(
      requests.map((request) => this.processRequest(request.id))
    )
  }
}

