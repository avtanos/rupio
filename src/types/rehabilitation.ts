import { PersonalFile } from './personalFile';

export interface RehabilitationDirection {
  id: string;
  directionNumber: string; // ГОД/НОМЕР (например: 2024/001)
  personalFileId: string;
  personalFile?: PersonalFile;
  directionDate: string; // Дата направления
  diagnosis: string; // Диагноз
  msekCertificate: string; // Справка МСЭК
  status: RehabilitationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // ID сотрудника, создавшего направление
}

export type RehabilitationStatus = 
  | 'Создано'
  | 'Отправлено'
  | 'Принято в ЦР ЛОВЗ'
  | 'В процессе реабилитации'
  | 'Завершено'
  | 'Отклонено';

export interface RehabilitationDirectionFormData {
  personalFileId: string;
  diagnosis: string;
  msekCertificate: string;
  directionDate: string;
}

export interface RehabilitationDirectionFilters {
  searchTerm: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
}
