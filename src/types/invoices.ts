// Базовые типы для накладных
export type InvoiceType = 
  | 'prosthesis' 
  | 'footwear' 
  | 'ottobock' 
  | 'repair' 
  | 'ready-poi';

export type InvoiceStatus = 
  | 'draft' 
  | 'approved' 
  | 'sent' 
  | 'received' 
  | 'completed' 
  | 'cancelled';

export type InvoicePriority = 'low' | 'normal' | 'high' | 'urgent';

// Базовый интерфейс накладной
export interface BaseInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  orderNumber: string;
  personalFileId: string;
  clientName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: InvoiceStatus;
  priority: InvoicePriority;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  sentDate?: string;
  receivedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Накладная на протезы
export interface ProsthesisInvoice extends BaseInvoice {
  type: 'prosthesis';
  prosthesisType: string;
  components: ProsthesisInvoiceComponent[];
  measurements: ProsthesisMeasurements;
  needsCast: boolean;
  manufacturingDate?: string;
  qualityCheck: boolean;
}

export interface ProsthesisInvoiceComponent {
  id: string;
  name: string;
  code: string;
  size: string;
  leftQuantity: number;
  rightQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProsthesisMeasurements {
  height?: number;
  weight?: number;
  activityLevel?: string;
  stumpLength?: number;
  stumpShape?: string;
  mobility?: string;
  scarType?: string;
  skinCondition?: string;
  boneSaw?: string;
  support?: boolean;
  objectiveData?: string;
}

// Накладная на обувь
export interface FootwearInvoice extends BaseInvoice {
  type: 'footwear';
  model: string;
  color: string;
  material: string;
  heelHeight: number;
  heelMaterial: string;
  size: string;
  technicalOperations: FootwearTechnicalOperation[];
  fittings: FootwearFitting[];
  needsCast: boolean;
  leftLegShortening?: number;
  rightLegShortening?: number;
}

export interface FootwearTechnicalOperation {
  id: string;
  operationName: string;
  executorName: string;
  executionDate: string;
  qualityCheck: boolean;
}

export interface FootwearFitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate: string;
  appointmentDate: string;
}

// Накладная на Оттобок
export interface OttobockInvoice extends BaseInvoice {
  type: 'ottobock';
  productType: string;
  materials: OttobockInvoiceMaterial[];
  fittings: OttobockFitting[];
  needsCast: boolean;
  manufacturingDate?: string;
  qualityCheck: boolean;
}

export interface OttobockInvoiceMaterial {
  id: string;
  articleNumber: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  totalPrice: number;
  notes?: string;
}

export interface OttobockFitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate: string;
  appointmentDate: string;
}

// Накладная на ремонт
export interface RepairInvoice extends BaseInvoice {
  type: 'repair';
  repairType: string;
  materials: RepairInvoiceMaterial[];
  fittings: RepairFitting[];
  needsCast: boolean;
  repairDate?: string;
  qualityCheck: boolean;
}

export interface RepairInvoiceMaterial {
  id: string;
  articleNumber: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  totalPrice: number;
  notes?: string;
}

export interface RepairFitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate: string;
  appointmentDate: string;
}

// Накладная на готовые ПОИ
export interface ReadyPoiInvoice extends BaseInvoice {
  type: 'ready-poi';
  productCategory: string;
  materials: ReadyPoiInvoiceMaterial[];
  fittings: ReadyPoiFitting[];
  needsCast: boolean;
  manufacturingDate?: string;
  qualityCheck: boolean;
}

export interface ReadyPoiInvoiceMaterial {
  id: string;
  articleNumber: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  totalPrice: number;
  notes?: string;
}

export interface ReadyPoiFitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate: string;
  appointmentDate: string;
}

// Объединенный тип накладной
export type Invoice = 
  | ProsthesisInvoice 
  | FootwearInvoice 
  | OttobockInvoice 
  | RepairInvoice 
  | ReadyPoiInvoice;

// Фильтры для накладных
export interface InvoiceFilters {
  searchTerm: string;
  status: string;
  priority: string;
  dateFrom: string;
  dateTo: string;
  productName: string;
  clientName: string;
  createdBy: string;
}

// Статистика накладных
export interface InvoiceStats {
  total: number;
  draft: number;
  approved: number;
  sent: number;
  received: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
  averageAmount: number;
}
