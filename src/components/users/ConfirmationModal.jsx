import { AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../common/Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80] transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white z-[90] rounded-2xl shadow-2xl transition-all duration-300 animate-in zoom-in-95 p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3 rounded-xl",
            type === 'danger' ? "bg-red-50 text-red-600" : "bg-[#F0F3FF] text-[#1428C9]"
          )}>
            <AlertCircle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#111827]">{title}</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed font-medium">
              {message}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} icon={X} />
        </div>

        <div className="mt-10 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            variant={type === 'danger' ? 'danger' : 'primary'} 
            className="flex-1" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText || 'Confirmer'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
