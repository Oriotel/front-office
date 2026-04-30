import React from 'react';

const ProfileForm = ({ user }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Informations Personnelles</h3>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nom complet</label>
            <input 
              type="text" 
              id="fullName" 
              defaultValue={user?.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Jean Dupont"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
            <input 
              type="email" 
              id="email" 
              defaultValue={user?.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="jean.dupont@oriotel.com"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input 
              type="tel" 
              id="phone" 
              defaultValue={user?.phone}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biographie</label>
            <textarea 
              id="bio" 
              rows="4"
              defaultValue={user?.bio}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Écrivez quelques mots sur vous..."
            ></textarea>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button 
            type="button" 
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
