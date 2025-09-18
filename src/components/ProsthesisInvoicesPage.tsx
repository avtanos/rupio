import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Eye, Trash2, Printer, Download, CheckCircle, Clock, AlertCircle, Package, User, Calendar, DollarSign, FileText, X } from 'lucide-react';
import { ProsthesisInvoice, InvoiceFilters, InvoiceStats, InvoiceStatus, InvoicePriority } from '../types/invoices';
import { PersonalFile } from '../types/personalFile';

interface ProsthesisInvoicesPageProps {
  invoices: ProsthesisInvoice[];
  personalFiles: PersonalFile[];
  onNewInvoice: (invoice: Omit<ProsthesisInvoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateInvoice: (id: string, updates: Partial<ProsthesisInvoice>) => void;
  onDeleteInvoice: (id: string) => void;
  onPrintInvoice: (id: string) => void;
}

const ProsthesisInvoicesPage: React.FC<ProsthesisInvoicesPageProps> = ({
  invoices,
  personalFiles,
  onNewInvoice,
  onUpdateInvoice,
  onDeleteInvoice,
  onPrintInvoice
}) => {
  const [filters, setFilters] = useState<InvoiceFilters>({
    searchTerm: '',
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: '',
    productName: '',
    clientName: '',
    createdBy: ''
  });

  const [selectedInvoice, setSelectedInvoice] = useState<ProsthesisInvoice | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<ProsthesisInvoice | null>(null);

  const statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'draft', label: 'Черновик' },
    { value: 'approved', label: 'Утверждено' },
    { value: 'sent', label: 'Отправлено' },
    { value: 'received', label: 'Получено' },
    { value: 'completed', label: 'Завершено' },
    { value: 'cancelled', label: 'Отменено' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Все приоритеты' },
    { value: 'low', label: 'Низкий' },
    { value: 'normal', label: 'Обычный' },
    { value: 'high', label: 'Высокий' },
    { value: 'urgent', label: 'Срочный' }
  ];

  // Фильтрация накладных
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const personalFile = personalFiles.find(pf => pf.id === invoice.personalFileId);
      const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.toLowerCase() : '';
      
      const matchesSearch = filters.searchTerm === '' || 
        invoice.invoiceNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        invoice.orderNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        invoice.productName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        fullName.includes(filters.searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || invoice.status === filters.status;
      const matchesPriority = filters.priority === 'all' || invoice.priority === filters.priority;
      const matchesProductName = filters.productName === '' || 
        invoice.productName.toLowerCase().includes(filters.productName.toLowerCase());
      const matchesClientName = filters.clientName === '' || 
        fullName.includes(filters.clientName.toLowerCase());
      const matchesCreatedBy = filters.createdBy === '' || 
        invoice.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase());

      const matchesDateFrom = !filters.dateFrom || invoice.invoiceDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || invoice.invoiceDate <= filters.dateTo;

