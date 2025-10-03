export type OrthosisProductType = 
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
  | 'Аппарат Илизарова';

export type OrthosisDiagnosis = 
  // Заболевания суставов
  | 'Артроз коленного сустава'
  | 'Артроз голеностопного сустава'
  | 'Артроз тазобедренного сустава'
  | 'Артроз плечевого сустава'
  | 'Артроз локтевого сустава'
  | 'Артроз лучезапястного сустава'
  | 'Ревматоидный артрит'
  | 'Остеоартроз'
  | 'Подагра'
  // Травмы
  | 'Перелом костей'
  | 'Вывих сустава'
  | 'Растяжение связок'
  | 'Разрыв связок'
  | 'Ушиб сустава'
  | 'Травма мениска'
  | 'Травма сухожилий'
  // Заболевания позвоночника
  | 'Остеохондроз'
  | 'Сколиоз'
  | 'Кифоз'
  | 'Лордоз'
  | 'Межпозвоночная грыжа'
  | 'Спондилез'
  | 'Спондилоартроз'
  // Неврологические заболевания
  | 'ДЦП'
  | 'Инсульт'
  | 'Рассеянный склероз'
  | 'Полиомиелит'
  | 'Паралич'
  | 'Парез'
  // Врожденные аномалии
  | 'Врожденный вывих бедра'
  | 'Косолапость'
  | 'Кривошея'
  | 'Врожденная деформация стопы'
  // Послеоперационные состояния
  | 'После эндопротезирования'
  | 'После артроскопии'
  | 'После пластики связок'
  | 'После остеосинтеза'
  // Другие
  | 'Плоскостопие'
  | 'Вальгусная деформация'
  | 'Варусная деформация'
  | 'Контрактура сустава'
  | 'Атрофия мышц'
  | 'Остеопороз';

export type OrthosisSide = 'Левый' | 'Правый' | 'Оба';

export type OrthosisOrderType = 'Первичный' | 'Вторичный';

export type OrthosisOrderStatus = 'Срочный' | 'Обычный';

export type OrthosisServiceType = 'Платная' | 'Бесплатная';

export interface OrthosisMaterial {
  id: string;
  articleNumber: string;
  materialName: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

export interface OrthosisFitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate?: string;
  appointmentDate?: string;
}

export interface OrthosisOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  personalFileId: string;
  clientName: string;
  disabilityGroup: string;
  disabilityCategory: string;
  productType: OrthosisProductType;
  diagnosis: OrthosisDiagnosis;
  side: OrthosisSide;
  isHospitalized: boolean;
  orderType: OrthosisOrderType;
  materials: OrthosisMaterial[];
  status: OrthosisOrderStatus;
  urgencyReason?: string;
  serviceType: OrthosisServiceType;
  orderCost: number;
  fittings: OrthosisFitting[];
  manufacturingDate?: string;
  issueDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrthosisOrderFormData {
  productType: OrthosisProductType;
  diagnosis: OrthosisDiagnosis;
  side: OrthosisSide;
  isHospitalized: boolean;
  orderType: OrthosisOrderType;
  materials: OrthosisMaterial[];
  status: OrthosisOrderStatus;
  urgencyReason?: string;
  serviceType: OrthosisServiceType;
  orderCost: number;
  fittings: OrthosisFitting[];
  notes?: string;
}
