import React, { useState } from 'react';
import { Order } from '../types';
import { Receipt, Plus, Search, Filter, Eye, Download } from 'lucide-react';

interface InvoicesManagementProps {
  orders: Order[];
  invoiceType: string;
}

const InvoicesManagement: React.FC<InvoicesManagementProps> = ({
  orders,
  invoiceType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Фильтруем заказы по типу накладной
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Фильтрация по типу накладной
    const matchesInvoiceType = () => {
      switch (invoiceType) {
        case 'prosthesis-invoices':
          return order.productCategory === 'протез';
        case 'footwear-invoices':
          return order.productCategory === 'обувь';
        case 'orthosis-invoices':
          return order.productCategory === 'корсет' || order.productCategory === 'ортез';
        case 'repair-invoices':
          return order.productType.includes('ремонт');
        case 'ready-poi-invoices':
          return order.productCategory === 'слуховой_аппарат' || order.productCategory === 'коляска';
        default:
          return true;
      }
    };
    
    return matchesSearch && matchesStatus && matchesInvoiceType();
  });

  const getInvoiceTypeTitle = () => {
    switch (invoiceType) {
      case 'prosthesis-invoices':
        return 'Накладные на протезы';
      case 'footwear-invoices':
        return 'Накладные на обувь';
      case 'orthosis-invoices':
        return 'Накладные на Оттобок';
      case 'repair-invoices':
        return 'Накладные на ремонт';
      case 'ready-poi-invoices':
        return 'Накладные на готовые ПОИ';
      default:
        return 'Накладные';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'регистрация':
        return 'bg-yellow-100 text-yellow-800';
      case 'мед_осмотр':
        return 'bg-blue-100 text-blue-800';
      case 'в_производстве':
        return 'bg-purple-100 text-purple-800';
      case 'готов_к_выдаче':
        return 'bg-green-100 text-green-800';
      case 'завершен':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateInvoice = (order: Order) => {
    // Здесь будет логика генерации накладной
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{getInvoiceTypeTitle()}</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Создать накладную</span>
          </button>
        </div>

        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Поиск по номеру заказа, клиенту или типу изделия..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="готов_к_выдаче">Готов к выдаче</option>
              <option value="завершен">Завершен</option>
            </select>
          </div>
        </div>

        {/* Таблица накладных */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Номер заказа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип изделия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата готовности
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.productType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.actualCompletionDate 
                      ? new Date(order.actualCompletionDate).toLocaleDateString('ru-RU')
                      : new Date(order.expectedCompletionDate).toLocaleDateString('ru-RU')
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Просмотр</span>
                      </button>
                      <button
                        onClick={() => generateInvoice(order)}
                        className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Скачать</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Накладные не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры поиска или создать новую накладную.
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно для деталей накладной */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Накладная для заказа {selectedInvoice.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Клиент:</p>
                <p className="text-sm text-gray-900">{selectedInvoice.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Тип изделия:</p>
                <p className="text-sm text-gray-900">{selectedInvoice.productType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Статус:</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                  {selectedInvoice.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Дата готовности:</p>
                <p className="text-sm text-gray-900">
                  {selectedInvoice.actualCompletionDate 
                    ? new Date(selectedInvoice.actualCompletionDate).toLocaleDateString('ru-RU')
                    : new Date(selectedInvoice.expectedCompletionDate).toLocaleDateString('ru-RU')
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Мед. учреждение:</p>
                <p className="text-sm text-gray-900">{selectedInvoice.medicalInstitution}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Номер направления:</p>
                <p className="text-sm text-gray-900">{selectedInvoice.referralNumber}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Закрыть
              </button>
              <button
                onClick={() => generateInvoice(selectedInvoice)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Скачать накладную
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesManagement;