      return matchesSearch && matchesStatus && matchesPriority && matchesProductName && 
             matchesClientName && matchesCreatedBy && matchesDateFrom && matchesDateTo;
    });
  }, [invoices, personalFiles, filters]);

  // Статистика
  const stats = useMemo((): InvoiceStats => {
    const total = invoices.length;
    const draft = invoices.filter(inv => inv.status === 'draft').length;
    const approved = invoices.filter(inv => inv.status === 'approved').length;
    const sent = invoices.filter(inv => inv.status === 'sent').length;
    const received = invoices.filter(inv => inv.status === 'received').length;
    const completed = invoices.filter(inv => inv.status === 'completed').length;
    const cancelled = invoices.filter(inv => inv.status === 'cancelled').length;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const averageAmount = total > 0 ? totalAmount / total : 0;

    return { total, draft, approved, sent, received, completed, cancelled, totalAmount, averageAmount };
  }, [invoices]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'draft': 'bg-gray-100 text-gray-800',
      'approved': 'bg-blue-100 text-blue-800',
      'sent': 'bg-yellow-100 text-yellow-800',
      'received': 'bg-green-100 text-green-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return `px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'sent':
        return <Package className="w-4 h-4" />;
      case 'received':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      'low': 'bg-gray-100 text-gray-800',
      'normal': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };

    return `px-2 py-1 text-xs font-medium rounded-full ${priorityStyles[priority as keyof typeof priorityStyles] || 'bg-gray-100 text-gray-800'}`;
  };

  const handleFilterChange = (field: keyof InvoiceFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      priority: 'all',
      dateFrom: '',
      dateTo: '',
      productName: '',
      clientName: '',
      createdBy: ''
    });
  };

  const handleNewInvoice = () => {
    const newInvoice: ProsthesisInvoice = {
      id: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      orderNumber: '',
      personalFileId: '',
      clientName: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      status: 'draft',
      priority: 'normal',
      createdBy: 'Текущий пользователь',
      type: 'prosthesis',
      prosthesisType: '',
      components: [],
      measurements: {
        height: 0,
        weight: 0,
        stumpLength: 0,
        stumpShape: '',
        mobility: '',
        scarType: '',
        skinCondition: '',
        boneSaw: '',
        support: false,
        objectiveData: ''
      },
      needsCast: false,
      qualityCheck: false,
      createdAt: '',
      updatedAt: ''
    };
    setEditingInvoice(newInvoice);
    setShowInvoiceForm(true);
  };

  const handleEditInvoice = (invoice: ProsthesisInvoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleViewInvoice = (invoice: ProsthesisInvoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDeleteInvoice = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту накладную?')) {
      onDeleteInvoice(id);
    }
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    const invoiceData: Omit<ProsthesisInvoice, 'id' | 'createdAt' | 'updatedAt'> = {
      ...editingInvoice,
      invoiceNumber: editingInvoice.invoiceNumber || `INV-${Date.now()}`,
      invoiceDate: editingInvoice.invoiceDate || new Date().toISOString().split('T')[0],
      productName: editingInvoice.productName || editingInvoice.prosthesisType,
      unitPrice: editingInvoice.unitPrice || 0,
      totalAmount: editingInvoice.totalAmount || (editingInvoice.quantity * (editingInvoice.unitPrice || 0)),
      createdBy: editingInvoice.createdBy || 'Текущий пользователь',
      type: 'prosthesis',
      prosthesisType: editingInvoice.prosthesisType || '',
      components: editingInvoice.components || [],
      measurements: editingInvoice.measurements || {
        height: 0,
        weight: 0,
        stumpLength: 0,
        stumpShape: '',
        mobility: '',
        scarType: '',
        skinCondition: '',
        boneSaw: '',
        support: false,
        objectiveData: ''
      },
      needsCast: editingInvoice.needsCast || false,
      qualityCheck: editingInvoice.qualityCheck || false
    };

    if (editingInvoice.id) {
      onUpdateInvoice(editingInvoice.id, invoiceData);
    } else {
      onNewInvoice(invoiceData);
    }

    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  const handlePrintInvoice = (id: string) => {
    onPrintInvoice(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Накладные на протезы</h1>
          <p className="text-gray-600">Управление накладными на изготовление протезов</p>
        </div>
        <button
          onClick={handleNewInvoice}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Новая накладная</span>
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Всего</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Черновики</p>
              <p className="text-2xl font-semibold text-gray-600">{stats.draft}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Утверждено</p>
              <p className="text-2xl font-semibold text-blue-600">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Отправлено</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.sent}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Получено</p>
              <p className="text-2xl font-semibold text-green-600">{stats.received}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Завершено</p>
              <p className="text-2xl font-semibold text-emerald-600">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Общая сумма</p>
              <p className="text-lg font-semibold text-purple-600">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Средняя сумма</p>
              <p className="text-lg font-semibold text-indigo-600">{formatCurrency(stats.averageAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Поиск
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Номер, заказ, изделие, ФИО..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Статус
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Приоритет
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Дата с
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Дата по
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Наименование изделия
            </label>
            <input
              type="text"
              value={filters.productName}
              onChange={(e) => handleFilterChange('productName', e.target.value)}
              placeholder="Название изделия..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Клиент
            </label>
            <input
              type="text"
              value={filters.clientName}
              onChange={(e) => handleFilterChange('clientName', e.target.value)}
              placeholder="ФИО клиента..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Создал
            </label>
            <input
              type="text"
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              placeholder="Создатель..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Очистить фильтры</span>
          </button>
        </div>
      </div>

      {/* Таблица накладных */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  № накладной
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изделие
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Количество
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Приоритет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => {
                const personalFile = personalFiles.find(pf => pf.id === invoice.personalFileId);
                const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.trim() : 'Неизвестно';
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-mono text-blue-600">
                          {invoice.invoiceNumber}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">Заказ: {invoice.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(invoice.invoiceDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{fullName}</div>
                          {personalFile && (
                            <div className="text-sm text-gray-500">ПИН: {personalFile.pin}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{invoice.productName}</div>
                      <div className="text-sm text-gray-500">{invoice.prosthesisType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{invoice.quantity} шт</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.totalAmount)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(invoice.status)}
                        <span className={`ml-2 ${getStatusBadge(invoice.status)}`}>
                          {statusOptions.find(opt => opt.value === invoice.status)?.label || invoice.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getPriorityBadge(invoice.priority)}>
                        {priorityOptions.find(opt => opt.value === invoice.priority)?.label || invoice.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(invoice.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Печать"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Накладные не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры поиска или создать новую накладную.
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно просмотра накладной */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Накладная {selectedInvoice.invoiceNumber}</h2>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Основная информация</h3>
                    <div className="space-y-2">
                      <div><strong>Номер накладной:</strong> {selectedInvoice.invoiceNumber}</div>
                      <div><strong>Дата:</strong> {formatDate(selectedInvoice.invoiceDate)}</div>
                      <div><strong>Заказ:</strong> {selectedInvoice.orderNumber}</div>
                      <div><strong>Статус:</strong> <span className={getStatusBadge(selectedInvoice.status)}>{statusOptions.find(opt => opt.value === selectedInvoice.status)?.label}</span></div>
                      <div><strong>Приоритет:</strong> <span className={getPriorityBadge(selectedInvoice.priority)}>{priorityOptions.find(opt => opt.value === selectedInvoice.priority)?.label}</span></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Клиент</h3>
                    <div className="space-y-2">
                      <div><strong>ФИО:</strong> {selectedInvoice.clientName}</div>
                      <div><strong>Изделие:</strong> {selectedInvoice.productName}</div>
                      <div><strong>Тип протеза:</strong> {selectedInvoice.prosthesisType}</div>
                      <div><strong>Количество:</strong> {selectedInvoice.quantity} шт</div>
                      <div><strong>Сумма:</strong> {formatCurrency(selectedInvoice.totalAmount)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Компоненты</h3>
                    <div className="space-y-2">
                      {selectedInvoice.components.map((component, index) => (
                        <div key={component.id} className="border border-gray-200 rounded p-3">
                          <div className="font-medium">{component.name}</div>
                          <div className="text-sm text-gray-600">Код: {component.code} | Размер: {component.size}</div>
                          <div className="text-sm text-gray-600">Левый: {component.leftQuantity} | Правый: {component.rightQuantity}</div>
                          <div className="text-sm font-medium">Цена: {formatCurrency(component.totalPrice)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Измерения</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Рост:</strong> {selectedInvoice.measurements.height} см</div>
                      <div><strong>Вес:</strong> {selectedInvoice.measurements.weight} кг</div>
                      <div><strong>Длина культи:</strong> {selectedInvoice.measurements.stumpLength} см</div>
                      <div><strong>Форма культи:</strong> {selectedInvoice.measurements.stumpShape}</div>
                      <div><strong>Подвижность:</strong> {selectedInvoice.measurements.mobility}</div>
                      <div><strong>Рубец:</strong> {selectedInvoice.measurements.scarType}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Закрыть
                </button>
                <button
                  onClick={() => handlePrintInvoice(selectedInvoice.id)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Печать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для создания/редактирования накладной */}
      {showInvoiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingInvoice ? 'Редактировать накладную' : 'Создать накладную'}
                    </h2>
                    {editingInvoice?.invoiceNumber && (
                      <p className="text-sm text-gray-600">Накладная {editingInvoice.invoiceNumber}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowInvoiceForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitInvoice} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Левая колонка - Основная информация */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Основная информация</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Номер накладной *
                          </label>
                          <input
                            type="text"
                            value={editingInvoice?.invoiceNumber || ''}
                            onChange={(e) => setEditingInvoice(prev => prev ? {...prev, invoiceNumber: e.target.value} : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Дата *
                          </label>
                          <input
                            type="date"
                            value={editingInvoice?.invoiceDate || ''}
                            onChange={(e) => setEditingInvoice(prev => prev ? {...prev, invoiceDate: e.target.value} : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название цеха *
                          </label>
                          <input
                            type="text"
                            value="Цех протезирования"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            readOnly
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Тип накладной
                          </label>
                          <select
                            value="issuance"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="issuance">Выдача</option>
                            <option value="receipt">Поступление</option>
                            <option value="transfer">Передача</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Статус
                          </label>
                          <select
                            value={editingInvoice?.status || 'draft'}
                            onChange={(e) => setEditingInvoice(prev => prev ? {...prev, status: e.target.value as InvoiceStatus} : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Статистика */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Статистика</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {editingInvoice?.quantity || 0}
                          </div>
                          <div className="text-sm text-gray-600">Всего изделий</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">1</div>
                          <div className="text-sm text-gray-600">Заказов</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Правая колонка - Заказы */}
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Package className="w-5 h-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Доступные заказы</h3>
                      </div>
                      
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Поиск по номеру заказа или ФИО..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold text-yellow-800">
                              1
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">ORD-2025-0156</div>
                              <div className="text-sm text-gray-600 flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>Иван</span>
                              </div>
                              <div className="text-xs text-gray-500">Создан: 15.08.2025</div>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors">
                            + Добавить
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Выбранные заказы (1)</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              1
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">ORD-2025-0158</div>
                              <div className="text-sm text-gray-600">Ахмед - Не указан</div>
                            </div>
                          </div>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingInvoice ? 'Сохранить изменения' : 'Создать накладную'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsthesisInvoicesPage;
