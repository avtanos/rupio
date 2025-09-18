export type OttobockProductType = 
  | 'Протез бедра'
  | 'Протез голени'
  | 'Протез плеча'
  | 'Протез предплечья'
  | 'Протез кисти'
  | 'Протез стопы'
  | 'Косметический протез'
  | 'Спортивный протез'
  | 'Модульный протез';

export type OttobockDiagnosis = 
  // Ампутация нижней конечности
  | 'Ампутация левого бедра'
  | 'Ампутация правого бедра'
  | 'Ампутация левой голени'
  | 'Ампутация правой голени'
  | 'Ампутация обеих бедер'
  | 'Ампутация обеих голеней'
  | 'Ампутация левого тазобедренного сустава'
  | 'Ампутация правого тазобедренного сустава'
  | 'Ампутация левого по Пирогову'
  | 'Ампутация правого по Пирогову'
  | 'Ампутация правого по Шопару'
  | 'Ампутация левого по Шопару'
  | 'Ампутация левого по Лесфранку'
  | 'Ампутация обеих по Шопару'
  | 'Ампутация обеих по Лесфранку'
  // Ампутация верхней конечности
  | 'Ампутация левого плеча'
  | 'Ампутация правого плеча'
  | 'Ампутация обеих плеч'
  | 'Ампутация левого предплечья'
  | 'Ампутация правого предплечья'
  | 'Ампутация обеих предплечий'
  | 'Ампутация левой кисти'
  | 'Ампутация правой кисти'
  | 'Ампутация обеих кистей';

export type OttobockSide = 'Левый' | 'Правый';

export type OttobockOrderType = 'Первичный' | 'Вторичный';

export type OttobockOrderStatus = 'Срочный' | 'Обычный';

export type OttobockServiceType = 'Платная' | 'Бесплатная';

export interface OttobockMaterial {
  id: string;
  articleNumber: string;
  materialName: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

export interface OttobockFitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate?: string;
  appointmentDate?: string;
}

export interface OttobockOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  personalFileId: string;
  clientName: string;
  disabilityGroup: string;
  disabilityCategory: string;
  productType: OttobockProductType;
  diagnosis: OttobockDiagnosis;
  side: OttobockSide;
  isHospitalized: boolean;
  orderType: OttobockOrderType;
  materials: OttobockMaterial[];
  status: OttobockOrderStatus;
  urgencyReason?: string;
  serviceType: OttobockServiceType;
  orderCost: number;
  fittings: OttobockFitting[];
  manufacturingDate?: string;
  issueDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OttobockOrderFormData {
  productType: OttobockProductType;
  diagnosis: OttobockDiagnosis;
  side: OttobockSide;
  isHospitalized: boolean;
  orderType: OttobockOrderType;
  materials: OttobockMaterial[];
  status: OttobockOrderStatus;
  urgencyReason?: string;
  serviceType: OttobockServiceType;
  orderCost: number;
  fittings: OttobockFitting[];
  notes?: string;
}
