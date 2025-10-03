import React, { useState, useEffect } from 'react';
import { Client, Order, ReportData } from '../types';
import { PersonalFile } from '../types/personalFile';
import { WorkOrder } from '../types/orders';
import { RehabilitationDirection } from '../types/rehabilitation';
import { ManufacturingOrder, TransferOrder } from '../types/manufacturing';
import { WarehouseProduct } from '../types/warehouse';
import { clients as initialClients, orders as initialOrders, personalFiles as initialPersonalFiles, reports as initialReports, workOrders as initialWorkOrders, rehabilitationDirections as initialRehabilitationDirections, manufacturingOrders as initialManufacturingOrders, materialsCatalog as initialMaterialsCatalog, transferOrders as initialTransferOrders, warehouseProducts as initialWarehouseProducts, invoices as initialInvoices } from '../data';
import { adaptWorkOrderToProsthesisOrder, adaptProsthesisOrderToWorkOrder, adaptWorkOrderToFootwearOrder, adaptFootwearOrderToWorkOrder, adaptWorkOrderToOttobockOrder, adaptOttobockOrderToWorkOrder, adaptWorkOrderToOrthosisOrder, adaptOrthosisOrderToWorkOrder, adaptWorkOrderToRepairOrder, adaptRepairOrderToWorkOrder, adaptWorkOrderToReadyPoiOrder, adaptReadyPoiOrderToWorkOrder } from '../utils/orderAdapters';
import ProsthesisPrintBlankComponent from './ProsthesisPrintBlank';
import FootwearPrintBlankComponent from './FootwearPrintBlank';
import { ProsthesisPrintBlank, FootwearPrintBlank } from '../types/printBlank';
import ProcessStage from './ProcessStage';
import RegistrationStage from './RegistrationStage';
import MedicalDepartmentStage from './MedicalDepartmentStage';
import WorkshopStage from './WorkshopStage';
import WarehouseStage from './WarehouseStage';
import AdministrationReports from './reports/AdministrationReports';
import WorkshopReports from './reports/WorkshopReports';
import WarehouseReports from './reports/WarehouseReports';
import OrdersManagement from './OrdersManagement';
import InvoicesManagement from './InvoicesManagement';
import ProsthesisOrdersPage from './ProsthesisOrdersPage';
import FootwearOrdersPage from './FootwearOrdersPage';
import OttobockOrdersPage from './OttobockOrdersPage';
import OrthosisOrdersPage from './OrthosisOrdersPage';
import RepairOrdersPage from './RepairOrdersPage';
import ReadyPoiOrdersPage from './ReadyPoiOrdersPage';
import RehabilitationDirectionsPage from './RehabilitationDirectionsPage';
import ManufacturingOrdersPage from './ManufacturingOrdersPage';
import WarehouseIssuancePage from './WarehouseIssuancePage';
import ProsthesisInvoicesPage from './ProsthesisInvoicesPage';
import FootwearInvoicesPage from './FootwearInvoicesPage';
import OttobockInvoicesPage from './OttobockInvoicesPage';
import RepairInvoicesPage from './RepairInvoicesPage';
import ReadyPoiInvoicesPage from './ReadyPoiInvoicesPage';
import PermissionsTable from './PermissionsTable';
import RoleSelector from './RoleSelector';
import RoleIndicator from './RoleIndicator';
import { UserRole, ROLE_NAVIGATION, canView, canCreate, canEdit, canDelete, canPrint } from '../types/roles';
import { Invoice } from '../types/invoices';
import { 
  Home, 
  Users, 
  Stethoscope, 
  Wrench, 
  Package, 
  BarChart3, 
  Settings,
  Menu,
  X,
  FileText,
  ClipboardList,
  Receipt,
  Archive
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(initialClients as unknown as Client[]);
  const [orders, setOrders] = useState<Order[]>(initialOrders as unknown as Order[]);
  const [personalFiles, setPersonalFiles] = useState<PersonalFile[]>(initialPersonalFiles as unknown as PersonalFile[]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders as unknown as WorkOrder[]);
  const [rehabilitationDirections, setRehabilitationDirections] = useState<RehabilitationDirection[]>(initialRehabilitationDirections as unknown as RehabilitationDirection[]);
  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>(initialManufacturingOrders as unknown as ManufacturingOrder[]);
  const [materialsCatalog] = useState(initialMaterialsCatalog as unknown as any[]);
  const [transferOrders, setTransferOrders] = useState<TransferOrder[]>(initialTransferOrders as unknown as TransferOrder[]);
  const [warehouseProducts, setWarehouseProducts] = useState<WarehouseProduct[]>(initialWarehouseProducts as unknown as WarehouseProduct[]);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices as unknown as Invoice[]);
  const [reportData, setReportData] = useState<ReportData | null>(initialReports as unknown as ReportData);
  const [activeTab, setActiveTab] = useState('process');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [currentRole, setCurrentRole] = useState<UserRole>('administration');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showPrintBlank, setShowPrintBlank] = useState(false);
  const [printBlankType, setPrintBlankType] = useState<'prosthesis' | 'footwear' | null>(null);
  const [printBlankData, setPrintBlankData] = useState<any>(null);

  useEffect(() => {
    console.log('Данные загружены:', {
      clients: clients.length,
      orders: orders.length,
      personalFiles: personalFiles.length,
      reports: reportData ? 'загружены' : 'не загружены'
    });
  }, [clients, orders, personalFiles, reportData]);

  const handleOrderUpdate = (orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const handleNewClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: `C${String(clients.length + 1).padStart(3, '0')}`
    };
    setClients(prevClients => [...prevClients, newClient]);
  };

  const handleNewOrder = (order: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...order,
      id: `O${String(orders.length + 1).padStart(3, '0')}`,
      orderNumber: `З-2024-${String(orders.length + 1).padStart(3, '0')}`,
      status: 'регистрация'
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  const handleNewPersonalFile = (personalFile: PersonalFile) => {
    setPersonalFiles(prevFiles => [...prevFiles, personalFile]);
  };

  const handleUpdatePersonalFile = (id: string, updates: Partial<PersonalFile>) => {
    setPersonalFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === id ? { ...file, ...updates } : file
      )
    );
  };

  const handleNewWorkOrder = (workOrder: WorkOrder) => {
    setWorkOrders(prevOrders => [...prevOrders, workOrder]);
  };

  const handleUpdateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const handleNewProsthesisOrder = (order: any) => {
    const workOrder = adaptProsthesisOrderToWorkOrder(order);
    setWorkOrders(prevOrders => [...prevOrders, workOrder]);
  };

  const handleUpdateProsthesisOrder = (id: string, updates: Partial<any>) => {
    setWorkOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const handleDeleteProsthesisOrder = (id: string) => {
    setWorkOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  const handleNewFootwearOrder = (order: any) => {
    const workOrder = adaptFootwearOrderToWorkOrder(order);
    setWorkOrders(prevOrders => [...prevOrders, workOrder]);
  };

  const handleUpdateFootwearOrder = (id: string, updates: Partial<any>) => {
    setWorkOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const handleDeleteFootwearOrder = (id: string) => {
    setWorkOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  const handleNewOttobockOrder = (order: any) => {
    const workOrder = adaptOttobockOrderToWorkOrder(order);
    setWorkOrders(prevOrders => [...prevOrders, workOrder]);
  };

  const handleUpdateOttobockOrder = (id: string, updates: Partial<any>) => {
    setWorkOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const handleDeleteOttobockOrder = (id: string) => {
    setWorkOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  const handleNewOrthosisOrder = (order: any) => {
    const workOrder = adaptOrthosisOrderToWorkOrder(order);
    setWorkOrders(prevOrders => [...prevOrders, workOrder]);
  };

  const handleUpdateOrthosisOrder = (id: string, updates: Partial<any>) => {
    setWorkOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const handleDeleteOrthosisOrder = (id: string) => {
    setWorkOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  const handleNewRepairOrder = (order: any) => {
    const workOrder = adaptRepairOrderToWorkOrder(order);
    setWorkOrders(prevOrders => [...prevOrders, workOrder]);
  };

  const handleUpdateRepairOrder = (id: string, updates: Partial<any>) => {
    setWorkOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const handleDeleteRepairOrder = (id: string) => {
    setWorkOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  const handleNewReadyPoiOrder = (order: any) => {
    const workOrder = adaptReadyPoiOrderToWorkOrder(order);
    setWorkOrders(prevOrders => [...prevOrders, workOrder]);
  };

  const handleUpdateReadyPoiOrder = (id: string, updates: Partial<any>) => {
    setWorkOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const handleDeleteReadyPoiOrder = (id: string) => {
    setWorkOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  // Функции для направлений на реабилитацию
  const handleNewRehabilitationDirection = (directionData: any) => {
    const newDirection: RehabilitationDirection = {
      ...directionData,
      id: `rehab-${String(rehabilitationDirections.length + 1).padStart(3, '0')}`,
      directionNumber: generateDirectionNumber(),
      status: 'Создано',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'medical-001' // В реальном приложении получать из контекста пользователя
    };
    setRehabilitationDirections(prevDirections => [...prevDirections, newDirection]);
  };

  const handleUpdateRehabilitationDirection = (id: string, updates: Partial<RehabilitationDirection>) => {
    setRehabilitationDirections(prevDirections => 
      prevDirections.map(direction => 
        direction.id === id ? { ...direction, ...updates, updatedAt: new Date().toISOString() } : direction
      )
    );
  };

  const handleDeleteRehabilitationDirection = (id: string) => {
    setRehabilitationDirections(prevDirections => prevDirections.filter(direction => direction.id !== id));
  };

  // Генерация номера направления (ГОД/НОМЕР)
  const generateDirectionNumber = () => {
    const currentYear = new Date().getFullYear();
    const currentCount = rehabilitationDirections.filter(d => d.directionNumber.startsWith(currentYear.toString())).length + 1;
    return `${currentYear}/${currentCount.toString().padStart(3, '0')}`;
  };

  // Функции для изготовления заказов
  const handleNewManufacturingOrder = (orderData: any) => {
    const newOrder: ManufacturingOrder = {
      ...orderData,
      id: `mfg-${String(manufacturingOrders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setManufacturingOrders(prevOrders => [...prevOrders, newOrder]);
  };

  const handleUpdateManufacturingOrder = (id: string, updates: Partial<ManufacturingOrder>) => {
    setManufacturingOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
      )
    );
  };

  const handleDeleteManufacturingOrder = (id: string) => {
    setManufacturingOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  const handleNewTransferOrder = (transferData: any) => {
    const newTransfer: TransferOrder = {
      ...transferData,
      id: `trf-${String(transferOrders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTransferOrders(prevTransfers => [...prevTransfers, newTransfer]);
  };

  // Функции для склада готовой продукции
  const handleUpdateWarehouseProduct = (id: string, updates: Partial<WarehouseProduct>) => {
    setWarehouseProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
      )
    );
  };

  const handleIssueProduct = (id: string, issuanceData: any) => {
    setWarehouseProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { 
          ...product, 
          ...issuanceData,
          status: 'Выдано',
          updatedAt: new Date().toISOString()
        } : product
      )
    );
  };

  // Функции для накладных
  const handleNewInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Invoice;
    setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
  };

  const handleUpdateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === id ? { 
          ...invoice, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } as Invoice : invoice
      )
    );
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
  };

  const handlePrintInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      console.log('Печать накладной:', invoice);
      alert('Накладная отправлена на печать!');
    }
  };

  // Функции для печати бланков
  const handlePrintProsthesisBlank = (orderId: string, personalFile: PersonalFile, diagnosis: string, productType: string) => {
    setPrintBlankType('prosthesis');
    setPrintBlankData({
      orderId,
      clientData: {
        pin: personalFile.pin,
        fullName: `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.trim(),
        documentType: personalFile.documentType,
        documentNumber: personalFile.passportNumber,
        birthYear: personalFile.birthYear,
        gender: personalFile.gender
      },
      diagnosis,
      productType
    });
    setShowPrintBlank(true);
  };

  const handlePrintFootwearBlank = (orderId: string, personalFile: PersonalFile, diagnosis: string) => {
    setPrintBlankType('footwear');
    setPrintBlankData({
      orderId,
      clientData: {
        pin: personalFile.pin,
        fullName: `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.trim(),
        documentType: personalFile.documentType,
        documentNumber: personalFile.passportNumber,
        birthYear: personalFile.birthYear,
        gender: personalFile.gender
      },
      diagnosis
    });
    setShowPrintBlank(true);
  };

  const handleClosePrintBlank = () => {
    setShowPrintBlank(false);
    setPrintBlankType(null);
    setPrintBlankData(null);
  };

  const handlePrintBlank = (blank: ProsthesisPrintBlank | FootwearPrintBlank) => {
    // Здесь можно добавить логику для отправки на печать
    console.log('Печать бланка:', blank);
    // В реальном приложении здесь будет вызов API для печати
    alert('Бланк отправлен на печать!');
    handleClosePrintBlank();
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'orders' || itemId === 'invoices') {
      toggleSubmenu(itemId);
    } else {
      setActiveTab(itemId);
      setSidebarOpen(false);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setShowRoleSelector(false);
    // Сброс активной вкладки на первую доступную для роли
    const availableTabs = ROLE_NAVIGATION[role];
    if (availableTabs.length > 0) {
      setActiveTab(availableTabs[0]);
    }
  };

  const isTabAccessible = (tabId: string): boolean => {
    return ROLE_NAVIGATION[currentRole].includes(tabId);
  };

  const getFilteredNavigationItems = () => {
    return navigationItems.filter(item => {
      if (item.hasSubmenu) {
        // Для подменю проверяем доступность хотя бы одного подэлемента
        if (item.id === 'orders') {
          return orderSubmenuItems.some(subItem => isTabAccessible(subItem.id));
        }
        if (item.id === 'invoices') {
          return invoiceSubmenuItems.some(subItem => isTabAccessible(subItem.id));
        }
        if (item.id === 'medical') {
          return medicalSubmenuItems.some(subItem => isTabAccessible(subItem.id));
        }
        if (item.id === 'workshop') {
          return workshopSubmenuItems.some(subItem => isTabAccessible(subItem.id));
        }
        if (item.id === 'warehouse') {
          return warehouseSubmenuItems.some(subItem => isTabAccessible(subItem.id));
        }
      }
      return isTabAccessible(item.id);
    });
  };

  const getFilteredSubmenuItems = (parentId: string) => {
    if (parentId === 'orders') {
      return orderSubmenuItems.filter(subItem => isTabAccessible(subItem.id));
    }
    if (parentId === 'invoices') {
      return invoiceSubmenuItems.filter(subItem => isTabAccessible(subItem.id));
    }
    if (parentId === 'medical') {
      return medicalSubmenuItems.filter(subItem => isTabAccessible(subItem.id));
    }
    if (parentId === 'workshop') {
      return workshopSubmenuItems.filter(subItem => isTabAccessible(subItem.id));
    }
    if (parentId === 'warehouse') {
      return warehouseSubmenuItems.filter(subItem => isTabAccessible(subItem.id));
    }
    return [];
  };

  const processStages = [
    {
      id: 'registration',
      name: 'Регистрация',
      department: 'Регистратура',
      description: 'Регистрация нового личного дела или поиск имеющегося, ввод направления с мед. учреждения',
      actions: [
        'Регистрация нового личного дела или поиск имеющегося',
        'Ввод направления с мед. учреждения'
      ],
      status: 'completed' as const,
      orders: orders.filter(order => order.status === 'регистрация')
    },
    {
      id: 'medical',
      name: 'Выписка наряда/заказа',
      department: 'Мед.Отдел',
      description: 'Осмотр, постановка диагноза, заполнение наряда, печать бланков, снятие мерок',
      actions: [
        'Осмотр, постановка / уточнение диагноза',
        'Отправка на реабилитацию в ЦР ЛОВЗ',
        'Заполнение наряда/ заказа',
        'Печать бланков заказа',
        'Снятие мерок'
      ],
      status: 'in_progress' as const,
      orders: orders.filter(order => order.status === 'мед_осмотр' || order.status === 'в_производстве')
    },
    {
      id: 'workshop',
      name: 'Выполнение заказа',
      department: 'Цеха',
      description: 'Изготовление, примерка, составление накладной, отправка на склад',
      actions: [
        'Изготовление',
        'Примерка',
        'Составление накладной, печать',
        'Отправка на склад готовой продукции'
      ],
      status: 'in_progress' as const,
      orders: orders.filter(order => order.status === 'в_производстве' || order.status === 'готов_к_выдаче')
    },
    {
      id: 'warehouse',
      name: 'Выдача заказа',
      department: 'Склад готовой продукции',
      description: 'Прием изделий на склад, выдача изделий клиентам',
      actions: [
        'Прием изделий на склад готовой продукции',
        'Выдача изделий'
      ],
      status: 'pending' as const,
      orders: orders.filter(order => order.status === 'готов_к_выдаче' || order.status === 'завершен')
    }
  ];

  const navigationItems = [
    { id: 'process', label: 'Бизнес-процесс', icon: Home },
    { id: 'registration', label: 'Картотека', icon: Users },
    { id: 'orders', label: 'Заказы и наряды', icon: ClipboardList, hasSubmenu: true },
    { id: 'invoices', label: 'Накладные', icon: Receipt, hasSubmenu: true },
    { id: 'medical', label: 'Мед. Отдел', icon: Stethoscope, hasSubmenu: true },
    { id: 'workshop', label: 'Цеха', icon: Wrench, hasSubmenu: true },
    { id: 'warehouse', label: 'Склад', icon: Package, hasSubmenu: true },
    { id: 'reports', label: 'Отчеты', icon: BarChart3 },
    { id: 'settings', label: 'Настройки', icon: Settings }
  ];

  const orderSubmenuItems = [
    { id: 'prosthesis-orders', label: 'Заказы на изготовление протеза', icon: FileText },
    { id: 'footwear-orders', label: 'Заказы на изготовление обуви', icon: FileText },
    { id: 'ottobock-orders', label: 'Заказы на изготовление Отто-бок', icon: FileText },
    { id: 'orthosis-orders', label: 'Заказы на изготовление Оттобок', icon: FileText },
    { id: 'repair-orders', label: 'Наряды на ремонт', icon: FileText },
    { id: 'ready-poi-orders', label: 'Заказы на готовые ПОИ', icon: FileText }
  ];

  const invoiceSubmenuItems = [
    { id: 'prosthesis-invoices', label: 'Накладные на протезы', icon: Receipt },
    { id: 'footwear-invoices', label: 'Накладные на обувь', icon: Receipt },
    { id: 'ottobock-invoices', label: 'Накладные на Отто-бок', icon: Receipt },
    { id: 'orthosis-invoices', label: 'Накладные на Оттобок', icon: Receipt },
    { id: 'repair-invoices', label: 'Накладные на ремонт', icon: Receipt },
    { id: 'ready-poi-invoices', label: 'Накладные на готовые ПОИ', icon: Receipt }
  ];

  const medicalSubmenuItems = [
    { id: 'rehabilitation-directions', label: 'Направления на реабилитацию', icon: Stethoscope }
  ];

  const workshopSubmenuItems = [
    { id: 'manufacturing-orders', label: 'Изготовление заказов', icon: Wrench }
  ];

  const warehouseSubmenuItems = [
    { id: 'warehouse-issuance', label: 'Выдача заказов', icon: Package }
  ];

  const renderContent = () => {
    if (showRoleSelector) {
      return (
        <div className="space-y-6">
          <RoleSelector
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'process':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Графическая модель бизнес-процесса оказания услуг РУПОИ
                </h1>
                <button
                  onClick={() => setShowRoleSelector(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Сменить роль</span>
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {processStages.map((stage) => (
                  <ProcessStage
                    key={stage.id}
                    stage={stage}
                    onOrderClick={setSelectedOrder}
                  />
                ))}
              </div>
            </div>
          </div>
        );
        case 'registration':
          return (
            <RegistrationStage
              clients={clients}
              orders={orders}
              personalFiles={personalFiles}
              workOrders={workOrders}
              onNewClient={handleNewClient}
              onNewOrder={handleNewOrder}
              onNewPersonalFile={handleNewPersonalFile}
              onUpdatePersonalFile={handleUpdatePersonalFile}
              onNewWorkOrder={handleNewWorkOrder}
              onUpdateWorkOrder={handleUpdateWorkOrder}
            />
          );
      case 'prosthesis-orders':
        return (
          <ProsthesisOrdersPage
            orders={workOrders
              .filter(order => order.orderType === 'Заказ на изготовление протеза')
              .map(adaptWorkOrderToProsthesisOrder)
              .filter((order): order is NonNullable<typeof order> => order !== null)
            }
            personalFiles={personalFiles}
            onNewOrder={handleNewProsthesisOrder}
            onUpdateOrder={handleUpdateProsthesisOrder}
            onDeleteOrder={handleDeleteProsthesisOrder}
            onPrintBlank={handlePrintProsthesisBlank}
          />
        );
      case 'footwear-orders':
        return (
          <FootwearOrdersPage
            orders={workOrders
              .filter(order => order.orderType === 'Заказ на изготовление обуви')
              .map(adaptWorkOrderToFootwearOrder)
              .filter((order): order is NonNullable<typeof order> => order !== null)
            }
            personalFiles={personalFiles}
            onNewOrder={handleNewFootwearOrder}
            onUpdateOrder={handleUpdateFootwearOrder}
            onDeleteOrder={handleDeleteFootwearOrder}
            onPrintBlank={handlePrintFootwearBlank}
          />
        );
      case 'ottobock-orders':
        return (
          <OttobockOrdersPage
            orders={workOrders
              .filter(order => order.orderType === 'Заказ на изготовление Отто-бок')
              .map(adaptWorkOrderToOttobockOrder)
              .filter((order): order is NonNullable<typeof order> => order !== null)
            }
            personalFiles={personalFiles}
            onNewOrder={handleNewOttobockOrder}
            onUpdateOrder={handleUpdateOttobockOrder}
            onDeleteOrder={handleDeleteOttobockOrder}
            onPrintBlank={handlePrintProsthesisBlank}
          />
        );
      case 'orthosis-orders':
        return (
          <OrthosisOrdersPage
            orders={workOrders
              .filter(order => order.orderType === 'Заказ на изготовление Оттобок')
              .map(adaptWorkOrderToOrthosisOrder)
              .filter((order): order is NonNullable<typeof order> => order !== null)
            }
            personalFiles={personalFiles}
            onNewOrder={handleNewOrthosisOrder}
            onUpdateOrder={handleUpdateOrthosisOrder}
            onDeleteOrder={handleDeleteOrthosisOrder}
            onPrintBlank={handlePrintProsthesisBlank}
          />
        );
      case 'repair-orders':
        return (
          <RepairOrdersPage
            orders={workOrders
              .filter(order => order.orderType === 'Наряд на ремонт')
              .map(adaptWorkOrderToRepairOrder)
              .filter((order): order is NonNullable<typeof order> => order !== null)
            }
            personalFiles={personalFiles}
            onNewOrder={handleNewRepairOrder}
            onUpdateOrder={handleUpdateRepairOrder}
            onDeleteOrder={handleDeleteRepairOrder}
            onPrintBlank={handlePrintProsthesisBlank}
          />
        );
      case 'ready-poi-orders':
        return (
          <ReadyPoiOrdersPage
            orders={workOrders
              .filter(order => order.orderType === 'Заказ на готовые ПОИ')
              .map(adaptWorkOrderToReadyPoiOrder)
              .filter((order): order is NonNullable<typeof order> => order !== null)
            }
            personalFiles={personalFiles}
            onNewOrder={handleNewReadyPoiOrder}
            onUpdateOrder={handleUpdateReadyPoiOrder}
            onDeleteOrder={handleDeleteReadyPoiOrder}
            onPrintBlank={handlePrintFootwearBlank}
          />
        );
      case 'prosthesis-invoices':
        return (
          <InvoicesManagement
            orders={orders}
            invoiceType="prosthesis-invoices"
          />
        );
      case 'footwear-invoices':
        return (
          <InvoicesManagement
            orders={orders}
            invoiceType="footwear-invoices"
          />
        );
      case 'ottobock-invoices':
        return (
          <InvoicesManagement
            orders={orders}
            invoiceType="ottobock-invoices"
          />
        );
      case 'orthosis-invoices':
        return (
          <InvoicesManagement
            orders={orders}
            invoiceType="orthosis-invoices"
          />
        );
      case 'repair-invoices':
        return (
          <InvoicesManagement
            orders={orders}
            invoiceType="repair-invoices"
          />
        );
      case 'ready-poi-invoices':
        return (
          <InvoicesManagement
            orders={orders}
            invoiceType="ready-poi-invoices"
          />
        );
      case 'medical':
        return (
          <MedicalDepartmentStage
            orders={orders}
            onOrderUpdate={handleOrderUpdate}
          />
        );
      case 'rehabilitation-directions':
        return (
          <RehabilitationDirectionsPage
            directions={rehabilitationDirections}
            personalFiles={personalFiles}
            onNewDirection={handleNewRehabilitationDirection}
            onUpdateDirection={handleUpdateRehabilitationDirection}
            onDeleteDirection={handleDeleteRehabilitationDirection}
          />
        );
      case 'manufacturing-orders':
        return (
          <ManufacturingOrdersPage
            manufacturingOrders={manufacturingOrders}
            personalFiles={personalFiles}
            workOrders={workOrders}
            materialsCatalog={materialsCatalog}
            onNewManufacturingOrder={handleNewManufacturingOrder}
            onUpdateManufacturingOrder={handleUpdateManufacturingOrder}
            onDeleteManufacturingOrder={handleDeleteManufacturingOrder}
            onNewTransferOrder={handleNewTransferOrder}
          />
        );
      case 'workshop':
        return (
          <WorkshopStage
            orders={orders}
            onOrderUpdate={handleOrderUpdate}
          />
        );
      case 'warehouse-issuance':
        return (
          <WarehouseIssuancePage
            warehouseProducts={warehouseProducts}
            personalFiles={personalFiles}
            onUpdateProduct={handleUpdateWarehouseProduct}
            onIssueProduct={handleIssueProduct}
          />
        );
      case 'prosthesis-invoices':
        return (
          <ProsthesisInvoicesPage
            invoices={invoices.filter(inv => inv.type === 'prosthesis') as any}
            personalFiles={personalFiles}
            onNewInvoice={handleNewInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onPrintInvoice={handlePrintInvoice}
          />
        );
      case 'footwear-invoices':
        return (
          <FootwearInvoicesPage
            invoices={invoices.filter(inv => inv.type === 'footwear') as any}
            personalFiles={personalFiles}
            onNewInvoice={handleNewInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onPrintInvoice={handlePrintInvoice}
          />
        );
      case 'ottobock-invoices':
        return (
          <OttobockInvoicesPage
            invoices={invoices.filter(inv => inv.type === 'ottobock') as any}
            personalFiles={personalFiles}
            onNewInvoice={handleNewInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onPrintInvoice={handlePrintInvoice}
          />
        );
      case 'repair-invoices':
        return (
          <RepairInvoicesPage
            invoices={invoices.filter(inv => inv.type === 'repair') as any}
            personalFiles={personalFiles}
            onNewInvoice={handleNewInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onPrintInvoice={handlePrintInvoice}
          />
        );
      case 'ready-poi-invoices':
        return (
          <ReadyPoiInvoicesPage
            invoices={invoices.filter(inv => inv.type === 'ready-poi') as any}
            personalFiles={personalFiles}
            onNewInvoice={handleNewInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onPrintInvoice={handlePrintInvoice}
          />
        );
      case 'warehouse':
        return (
          <WarehouseStage
            orders={orders}
            onOrderUpdate={handleOrderUpdate}
          />
        );
      case 'reports':
        return reportData ? (
          <div className="space-y-6">
            <AdministrationReports reportData={reportData.administration || null} />
            <WorkshopReports reportData={reportData.workshop || null} />
            <WarehouseReports reportData={reportData.warehouse || null} />
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">Загрузка отчетов...</div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Настройки системы</h2>
            <PermissionsTable currentRole={currentRole} />
          </div>
        );
      default:
        return <div>Страница не найдена</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Мобильная навигация */}
        <div className="lg:hidden">
          <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">РУПОИ Дашборд</h1>
              <p className="text-xs text-gray-500">Роль: {currentRole === 'registration' ? 'Картотека' : 
                currentRole === 'medical' ? 'Медотдел' :
                currentRole === 'workshop' ? 'Цеха' :
                currentRole === 'warehouse' ? 'Склад готовой продукции' :
                'Администрация'}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        
        {sidebarOpen && (
          <div className="bg-white shadow-lg border-b">
            <nav className="px-4 py-2">
              {getFilteredNavigationItems().map((item) => {
                const Icon = item.icon;
                const isExpanded = expandedMenus.has(item.id);
                const hasSubmenu = item.hasSubmenu;
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {hasSubmenu && (
                        <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          ›
                        </span>
                      )}
                    </button>
                    
                    {hasSubmenu && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.id === 'orders' && getFilteredSubmenuItems('orders').map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                setActiveTab(subItem.id);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                activeTab === subItem.id
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span className="text-sm">{subItem.label}</span>
                            </button>
                          );
                        })}
                        
                        {item.id === 'invoices' && getFilteredSubmenuItems('invoices').map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                setActiveTab(subItem.id);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                activeTab === subItem.id
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span className="text-sm">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <div className="flex">
        {/* Боковая панель для десктопа */}
        <div className="hidden lg:block w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">РУПОИ</h1>
            <p className="text-sm text-gray-600">Дашборд системы</p>
            <div className="mt-3">
              <RoleIndicator
                role={currentRole}
                onRoleChange={() => setShowRoleSelector(true)}
                compact={true}
              />
            </div>
          </div>
          <nav className="mt-6">
            {getFilteredNavigationItems().map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenus.has(item.id);
              const hasSubmenu = item.hasSubmenu;
              
              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {hasSubmenu && (
                      <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                        ›
                      </span>
                    )}
                  </button>
                  
                  {hasSubmenu && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.id === 'orders' && getFilteredSubmenuItems('orders').map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => setActiveTab(subItem.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              activeTab === subItem.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span className="text-sm">{subItem.label}</span>
                          </button>
                        );
                      })}
                      
                      {item.id === 'invoices' && getFilteredSubmenuItems('invoices').map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => setActiveTab(subItem.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              activeTab === subItem.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span className="text-sm">{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Основной контент */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>

      {/* Модальное окно для деталей заказа */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Детали заказа {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Клиент:</p>
                <p className="text-sm text-gray-900">{selectedOrder.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Тип изделия:</p>
                <p className="text-sm text-gray-900">{selectedOrder.productType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Статус:</p>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Дата создания:</p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedOrder.createdDate).toLocaleDateString('ru-RU')}
                </p>
              </div>
              {selectedOrder.diagnosis && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700">Диагноз:</p>
                  <p className="text-sm text-gray-900">
                    {selectedOrder.diagnosis} ({selectedOrder.diagnosisCode})
                  </p>
                </div>
              )}
              {selectedOrder.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700">Примечания:</p>
                  <p className="text-sm text-gray-900">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальные окна для печати бланков */}
      {showPrintBlank && printBlankType === 'prosthesis' && printBlankData && (
        <ProsthesisPrintBlankComponent
          orderId={printBlankData.orderId}
          clientData={printBlankData.clientData}
          diagnosis={printBlankData.diagnosis}
          productType={printBlankData.productType}
          onClose={handleClosePrintBlank}
          onPrint={handlePrintBlank}
        />
      )}

      {showPrintBlank && printBlankType === 'footwear' && printBlankData && (
        <FootwearPrintBlankComponent
          orderId={printBlankData.orderId}
          clientData={printBlankData.clientData}
          diagnosis={printBlankData.diagnosis}
          onClose={handleClosePrintBlank}
          onPrint={handlePrintBlank}
        />
      )}
    </div>
  );
};

export default Dashboard;
