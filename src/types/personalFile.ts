export interface PersonalFile {
  id: string;
  personalFileNumber: string; // Формат: ГОД-НОМЕР ДЕЛА (ХХХХ-ХХХХ)
  
  // Личные данные
  pin: string; // ПИН
  documentType: 'Паспорт' | 'Свидетельство о рождении';
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: 'Мужской' | 'Женский';
  birthYear: string; // Год рождения
  passportSeries: 'ID' | 'AC' | 'AN' | 'KGZ01' | 'KR-X';
  passportNumber: string;
  passportIssuedBy: string; // Орган выдачи
  passportIssueDate: string; // Дата выдачи
  pensionNumber?: string; // № Пенсионного удостоверения
  pensionIssueDate?: string; // Дата выдачи пенсионного
  pensionIssuedBy?: string; // Орган выдачи пенсионного
  
  // Адреса
  registrationAddress: string; // Адрес по прописке
  actualAddress: string; // Адрес фактический
  addressSameAsRegistration: boolean; // Совпадает с пропиской
  
  // Контакты
  phone?: string; // Номер телефона
  additionalPhone?: string; // Дополнительный номер
  workplace?: string; // Место работы
  
  // Медицинская информация
  disabilityCategory: 'ЛОВЗ до 18 лет' | 'ЛОВЗ с детства' | 'Инвалид ВОВ' | 'Инвалид советской армии' | 'Инвалид труда';
  disabilityGroup: '1 группа' | '2 группа' | '3 группа';
  disabilityReason?: 'Травма' | 'Врожденный' | 'Заболевание';
  operationInfo?: string; // Где и когда оперирован
  additions?: string; // Дополнения (до 255 символов)
  
  // Системная информация
  registrationDate: string;
  status: 'активный' | 'архивный';
  services: ServiceRecord[];
  directions: ServiceDirection[];
  prostheticsData?: ProstheticsData; // Данные по протезированию (заполняются в случае протезирования)
}

export interface ServiceRecord {
  id: string;
  serviceDate: string;
  serviceType: string;
  serviceDescription: string;
  orderNumber?: string;
  status: 'завершен' | 'в_процессе' | 'отменен';
  responsiblePerson: string;
  notes?: string;
}

export interface ServiceDirection {
  id: string;
  directionDate: string; // Дата направления
  diagnosis: string; // Диагноз при направлении
  institution: string; // Учреждение
  doctorName: string; // ФИО Врача
  serviceType: string; // Вид услуги
  notes?: string; // Дополнительные примечания
}

export interface ProstheticsData {
  id: string;
  stumpLength?: string; // Длина культи
  stumpShape?: 'цилиндрическая' | 'булавовидная' | 'умеренно-коническая' | 'резко-коническая' | 'избыток ткани' | 'атрофия'; // Форма культи
  stumpMobility?: 'нормальная' | 'ограничение движения' | 'контрактура'; // Подвижность культи
  contractureDescription?: string; // Описание контрактуры (если выбрана)
  scar?: 'линейный' | 'звездчатый' | 'центральный' | 'передний' | 'задний' | 'боковой' | 'подвижный' | 'спаянный' | 'безболезненный' | 'келоидный'; // Рубец
  skinCondition?: 'нормальный' | 'синюшный' | 'отечный' | 'потертости' | 'трещины' | 'язвы' | 'свищи' | 'невромы'; // Состояние кожного покрова
  boneCondition?: 'болезненный' | 'безболезненный' | 'неровный' | 'гладкий' | 'остеофиты'; // Костный опил
  stumpSupport?: boolean; // Опорность культи (да/нет)
  objectiveData?: string; // Объективные данные (свободная текстовая запись)
}

export interface PersonalFileSearchParams {
  pin?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  personalFileNumber?: string;
}
