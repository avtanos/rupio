import React from 'react';
import { ReportData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AdministrationReportsProps {
  reportData: ReportData['administration'] | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdministrationReports: React.FC<AdministrationReportsProps> = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Отчетность (Администрация)</h2>
          <div className="text-center text-gray-500 py-8">
            Данные отчетов не загружены
          </div>
        </div>
      </div>
    );
  }

  const { annualDisabledPersonsReport, annualProductsReport } = reportData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Отчетность (Администрация)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Годовой отчет по ЛОВЗ состоящие на учете в РУПОИ ({annualDisabledPersonsReport.year})
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {annualDisabledPersonsReport.totalRegistered.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Всего зарегистрировано</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">По регионам</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={annualDisabledPersonsReport.byRegion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">По полу</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={annualDisabledPersonsReport.byGender}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {annualDisabledPersonsReport.byGender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">По категориям инвалидности</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={annualDisabledPersonsReport.byCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {annualDisabledPersonsReport.byCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Годовой отчет о ЛОВЗ по заказанным изделиям ({annualProductsReport.year})
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {annualProductsReport.totalOrders.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Всего заказов</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">По типам изделий</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={annualProductsReport.byProductType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">По регионам</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={annualProductsReport.byRegion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#FFBB28" />
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

export default AdministrationReports;
