export type RepairProductType = 
  | 'Протез бедра'
  | 'Протез голени'
  | 'Протез плеча'
  | 'Протез предплечья'
  | 'Протез кисти'
  | 'Протез стопы'
  | 'Косметический протез'
  | 'Спортивный протез'
  | 'Модульный протез'
  | 'Ортез коленного сустава'
  | 'Ортез голеностопного сустава'
  | 'Ортез тазобедренного сустава'
  | 'Ортез плечевого сустава'
  | 'Ортез локтевого сустава'
  | 'Ортез лучезапястного сустава'
  | 'Корсет поясничный'
  | 'Корсет грудопоясничный'
  | 'Корсет шейный'
  | 'Бандаж брюшной'
  | 'Бандаж паховый'
  | 'Бандаж на коленный сустав'
  | 'Бандаж на голеностопный сустав'
  | 'Бандаж на плечевой сустав'
  | 'Бандаж на локтевой сустав'
  | 'Бандаж на лучезапястный сустав'
  | 'Реклинатор'
  | 'Фиксатор позвоночника'
  | 'Тутор'
  | 'Аппарат Илизарова'
  | 'Ортопедическая обувь'
  | 'Ортопедические стельки'
  | 'Ортопедические вкладыши'
  | 'Ортопедические приспособления';

export type RepairOrderStatus = 'Срочный' | 'Обычный';

export type RepairServiceType = 'Платная' | 'Бесплатная';

export interface RepairMaterial {
  id: string;
  articleNumber: string;
  materialName: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

export interface RepairFitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate?: string;
  appointmentDate?: string;
}

export interface RepairOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  personalFileId: string;
  clientName: string;
  disabilityGroup: string;
  disabilityCategory: string;
  productType: RepairProductType;
  materials: RepairMaterial[];
  status: RepairOrderStatus;
  urgencyReason?: string;
  serviceType: RepairServiceType;
  orderCost: number;
  fittings: RepairFitting[];
  manufacturingDate?: string;
  issueDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface RepairOrderFormData {
  productType: RepairProductType;
  materials: RepairMaterial[];
  status: RepairOrderStatus;
  urgencyReason?: string;
  serviceType: RepairServiceType;
  orderCost: number;
  fittings: RepairFitting[];
  notes?: string;
}
