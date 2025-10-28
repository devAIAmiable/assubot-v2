import type { DropdownOption } from '../components/ui/Dropdown';

export const professionalCategoryOptions: DropdownOption[] = [
  { value: '', label: 'Sélectionner une catégorie' },
  { value: 'executive', label: 'Employé cadre' },
  { value: 'non-executive', label: 'Employé non cadre' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'student', label: 'Étudiant' },
  { value: 'unemployed', label: 'Sans emploi' },
];
export const getProfessionalCategoryLabel = (value: string | undefined): string => {
  if (!value) return 'Non renseigné';
  const option = professionalCategoryOptions.find((opt) => opt.value === value);
  return option ? option.label : 'Non renseigné';
};
