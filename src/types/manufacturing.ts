import { WorkOrder } from './orders';
import { PersonalFile } from './personalFile';

// Расходный материал
export interface ConsumableMaterial {
  id: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  unit: string; // единица измерения
  quantityPlanned: number; // запланированное количество
  quantityUsed: number; // фактически использованное количество
  unitPrice: number; // цена за единицу
  totalCost: number; // общая стоимость
  notes?: string; // примечания
}

// Статус готовности продукции
export type ProductReadinessStatus = 
  | 'В работе'
  | 'Готово к примерке'
  | 'На примерке'
  | 'Доработка'
  | 'Готово к передаче'
  | 'Передано на склад';

// Информация о готовности
export interface ProductReadiness {
  status: ProductReadinessStatus;
  stage: string;
  completionPercentage: number;
  notes?: string;
  readinessDate?: string; // дата готовности
  fittingCallDate?: string; // дата вызова на примерку
  fittingDate?: string; // дата явки на примерку
  fittingNotes?: string; // примечания к примерке
  completionDate?: string; // дата завершения
  qualityNotes?: string; // примечания по качеству
}

// Изготовление заказа
export interface ManufacturingOrder {
  id: string;
  workOrderId: string;
  workOrder?: WorkOrder;
  personalFileId: string;
  personalFile?: PersonalFile;
  orderType: string; // тип заказа (протез, обувь, etc.)
  productName: string; // наименование изделия
  orderNumber: string; // номер заказа/наряда
  orderDate: string; // дата заказа
  startDate?: string; // дата начала изготовления
  plannedCompletionDate?: string; // планируемая дата завершения
  actualCompletionDate?: string; // фактическая дата завершения
  materials: ConsumableMaterial[]; // расходные материалы
  readiness: ProductReadiness; // готовность продукции
  assignedWorker: string; // назначенный работник
  workshop: string; // цех
  priority: 'Низкий' | 'Средний' | 'Высокий' | 'Критический';
  status: ManufacturingStatus;
  notes?: string; // общие примечания
  createdAt: string;
  updatedAt: string;
}

// Статус изготовления
export type ManufacturingStatus = 
  | 'В очереди'
  | 'В работе'
  | 'Приостановлено'
  | 'Готово'
  | 'Передано на склад'
  | 'Отменено';

// Наряд передачи на склад
export interface TransferOrder {
  id: string;
  manufacturingOrderId: string;
  manufacturingOrder?: ManufacturingOrder;
  transferNumber: string; // номер наряда передачи
  transferDate: string; // дата передачи
  warehouseLocation: string; // место на складе
  transferredBy: string; // кто передал
  receivedBy?: string; // кто принял
  status: 'Создан' | 'Передан' | 'Принят';
  notes?: string;
  createdDate: string;
  createdAt: string;
  updatedAt: string;
}

// Фильтры для поиска
export interface ManufacturingFilters {
  searchTerm: string;
  statusFilter: string;
  orderTypeFilter: string;
  workerFilter: string;
  workshopFilter: string;
  priorityFilter: string;
  dateFrom: string;
  dateTo: string;
}

// Данные формы изготовления
export interface ManufacturingFormData {
  workOrderId: string;
  assignedWorker: string;
  workshop: string;
  priority: string;
  plannedCompletionDate: string;
  notes: string;
}

// Данные формы расходного материала
export interface MaterialFormData {
  materialId: string;
  materialName: string;
  materialCode: string;
  unit: string;
  quantityPlanned: number;
  quantityUsed: number;
  unitPrice: number;
  notes: string;
}
