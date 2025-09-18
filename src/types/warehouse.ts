import { PersonalFile } from './personalFile';
import { ManufacturingOrder } from './manufacturing';

// Статус выдачи
export type IssuanceStatus = 'На складе' | 'Выдано' | 'Зарезервировано';

// Готовая продукция на складе
export interface WarehouseProduct {
  id: string;
  manufacturingOrderId: string;
  manufacturingOrder?: ManufacturingOrder;
  personalFileId: string;
  personalFile?: PersonalFile;
  productName: string; // Наименование изделия
  orderNumber: string; // № заказа
  receiptDate: string; // Дата поступления
  receiptInvoiceNumber: string; // № накладной поступления
  issuanceDate?: string; // Дата выдачи
  issuanceInvoiceNumber?: string; // № накладной выдачи
  status: IssuanceStatus;
  warehouseLocation: string; // Место на складе
  receivedBy: string; // Кто принял на склад
  issuedBy?: string; // Кто выдал
  notes?: string; // Примечания
  createdAt: string;
  updatedAt: string;
}

// Фильтры для поиска
export interface WarehouseFilters {
  searchTerm: string; // Поиск по ФИО или наименованию
  productName: string; // Фильтр по наименованию изделия
  receiptDateFrom: string; // Период поступления С
  receiptDateTo: string; // Период поступления ПО
  issuanceDateFrom: string; // Период выдачи С
  issuanceDateTo: string; // Период выдачи ПО
  status: string; // Статус (все, на складе, выдано)
}

// Данные формы выдачи
export interface IssuanceFormData {
  issuanceDate: string;
  issuanceInvoiceNumber: string;
  issuedBy: string;
  notes: string;
}

// Статистика склада
export interface WarehouseStats {
  totalProducts: number;
  onWarehouse: number;
  issued: number;
  reserved: number;
  recentReceipts: number; // Поступления за последние 7 дней
}

// Последние поступления
export interface RecentReceipt {
  id: string;
  productName: string;
  orderNumber: string;
  receiptDate: string;
  personalFile: PersonalFile;
  status: IssuanceStatus;
}
