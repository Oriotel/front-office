import React from 'react';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-8 font-['Montserrat',sans-serif]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <User size={64} className="text-white opacity-80" />
              </div>
              <h2 className="text-xl font-bold">Jean Dupont</h2>
              <p className="text-white/60 mb-6">Administrateur</p>
              
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg font-medium">
                Modifier le profil
              </button>
            </div>
          </div>
          
          {/* Main Info */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="text-blue-500" size={24} />
                Informations Personnelles
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="text-white/40 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-white/40">Adresse Email</p>
                    <p className="font-medium">jean.dupont@oriotel.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="text-white/40 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-white/40">Téléphone</p>
                    <p className="font-medium">+33 6 12 34 56 78</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="text-white/40 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-white/40">Localisation</p>
                    <p className="font-medium">Paris, France</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="text-green-500" size={24} />
                Sécurité
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                <div>
                  <p className="font-medium">Mot de passe</p>
                  <p className="text-sm text-white/40">Dernière modification il y a 3 mois</p>
                </div>
                <button className="px-4 py-2 border border-white/20 hover:bg-white/10 transition-colors rounded-lg text-sm">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
