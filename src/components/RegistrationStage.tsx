import React, { useState } from 'react';
import { Client, Order } from '../types';
import { PersonalFile } from '../types/personalFile';
import { WorkOrder } from '../types/orders';
import PersonalFilesTable from './PersonalFilesTable';
import PersonalFileDetails from './PersonalFileDetails';
import PersonalFileForm from './PersonalFileForm';
import { UserPlus, Search, FileText, Calendar } from 'lucide-react';

interface RegistrationStageProps {
  clients: Client[];
  orders: Order[];
  personalFiles: PersonalFile[];
  workOrders: WorkOrder[];
  onNewClient: (client: Omit<Client, 'id'>) => void;
  onNewOrder: (order: Omit<Order, 'id'>) => void;
  onNewPersonalFile: (personalFile: PersonalFile) => void;
  onUpdatePersonalFile: (id: string, updates: Partial<PersonalFile>) => void;
  onNewWorkOrder: (workOrder: WorkOrder) => void;
  onUpdateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
}

const RegistrationStage: React.FC<RegistrationStageProps> = ({
  clients,
  orders,
  personalFiles,
  workOrders,
  onNewClient,
  onNewOrder,
  onNewPersonalFile,
  onUpdatePersonalFile,
  onNewWorkOrder,
  onUpdateWorkOrder
}) => {
  console.log('RegistrationStage получил personalFiles:', personalFiles.length, 'записей');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [selectedPersonalFile, setSelectedPersonalFile] = useState<PersonalFile | null>(null);
  const [showPersonalFileForm, setShowPersonalFileForm] = useState(false);
  const [editingPersonalFile, setEditingPersonalFile] = useState<PersonalFile | null>(null);

  const filteredClients = clients.filter(client =>
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.personalFileNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const registrationOrders = orders.filter(order => order.status === 'регистрация');

  const handleNewPersonalFile = () => {
    setEditingPersonalFile(null);
    setShowPersonalFileForm(true);
  };

  const handleViewPersonalFile = (personalFile: PersonalFile) => {
    setSelectedPersonalFile(personalFile);
  };

  const handleEditPersonalFile = (personalFile: PersonalFile) => {
    setEditingPersonalFile(personalFile);
    setShowPersonalFileForm(true);
  };

  const handleSavePersonalFile = (personalFile: PersonalFile) => {
    if (editingPersonalFile) {
      onUpdatePersonalFile(personalFile.id, personalFile);
    } else {
      onNewPersonalFile(personalFile);
    }
    setShowPersonalFileForm(false);
    setEditingPersonalFile(null);
  };

  return (
    <div className="space-y-6">
      <PersonalFilesTable
        personalFiles={personalFiles}
        onNewPersonalFile={handleNewPersonalFile}
        onViewPersonalFile={handleViewPersonalFile}
        onEditPersonalFile={handleEditPersonalFile}
      />

      {/* Модальные окна */}
            {selectedPersonalFile && (
              <PersonalFileDetails
                personalFile={selectedPersonalFile}
                onClose={() => setSelectedPersonalFile(null)}
                onEdit={handleEditPersonalFile}
                onUpdatePersonalFile={onUpdatePersonalFile}
                workOrders={workOrders}
                onNewWorkOrder={onNewWorkOrder}
                onUpdateWorkOrder={onUpdateWorkOrder}
              />
            )}

      {showPersonalFileForm && (
        <PersonalFileForm
          personalFile={editingPersonalFile || undefined}
          onSave={handleSavePersonalFile}
          onCancel={() => {
            setShowPersonalFileForm(false);
            setEditingPersonalFile(null);
          }}
        />
      )}

    </div>
  );
};

export default RegistrationStage;
