import React, { useState, useRef } from 'react';
import { Upload, X, Plus, Ruler, Edit3, Save, Trash2 } from 'lucide-react';
import { LimbVisualization } from '../types/workflow';

interface LimbVisualizationEditorProps {
  orderId: string;
  limbType: 'left_arm' | 'right_arm' | 'left_leg' | 'right_leg' | 'torso';
  side: 'left' | 'right';
  visualization?: LimbVisualization;
  onSave: (visualization: LimbVisualization) => void;
  onCancel: () => void;
}

const LimbVisualizationEditor: React.FC<LimbVisualizationEditorProps> = ({
  orderId,
  limbType,
  side,
  visualization,
  onSave,
  onCancel
}) => {
  const [images, setImages] = useState({
    front: visualization?.images.front || '',
    side: visualization?.images.side || '',
    back: visualization?.images.back || '',
    detail: visualization?.images.detail || ''
  });
  
  const [measurements, setMeasurements] = useState({
    length: visualization?.measurements.length || 0,
    circumference: visualization?.measurements.circumference || 0,
    width: visualization?.measurements.width || 0,
    height: visualization?.measurements.height || 0,
    customMeasurements: visualization?.measurements.customMeasurements || {}
  });
  
  const [annotations, setAnnotations] = useState(visualization?.annotations || []);
  const [isEditing, setIsEditing] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState({ label: '', description: '' });
  const [customMeasurementName, setCustomMeasurementName] = useState('');
  const [customMeasurementValue, setCustomMeasurementValue] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getLimbLabel = () => {
    const labels = {
      'left_arm': 'Левая рука',
      'right_arm': 'Правая рука',
      'left_leg': 'Левая нога',
      'right_leg': 'Правая нога',
      'torso': 'Торс'
    };
    return labels[limbType];
  };

  const handleImageUpload = (type: keyof typeof images, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImages(prev => ({
        ...prev,
        [type]: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddAnnotation = () => {
    if (newAnnotation.label.trim()) {
      const annotation = {
        id: `ann_${Date.now()}`,
        x: Math.random() * 200 + 50, // Примерные координаты
        y: Math.random() * 200 + 50,
        label: newAnnotation.label,
        description: newAnnotation.description
      };
      setAnnotations(prev => [...prev, annotation]);
      setNewAnnotation({ label: '', description: '' });
    }
  };

  const handleRemoveAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  const handleAddCustomMeasurement = () => {
    if (customMeasurementName.trim()) {
      setMeasurements(prev => ({
        ...prev,
        customMeasurements: {
          ...prev.customMeasurements,
          [customMeasurementName]: customMeasurementValue
        }
      }));
      setCustomMeasurementName('');
      setCustomMeasurementValue(0);
    }
  };

  const handleRemoveCustomMeasurement = (name: string) => {
    setMeasurements(prev => {
      const newCustom = { ...prev.customMeasurements };
      delete newCustom[name];
      return {
        ...prev,
        customMeasurements: newCustom
      };
    });
  };

  const handleSave = () => {
    const visualizationData: LimbVisualization = {
      id: visualization?.id || `limb_${Date.now()}`,
      orderId,
      limbType,
      side,
      images,
      measurements,
      annotations,
      createdAt: visualization?.createdAt || new Date().toISOString(),
      createdBy: 'current_user' // В реальном приложении получать из контекста
    };
    
    onSave(visualizationData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Визуализация конечности: {getLimbLabel()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            <X className="w-4 h-4" />
            Отмена
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Загрузка изображений */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Изображения конечности</h4>
          
          {Object.entries(images).map(([type, url]) => (
            <div key={type} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {type === 'front' ? 'Спереди' : 
                 type === 'side' ? 'Сбоку' : 
                 type === 'back' ? 'Сзади' : 'Детали'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {url ? (
                  <div className="relative">
                    <img src={url} alt={type} className="w-full h-32 object-cover rounded" />
                    <button
                      onClick={() => setImages(prev => ({ ...prev, [type]: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Загрузить изображение
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(type as keyof typeof images, file);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Измерения */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Измерения</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длина (см)
              </label>
              <input
                type="number"
                value={measurements.length}
                onChange={(e) => setMeasurements(prev => ({ ...prev, length: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Обхват (см)
              </label>
              <input
                type="number"
                value={measurements.circumference}
                onChange={(e) => setMeasurements(prev => ({ ...prev, circumference: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ширина (см)
              </label>
              <input
                type="number"
                value={measurements.width}
                onChange={(e) => setMeasurements(prev => ({ ...prev, width: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Высота (см)
              </label>
              <input
                type="number"
                value={measurements.height}
                onChange={(e) => setMeasurements(prev => ({ ...prev, height: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                step="0.1"
              />
            </div>
          </div>

          {/* Дополнительные измерения */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Дополнительные измерения</h5>
            <div className="space-y-2">
              {Object.entries(measurements.customMeasurements).map(([name, value]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{name}:</span>
                  <span className="text-sm font-medium">{value} см</span>
                  <button
                    onClick={() => handleRemoveCustomMeasurement(name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Название измерения"
                  value={customMeasurementName}
                  onChange={(e) => setCustomMeasurementName(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Значение"
                  value={customMeasurementValue}
                  onChange={(e) => setCustomMeasurementValue(Number(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                  step="0.1"
                />
                <button
                  onClick={handleAddCustomMeasurement}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Аннотации */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Аннотации</h5>
            <div className="space-y-2">
              {annotations.map((annotation) => (
                <div key={annotation.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">{annotation.label}</span>
                  <span className="text-sm text-gray-600">- {annotation.description}</span>
                  <button
                    onClick={() => handleRemoveAnnotation(annotation.id)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Метка"
                  value={newAnnotation.label}
                  onChange={(e) => setNewAnnotation(prev => ({ ...prev, label: e.target.value }))}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Описание"
                  value={newAnnotation.description}
                  onChange={(e) => setNewAnnotation(prev => ({ ...prev, description: e.target.value }))}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={handleAddAnnotation}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimbVisualizationEditor;
