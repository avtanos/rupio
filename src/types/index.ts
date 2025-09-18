export interface Client {
  id: string;
  personalFileNumber: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  region: string;
  address: string;
  phone: string;
  disabilityCategory: 'I группа' | 'II группа' | 'III группа';
  registrationDate: string;
  status: 'активный' | 'неактивный';
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  medicalInstitution: string;
  referralNumber: string;
  referralDate: string;
  diagnosis: string;
  diagnosisCode: string;
  productType: string;
  productCategory: string;
  measurements: Record<string, number>;
  status: 'регистрация' | 'мед_осмотр' | 'в_производстве' | 'готов_к_выдаче' | 'завершен';
  createdDate: string;
  expectedCompletionDate: string;
  actualCompletionDate: string | null;
  workshop: string | null;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  material: string;
  color: string;
  price: number;
  manufacturingTime: number;
  inStock: number;
  minStock: number;
  description: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  type: string;
  unit: string;
  pricePerUnit: number;
  inStock: number;
  minStock: number;
  supplier: string;
  lastDelivery: string;
  nextDelivery: string;
  description: string;
}

export interface ProcessStage {
  id: string;
  name: string;
  department: string;
  description: string;
  actions: string[];
  status: 'pending' | 'in_progress' | 'completed';
  orders: Order[];
}

export interface ReportData {
  administration: {
    annualDisabledPersonsReport: {
      year: number;
      totalRegistered: number;
      byRegion: Array<{ region: string; count: number; percentage: number }>;
      byGender: Array<{ gender: string; count: number; percentage: number }>;
      byCategory: Array<{ category: string; count: number; percentage: number }>;
    };
    annualProductsReport: {
      year: number;
      totalOrders: number;
      byProductType: Array<{ type: string; count: number; percentage: number }>;
      byRegion: Array<{ region: string; orders: number; percentage: number }>;
    };
  };
  workshop: {
    monthlyMaterialsConsumption: {
      month: string;
      materials: Array<{
        material: string;
        consumed: number;
        unit: string;
        cost: number;
        previousMonth: number;
        change: number;
      }>;
      totalCost: number;
      previousMonthCost: number;
      costChange: number;
    };
    monthlyLeatherTextileConsumption: {
      month: string;
      leatherMaterials: Array<{
        material: string;
        consumed: number;
        unit: string;
        products: string[];
      }>;
      textileMaterials: Array<{
        material: string;
        consumed: number;
        unit: string;
        products: string[];
      }>;
      totalLeatherCost: number;
      totalTextileCost: number;
      totalCost: number;
    };
  };
  warehouse: {
    monthlyFootwearReport: {
      month: string;
      receipts: Array<{ date: string; quantity: number; type: string }>;
      issuances: Array<{ date: string; quantity: number; type: string; clientId: string }>;
      totalReceived: number;
      totalIssued: number;
      remaining: number;
    };
    monthlyProsthesesReport: {
      month: string;
      receipts: Array<{ date: string; quantity: number; type: string }>;
      issuances: Array<{ date: string; quantity: number; type: string; clientId: string }>;
      totalReceived: number;
      totalIssued: number;
      remaining: number;
    };
    monthlyWheelchairsReport: {
      month: string;
      receipts: Array<{ date: string; quantity: number; type: string }>;
      issuances: Array<{ date: string; quantity: number; type: string; clientId: string }>;
      totalReceived: number;
      totalIssued: number;
      remaining: number;
    };
    finishedProductsReport: {
      month: string;
      products: Array<{
        type: string;
        received: number;
        issued: number;
        remaining: number;
        examples: string[];
      }>;
    };
  };
}
