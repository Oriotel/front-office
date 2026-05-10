import React, { useState, useMemo } from 'react';
import SubscriptionStats from '../components/subscriptions/SubscriptionStats';
import SubscriptionTable from '../components/subscriptions/SubscriptionTable';
import SubscriptionFilters from '../components/subscriptions/SubscriptionFilters';
import SubscriptionDetailsDrawer from '../components/subscriptions/SubscriptionDetailsDrawer';
import ValidationDrawer from '../components/subscriptions/ValidationDrawer';
import { jsPDF } from 'jspdf';
import { RotateCcw } from 'lucide-react';
import 'jspdf-autotable';
import '../styles/subscriptions.css';

const AssistantSubscriptionsPage = () => {
  const [data, setData] = useState([
    {
      id: 1,
      client: { name: 'Ahmed Bennani', address: '123 Rue de la Liberté, Cas...', avatar: 'AB' },
      contact: { phone: '+212 661 234 567', cin: 'AB123456' },
      operator: { name: 'IAM', type: 'Fibre Optique', color: '#004595' },
      status: 'PENDING',
      validator: 'Sarah Johnson',
      date: '2026-04-08'
    },
    {
      id: 2,
      client: { name: 'Fatima Zahra', address: '456 Avenue Mohammed V, ...', avatar: 'FZ' },
      contact: { phone: '+212 662 987 654', cin: 'FZ789012' },
      operator: { name: 'Orange', type: 'Mobile Postpaid', color: '#FF6600' },
      status: 'REFUSED',
      validator: 'Sarah Johnson',
      date: '2026-04-09'
    },
    {
      id: 3,
      client: { name: 'Karim Mansouri', address: 'Rue Agadir, Tangier', avatar: 'KM' },
      contact: { phone: '+212 660 112 233', cin: 'KM556677' },
      operator: { name: 'Inwi', type: 'ADSL Home', color: '#722E85' },
      status: 'VALIDATED',
      validator: 'Sarah Johnson',
      date: '2026-04-09'
    }
  ]);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({ operator: 'All', status: 'All', startDate: '', endDate: '' });

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.contact.cin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOperator = filters.operator === 'All' || item.operator.name === filters.operator;
      const matchesStatus = filters.status === 'All' || item.status === filters.status;
      const itemDate = new Date(item.date);
      const matchesStartDate = !filters.startDate || itemDate >= new Date(filters.startDate);
      const matchesEndDate = !filters.endDate || itemDate <= new Date(filters.endDate);
      return matchesSearch && matchesOperator && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [data, searchQuery, filters]);

  const handleValidateClick = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(false);
    setIsValidationOpen(true);
  };

  const handleRefuseClick = (item) => {
    if (window.confirm(`Refuser le dossier de ${item.client.name} ?`)) {
      setData(prev => prev.map(i => i.id === item.id ? { ...i, status: 'REFUSED' } : i));
      setIsDetailsOpen(false);
    }
  };

  const handleConfirmValidation = (item) => {
    setData(prev => prev.map(i => i.id === item.id ? { ...i, status: 'VALIDATED' } : i));
    setIsValidationOpen(false);
    alert('Dossier validé avec succès !');
  };

  const handleExport = (format) => {
    // Logic remains same as original but maybe with assistant specific headers
    const timestamp = new Date().toLocaleString();
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text("ORIOTEL ERP - Management Report", 14, 20);
      doc.autoTable({
        startY: 30,
        head: [['CLIENT', 'CIN', 'OPERATOR', 'STATUS', 'DATE']],
        body: filteredData.map(i => [i.client.name, i.contact.cin, i.operator.name, i.status, i.date]),
      });
      doc.save(`export_${new Date().getTime()}.pdf`);
    }
  };

  return (
    <div className="subscriptions-container animate-in fade-in duration-500">
      <div className="page-header">
        <h1 className="page-title">Subscriptions Management</h1>
        <p className="page-subtitle">Manage and validate subscription requests</p>
      </div>

      <SubscriptionStats />

      <div className="content-card mt-8">
        <div className="content-tabs">
          <div className="tab-item active">Total Subscription</div>
          <div className="tab-item">Validated Subscription</div>
          <div className="tab-item">Pending Subscription</div>
          <div className="tab-item">Refused</div>
        </div>
        
        <SubscriptionFilters 
          onAddClick={null} // Assistants don't add, they manage
          onSearch={setSearchQuery}
          onExport={handleExport}
          onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
        />

        {isFilterVisible && (
          <div className="filter-panel">
            {/* Same filter controls as before */}
            <div className="filter-group">
              <span className="filter-label">Operator</span>
              <select className="filter-select" value={filters.operator} onChange={e => setFilters(f => ({...f, operator: e.target.value}))}>
                <option value="All">All Operators</option>
                <option value="IAM">IAM</option>
                <option value="Orange">Orange</option>
                <option value="Inwi">Inwi</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="filter-label">Status</span>
              <select className="filter-select" value={filters.status} onChange={e => setFilters(f => ({...f, status: e.target.value}))}>
                <option value="All">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="VALIDATED">Validated</option>
                <option value="REFUSED">Refused</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="filter-label">De</span>
              <input type="date" className="filter-input-date" value={filters.startDate} onChange={e => setFilters(f => ({...f, startDate: e.target.value}))} />
            </div>
            <div className="filter-group">
              <span className="filter-label">À</span>
              <input type="date" className="filter-input-date" value={filters.endDate} onChange={e => setFilters(f => ({...f, endDate: e.target.value}))} />
            </div>
            <button className="btn-reset-filters" onClick={() => { setFilters({operator:'All', status:'All', startDate:'', endDate:''}); setSearchQuery(''); }}>
              <RotateCcw size={14} /> <span>Réinitialiser</span>
            </button>
          </div>
        )}
        
        <SubscriptionTable 
          data={filteredData} 
          onView={(item) => { setSelectedItem(item); setIsDetailsOpen(true); }}
          onEdit={handleValidateClick} // Assistant "Edit" is actually Validate/Refuse flow
          onDelete={handleRefuseClick}
        />
      </div>

      <SubscriptionDetailsDrawer 
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedItem(null); }}
        data={selectedItem}
        showActions={true} // Enable assistant buttons
        onValidate={handleValidateClick}
        onRefuse={handleRefuseClick}
      />

      <ValidationDrawer 
        isOpen={isValidationOpen}
        onClose={() => { setIsValidationOpen(false); setSelectedItem(null); }}
        data={selectedItem}
        onConfirm={handleConfirmValidation}
      />
    </div>
  );
};

export default AssistantSubscriptionsPage;
