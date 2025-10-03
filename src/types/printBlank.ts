// Типы для бланков печати

export interface PrintBlankBase {
  id: string;
  orderId: string;
  orderType: 'prosthesis' | 'footwear';
  printDate: string;
  printedBy: string;
}

// Бланк для протеза
export interface ProsthesisPrintBlank extends PrintBlankBase {
  orderType: 'prosthesis';
  // Личные данные заказчика
  clientData: {
    pin: string;
    fullName: string;
    documentType: string;
    documentNumber: string;
    birthYear: number;
    gender: string;
  };
  // Данные заказа
  orderData: {
    diagnosis: string;
    productType: string;
    components: ProsthesisPrintComponent[];
  };
  // Фото клиента
  clientPhoto?: string;
}

export interface ProsthesisPrintComponent {
  id: string;
  name: string; // Наименование полуфабриката
  code: string; // Шифр полуфабриката
  size: string;
  leftQuantity: number;
  rightQuantity: number;
  needsCast: boolean; // Слепок: Да/Нет
}

// Бланк для ортобуви
export interface FootwearPrintBlank extends PrintBlankBase {
  orderType: 'footwear';
  // Личные данные заказчика
  clientData: {
    pin: string;
    fullName: string;
    documentType: string;
    documentNumber: string;
    birthYear: number;
    gender: string;
  };
  // Данные заказа
  orderData: {
    diagnosis: string;
    productDescription: string; // Описание изделия
    productName: string; // Наименование изделия
    color: string;
    fasteningType: string; // Вид крепления
    soleType: string; // Вид подошвы
    measurements: FootwearMeasurements;
    needsCast: boolean; // Слепок (гипс): Да/Нет
  };
  // Фото клиента
  clientPhoto?: string;
}

export interface FootwearMeasurements {
  archSize: string; // Размер вкладки свода
  pronatorSize: string; // Размер пронатора
  footSize: string; // Размер стопы
  shorteningSize: string; // Размер укорочения
  heelPlugSize: string; // Размер пробки по пяту
}

// Справочники для печати
export interface PrintReference {
  id: string;
  name: string;
  category: string;
}

// Полуфабрикаты для протезов
export type ProsthesisSemiFinished = 
  | 'Шины'
  | 'Стопа'
  | 'Щиколотка'
  | 'Узел'
  | 'Вертлук'
  | 'П/кольцо'
  | 'Сидение'
  | 'Кисть'
  | 'Стелька'
  | 'Болванка'
  | 'Насадка';

// Шифры полуфабрикатов для протезов
export type ProsthesisCode = 
  | 'ПБ-001'
  | 'ПБ-002'
  | 'ПБ-003'
  | 'СТ-001'
  | 'СТ-002'
  | 'ЩК-001'
  | 'УЗ-001'
  | 'ВТ-001'
  | 'ПК-001'
  | 'СД-001'
  | 'КС-001'
  | 'СТЛ-001'
  | 'БЛ-001'
  | 'НС-001';

// Описания изделий для ортобуви
export type FootwearDescription = 
  | 'круговой жесткий корсет с обеих сторон до носка'
  | 'круговой жесткий корсет с внутренней стороны до носка'
  | 'металлическая пластинка подошвы'
  | 'увеличенные размеры'
  | 'Укорочение нижних конечностей';

// Наименования изделий для ортобуви
export type FootwearProductName = 
  | 'ортботинки из хрома без меха'
  | 'ортботинки из хрома с мехом'
  | 'ортботинки летние'
  | 'ботинки без меха'
  | 'ботинки с мехом'
  | 'полуботинки'
  | 'полусапожки'
  | 'женские туфли'
  | 'женские туфли лодочки';

// Цвета для ортобуви
export type FootwearColor = 
  | 'черный'
  | 'красный'
  | 'синий'
  | 'комбинированный'
  | 'бордовый';

// Виды крепления для ортобуви
export type FootwearFastening = 
  | 'на шнуровке'
  | 'на замочках'
  | 'на ремешках'
  | 'на резинках'
  | 'с одним перекидным ремешком';

// Виды подошвы для ортобуви
export type FootwearSole = 
  | 'микропористая'
  | 'полиуретановая';
