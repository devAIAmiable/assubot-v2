/**
 * Field shortcuts utilities for quick selection options
 */

export interface FieldShortcut {
  value: string;
  label: string;
  description: string;
}

/**
 * Get date shortcuts for common date selections
 */
export function getDateShortcuts(): FieldShortcut[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);

  return [
    {
      value: 'today',
      label: "Aujourd'hui",
      description: `Aujourd'hui (${formatDateShort(today)})`,
    },
    {
      value: 'tomorrow',
      label: 'Demain',
      description: `Demain (${formatDateShort(tomorrow)})`,
    },
    {
      value: 'next_month',
      label: 'Mois prochain',
      description: `1er ${getMonthName(nextMonth)} ${nextMonth.getFullYear()}`,
    },
    {
      value: 'asap',
      label: 'Dès que possible',
      description: 'Début immédiat du contrat',
    },
  ];
}

/**
 * Get common number shortcuts for specific field types
 */
export function getNumberShortcuts(fieldName: string): FieldShortcut[] {
  switch (fieldName) {
    case 'maxMonthlyPremium':
      return [
        { value: '50', label: '50€', description: 'Budget mensuel de 50€' },
        { value: '100', label: '100€', description: 'Budget mensuel de 100€' },
        { value: '150', label: '150€', description: 'Budget mensuel de 150€' },
        { value: '200', label: '200€', description: 'Budget mensuel de 200€' },
      ];

    case 'maxAnnualPremium':
      return [
        { value: '600', label: '600€', description: 'Budget annuel de 600€' },
        { value: '1200', label: '1200€', description: 'Budget annuel de 1200€' },
        { value: '1800', label: '1800€', description: 'Budget annuel de 1800€' },
        { value: '2400', label: '2400€', description: 'Budget annuel de 2400€' },
      ];

    case 'annualMileage':
      return [
        { value: '5000', label: '5 000 km', description: 'Kilométrage faible' },
        { value: '10000', label: '10 000 km', description: 'Kilométrage moyen' },
        { value: '15000', label: '15 000 km', description: 'Kilométrage élevé' },
        { value: '20000', label: '20 000 km', description: 'Kilométrage très élevé' },
      ];

    case 'vehicleValue':
      return [
        { value: '5000', label: '5 000€', description: "Véhicule d'occasion récent" },
        { value: '10000', label: '10 000€', description: "Véhicule d'occasion moyen" },
        { value: '15000', label: '15 000€', description: 'Véhicule neuf entrée de gamme' },
        { value: '25000', label: '25 000€', description: 'Véhicule neuf milieu de gamme' },
      ];

    default:
      return [];
  }
}

/**
 * Get shortcuts based on field type and name
 */
export function getFieldShortcuts(fieldType: string, fieldName: string): FieldShortcut[] {
  switch (fieldType) {
    case 'date':
      return getDateShortcuts();
    case 'number':
      return getNumberShortcuts(fieldName);
    default:
      return [];
  }
}

/**
 * Apply shortcut value to field
 */
export function applyShortcut(shortcutValue: string, fieldType: string): string {
  switch (fieldType) {
    case 'date':
      return applyDateShortcut(shortcutValue);
    case 'number':
      return shortcutValue;
    default:
      return shortcutValue;
  }
}

/**
 * Apply date shortcut to get actual date value
 */
function applyDateShortcut(shortcutValue: string): string {
  const today = new Date();

  switch (shortcutValue) {
    case 'today':
      return formatDateForInput(today);
    case 'tomorrow': {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDateForInput(tomorrow);
    }
    case 'next_month': {
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      return formatDateForInput(nextMonth);
    }
    case 'asap':
      return formatDateForInput(today);
    default:
      return shortcutValue;
  }
}

/**
 * Format date for HTML input (YYYY-MM-DD)
 */
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date for display (DD/MM/YYYY)
 */
function formatDateShort(date: Date): string {
  return date.toLocaleDateString('fr-FR');
}

/**
 * Get month name in French
 */
function getMonthName(date: Date): string {
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return months[date.getMonth()];
}
