export type FootwearDiagnosis = 
  | 'ДЦП'
  | 'Косолапость правосторонняя'
  | 'Косолапость левосторонняя'
  | 'Укорочение левой нижней конечности'
  | 'Укорочение правой нижней конечности'
  | 'Деформация пальцев стоп левый'
  | 'Деформация пальцев стоп правый'
  | 'Левая Слоновость'
  | 'Правая Слоновость'
  | 'Левый порез'
  | 'Правый порез'
  | 'Левая конская стопа'
  | 'Правая конская стопа';

export type FootwearModel = 
  | 'Ортопедические туфли'
  | 'Ортопедические ботинки'
  | 'Ортопедические сапоги'
  | 'Ортопедические кроссовки'
  | 'Ортопедические сандалии'
  | 'Ортопедические тапочки'
  | 'Ортопедические сапожки';

export type FootwearColor = 
  | 'Черный'
  | 'Красный'
  | 'Комбинированный'
  | 'Бордовый'
  | 'Коричневый'
  | 'Серый'
  | 'Белый'
  | 'Синий'
  | 'Зеленый';

export type FootwearMaterial = 
  | 'Натуральная кожа'
  | 'Искусственная кожа'
  | 'Текстиль'
  | 'Замша'
  | 'Нубук'
  | 'Комбинированный';

export type HeelMaterial = 
  | 'Резина'
  | 'Пластик'
  | 'Дерево'
  | 'Металл'
  | 'Комбинированный';

export type FootwearOrderType = 'Первичный' | 'Вторичный';

export type FootwearOrderStatus = 'Срочный' | 'Обычный';

export type FootwearServiceType = 'Платная' | 'Бесплатная';

export interface TechnicalOperation {
  id: string;
  operationName: string;
  executorName: string;
  executionDate?: string;
  qualityCheck: boolean;
}

export interface FootwearFitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate?: string;
  appointmentDate?: string;
}

export interface FootwearOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  personalFileId: string;
  clientName: string;
  disabilityGroup: string;
  disabilityCategory: string;
  
  // Основные поля заказа
  diagnosis: FootwearDiagnosis;
  model: FootwearModel;
  color: FootwearColor;
  material: FootwearMaterial;
  heelHeight: number;
  heelMaterial: HeelMaterial;
  isHospitalized: boolean;
  orderType: FootwearOrderType;
  
  // Дополнительные поля для укорочения
  leftLegShortening?: number; // в см
  rightLegShortening?: number; // в см
  
  // Статус и приоритет
  status: FootwearOrderStatus;
  urgencyReason?: string;
  serviceType: FootwearServiceType;
  
  // Технические операции
  technicalOperations: TechnicalOperation[];
  
  // Примерки
  fittings: FootwearFitting[];
  
  // Даты выполнения
  manufacturingDate?: string;
  issueDate?: string;
  
  // Системные поля
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface FootwearOrderFormData {
  diagnosis: FootwearDiagnosis;
  model: FootwearModel;
  color: FootwearColor;
  material: FootwearMaterial;
  heelHeight: number;
  heelMaterial: HeelMaterial;
  isHospitalized: boolean;
  orderType: FootwearOrderType;
  leftLegShortening?: number;
  rightLegShortening?: number;
  status: FootwearOrderStatus;
  urgencyReason?: string;
  serviceType: FootwearServiceType;
  technicalOperations: TechnicalOperation[];
  fittings: FootwearFitting[];
  notes?: string;
}
