import React from 'react';
import { OrthosisMaterial } from '../types/orthosisOrder';
import { Plus, Trash2 } from 'lucide-react';

interface OrthosisMaterialsTableProps {
  materials: OrthosisMaterial[];
  onMaterialsChange: (materials: OrthosisMaterial[]) => void;
  availableUnits: string[];
}

const OrthosisMaterialsTable: React.FC<OrthosisMaterialsTableProps> = ({
  materials,
  onMaterialsChange,
  availableUnits
}) => {
  const handleAddMaterial = () => {
    const newMaterial: OrthosisMaterial = {
      id: `mat_${Date.now()}`,
      articleNumber: '',
      materialName: '',
      unit: availableUnits[0] || 'шт',
      quantity: 1,
      price: 0,
      total: 0,
      notes: ''
    };
    
    onMaterialsChange([...materials, newMaterial]);
  };

  const handleDeleteMaterial = (id: string) => {
    onMaterialsChange(materials.filter(material => material.id !== id));
  };

  const handleMaterialChange = (id: string, field: keyof OrthosisMaterial, value: string | number) => {
    const updatedMaterials = materials.map(material => {
      if (material.id === id) {
        const updatedMaterial = { ...material, [field]: value };
        
        // Пересчитываем общую сумму если изменились количество или цена
        if (field === 'quantity' || field === 'price') {
          updatedMaterial.total = updatedMaterial.quantity * updatedMaterial.price;
        }
        
        return updatedMaterial;
      }
      return material;
    });
    
    onMaterialsChange(updatedMaterials);
  };

  const calculateTotalCost = () => {
    return materials.reduce((sum, material) => sum + material.total, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Материалы и комплектация ({materials.length})
        </h3>
        <button
          type="button"
          onClick={handleAddMaterial}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить материал</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                №
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                № артикул
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Наименование материалов
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ед.изм
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Кол-во
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Примечание
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materials.map((material, index) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={material.articleNumber}
                    onChange={(e) => handleMaterialChange(material.id, 'articleNumber', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Артикул"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={material.materialName}
                    onChange={(e) => handleMaterialChange(material.id, 'materialName', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Наименование"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={material.unit}
                    onChange={(e) => handleMaterialChange(material.id, 'unit', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={material.quantity}
                    onChange={(e) => handleMaterialChange(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={material.price}
                      onChange={(e) => handleMaterialChange(material.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500">=</span>
                    <span className="text-sm font-medium text-gray-900">
                      {material.total.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={material.notes || ''}
                    onChange={(e) => handleMaterialChange(material.id, 'notes', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Примечание"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Удалить материал"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {materials.length > 0 && (
        <div className="flex justify-end">
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Общая стоимость: <span className="text-lg font-bold text-gray-900">
                {calculateTotalCost().toFixed(2)} ₽
              </span>
            </span>
          </div>
        </div>
      )}

      {materials.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Материалы не добавлены</p>
          <p className="text-sm">Нажмите "Добавить материал" для начала работы</p>
        </div>
      )}
    </div>
  );
};

export default OrthosisMaterialsTable;
