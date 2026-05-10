import React from 'react';
import { X, Paperclip, Clock, Info } from 'lucide-react';

const SubscriptionDetailsDrawer = ({ isOpen, onClose, data, showActions = false, onValidate, onRefuse }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Détails du dossier</h2>
            <p className="drawer-subtitle" style={{ color: '#2563eb', fontWeight: 700 }}>#SUB-2024-890</p>
          </div>
          <button className="action-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* User Info Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200">
              <img src={`https://ui-avatars.com/api/?name=${data.client.name}&background=random`} alt={data.client.name} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{data.client.name}</h3>
              <p className="text-sm text-slate-500 font-medium">CIN: {data.contact.cin}</p>
              <p className="text-xs text-slate-400">Inscrit le 12/10/2023</p>
            </div>
          </div>

          {/* Contact Card */}
          <div className="details-user-card">
            <div className="details-row">
              <span className="details-label">Téléphone</span>
              <span className="details-value">{data.contact.phone}</span>
            </div>
            <div className="details-row border-t border-slate-100">
              <span className="details-label">Adresse</span>
              <span className="details-value">{data.client.address}</span>
            </div>
            <div className="details-row border-t border-slate-100">
              <span className="details-label">Numéro fixe</span>
              <span className="details-value">005487XXXXXXXXXX</span>
            </div>
          </div>

          {/* Attachments */}
          <div className="mt-8">
            <span className="form-section-label flex items-center gap-2">
              <Paperclip size={14} /> PIÈCES JOINTES
            </span>
            <div className="attachment-grid">
              <div className="attachment-card">
                <div className="attachment-thumb">
                   <div className="w-12 h-8 bg-blue-100 rounded border border-blue-200"></div>
                </div>
                <div className="attachment-name">CIN_Recto.jpg</div>
              </div>
              <div className="attachment-card">
                <div className="attachment-thumb">
                   <div className="w-8 h-10 bg-slate-100 rounded border border-slate-200"></div>
                </div>
                <div className="attachment-name">Contrat_Signed.pdf</div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mt-8">
            <span className="form-section-label flex items-center gap-2">
              <Clock size={14} /> HISTORIQUE DU STATUT
            </span>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot bg-orange-500"></div>
                <div className="timeline-content">
                  <span className="timeline-title">En attente de validation</span>
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

          {/* Potential Refusal Alert */}
          <div className="alert-danger-soft">
            <span className="alert-title flex items-center gap-2">
              <Info size={14} /> MOTIF DE REFUS POTENTIEL
            </span>
            <p className="alert-text">
              Le justificatif de domicile fourni est daté de plus de 3 mois. Veuillez demander une version récente au client pour validation finale.
            </p>
          </div>
        </div>

        <div className="drawer-footer flex gap-3">
          {showActions ? (
            <>
              <button 
                className="btn-premium w-full justify-center bg-blue-50 text-blue-600 border-none font-bold"
                onClick={() => onRefuse(data)}
              >
                REFUSER
              </button>
              <button 
                className="btn-premium btn-primary w-full justify-center font-bold"
                onClick={() => onValidate(data)}
              >
                VALIDER
              </button>
            </>
          ) : (
            <button className="btn-premium btn-secondary w-full" onClick={onClose}>
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsDrawer;
