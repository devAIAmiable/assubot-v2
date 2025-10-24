import { FaExclamationTriangle, FaGlobe, FaPhone, FaTimes, FaUserShield } from 'react-icons/fa';
import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import ArrayFieldManager from '../form-fields/ArrayFieldManager';
import type { OtherSectionsFormData } from '../../../validators/templateContractSchema';

interface OtherSectionsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const OtherSectionsStep: React.FC<OtherSectionsStepProps> = ({ onNext, onPrevious }) => {
  const { control, register } = useFormContext<OtherSectionsFormData>();
  const [activeTab, setActiveTab] = useState(0);

  // Field arrays for each section
  const exclusionsArray = useFieldArray({ control, name: 'exclusions' });
  const obligationsArray = useFieldArray({ control, name: 'obligations' });
  const zonesArray = useFieldArray({ control, name: 'zones' });
  const terminationsArray = useFieldArray({ control, name: 'terminations' });
  const cancellationsArray = useFieldArray({ control, name: 'cancellations' });
  const contactsArray = useFieldArray({ control, name: 'contacts' });

  const tabs = [
    { name: 'Exclusions', icon: FaTimes, color: 'red' },
    { name: 'Obligations', icon: FaUserShield, color: 'blue' },
    { name: 'Zones', icon: FaGlobe, color: 'green' },
    { name: 'Résiliations', icon: FaExclamationTriangle, color: 'orange' },
    { name: 'Annulations', icon: FaExclamationTriangle, color: 'purple' },
    { name: 'Contacts', icon: FaPhone, color: 'gray' },
  ];

  const renderExclusionItem = (item: { description?: string; type?: string }, index: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          {...register(`exclusions.${index}.description`)}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Dommages intentionnels"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select {...register(`exclusions.${index}.type`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="general">Général</option>
          <option value="activity">Activité</option>
          <option value="geographic">Géographique</option>
          <option value="temporal">Temporel</option>
        </select>
      </div>
    </div>
  );

  const renderObligationItem = (item: { description?: string }, index: number) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        {...register(`obligations.${index}.description`)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Ex: Déclarer tout sinistre dans les 48h"
      />
    </div>
  );

  const renderZoneItem = (item: { type?: string; value?: string }, index: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select {...register(`zones.${index}.type`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="country">Pays</option>
          <option value="zone">Zone</option>
          <option value="region">Région</option>
          <option value="city">Ville</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
        <input
          {...register(`zones.${index}.value`)}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: France, Europe, Paris"
        />
      </div>
    </div>
  );

  const renderTerminationItem = (item: { description?: string }, index: number) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        {...register(`terminations.${index}.description`)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Ex: Résiliation automatique à 80 ans"
      />
    </div>
  );

  const renderCancellationItem = (item: { description?: string; deadline?: string }, index: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register(`cancellations.${index}.description`)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Préavis de 30 jours"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Délai</label>
        <input
          {...register(`cancellations.${index}.deadline`)}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: 30 jours"
        />
      </div>
    </div>
  );

  const renderContactItem = (item: { type?: string; value?: string }, index: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select {...register(`contacts.${index}.type`)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="phone">Téléphone</option>
          <option value="email">Email</option>
          <option value="address">Adresse</option>
          <option value="website">Site web</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
        <input
          {...register(`contacts.${index}.value`)}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: +33 1 23 45 67 89"
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

          {/* Terminations */}
          <TabPanel>
            <ArrayFieldManager
              fieldArray={terminationsArray}
              renderItem={renderTerminationItem}
              addButtonText="Ajouter une résiliation"
              emptyMessage="Aucune condition de résiliation définie"
            />
          </TabPanel>

          {/* Cancellations */}
          <TabPanel>
            <ArrayFieldManager
              fieldArray={cancellationsArray}
              renderItem={renderCancellationItem}
              addButtonText="Ajouter une annulation"
              emptyMessage="Aucune condition d'annulation définie"
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
        <button type="button" onClick={onPrevious} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Précédent
        </button>

        <button type="button" onClick={onNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  );
};

export default OtherSectionsStep;
