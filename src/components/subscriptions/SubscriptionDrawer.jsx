import React, { useState, useEffect } from 'react';
import { X, Upload, Globe, Zap, Smartphone, Check } from 'lucide-react';

const SubscriptionDrawer = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [selectedOperator, setSelectedOperator] = useState('Orange');
  const [selectedPlan, setSelectedPlan] = useState('FTTH');
  const [selectedSegment, setSelectedSegment] = useState('B2C Individual');

  useEffect(() => {
    if (initialData) {
      setSelectedOperator(initialData.operator.name);
      setSelectedPlan(initialData.operator.type.includes('Fibre') ? 'FTTH' : (initialData.operator.type.includes('Mobile') ? 'Mobile' : 'ADSL'));
    } else {
      setSelectedOperator('Orange');
      setSelectedPlan('FTTH');
      setSelectedSegment('B2C Individual');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">{initialData ? 'Edit Subscription' : 'Subscription Entry'}</h2>
            <p className="drawer-subtitle">{initialData ? 'Update existing operator contract' : 'Add new operator contract'}</p>
          </div>
          <button className="action-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Identity Verification */}
          <div className="mb-8">
            <span className="form-section-label">Identity Verification</span>
            <div className="upload-area">
              <div className="upload-icon">
                <Upload size={24} />
              </div>
              <div className="upload-text">Upload CIN (Front & Back)</div>
              <p className="upload-hint">Max file size 5MB, PDF, PNG, JPG</p>
            </div>
          </div>

          {/* Select Operator */}
          <div className="mb-8">
            <span className="form-section-label">Select Operator</span>
            <div className="operator-grid">
              {[
                { name: 'IAM', color: '#004595' },
                { name: 'Orange', color: '#FF6600' },
                { name: 'Inwi', color: '#722E85' }
              ].map(op => (
                <div 
                  key={op.name}
                  className={`op-select-card ${selectedOperator === op.name ? 'active' : ''}`}
                  onClick={() => setSelectedOperator(op.name)}
                >
                  <div className="op-logo-circle" style={{ backgroundColor: op.color }}></div>
                  <div className="op-select-label">{op.name}</div>
                  {selectedOperator === op.name && (
                    <div className="absolute top-1 right-1 text-blue-600">
                      <div className="w-3 h-3 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check size={8} color="white" strokeWidth={4} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Objective & Segment */}
          <div className="mb-8">
            <span className="form-section-label">Objective & Segment</span>
            
            {/* ADSL */}
            <div 
              className={`plan-select-card ${selectedPlan === 'ADSL' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('ADSL')}
            >
              <div className="plan-icon"><Globe size={20} /></div>
              <div className="plan-info">
                <div className="plan-name">ADSL Connection</div>
                {selectedPlan === 'ADSL' && (
                  <div className="plan-options">
                    <button 
                      className={`plan-option-btn ${selectedSegment === 'B2C Individual' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedSegment('B2C Individual'); }}
                    >
                      B2C Individual
                    </button>
                    <button 
                      className={`plan-option-btn ${selectedSegment === 'B2B Professional' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedSegment('B2B Professional'); }}
                    >
                      B2B Professional
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FTTH */}
            <div 
              className={`plan-select-card ${selectedPlan === 'FTTH' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('FTTH')}
            >
              <div className="plan-icon"><Zap size={20} /></div>
              <div className="plan-info">
                <div className="plan-name">FTTH (Fiber Optic)</div>
                {selectedPlan === 'FTTH' && (
                  <div className="plan-options">
                    <button 
                      className={`plan-option-btn ${selectedSegment === 'B2C Individual' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedSegment('B2C Individual'); }}
                    >
                      B2C Individual
                    </button>
                    <button 
                      className={`plan-option-btn ${selectedSegment === 'B2B Professional' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedSegment('B2B Professional'); }}
                    >
                      B2B Professional
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile */}
            <div 
              className={`plan-select-card ${selectedPlan === 'Mobile' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('Mobile')}
            >
              <div className="plan-icon"><Smartphone size={20} /></div>
              <div className="plan-info">
                <div className="plan-name">Forfait Mobile</div>
                {selectedPlan === 'Mobile' && (
                  <div className="plan-options">
                    <button 
                      className={`plan-option-btn ${selectedSegment === 'B2C Individual' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedSegment('B2C Individual'); }}
                    >
                      B2C Individual
                    </button>
                    <button 
                      className={`plan-option-btn ${selectedSegment === 'B2B Professional' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedSegment('B2B Professional'); }}
                    >
                      B2B Professional
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn-premium btn-secondary w-full" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-premium btn-primary w-full" onClick={() => onSubmit({ operator: selectedOperator, plan: selectedPlan, segment: selectedSegment })}>
            {initialData ? 'Update Subscription' : 'Register Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDrawer;
