// Simple state management for the app
interface Tender {
  id: string
  title: string
  status: 'processing' | 'active' | 'selected' | 'closed' | 'cancelled'
  startAt: string
  endAt: string
  requirement: {
    title: string
    category: string
    quantity: number
    unit: string
  }
  products: Array<{
    id: string
    name: string
    description: string
    category: string
    quantity: number
    unit: string
    specifications: string
    budget: number
  }>
  offers: Array<{
    id: string
    provider: {
      id: string
      name: string
      email: string
      phone: string
      rating: number
    }
    totalAmount: number
    validUntil: string
    status: 'pending' | 'accepted' | 'rejected'
    notes?: string
    productOffers?: Array<{
      productId: string
      unitPrice: number
      quantity: number
      subtotal: number
      productName?: string
      price?: number
    }>
  }>
  clientId: string
  createdAt: string
}

interface PriceHistory {
  id: string
  productName: string
  productCategory: string
  providerName: string
  providerId: string
  unitPrice: number
  quantity: number
  tenderId: string
  tenderTitle: string
  date: string
  clientId: string
}

interface Requirement {
  id: string
  title: string
  description: string
  deadline: string
  products: Array<{
    id: string
    name: string
    description: string
    category: string
    quantity: number
    unit: string
    specifications?: string
    budget?: number
  }>
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED'
  createdAt: string
}

class AppStore {
  private tenders: Tender[] = []
  private requirements: Requirement[] = []
  private priceHistory: PriceHistory[] = []
  private listeners: Set<() => void> = new Set()

  constructor() {
    // Cargar datos del localStorage al inicializar solo en el cliente
    if (typeof window !== 'undefined') {
      this.loadFromStorage()
    }
  }

  // Tenders
  getTenders(): Tender[] {
    return this.tenders
  }

  addTender(tender: Tender): void {
    this.tenders.push(tender)
    this.saveToStorage()
    this.notifyListeners()
  }

  updateTender(id: string, updates: Partial<Tender>): void {
    const index = this.tenders.findIndex(t => t.id === id)
    if (index !== -1) {
      this.tenders[index] = { ...this.tenders[index], ...updates }
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Activate a processing tender
  activateTender(id: string): void {
    const tender = this.tenders.find(t => t.id === id)
    if (tender && tender.status === 'processing') {
      tender.status = 'active'
      tender.startAt = new Date().toISOString()
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Requirements
  getRequirements(): Requirement[] {
    return this.requirements
  }

  addRequirement(requirement: Requirement): void {
    this.requirements.push(requirement)
    this.saveToStorage()
    this.notifyListeners()
  }

  updateRequirement(id: string, updates: Partial<Requirement>): void {
    const index = this.requirements.findIndex(r => r.id === id)
    if (index !== -1) {
      this.requirements[index] = { ...this.requirements[index], ...updates }
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Price History
  getPriceHistory(): PriceHistory[] {
    return this.priceHistory
  }

  addPriceHistory(priceEntry: PriceHistory): void {
    this.priceHistory.push(priceEntry)
    this.saveToStorage()
  }

  getPriceHistoryByProduct(productName: string): PriceHistory[] {
    return this.priceHistory.filter(p => p.productName === productName)
  }

  getPriceHistoryByProvider(providerId: string): PriceHistory[] {
    return this.priceHistory.filter(p => p.providerId === providerId)
  }

  getPriceHistoryByClient(clientId: string): PriceHistory[] {
    return this.priceHistory.filter(p => p.clientId === clientId)
  }

  // Convert requirement to tender
  createTenderFromRequirement(requirement: Requirement): Tender {
    const tender: Tender = {
      id: `tender-${requirement.id}`,
      title: requirement.title,
      status: 'processing',
      startAt: new Date().toISOString(),
      endAt: requirement.deadline,
      requirement: {
        title: requirement.title,
        category: requirement.products[0]?.category || 'General',
        quantity: requirement.products.reduce((sum, p) => sum + p.quantity, 0),
        unit: requirement.products[0]?.unit || 'unidades'
      },
      offers: [], // Empty initially, providers will add offers
      clientId: 'client-001', // This would come from auth context
      createdAt: new Date().toISOString(),
      // Agregar productos detallados
      products: requirement.products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        quantity: p.quantity,
        unit: p.unit,
        specifications: p.specifications || '',
        budget: p.budget || 0
      }))
    }
    return tender
  }

  // Listeners
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }

  // LocalStorage methods
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('naova_tenders', JSON.stringify(this.tenders))
      localStorage.setItem('naova_requirements', JSON.stringify(this.requirements))
      localStorage.setItem('naova_priceHistory', JSON.stringify(this.priceHistory))
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const tendersData = localStorage.getItem('naova_tenders')
        const requirementsData = localStorage.getItem('naova_requirements')
        const priceHistoryData = localStorage.getItem('naova_priceHistory')
        
        if (tendersData) {
          this.tenders = JSON.parse(tendersData)
        }
        if (requirementsData) {
          this.requirements = JSON.parse(requirementsData)
        }
        if (priceHistoryData) {
          this.priceHistory = JSON.parse(priceHistoryData)
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    }
  }
}

export const appStore = new AppStore()
export type { Tender, Requirement, PriceHistory }
