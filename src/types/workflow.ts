// Типы для системы workflow и передачи заказов между отделами

export type WorkflowStatus = 
  | 'draft'                    // Черновик
  | 'registration_pending'     // Ожидает в регистратуре
  | 'medical_review'          // На рассмотрении в медотделе
  | 'chief_approval'          // На одобрении главного врача
  | 'dispatcher_assignment'   // Назначен диспетчером
  | 'in_production'           // В производстве
  | 'ready_for_fitting'       // Готов к примерке
  | 'completed'               // Завершен
  | 'rejected'                // Отклонен
  | 'returned_for_revision';  // Возвращен на доработку

export type WorkflowAction = 
  | 'send_to_medical'         // Отправить в медотдел
  | 'send_to_chief'           // Отправить главному врачу
  | 'approve'                 // Одобрить
  | 'reject'                  // Отклонить
  | 'return_for_revision'     // Вернуть на доработку
  | 'assign_to_dispatcher'    // Назначить диспетчеру
  | 'assign_to_production'    // Назначить в производство
  | 'mark_ready'              // Отметить готовым
  | 'complete';               // Завершить

export interface WorkflowStep {
  id: string;
  orderId: string;
  fromDepartment: string;
  toDepartment: string;
  action: WorkflowAction;
  status: WorkflowStatus;
  performedBy: string;
  performedAt: string;
  comments?: string;
  attachments?: string[]; // ID прикрепленных файлов
}

export interface WorkflowHistory {
  id: string;
  orderId: string;
  steps: WorkflowStep[];
  currentStatus: WorkflowStatus;
  currentDepartment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  orderId: string;
  recipientId: string;
  recipientRole: string;
  type: 'workflow_update' | 'approval_required' | 'rejection' | 'assignment';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  actionUrl?: string;
}

export interface LimbVisualization {
  id: string;
  orderId: string;
  limbType: 'left_arm' | 'right_arm' | 'left_leg' | 'right_leg' | 'torso';
  side: 'left' | 'right';
  images: {
    front: string;    // URL изображения спереди
    side: string;     // URL изображения сбоку
    back?: string;    // URL изображения сзади
    detail?: string;  // URL детального изображения
  };
  measurements: {
    length: number;
    circumference: number;
    width: number;
    height: number;
    customMeasurements: Record<string, number>;
  };
  annotations: {
    id: string;
    x: number;
    y: number;
    label: string;
    description: string;
  }[];
  createdAt: string;
  createdBy: string;
}

export interface MedicalConclusion {
  id: string;
  orderId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  conclusion: string;
  diagnosis: string;
  recommendations: string;
  contraindications?: string;
  attachments: string[]; // ID прикрепленных файлов
  limbVisualizations: string[]; // ID визуализаций конечностей
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  version: number;
  previousVersionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentAssignment {
  id: string;
  orderId: string;
  department: 'medical' | 'workshop' | 'warehouse' | 'dispatcher';
  assignedBy: string;
  assignedAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  notes?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'on_hold';
}

export interface WorkflowPermissions {
  role: string;
  canSendToMedical: boolean;
  canSendToChief: boolean;
  canApprove: boolean;
  canReject: boolean;
  canReturnForRevision: boolean;
  canAssignToDispatcher: boolean;
  canAssignToProduction: boolean;
  canViewAllOrders: boolean;
  canEditMedicalConclusions: boolean;
  canCreateLimbVisualizations: boolean;
}
