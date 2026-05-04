import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const MODULES = [
  'Utilisateurs', 'Souscriptions', 'Stock', 'Comptabilité', 
  'Tâches', 'Temps', 'Agences', 'Communication', 'Autorisation'
];

const ACTIONS = [
  'Lecture', 'Création', 'Modification', 'Suppression', 'Validation', 'Export'
];

const PermissionMatrix = ({ permissions, onToggle }) => {
  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap sticky left-0 z-10 bg-gray-50">
                Modules \ Permissions
              </th>
              {MODULES.map((module) => (
                <th key={module} className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center whitespace-nowrap">
                  {module}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIONS.map((action) => (
              <tr key={action} className="border-b border-gray-50 last:border-0 hover:bg-bg-light/50 transition-colors group">
                <td className="p-4 text-xs font-bold text-text-dark whitespace-nowrap sticky left-0 bg-white group-hover:bg-bg-light z-10 transition-colors">
                  {action}
                </td>
                {MODULES.map((module) => {
                  const isChecked = permissions[module]?.[action] || false;
                  return (
                    <td key={`${module}-${action}`} className="p-4 text-center">
                      <button
                        onClick={() => onToggle(module, action)}
                        className={clsx(
                          "w-5 h-5 transition-all duration-200 flex items-center justify-center mx-auto border-2",
                          isChecked 
                            ? "bg-primary border-primary scale-110" 
                            : "bg-white border-gray-300 hover:border-primary/50"
                        )}
                      >
                        {isChecked && <Check size={14} className="text-white stroke-[3]" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionMatrix;
