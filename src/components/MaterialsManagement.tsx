import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Calculator, AlertCircle } from 'lucide-react';
import { ConsumableMaterial, MaterialFormData } from '../types/manufacturing';

interface MaterialsManagementProps {
  materials: ConsumableMaterial[];
  onAddMaterial: (material: MaterialFormData) => void;
  onUpdateMaterial: (id: string, material: MaterialFormData) => void;
  onDeleteMaterial: (id: string) => void;
  materialsCatalog: any[];
}

const MaterialsManagement: React.FC<MaterialsManagementProps> = ({
  materials,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  materialsCatalog
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<ConsumableMaterial | null>(null);
  const [formData, setFormData] = useState<MaterialFormData>({
    materialId: '',
    materialName: '',
    materialCode: '',
    unit: '',
    quantityPlanned: 0,
    quantityUsed: 0,
    unitPrice: 0,
    notes: ''
  });

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setFormData({
      materialId: '',
      materialName: '',
      materialCode: '',
      unit: '',
      quantityPlanned: 0,
      quantityUsed: 0,
      unitPrice: 0,
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditMaterial = (material: ConsumableMaterial) => {
    setEditingMaterial(material);
    setFormData({
      materialId: material.materialId,
      materialName: material.materialName,
      materialCode: material.materialCode,
      unit: material.unit,
      quantityPlanned: material.quantityPlanned,
      quantityUsed: material.quantityUsed,
      unitPrice: material.unitPrice,
      notes: material.notes || ''
    });
    setShowForm(true);
  };

  const handleSaveMaterial = () => {
    if (editingMaterial) {
      onUpdateMaterial(editingMaterial.id, formData);
    } else {
      onAddMaterial(formData);
    }
    setShowForm(false);
    setEditingMaterial(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMaterial(null);
  };

  const handleMaterialSelect = (materialId: string) => {
    const material = materialsCatalog.find(m => m.id === materialId);
    if (material) {
      setFormData(prev => ({
        ...prev,
        materialId: material.id,
        materialName: material.name,
        materialCode: material.code,
        unit: material.unit,
        unitPrice: material.unitPrice
      }));
    }
  };

  const calculateTotalCost = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const totalCost = calculateTotalCost(formData.quantityUsed, formData.unitPrice);

  return (
    <div className="space-y-4">
      {/* Заголовок и кнопка добавления */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Расходные материалы</h3>
        </div>
        <button
          onClick={handleAddMaterial}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить материал</span>
        </button>
      </div>

      {/* Таблица материалов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Материал
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Код
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ед.изм
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Запланировано
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Использовано
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена за ед.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Стоимость
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{material.materialName}</div>
                      {material.notes && (
                        <div className="text-sm text-gray-500">{material.notes}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {material.materialCode}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.unit}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.quantityPlanned}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        material.quantityUsed > material.quantityPlanned 
                          ? 'text-red-600' 
                          : material.quantityUsed === material.quantityPlanned 
                          ? 'text-green-600' 
                          : 'text-gray-900'
                      }`}>
                        {material.quantityUsed}
                      </span>
                      {material.quantityUsed > material.quantityPlanned && (
                        <div title="Превышение плана">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.unitPrice.toLocaleString('ru-RU')} ₽
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {material.totalCost.toLocaleString('ru-RU')} ₽
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMaterial(material)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteMaterial(material.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {materials.length === 0 && (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Материалы не добавлены</h3>
            <p className="mt-1 text-sm text-gray-500">
              Добавьте расходные материалы для изготовления.
            </p>
          </div>
        )}
      </div>

      {/* Форма добавления/редактирования материала */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingMaterial ? 'Редактировать материал' : 'Добавить материал'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {editingMaterial ? 'Изменить данные материала' : 'Добавить расходный материал'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form className="p-6 space-y-4">
              {/* Выбор материала из каталога */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Материал из каталога
                </label>
                <select
                  value={formData.materialId}
                  onChange={(e) => handleMaterialSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите материал</option>
                  {materialsCatalog.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name} ({material.code}) - {material.unitPrice} ₽/{material.unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Наименование материала */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Наименование материала *
                </label>
                <input
                  type="text"
                  value={formData.materialName}
                  onChange={(e) => setFormData(prev => ({ ...prev, materialName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Код материала */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Код материала *
                  </label>
                  <input
                    type="text"
                    value={formData.materialCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, materialCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Единица измерения */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Единица измерения *
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Запланированное количество */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Запланировано *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.quantityPlanned}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantityPlanned: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Использованное количество */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Использовано *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.quantityUsed}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantityUsed: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Цена за единицу */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена за единицу *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Общая стоимость */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Общая стоимость:</span>
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4 text-gray-500" />
                    <span className="text-lg font-semibold text-gray-900">
                      {totalCost.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>

              {/* Примечания */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Примечания
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Дополнительная информация о материале"
                />
              </div>

              {/* Кнопки */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSaveMaterial}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingMaterial ? 'Сохранить изменения' : 'Добавить материал'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsManagement;
