import React from 'react';
import { ReportData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WorkshopReportsProps {
  reportData: ReportData['workshop'] | null;
}

const WorkshopReports: React.FC<WorkshopReportsProps> = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Отчетность (Цех готовой продукции)</h2>
          <div className="text-center text-gray-500 py-8">
            Данные отчетов не загружены
          </div>
        </div>
      </div>
    );
  }

  const { monthlyMaterialsConsumption, monthlyLeatherTextileConsumption } = reportData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Отчетность (Цех готовой продукции)</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Месячный отчет о расходе покупных материалов и полуфабрикатов ({monthlyMaterialsConsumption.month})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {monthlyMaterialsConsumption.totalCost.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-600">Общая стоимость</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {monthlyMaterialsConsumption.costChange > 0 ? '+' : ''}{monthlyMaterialsConsumption.costChange}%
                  </div>
                  <div className="text-sm text-gray-600">Изменение к прошлому месяцу</div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(monthlyMaterialsConsumption.totalCost - monthlyMaterialsConsumption.previousMonthCost).toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-600">Разница в стоимости</div>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyMaterialsConsumption.materials}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="material" angle={-45} textAnchor="end" height={120} />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name === 'consumed' ? 'Расход' : 'Стоимость']} />
                <Legend />
                <Bar dataKey="consumed" fill="#0088FE" name="Расход" />
                <Bar dataKey="cost" fill="#00C49F" name="Стоимость" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Детализация по материалам</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Материал
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Расход
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Стоимость
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Изменение
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyMaterialsConsumption.materials.map((material, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {material.material}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {material.consumed} {material.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {material.cost.toLocaleString()} ₽
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            material.change > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {material.change > 0 ? '+' : ''}{material.change}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Месячный отчет о расходе кожевенных и текстильных материалов ({monthlyLeatherTextileConsumption.month})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {monthlyLeatherTextileConsumption.totalLeatherCost.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-600">Кожевенные материалы</div>
                </div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {monthlyLeatherTextileConsumption.totalTextileCost.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-600">Текстильные материалы</div>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {monthlyLeatherTextileConsumption.totalCost.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-gray-600">Общая стоимость</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Кожевенные материалы</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyLeatherTextileConsumption.leatherMaterials}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="consumed" fill="#FF8C00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Текстильные материалы</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyLeatherTextileConsumption.textileMaterials}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="consumed" fill="#FF69B4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopReports;
