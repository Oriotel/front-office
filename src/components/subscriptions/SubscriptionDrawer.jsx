import React, { useState, useEffect } from 'react';
import { X, Globe, Zap, Smartphone, Check } from 'lucide-react';
import CinUploadSection from './CinUploadSection';

const OPERATORS = [
  { name: 'IAM',    color: '#EE1D23' },
  { name: 'Orange', color: '#FF6600' },
  { name: 'Inwi',   color: '#722E85' },
];

const PLANS = [
  { id: 'ADSL',   name: 'ADSL Connection',    icon: <Globe size={20} />      },
  { id: 'FTTH',   name: 'FTTH (Fibre Optique)', icon: <Zap size={20} />      },
  { id: 'Mobile', name: 'Forfait Mobile',      icon: <Smartphone size={20} /> },
];

const SubscriptionDrawer = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [selectedOperator, setSelectedOperator] = useState('Orange');
  const [selectedPlan,     setSelectedPlan]     = useState('FTTH');
  const [selectedSegment,  setSelectedSegment]  = useState('B2C Individual');

  // CIN & documents
  const [cinNumber, setCinNumber] = useState('');
  const [cinFiles,  setCinFiles]  = useState([]); // File[]

  // Reset when opening / switching to new entry
  useEffect(() => {
    if (initialData) {
      setSelectedOperator(initialData.operator?.name || 'Orange');
      const type = initialData.operator?.type || '';
      setSelectedPlan(type.includes('Fibre') ? 'FTTH' : type.includes('Mobile') ? 'Mobile' : 'ADSL');
    } else {
      setSelectedOperator('Orange');
      setSelectedPlan('FTTH');
      setSelectedSegment('B2C Individual');
    }
    setCinNumber('');
    setCinFiles([]);
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    onSubmit({
      operator:  selectedOperator,
      plan:      selectedPlan,
      segment:   selectedSegment,
      cin:       cinNumber,
      documents: cinFiles,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-500 ease-out">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {initialData ? 'Modifier la souscription' : 'Saisir une souscription'}
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
              {initialData ? 'Mettre à jour le dossier' : 'Nouveau dossier client'}
            </p>
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10"
             style={{ scrollbarWidth: 'none' }}>

          {/* 1. Identity Verification — CIN Upload + OCR */}
          <CinUploadSection
            onCinExtracted={setCinNumber}
            onFilesChange={setCinFiles}
          />

          {/* 2. Select Operator */}
          <div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-5 block">
              Choisir l'opérateur
            </span>
            <div className="grid grid-cols-3 gap-4">
              {OPERATORS.map((op) => (
                <div
                  key={op.name}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${
                    selectedOperator === op.name
                      ? 'border-blue-600 bg-blue-50/20 shadow-lg shadow-blue-100/50'
                      : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                  }`}
                  onClick={() => setSelectedOperator(op.name)}
                >
                  <div
                    className="w-10 h-10 rounded-full shadow-inner"
                    style={{ backgroundColor: op.color }}
                  />
                  <div className={`text-xs font-black uppercase tracking-widest ${
                    selectedOperator === op.name ? 'text-blue-700' : 'text-slate-600'
                  }`}>
                    {op.name}
                  </div>
                  {/* Radio indicator */}
                  <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedOperator === op.name
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {selectedOperator === op.name && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Objective & Segment */}
          <div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-5 block">
              Objectif & Segment
            </span>
            <div className="space-y-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'border-blue-600 bg-blue-50/10'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 flex items-center justify-center rounded-sm border-2 transition-all ${
                        selectedPlan === plan.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-200 bg-white'
                      }`}>
                        {selectedPlan === plan.id && (
                          <Check size={12} className="text-white" strokeWidth={4} />
                        )}
                      </div>
                      <span className="text-sm font-black text-slate-900">{plan.name}</span>
                    </div>
                    <div className={selectedPlan === plan.id ? 'text-blue-600' : 'text-slate-300'}>
                      {plan.icon}
                    </div>
                  </div>

                  {selectedPlan === plan.id && (
                    <div className="flex gap-3 mt-4">
                      {['B2C Individual', 'B2B Professionnel'].map((seg) => (
                        <button
                          key={seg}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedSegment === seg
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                              : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600'
                          }`}
                          onClick={(e) => { e.stopPropagation(); setSelectedSegment(seg); }}
                        >
                          {seg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex items-center gap-4">
          <button
            className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="flex-[2] py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
            onClick={handleSubmit}
          >
            {initialData ? 'Mettre à jour' : 'Enregistrer le dossier'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionDrawer;
