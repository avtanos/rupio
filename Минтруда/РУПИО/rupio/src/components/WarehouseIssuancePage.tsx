import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, Calendar, User, CheckCircle, Clock, AlertCircle, Eye, Edit, Truck, BarChart3 } from 'lucide-react';
import { WarehouseProduct, WarehouseFilters, IssuanceFormData } from '../types/warehouse';
import { PersonalFile } from '../types/personalFile';

interface WarehouseIssuancePageProps {
  warehouseProducts: WarehouseProduct[];
  personalFiles: PersonalFile[];
  onUpdateProduct: (id: string, updates: Partial<WarehouseProduct>) => void;
  onIssueProduct: (id: string, issuanceData: IssuanceFormData) => void;
}

const WarehouseIssuancePage: React.FC<WarehouseIssuancePageProps> = ({
  warehouseProducts,
  personalFiles,
  onUpdateProduct,
  onIssueProduct
}) => {
  const [filters, setFilters] = useState<WarehouseFilters>({
    searchTerm: '',
    productName: '',
    receiptDateFrom: '',
    receiptDateTo: '',
    issuanceDateFrom: '',
    issuanceDateTo: '',
    status: 'all'
  });

  const [selectedProduct, setSelectedProduct] = useState<WarehouseProduct | null>(null);
  const [showIssuanceForm, setShowIssuanceForm] = useState(false);
  const [issuanceFormData, setIssuanceFormData] = useState<IssuanceFormData>({
    issuanceDate: new Date().toISOString().split('T')[0],
    issuanceInvoiceNumber: '',
    issuedBy: '',
    notes: ''
  });

  const statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'На складе', label: 'На складе' },
    { value: 'Выдано', label: 'Выдано' },
    { value: 'Зарезервировано', label: 'Зарезервировано' }
  ];

  // Фильтрация продуктов
  const filteredProducts = useMemo(() => {
    return warehouseProducts.filter(product => {
      const personalFile = personalFiles.find(pf => pf.id === product.personalFileId);
      const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.toLowerCase() : '';
      
      const matchesSearch = filters.searchTerm === '' || 
        product.productName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.orderNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        fullName.includes(filters.searchTerm.toLowerCase());

      const matchesProductName = filters.productName === '' || 
        product.productName.toLowerCase().includes(filters.productName.toLowerCase());

      const matchesStatus = filters.status === 'all' || product.status === filters.status;

      const matchesReceiptDateFrom = !filters.receiptDateFrom || product.receiptDate >= filters.receiptDateFrom;
      const matchesReceiptDateTo = !filters.receiptDateTo || product.receiptDate <= filters.receiptDateTo;

      const matchesIssuanceDateFrom = !filters.issuanceDateFrom || (product.issuanceDate && product.issuanceDate >= filters.issuanceDateFrom);
      const matchesIssuanceDateTo = !filters.issuanceDateTo || (product.issuanceDate && product.issuanceDate <= filters.issuanceDateTo);

      return matchesSearch && matchesProductName && matchesStatus && 
             matchesReceiptDateFrom && matchesReceiptDateTo && 
             matchesIssuanceDateFrom && matchesIssuanceDateTo;
    });
  }, [warehouseProducts, personalFiles, filters]);

  // Статистика
  const stats = useMemo(() => {
    const total = warehouseProducts.length;
    const onWarehouse = warehouseProducts.filter(p => p.status === 'На складе').length;
    const issued = warehouseProducts.filter(p => p.status === 'Выдано').length;
    const reserved = warehouseProducts.filter(p => p.status === 'Зарезервировано').length;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentReceipts = warehouseProducts.filter(p => 
      new Date(p.receiptDate) >= sevenDaysAgo
    ).length;

    return { total, onWarehouse, issued, reserved, recentReceipts };
  }, [warehouseProducts]);

  // Последние поступления (топ 5)
  const recentProducts = useMemo(() => {
    return warehouseProducts
      .sort((a, b) => new Date(b.receiptDate).getTime() - new Date(a.receiptDate).getTime())
      .slice(0, 5);
  }, [warehouseProducts]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'На складе': 'bg-blue-100 text-blue-800',
      'Выдано': 'bg-green-100 text-green-800',
      'Зарезервировано': 'bg-yellow-100 text-yellow-800'
    };

    return `px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'На складе':
        return <Package className="w-4 h-4" />;
      case 'Выдано':
        return <CheckCircle className="w-4 h-4" />;
      case 'Зарезервировано':
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleFilterChange = (field: keyof WarehouseFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      productName: '',
      receiptDateFrom: '',
      receiptDateTo: '',
      issuanceDateFrom: '',
      issuanceDateTo: '',
      status: 'all'
    });
  };

  const handleIssueProduct = (product: WarehouseProduct) => {
    setSelectedProduct(product);
    setIssuanceFormData({
      issuanceDate: new Date().toISOString().split('T')[0],
      issuanceInvoiceNumber: `OUT-${new Date().getFullYear()}-${String(warehouseProducts.filter(p => p.issuanceInvoiceNumber).length + 1).padStart(3, '0')}`,
      issuedBy: '',
      notes: ''
    });
    setShowIssuanceForm(true);
  };

  const handleSaveIssuance = () => {
    if (selectedProduct) {
      onIssueProduct(selectedProduct.id, issuanceFormData);
      setShowIssuanceForm(false);
      setSelectedProduct(null);
    }
  };

  const handleCancelIssuance = () => {
    setShowIssuanceForm(false);
    setSelectedProduct(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Выдача заказов</h1>
          <p className="text-gray-600">Управление готовой продукцией на складе</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BarChart3 className="w-4 h-4" />
          <span>Обновлено: {new Date().toLocaleString('ru-RU')}</span>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Всего изделий</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">На складе</p>
              <p className="text-2xl font-semibold text-blue-600">{stats.onWarehouse}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Выдано</p>
              <p className="text-2xl font-semibold text-green-600">{stats.issued}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Зарезервировано</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.reserved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Поступления за 7 дней</p>
              <p className="text-2xl font-semibold text-purple-600">{stats.recentReceipts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Последние поступления */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Последние поступления</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProducts.map((product) => {
              const personalFile = personalFiles.find(pf => pf.id === product.personalFileId);
              const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.trim() : 'Неизвестно';
              
              return (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(product.status)}`}>
                      {product.status}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(product.receiptDate)}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{product.productName}</h4>
                  <p className="text-sm text-gray-600 mb-1">№ {product.orderNumber}</p>
                  <p className="text-sm text-gray-600">{fullName}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Поиск по ФИО/Наименованию
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="ФИО, наименование, № заказа..."
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
              <Calendar className="w-4 h-4 inline mr-2" />
              Период поступления С
            </label>
            <input
              type="date"
              value={filters.receiptDateFrom}
              onChange={(e) => handleFilterChange('receiptDateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Период поступления ПО
            </label>
            <input
              type="date"
              value={filters.receiptDateTo}
              onChange={(e) => handleFilterChange('receiptDateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Период выдачи С
            </label>
            <input
              type="date"
              value={filters.issuanceDateFrom}
              onChange={(e) => handleFilterChange('issuanceDateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Период выдачи ПО
            </label>
            <input
              type="date"
              value={filters.issuanceDateTo}
              onChange={(e) => handleFilterChange('issuanceDateTo', e.target.value)}
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

      {/* Таблица готовой продукции */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование изделия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата поступления
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  № заказа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ФИО
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата выдачи
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  № накладной
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const personalFile = personalFiles.find(pf => pf.id === product.personalFileId);
                const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.trim() : 'Неизвестно';
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                      <div className="text-sm text-gray-500">{product.warehouseLocation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(product.receiptDate)}
                      </div>
                      <div className="text-sm text-gray-500">№ {product.receiptInvoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">{product.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{fullName}</span>
                      </div>
                      {personalFile && (
                        <div className="text-sm text-gray-500">ПИН: {personalFile.pin}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.issuanceDate ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(product.issuanceDate)}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Не выдано</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.issuanceInvoiceNumber ? (
                        <span className="text-sm font-mono text-gray-900">{product.issuanceInvoiceNumber}</span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(product.status)}
                        <span className={`ml-2 ${getStatusBadge(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {product.status === 'На складе' && (
                          <button
                            onClick={() => handleIssueProduct(product)}
                            className="text-green-600 hover:text-green-900"
                            title="Выдать"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Продукция не найдена</h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры поиска.
            </p>
          </div>
        )}
      </div>

      {/* Форма выдачи */}
      {showIssuanceForm && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Выдача изделия</h2>
                  <p className="text-sm text-gray-500">{selectedProduct.productName}</p>
                </div>
              </div>
              <button
                onClick={handleCancelIssuance}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата выдачи *
                  </label>
                  <input
                    type="date"
                    value={issuanceFormData.issuanceDate}
                    onChange={(e) => setIssuanceFormData(prev => ({ ...prev, issuanceDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    № накладной выдачи *
                  </label>
                  <input
                    type="text"
                    value={issuanceFormData.issuanceInvoiceNumber}
                    onChange={(e) => setIssuanceFormData(prev => ({ ...prev, issuanceInvoiceNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Кто выдал *
                </label>
                <input
                  type="text"
                  value={issuanceFormData.issuedBy}
                  onChange={(e) => setIssuanceFormData(prev => ({ ...prev, issuedBy: e.target.value }))}
                  placeholder="ФИО сотрудника склада"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Примечания
                </label>
                <textarea
                  value={issuanceFormData.notes}
                  onChange={(e) => setIssuanceFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Дополнительная информация о выдаче..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelIssuance}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSaveIssuance}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  <span>Выдать изделие</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseIssuancePage;
