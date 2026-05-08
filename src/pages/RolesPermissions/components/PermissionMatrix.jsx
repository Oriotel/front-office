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
    <div className="bg-white rounded-sm border border-gray-100 overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap sticky left-0 z-10 bg-[#F8FAFC]">
                Modules \ Permissions
              </th>
              {MODULES.map((module) => (
                <th key={module} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center whitespace-nowrap bg-[#F8FAFC]">
                  {module}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ACTIONS.map((action) => (
              <tr key={action} className="transition-colors hover:bg-[#F8FAFC] group">
                <td className="px-6 py-4 text-sm font-medium text-[#111827] whitespace-nowrap sticky left-0 bg-white group-hover:bg-[#F8FAFC] z-10 transition-colors">
                  {action}
                </td>
                {MODULES.map((module) => {
                  const isChecked = permissions[module]?.[action] || false;
                  return (
                    <td key={`${module}-${action}`} className="px-6 py-4 text-center">
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
