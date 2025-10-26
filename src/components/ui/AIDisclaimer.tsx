import React from 'react';

const AIDisclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <p className="text-sm text-amber-800">
        <span className="font-semibold">Information:</span> Ces données ont été extraites automatiquement via une intelligence artificielle et peuvent être sujettes à erreur.
        Veuillez vérifier et corriger les informations si nécessaire.
      </p>
    </div>
  );
};

export default AIDisclaimer;
