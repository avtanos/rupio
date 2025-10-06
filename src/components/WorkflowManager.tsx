import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Send, Clock, AlertCircle, Eye } from 'lucide-react';
import { WorkflowStatus, WorkflowAction, WorkflowStep, WorkflowHistory } from '../types/workflow';

interface WorkflowManagerProps {
  orderId: string;
  currentStatus: WorkflowStatus;
  currentDepartment: string;
  workflowHistory: WorkflowHistory;
  userRole: string;
  onWorkflowAction: (action: WorkflowAction, comments?: string) => void;
  onViewHistory: () => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  orderId,
  currentStatus,
  currentDepartment,
  workflowHistory,
  userRole,
  onWorkflowAction,
  onViewHistory
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState('');

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'registration_pending': return 'bg-blue-100 text-blue-800';
      case 'medical_review': return 'bg-yellow-100 text-yellow-800';
      case 'chief_approval': return 'bg-orange-100 text-orange-800';
      case 'dispatcher_assignment': return 'bg-purple-100 text-purple-800';
      case 'in_production': return 'bg-indigo-100 text-indigo-800';
      case 'ready_for_fitting': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'returned_for_revision': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: WorkflowStatus) => {
    const labels: Record<WorkflowStatus, string> = {
      'draft': 'Черновик',
      'registration_pending': 'Ожидает в регистратуре',
      'medical_review': 'На рассмотрении в медотделе',
      'chief_approval': 'На одобрении главного врача',
      'dispatcher_assignment': 'Назначен диспетчером',
      'in_production': 'В производстве',
      'ready_for_fitting': 'Готов к примерке',
      'completed': 'Завершен',
      'rejected': 'Отклонен',
      'returned_for_revision': 'Возвращен на доработку'
    };
    return labels[status];
  };

  const getAvailableActions = (): WorkflowAction[] => {
    const actions: WorkflowAction[] = [];
    
    switch (userRole) {
      case 'registration':
        if (currentStatus === 'draft' || currentStatus === 'registration_pending') {
          actions.push('send_to_medical');
        }
        break;
      case 'medical':
        if (currentStatus === 'medical_review') {
          actions.push('send_to_chief');
        }
        break;
      case 'chief_doctor':
        if (currentStatus === 'chief_approval') {
          actions.push('approve', 'reject', 'return_for_revision');
        }
        break;
      case 'dispatcher':
        if (currentStatus === 'dispatcher_assignment') {
          actions.push('assign_to_production');
        }
        break;
      case 'workshop':
        if (currentStatus === 'in_production') {
          actions.push('mark_ready');
        }
        break;
    }
    
    return actions;
  };

  const getActionLabel = (action: WorkflowAction): string => {
    const labels: Record<WorkflowAction, string> = {
      'send_to_medical': 'Отправить в медотдел',
      'send_to_chief': 'Направить главному врачу',
      'approve': 'Одобрить',
      'reject': 'Отклонить',
      'return_for_revision': 'Вернуть на доработку',
      'assign_to_dispatcher': 'Назначить диспетчеру',
      'assign_to_production': 'Назначить в производство',
      'mark_ready': 'Отметить готовым',
      'complete': 'Завершить'
    };
    return labels[action];
  };

  const getActionIcon = (action: WorkflowAction) => {
    switch (action) {
      case 'send_to_medical':
      case 'send_to_chief':
      case 'assign_to_dispatcher':
      case 'assign_to_production':
        return <Send className="w-4 h-4" />;
      case 'approve':
        return <CheckCircle className="w-4 h-4" />;
      case 'reject':
        return <XCircle className="w-4 h-4" />;
      case 'return_for_revision':
        return <RotateCcw className="w-4 h-4" />;
      case 'mark_ready':
        return <Clock className="w-4 h-4" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Send className="w-4 h-4" />;
    }
  };

  const handleAction = (action: WorkflowAction) => {
    if (action === 'reject' || action === 'return_for_revision') {
      setShowComments(true);
    } else {
      onWorkflowAction(action, comments);
      setComments('');
    }
  };

  const handleConfirmAction = (action: WorkflowAction) => {
    onWorkflowAction(action, comments);
    setComments('');
    setShowComments(false);
  };

  const availableActions = getAvailableActions();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Управление заказом</h3>
        <button
          onClick={onViewHistory}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <Eye className="w-4 h-4" />
          История изменений
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Текущий статус:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
            {getStatusLabel(currentStatus)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Отдел:</span>
          <span className="text-sm text-gray-600">{currentDepartment}</span>
        </div>
      </div>

      {availableActions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Доступные действия:</h4>
          <div className="flex flex-wrap gap-2">
            {availableActions.map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  action === 'reject' || action === 'return_for_revision'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : action === 'approve'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {getActionIcon(action)}
                {getActionLabel(action)}
              </button>
            ))}
          </div>
        </div>
      )}

      {showComments && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Комментарий к действию:</h4>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Укажите причину отклонения или возврата на доработку..."
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleConfirmAction('reject')}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
            >
              Отклонить
            </button>
            <button
              onClick={() => handleConfirmAction('return_for_revision')}
              className="px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700"
            >
              Вернуть на доработку
            </button>
            <button
              onClick={() => setShowComments(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManager;
