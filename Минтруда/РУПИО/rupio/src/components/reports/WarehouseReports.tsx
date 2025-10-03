import React from 'react';
import { ReportData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WarehouseReportsProps {
  reportData: ReportData['warehouse'] | null;
}

const WarehouseReports: React.FC<WarehouseReportsProps> = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Отчетность (Склад)</h2>
          <div className="text-center text-gray-500 py-8">
            Данные отчетов не загружены
          </div>
        </div>
      </div>
    );
  }

  const { monthlyFootwearReport, monthlyProsthesesReport, monthlyWheelchairsReport, finishedProductsReport } = reportData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Отчетность (Склад)</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Месячные отчеты по приходу и выдаче обуви ({monthlyFootwearReport.month})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {monthlyFootwearReport.totalReceived}
                  </div>
                  <div className="text-sm text-gray-600">Получено</div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {monthlyFootwearReport.totalIssued}
                  </div>
                  <div className="text-sm text-gray-600">Выдано</div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {monthlyFootwearReport.remaining}
                  </div>
                  <div className="text-sm text-gray-600">Остаток</div>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyFootwearReport.receipts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#10B981" name="Поступления" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Месячные отчеты по приходу и выдаче протезов ({monthlyProsthesesReport.month})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {monthlyProsthesesReport.totalReceived}
                  </div>
                  <div className="text-sm text-gray-600">Получено</div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {monthlyProsthesesReport.totalIssued}
                  </div>
                  <div className="text-sm text-gray-600">Выдано</div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {monthlyProsthesesReport.remaining}
                  </div>
                  <div className="text-sm text-gray-600">Остаток</div>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyProsthesesReport.receipts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#3B82F6" name="Поступления" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Месячные отчеты по приходу и выдаче инвалидных кресло-колясок ({monthlyWheelchairsReport.month})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {monthlyWheelchairsReport.totalReceived}
                  </div>
                  <div className="text-sm text-gray-600">Получено</div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {monthlyWheelchairsReport.totalIssued}
                  </div>
                  <div className="text-sm text-gray-600">Выдано</div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {monthlyWheelchairsReport.remaining}
                  </div>
                  <div className="text-sm text-gray-600">Остаток</div>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyWheelchairsReport.receipts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8B5CF6" name="Поступления" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Отчеты по готовым ПОМ ({finishedProductsReport.month})
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {finishedProductsReport.products.map((product, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-3">{product.type}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Получено:</span>
                      <span className="text-sm font-medium text-green-600">{product.received}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Выдано:</span>
                      <span className="text-sm font-medium text-blue-600">{product.issued}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Остаток:</span>
                      <span className="text-sm font-medium text-purple-600">{product.remaining}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Примеры:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.examples.map((example, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={finishedProductsReport.products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="received" fill="#10B981" name="Получено" />
                <Bar dataKey="issued" fill="#3B82F6" name="Выдано" />
                <Bar dataKey="remaining" fill="#8B5CF6" name="Остаток" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseReports;
