import React, { useState } from 'react';
import { Order } from '../types';
import { Stethoscope, FileText, Printer, Ruler, Send } from 'lucide-react';

interface MedicalDepartmentStageProps {
  orders: Order[];
  onOrderUpdate: (orderId: string, updates: Partial<Order>) => void;
}

const MedicalDepartmentStage: React.FC<MedicalDepartmentStageProps> = ({
  orders,
  onOrderUpdate
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);

  const medicalOrders = orders.filter(order => 
    order.status === 'мед_осмотр' || order.status === 'в_производстве'
  );

  const handleDiagnosisUpdate = (orderId: string, diagnosis: string, diagnosisCode: string) => {
    onOrderUpdate(orderId, {
      diagnosis,
      diagnosisCode,
      status: 'в_производстве'
    });
    setShowDiagnosisForm(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Выписка наряда/заказа (Мед.Отдел)</h2>
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              {medicalOrders.length} заказов
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Действия:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-blue-500" />
              <span>Осмотр, постановка / уточнение диагноза</span>
            </li>
            <li className="flex items-center space-x-2">
              <Send className="w-4 h-4 text-green-500" />
              <span>Отправка на реабилитацию в ЦР ЛОВЗ</span>
            </li>
            <li className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-500" />
              <span>Заполнение наряда/ заказа</span>
            </li>
            <li className="flex items-center space-x-2">
              <Printer className="w-4 h-4 text-orange-500" />
              <span>Печать бланков заказа</span>
            </li>
            <li className="flex items-center space-x-2">
              <Ruler className="w-4 h-4 text-red-500" />
              <span>Снятие мерок</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Заказы на мед. осмотре</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {medicalOrders
                .filter(order => order.status === 'мед_осмотр')
                .map((order) => (
                <div
                  key={order.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">{order.clientName}</p>
                      <p className="text-xs text-gray-500">{order.productType}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Заказы в производстве</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {medicalOrders
                .filter(order => order.status === 'в_производстве')
                .map((order) => (
                <div
                  key={order.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">{order.clientName}</p>
                      <p className="text-xs text-gray-500">{order.productType}</p>
                      <p className="text-xs text-blue-600">{order.diagnosis}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Детали заказа {selectedOrder.orderNumber}
          </h3>
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
              <p className="text-sm font-medium text-gray-700">Мед. учреждение:</p>
              <p className="text-sm text-gray-900">{selectedOrder.medicalInstitution}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Номер направления:</p>
              <p className="text-sm text-gray-900">{selectedOrder.referralNumber}</p>
            </div>
            {selectedOrder.diagnosis && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700">Диагноз:</p>
                <p className="text-sm text-gray-900">{selectedOrder.diagnosis} ({selectedOrder.diagnosisCode})</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex space-x-2">
            {selectedOrder.status === 'мед_осмотр' && (
              <button
                onClick={() => setShowDiagnosisForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Поставить диагноз</span>
              </button>
            )}
            <button
              onClick={() => setSelectedOrder(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showDiagnosisForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Постановка диагноза</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const diagnosis = formData.get('diagnosis') as string;
              const diagnosisCode = formData.get('diagnosisCode') as string;
              handleDiagnosisUpdate(selectedOrder.id, diagnosis, diagnosisCode);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Диагноз
                  </label>
                  <input
                    type="text"
                    name="diagnosis"
                    defaultValue={selectedOrder.diagnosis}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Код диагноза
                  </label>
                  <input
                    type="text"
                    name="diagnosisCode"
                    defaultValue={selectedOrder.diagnosisCode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDiagnosisForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalDepartmentStage;
