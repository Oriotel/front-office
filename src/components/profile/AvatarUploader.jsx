import React, { useState } from 'react';
import { Camera, UploadCloud } from 'lucide-react';

const AvatarUploader = ({ currentImage, name }) => {
  const [preview, setPreview] = useState(currentImage);

  return (
    <div className="flex flex-col items-center p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 w-full text-left">Photo de profil</h3>
      
      <div className="relative group mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-gray-400">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </span>
          )}
        </div>
        
        <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md">
          <Camera size={18} />
        </button>
      </div>

      <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
          <UploadCloud size={20} />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          <span className="text-blue-600">Cliquez pour uploader</span> ou glissez-déposez
        </p>
        <p className="text-xs text-gray-500">SVG, PNG, JPG ou GIF (max. 800x400px)</p>
      </div>
    </div>
  );
};

export default AvatarUploader;
