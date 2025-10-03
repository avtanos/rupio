import React, { useState } from 'react';
import { ProsthesisComponent } from '../types/prosthesisOrder';
import { Plus, Trash2, Edit } from 'lucide-react';

interface ProsthesisComponentsTableProps {
  components: ProsthesisComponent[];
  onComponentsChange: (components: ProsthesisComponent[]) => void;
  availableComponents: Array<{ id: string; name: string; code: string; description: string }>;
}

const ProsthesisComponentsTable: React.FC<ProsthesisComponentsTableProps> = ({
  components,
  onComponentsChange,
  availableComponents
}) => {
  const [editingComponent, setEditingComponent] = useState<ProsthesisComponent | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddComponent = () => {
    const newComponent: ProsthesisComponent = {
      id: `comp_${Date.now()}`,
      name: '',
      code: '',
      size: '',
      quantityLeft: 0,
      quantityRight: 0
    };
    setEditingComponent(newComponent);
    setIsAddingNew(true);
  };

  const handleEditComponent = (component: ProsthesisComponent) => {
    setEditingComponent(component);
    setIsAddingNew(false);
  };

  const handleSaveComponent = () => {
    if (!editingComponent) return;

    if (isAddingNew) {
      onComponentsChange([...components, editingComponent]);
    } else {
      onComponentsChange(
        components.map(comp => 
          comp.id === editingComponent.id ? editingComponent : comp
        )
      );
    }

    setEditingComponent(null);
    setIsAddingNew(false);
  };

  const handleDeleteComponent = (id: string) => {
    onComponentsChange(components.filter(comp => comp.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingComponent(null);
    setIsAddingNew(false);
  };

  const handleComponentFieldChange = (field: keyof ProsthesisComponent, value: string | number) => {
    if (!editingComponent) return;
    
    setEditingComponent({
      ...editingComponent,
      [field]: value
    });
  };

  const handleSelectFromAvailable = (availableComponent: { id: string; name: string; code: string; description: string }) => {
    if (!editingComponent) return;
    
    setEditingComponent({
      ...editingComponent,
      name: availableComponent.name,
      code: availableComponent.code
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Таблица изделий</h3>
        <button
          onClick={handleAddComponent}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить компонент</span>
        </button>
      </div>

      {/* Таблица компонентов */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                №
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Наименование п/фабрикатов
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Шифр полуфабрикатов
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Размер
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Количество левый
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Количество правый
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {components.map((component, index) => (
              <tr key={component.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {component.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {component.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {component.size || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {component.quantityLeft || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {component.quantityRight || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditComponent(component)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteComponent(component.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Форма редактирования/добавления */}
      {editingComponent && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {isAddingNew ? 'Добавление компонента' : 'Редактирование компонента'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Наименование п/фабрикатов
              </label>
              <select
                value={editingComponent.name}
                onChange={(e) => {
                  const selected = availableComponents.find(comp => comp.name === e.target.value);
                  if (selected) {
                    handleSelectFromAvailable(selected);
                  } else {
                    handleComponentFieldChange('name', e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Выберите компонент</option>
                {availableComponents.map(comp => (
                  <option key={comp.id} value={comp.name}>
                    {comp.name} ({comp.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Шифр полуфабрикатов
              </label>
              <input
                type="text"
                value={editingComponent.code}
                onChange={(e) => handleComponentFieldChange('code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите шифр"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Размер
              </label>
              <input
                type="text"
                value={editingComponent.size || ''}
                onChange={(e) => handleComponentFieldChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите размер"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество левый
              </label>
              <input
                type="number"
                min="0"
                value={editingComponent.quantityLeft || 0}
                onChange={(e) => handleComponentFieldChange('quantityLeft', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество правый
              </label>
              <input
                type="number"
                min="0"
                value={editingComponent.quantityRight || 0}
                onChange={(e) => handleComponentFieldChange('quantityRight', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSaveComponent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsthesisComponentsTable;
