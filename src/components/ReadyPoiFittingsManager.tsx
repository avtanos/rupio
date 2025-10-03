import React from 'react';
import { ReadyPoiFitting } from '../types/readyPoiOrder';
import { Trash2 } from 'lucide-react';

interface ReadyPoiFittingsManagerProps {
  fittings: ReadyPoiFitting[];
  onFittingsChange: (fittings: ReadyPoiFitting[]) => void;
  onAddFitting?: () => void;
}

const ReadyPoiFittingsManager: React.FC<ReadyPoiFittingsManagerProps> = ({
  fittings,
  onFittingsChange,
  onAddFitting
}) => {
  const handleDeleteFitting = (id: string) => {
    onFittingsChange(fittings.filter(fitting => fitting.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Примерки</h3>
      </div>

      {/* Список примерок с inline редактированием */}
      <div className="space-y-3">
        {fittings.map((fitting) => (
          <div key={fitting.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Примерка {fitting.fittingNumber}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дата вызова
                    </label>
                    <input
                      type="date"
                      value={fitting.callDate || ''}
                      onChange={(e) => {
                        const updatedFitting = {
                          ...fitting,
                          callDate: e.target.value
                        };
                        onFittingsChange(
                          fittings.map(f => 
                            f.id === fitting.id ? updatedFitting : f
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дата явки
                    </label>
                    <input
                      type="date"
                      value={fitting.appointmentDate || ''}
                      onChange={(e) => {
                        const updatedFitting = {
                          ...fitting,
                          appointmentDate: e.target.value
                        };
                        onFittingsChange(
                          fittings.map(f => 
                            f.id === fitting.id ? updatedFitting : f
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleDeleteFitting(fitting.id)}
                  className="p-2 text-red-600 hover:text-red-900"
                  title="Удалить примерку"
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

export default ReadyPoiFittingsManager;
