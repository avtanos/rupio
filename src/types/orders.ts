export type OrderType = 'Заказ на изготовление протеза' | 'Заказ на изготовление обуви' | 'Заказ на изготовление Оттобок' | 'Наряд на ремонт' | 'Заказ на готовые ПОИ';

export type OrderStatus = 'создан' | 'в_производстве' | 'готов' | 'выдан' | 'отменен' | 'draft' | 'registration_pending' | 'medical_review' | 'chief_approval' | 'dispatcher_assignment' | 'in_production' | 'ready_for_fitting' | 'completed' | 'rejected' | 'returned_for_revision';

export interface WorkOrder {
  id: string;
  orderNumber: string; // № наряда/заказа
  orderDate: string; // Дата заказа
  personalFileId: string; // Связь с личным делом
  clientName: string; // ФИО ЛОВЗ
  disabilityGroup: string; // Группа инвалидности
  disabilityCategory: string; // Категория
  productName: string; // Наименование ПОИ (Протезно-ортопедическое изделие)
  manufacturingDate?: string; // Дата изготовления
  issueDate?: string; // Дата выдачи
  movementStatus: string; // Статус о движении изделий
  status: OrderStatus; // Статус (выполнено/не выполнено)
  orderType: OrderType; // Тип заказа/наряда
  measurements: Record<string, number>; // Измерения
  notes?: string; // Примечания
  createdBy: string; // Кто создал
  createdAt: string; // Дата создания
  updatedAt: string; // Дата обновления
  // Workflow поля
  workflowStatus?: 'draft' | 'registration_pending' | 'medical_review' | 'chief_approval' | 'dispatcher_assignment' | 'in_production' | 'ready_for_fitting' | 'completed' | 'rejected' | 'returned_for_revision';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedDepartment?: string;
  requiresApproval?: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export interface OrderSearchParams {
  orderDate?: string;
  clientName?: string;
  productName?: string;
  orderType?: OrderType;
  status?: OrderStatus;
  disabilityGroup?: string;
}

export interface OrderFormData {
  personalFileId: string;
  orderType: OrderType;
  productName: string;
  measurements: Record<string, number>;
  notes?: string;
}
