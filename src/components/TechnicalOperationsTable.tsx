import React from 'react';
import { TechnicalOperation } from '../types/footwearOrder';
import { Trash2 } from 'lucide-react';

interface TechnicalOperationsTableProps {
  operations: TechnicalOperation[];
  onOperationsChange: (operations: TechnicalOperation[]) => void;
  availableOperations: string[];
}

const TechnicalOperationsTable: React.FC<TechnicalOperationsTableProps> = ({
  operations,
  onOperationsChange,
  availableOperations
}) => {
  const handleDeleteOperation = (id: string) => {
    onOperationsChange(operations.filter(op => op.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Основные технические операции</h3>
      </div>

      {/* Список операций с inline редактированием */}
      <div className="space-y-3">
        {operations.map((operation, index) => (
          <div key={operation.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-gray-500">№{index + 1}</span>
                  <h4 className="text-md font-semibold text-gray-900">
                    {operation.operationName || 'Новая операция'}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название операции
                    </label>
                    <select
                      value={operation.operationName}
                      onChange={(e) => {
                        const updatedOperation = {
                          ...operation,
                          operationName: e.target.value
                        };
                        onOperationsChange(
                          operations.map(op => 
                            op.id === operation.id ? updatedOperation : op
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Выберите операцию</option>
                      {availableOperations.map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ФИО исполнителя
                    </label>
                    <input
                      type="text"
                      value={operation.executorName}
                      onChange={(e) => {
                        const updatedOperation = {
                          ...operation,
                          executorName: e.target.value
                        };
                        onOperationsChange(
                          operations.map(op => 
                            op.id === operation.id ? updatedOperation : op
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Введите ФИО"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дата исполнения
                    </label>
                    <input
                      type="date"
                      value={operation.executionDate || ''}
                      onChange={(e) => {
                        const updatedOperation = {
                          ...operation,
                          executionDate: e.target.value
                        };
                        onOperationsChange(
                          operations.map(op => 
                            op.id === operation.id ? updatedOperation : op
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`qualityCheck_${operation.id}`}
                      checked={operation.qualityCheck}
                      onChange={(e) => {
                        const updatedOperation = {
                          ...operation,
                          qualityCheck: e.target.checked
                        };
                        onOperationsChange(
                          operations.map(op => 
                            op.id === operation.id ? updatedOperation : op
                          )
                        );
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`qualityCheck_${operation.id}`} className="ml-2 block text-sm text-gray-900">
                      Отметка ОТК
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleDeleteOperation(operation.id)}
                  className="p-2 text-red-600 hover:text-red-900"
                  title="Удалить операцию"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TechnicalOperationsTable;
