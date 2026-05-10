import React, { useState, useMemo } from 'react';
import SubscriptionStats from '../components/subscriptions/SubscriptionStats';
import SubscriptionTable from '../components/subscriptions/SubscriptionTable';
import SubscriptionFilters from '../components/subscriptions/SubscriptionFilters';
import SubscriptionDrawer from '../components/subscriptions/SubscriptionDrawer';
import SubscriptionDetailsDrawer from '../components/subscriptions/SubscriptionDetailsDrawer';
import { jsPDF } from 'jspdf';
import { RotateCcw } from 'lucide-react';
import 'jspdf-autotable';
import '../styles/subscriptions.css';

const SubscriptionsPage = () => {
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters State
  const [filters, setFilters] = useState({
    operator: 'All',
    status: 'All',
    startDate: '',
    endDate: ''
  });

  // Reset Logic
  const resetFilters = () => {
    setFilters({ operator: 'All', status: 'All', startDate: '', endDate: '' });
    setSearchQuery('');
  };

  // Filtering Logic (Search + Dropdown + Dates)
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.contact.cin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toString().includes(searchQuery);
      
      const matchesOperator = filters.operator === 'All' || item.operator.name === filters.operator;
      const matchesStatus = filters.status === 'All' || item.status === filters.status;
      
      const itemDate = new Date(item.date);
      const matchesStartDate = !filters.startDate || itemDate >= new Date(filters.startDate);
      const matchesEndDate = !filters.endDate || itemDate <= new Date(filters.endDate);

      return matchesSearch && matchesOperator && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [data, searchQuery, filters]);

  // CRUD Actions
  const handleAddOrUpdate = (formData) => {
    if (selectedItem) {
      setData(prev => prev.map(item => item.id === selectedItem.id ? {
        ...item,
        operator: { ...item.operator, name: formData.operator, type: formData.plan }
      } : item));
    } else {
      const newItem = {
        id: data.length + 1,
        client: { name: 'New Client', address: 'Address...', avatar: 'NC' },
        contact: { phone: '+212 XXX XXX XXX', cin: 'XX123456' },
        operator: { name: formData.operator, type: formData.plan, color: formData.operator === 'IAM' ? '#004595' : (formData.operator === 'Orange' ? '#FF6600' : '#722E85') },
        status: 'PENDING',
        validator: 'Admin',
        date: new Date().toISOString().split('T')[0]
      };
      setData(prev => [newItem, ...prev]);
    }
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

  // Export Logic
  const handleExport = (format) => {
    const timestamp = new Date().toLocaleString();
    const filename = `subscriptions_report_${new Date().getTime()}`;
    
    if (format === 'csv' || format === 'excel') {
      const headers = ['CLIENT NAME', 'CIN', 'PHONE', 'OPERATOR', 'PLAN TYPE', 'STATUS', 'VALIDATOR', 'DATE'];
      const rows = filteredData.map(i => [
        i.client.name, i.contact.cin, i.contact.phone, i.operator.name, i.operator.type, i.status, i.validator, i.date
      ]);
      const content = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.${format === 'csv' ? 'csv' : 'xls'}`);
      link.click();
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(20, 40, 201); 
      doc.text("ORIOTEL ERP - Subscriptions Report", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${timestamp}`, 14, 28);
      doc.text(`Total Records: ${filteredData.length}`, 14, 33);
      const tableRows = filteredData.map(i => [
        i.client.name, i.contact.cin, i.operator.name, i.operator.type, i.status, i.date
      ]);
      doc.autoTable({
        startY: 40,
        head: [['CLIENT', 'CIN', 'OPERATOR', 'PLAN', 'STATUS', 'DATE']],
        body: tableRows,
        headStyles: { fillColor: [20, 40, 201], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { top: 40 },
      });
      doc.save(`${filename}.pdf`);
    }
  };

  return (
    <div className="subscriptions-container animate-in fade-in duration-500">
      <div className="page-header">
        <h1 className="page-title">My Subscriptions</h1>
        <p className="page-subtitle">Manage and validate subscription requests</p>
      </div>

      <SubscriptionStats />

      <div className="content-card mt-8">
        <div className="content-tabs">
          <div className="tab-item active">Total Subscription</div>
        </div>
        
        <SubscriptionFilters 
          onAddClick={() => { setSelectedItem(null); setIsDrawerOpen(true); }} 
          onSearch={setSearchQuery}
          onExport={handleExport}
          onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
        />

        {/* Filter Panel */}
        {isFilterVisible && (
          <div className="filter-panel">
            <div className="filter-group">
              <span className="filter-label">Operator</span>
              <select 
                className="filter-select"
                value={filters.operator}
                onChange={(e) => setFilters(prev => ({ ...prev, operator: e.target.value }))}
              >
                <option value="All">All Operators</option>
                <option value="IAM">IAM</option>
                <option value="Orange">Orange</option>
                <option value="Inwi">Inwi</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="filter-label">Status</span>
              <select 
                className="filter-select"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="All">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="VALIDATED">Validated</option>
                <option value="REFUSED">Refused</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="filter-group">
              <span className="filter-label">De</span>
              <input 
                type="date" 
                className="filter-input-date" 
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="filter-group">
              <span className="filter-label">À</span>
              <input 
                type="date" 
                className="filter-input-date" 
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            
            <button className="btn-reset-filters" onClick={resetFilters}>
              <RotateCcw size={14} />
              <span>Réinitialiser</span>
            </button>
          </div>
        )}
        
        <SubscriptionTable 
          data={filteredData} 
          onView={(item) => { setSelectedItem(item); setIsDetailsOpen(true); }}
          onEdit={(item) => { setSelectedItem(item); setIsDrawerOpen(true); }}
          onDelete={(item) => { if (window.confirm('Delete?')) setData(d => d.filter(i => i.id !== item.id)); }}
        />
      </div>

      <SubscriptionDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => { setIsDrawerOpen(false); setSelectedItem(null); }} 
        onSubmit={handleAddOrUpdate}
        initialData={selectedItem}
      />

      <SubscriptionDetailsDrawer 
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedItem(null); }}
        data={selectedItem}
      />
    </div>
  );
};

export default SubscriptionsPage;
