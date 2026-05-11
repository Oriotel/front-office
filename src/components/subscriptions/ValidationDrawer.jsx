import React from 'react';
import { X, Upload, Phone, Clock } from 'lucide-react';

const ValidationDrawer = ({ isOpen, onClose, data, onConfirm }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Validation du dossier</h2>
            <p className="drawer-subtitle" style={{ color: '#2563eb', fontWeight: 700 }}>#SUB-2024-890</p>
          </div>
          <button className="action-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* User Summary */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200">
              <img src={`https://ui-avatars.com/api/?name=${data.client.name}&background=random`} alt={data.client.name} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{data.client.name}</h3>
              <p className="text-xs text-slate-500">CIN: {data.contact.cin}</p>
              <p className="text-[10px] text-slate-400">Inscrit le 12/10/2023</p>
            </div>
          </div>

          {/* Fixed Line Input */}
          <div className="mb-8">
            <span className="form-section-label">NUMÉRO DE LIGNE FIXE</span>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all"
                placeholder="01 23 45 67 89"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 italic">Le numéro doit correspondre à la ligne d'installation prévue.</p>
          </div>

          {/* Contract Upload */}
          <div className="mb-8">
            <span className="form-section-label flex items-center gap-2">CHARGER LE CONTRAT SIGNÉ</span>
            <div className="upload-area mt-2 py-8 bg-slate-50/50">
              <div className="upload-icon bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Upload size={20} />
              </div>
              <div className="upload-text mt-3">Cliquer ou glisser-déposer</div>
              <p className="upload-hint">PDF, JPG (max. 10MB)</p>
            </div>
          </div>

          {/* Status History */}
          <div className="mt-8">
            <span className="form-section-label flex items-center gap-2">
              <Clock size={14} /> HISTORIQUE DU STATUT
            </span>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot bg-orange-500"></div>
                <div className="timeline-content">
                  <span className="timeline-title">Dossier Validé</span>
                  <span className="timeline-date">Aujourd'hui, 09:45 par Système</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot bg-blue-400"></div>
                <div className="timeline-content">
                  <span className="timeline-title">Dossier créé</span>
                  <span className="timeline-date">12/10/2023, 16:30 par Ahmed M.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-footer flex-col gap-2">
          <button 
            className="btn-premium btn-primary w-full py-4 text-base shadow-xl shadow-blue-200" 
            onClick={() => onConfirm(data)}
          >
            Confirmer la validation
          </button>
          <button className="text-sm font-bold text-slate-500 hover:text-slate-800 py-2 transition-all" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationDrawer;
