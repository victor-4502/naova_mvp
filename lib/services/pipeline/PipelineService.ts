// @ts-nocheck
// TODO: Activar cuando el schema POS esté activo

// Pipeline Service - Gestiona el pipeline Kanban

import { prisma } from '@/lib/prisma'
import type { PipelineStage, RequestStatus } from '@/lib/types/request'
import { PIPELINE_STAGES, REQUEST_STATUSES } from '@/lib/utils/constants'

export interface PipelineColumn {
  stage: PipelineStage
  title: string
  requests: Array<{
    id: string
    title: string
    category?: string
    urgency: string
    createdAt: Date
    clientName: string
  }>
}

export interface PipelineData {
  columns: PipelineColumn[]
  totalRequests: number
}

export class PipelineService {
  /**
   * Obtiene todos los requests organizados por stage del pipeline
   */
  static async getPipeline(
    clientId?: string
  ): Promise<PipelineData> {
    const whereClause: any = {}
    if (clientId) {
      whereClause.clientId = clientId
    }

    const requests = await prisma.request.findMany({
      where: whereClause,
      include: {
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Organizar por columnas
    const columns: PipelineColumn[] = [
      {
        stage: 'new_request',
        title: 'Nueva Solicitud',
        requests: [],
      },
      {
        stage: 'needs_info',
        title: 'Falta Información',
        requests: [],
      },
      {
        stage: 'finding_suppliers',
        title: 'Buscando Proveedores',
        requests: [],
      },
      {
        stage: 'quotes_in_progress',
        title: 'Cotizaciones en Curso',
        requests: [],
      },
      {
        stage: 'selecting_quote',
        title: 'Seleccionando Cotización',
        requests: [],
      },
      {
        stage: 'purchase_in_progress',
        title: 'Compra en Proceso',
        requests: [],
      },
      {
        stage: 'delivered',
        title: 'Entregado',
        requests: [],
      },
      {
        stage: 'closed',
        title: 'Cerrado',
        requests: [],
      },
    ]

    requests.forEach((request) => {
      const column = columns.find((c) => c.stage === request.pipelineStage)
      if (column) {
        column.requests.push({
          id: request.id,
          title: request.category || 'Sin categoría',
          category: request.category || undefined,
          urgency: request.urgency,
          createdAt: request.createdAt,
          clientName: request.client.name,
        })
      }
    })

    return {
      columns,
      totalRequests: requests.length,
    }
  }

  /**
   * Mueve un request a otro stage
   */
  static async moveRequest(
    requestId: string,
    newStage: PipelineStage
  ): Promise<void> {
    // Determinar el status correspondiente al stage
    const status = this.getStatusFromStage(newStage)

    await prisma.request.update({
      where: { id: requestId },
      data: {
        pipelineStage: newStage,
        status,
        updatedAt: new Date(),
      },
    })
  }

  /**
   * Obtiene el status correspondiente a un stage
   */
  private static getStatusFromStage(stage: PipelineStage): RequestStatus {
    const mapping: Record<PipelineStage, RequestStatus> = {
      new_request: 'new_request',
      needs_info: 'incomplete_information',
      finding_suppliers: 'ready_for_supplier_matching',
      quotes_in_progress: 'rfq_sent',
      selecting_quote: 'quotes_received',
      purchase_in_progress: 'po_created',
      delivered: 'delivered',
      closed: 'closed',
    }

    return mapping[stage] || 'new_request'
  }
}

