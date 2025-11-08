import { ContactType, ObligationType, ZoneType } from '../../../types/contract';
import { FaExclamationTriangle, FaGlobe, FaPhone, FaTimes, FaUserShield } from 'react-icons/fa';
import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import AIDisclaimer from '../../ui/AIDisclaimer';
import ArrayFieldManager from '../form-fields/ArrayFieldManager';
import type { OtherSectionsFormData } from '../../../validators/templateContractSchema';

interface OtherSectionsStepProps {
  onNext?: () => void;
  onPrevious: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  originalData?: unknown;
}

const OtherSectionsStep: React.FC<OtherSectionsStepProps> = ({ onNext, onPrevious, onSubmit, isSubmitting }) => {
  const { control, register } = useFormContext<OtherSectionsFormData>();
  const [activeTab, setActiveTab] = useState(0);

  // Field arrays for each section
  const exclusionsArray = useFieldArray({ control, name: 'exclusions' });
  const obligationsArray = useFieldArray({ control, name: 'obligations' });
  const zonesArray = useFieldArray({ control, name: 'zones' });
  const cancellationsArray = useFieldArray({ control, name: 'cancellations' });
  const contactsArray = useFieldArray({ control, name: 'contacts' });

  const tabs = [
    { name: 'Exclusions', icon: FaTimes, color: 'red' },
    { name: 'Obligations', icon: FaUserShield, color: 'blue' },
    { name: 'Zones', icon: FaGlobe, color: 'green' },
    { name: 'Résiliations', icon: FaExclamationTriangle, color: 'orange' },
    { name: 'Contacts', icon: FaPhone, color: 'gray' },
  ];

  const renderExclusionItem = (_item: unknown, index: number) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        {...register(`exclusions.${index}.description`)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Ex: Dommages intentionnels"
      />
    </div>
  );

  const renderObligationItem = (_item: unknown, index: number) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register(`obligations.${index}.description`)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Déclarer tout sinistre dans les 48h"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select {...register(`obligations.${index}.type`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Sélectionner un type</option>
          <option value={ObligationType.SUBSCRIPTION}>À la souscription</option>
          <option value={ObligationType.DURING_CONTRACT}>En cours de contrat</option>
          <option value={ObligationType.CLAIM}>En cas de sinistre</option>
        </select>
      </div>
    </div>
  );

  const renderZoneItem = (_item: unknown, index: number) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select {...register(`zones.${index}.type`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value={ZoneType.COUNTRY}>Pays</option>
            <option value={ZoneType.ZONE}>Zone</option>
            <option value={ZoneType.REGION}>Région</option>
            <option value={ZoneType.CITY}>Ville</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            {...register(`zones.${index}.name`)}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Colombie"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input
            {...register(`zones.${index}.code`)}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: CO"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input
            {...register(`zones.${index}.latitude`)}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 4.58"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input
            {...register(`zones.${index}.longitude`)}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: -74.3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conditions (optionnel - une par ligne)</label>
        <textarea
          {...register(`zones.${index}.conditions`)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Conditions spécifiques pour cette zone"
        />
      </div>
    </div>
  );

  const renderCancellationItem = (_item: unknown, index: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <textarea
          {...register(`cancellations.${index}.question`)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Comment résilier mon contrat ?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Réponse</label>
        <textarea
          {...register(`cancellations.${index}.response`)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Préavis de 30 jours avant l'échéance"
        />
      </div>
    </div>
  );

  const renderContactItem = (_item: unknown, index: number) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type de contact</label>
        <select {...register(`contacts.${index}.type`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value={ContactType.MANAGEMENT}>Gestion du contrat</option>
          <option value={ContactType.ASSISTANCE}>Assistance</option>
          <option value={ContactType.EMERGENCY}>Urgence</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
        <input
          {...register(`contacts.${index}.name`)}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Service client"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            {...register(`contacts.${index}.phone`)}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: +33 1 23 45 67 89"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register(`contacts.${index}.email`)}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: contact@assureur.fr"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Heures d'ouverture</label>
        <input
          {...register(`contacts.${index}.openingHours`)}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Lun-Ven 9h-18h"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <FaExclamationTriangle className="text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Autres sections</h2>
          <p className="text-sm text-gray-600">Définissez les exclusions, obligations et autres conditions</p>
        </div>
      </div>

      {/* AI Disclaimer */}
      <AIDisclaimer />

      {/* Tabs */}
      <TabGroup selectedIndex={activeTab} onChange={setActiveTab}>
        <TabList className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selected ? `bg-white text-${tab.color}-600 shadow-sm` : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </Tab>
            );
          })}
        </TabList>

        <TabPanels className="mt-6">
          {/* Exclusions */}
          <TabPanel>
            <ArrayFieldManager fieldArray={exclusionsArray} renderItem={renderExclusionItem} addButtonText="Ajouter une exclusion" emptyMessage="Aucune exclusion définie" />
          </TabPanel>

          {/* Obligations */}
          <TabPanel>
            <ArrayFieldManager fieldArray={obligationsArray} renderItem={renderObligationItem} addButtonText="Ajouter une obligation" emptyMessage="Aucune obligation définie" />
          </TabPanel>

          {/* Zones */}
          <TabPanel>
            <ArrayFieldManager fieldArray={zonesArray} renderItem={renderZoneItem} addButtonText="Ajouter une zone" emptyMessage="Aucune zone définie" />
          </TabPanel>

          {/* Résiliations */}
          <TabPanel>
            <ArrayFieldManager
              fieldArray={cancellationsArray}
              renderItem={renderCancellationItem}
              addButtonText="Ajouter une résiliation"
              emptyMessage="Aucune condition de résiliation définie"
            />
          </TabPanel>

          {/* Contacts */}
          <TabPanel>
            <ArrayFieldManager fieldArray={contactsArray} renderItem={renderContactItem} addButtonText="Ajouter un contact" emptyMessage="Aucun contact défini" />
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>

        {onSubmit ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
        ) : (
          <button type="button" onClick={onNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default OtherSectionsStep;
