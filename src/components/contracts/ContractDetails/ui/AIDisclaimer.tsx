import { FaMagic } from 'react-icons/fa';
import React from 'react';

const AIDisclaimer: React.FC = () => (
  <div className="mt-6 text-center">
    <div className="flex items-center justify-center">
      <div className="flex-shrink-0">
        <FaMagic className="h-4 w-4 text-[#1e51ab]" />
      </div>
      <div className="ml-2">
        <p className="text-sm text-gray-500">
          <span className="font-medium">
            Votre espace « Contrats » est confidentiel. L'extraction des informations repose sur une IA, veuillez vérifier les informations importantes.
          </span>
        </p>
      </div>
    </div>
  </div>
);

export default AIDisclaimer;
