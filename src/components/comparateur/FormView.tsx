import type { ComparisonCategory, ComparisonCalculationResponse, FormDefinition, FormField } from '../../types/comparison';
import { FaArrowLeft, FaArrowRight, FaChevronLeft, FaUser } from 'react-icons/fa';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getVisibleSubsectionGroups, type SubsectionGroup } from '../../utils/formGrouping';
import { trackComparateurFormSubmit } from '@/services/analytics/gtm';
import { transformFormDataForBackend } from '../../utils/formDataTransform';
import { generateAutoFormTestData } from '../../utils/testFormData';

import AutocompleteField from './fields/AutocompleteField';
import CardField from './fields/CardField';
import CheckboxField from './fields/CheckboxField';
import DateField from './fields/DateField';
import InsurerField from './fields/InsurerField';
import NumberField from './fields/NumberField';
import ObjectField from './fields/ObjectField';
import RadioField from './fields/RadioField';
import SelectField from './fields/SelectField';
import SliderField from './fields/SliderField';
import TextAreaField from './fields/TextAreaField';
import TextField from './fields/TextField';
import { getFormDefinitionByCategory } from '../../config/forms';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { useCalculateComparisonMutation } from '../../store/comparisonApi';

interface FormViewProps {
  selectedType: ComparisonCategory | null;
  formData: Record<string, unknown>;
  updateFormField: (field: string, value: unknown) => void;
  batchUpdateFormFields?: (fields: Record<string, unknown>) => void;
  setCurrentStep: (step: 'history' | 'type' | 'form' | 'results' | 'loading') => void;
  comparisonError?: string | null;
  onComparisonSuccess: (response: ComparisonCalculationResponse) => void;
  onComparisonError: (error: string) => void;
}

const FormView: React.FC<FormViewProps> = ({
  selectedType,
  formData,
  updateFormField,
  batchUpdateFormFields,
  setCurrentStep,
  comparisonError,
  onComparisonSuccess,
  onComparisonError,
}) => {
  const user = useAppSelector((state) => state.user?.currentUser);
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasPrefilled, setHasPrefilled] = useState(false);
  const [showAutofillPrompt, setShowAutofillPrompt] = useState(false);
  const [autofillConsent, setAutofillConsent] = useState<boolean | null>(null);

  // Wizard mode state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Mutation for form submission
  const [calculateComparison, { isLoading: isSubmitting, error: submissionError }] = useCalculateComparisonMutation();

  // Autofill consent functions
  const handleAcceptAutofill = useCallback(() => {
    setAutofillConsent(true);
    setShowAutofillPrompt(false);

    // Store preference in localStorage
    localStorage.setItem('autofillConsent', 'true');
  }, []);

  const handleDeclineAutofill = useCallback(() => {
    setAutofillConsent(false);
    setShowAutofillPrompt(false);

    // Store preference in localStorage
    localStorage.setItem('autofillConsent', 'false');
  }, []);

  // Load form definition when selectedType changes
  useEffect(() => {
    if (selectedType) {
      setIsLoading(true);
      try {
        const definition = getFormDefinitionByCategory(selectedType);
        setFormDefinition(definition);
        setCurrentStepIndex(0);
        setErrors({});
        setHasPrefilled(false); // Reset prefilling flag for new form

        // Check for autofill consent (for non-test mode)
        const isTestMode = localStorage.getItem('comparisonTestMode') === 'true';
        if (!isTestMode) {
          const storedConsent = localStorage.getItem('autofillConsent');
          if (storedConsent === null && user && Object.keys(user).length > 0) {
            // Show autofill prompt if no preference is stored and user has data
            setShowAutofillPrompt(true);
          } else if (storedConsent === 'true') {
            // Auto-prefill if user previously consented
            setAutofillConsent(true);
          }
        } else {
          setShowAutofillPrompt(false);
        }
      } catch (error) {
        console.error('Error loading form definition:', error);
        setErrors({ general: 'Erreur lors du chargement du formulaire' });
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedType, user]);

  // Separate effect for test mode filling - runs after formDefinition is set
  // Only depend on hasPrefilled to prevent infinite loops
  useEffect(() => {
    const isTestMode = localStorage.getItem('comparisonTestMode') === 'true';
    if (isTestMode && formDefinition && selectedType === 'auto' && !hasPrefilled) {
      // Use requestAnimationFrame to ensure form is fully rendered
      requestAnimationFrame(() => {
        setTimeout(() => {
          const testData = generateAutoFormTestData();
          // Use batch update if available, otherwise fall back to individual updates
          if (batchUpdateFormFields) {
            batchUpdateFormFields(testData);
          } else {
            // Fallback: set all fields individually
            Object.entries(testData).forEach(([fieldName, value]) => {
              updateFormField(fieldName, value);
            });
          }
          setHasPrefilled(true);
        }, 100); // Small delay to ensure form is ready
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDefinition, selectedType, hasPrefilled]); // Intentionally exclude callbacks to prevent loops

  // Separate effect to handle prefilling when formDefinition is ready and user has consented
  useEffect(() => {
    if (formDefinition && user && !hasPrefilled && autofillConsent === true && !showAutofillPrompt) {
      // Map gender to civility
      const mapGenderToCivility = (gender?: string): string | undefined => {
        if (!gender) return undefined;
        const genderLower = gender.toLowerCase();
        if (genderLower === 'male' || genderLower === 'homme' || genderLower === 'm') {
          return 'M.';
        } else if (genderLower === 'female' || genderLower === 'femme' || genderLower === 'f') {
          return 'Mme';
        }
        return undefined;
      };

      // Format date for HTML date input (YYYY-MM-DD)
      const formatDateForInput = (dateString?: string): string | undefined => {
        if (!dateString) return undefined;
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return undefined;
          return date.toISOString().split('T')[0];
        } catch {
          return undefined;
        }
      };

      // Map professionalStatus to the correct option value in form definition
      const mapProfessionalStatusToOptionValue = (userStatus?: string): string | undefined => {
        if (!userStatus) return undefined;

        const statusField = formDefinition.sections.flatMap((section) => section.fields).find((field) => field.name === 'professionalStatus');

        if (statusField?.options) {
          // Try to find exact match first
          const exactMatch = statusField.options.find(
            (option) => option.label.toLowerCase() === userStatus.toLowerCase() || option.value.toLowerCase() === userStatus.toLowerCase()
          );

          if (exactMatch) return exactMatch.value;

          // Try partial match for common categories
          const partialMatch = statusField.options.find((option) => {
            const optionLower = option.label.toLowerCase();
            const userLower = userStatus.toLowerCase();

            const mappings = [
              { keywords: ['employee', 'salarié', 'employé'], value: 'employee' },
              { keywords: ['student', 'étudiant', 'etudiant'], value: 'student' },
              { keywords: ['retired', 'retraité', 'retraite'], value: 'retired' },
              { keywords: ['unemployed', 'chômeur', 'chomeur', 'chômage'], value: 'unemployed' },
              { keywords: ['other', 'autre'], value: 'other' },
            ];

            for (const mapping of mappings) {
              if (mapping.keywords.some((keyword) => optionLower.includes(keyword) && userLower.includes(keyword))) {
                return option.value === mapping.value;
              }
            }
            return false;
          });

          if (partialMatch) return partialMatch.value;
        }
        return undefined;
      };

      const userProfessionalStatus = (user as { professionalStatus?: string }).professionalStatus ?? user.professionalCategory;

      // Inline prefilling logic to avoid circular dependency
      const personalInfoFields = {
        firstName: user.firstName,
        lastName: user.lastName,
        civility: mapGenderToCivility(user.gender),
        birthDate: formatDateForInput(user.birthDate),
        postalCode: user.zip,
        city: user.city,
        professionalStatus: mapProfessionalStatusToOptionValue(userProfessionalStatus),
      };

      const formFieldNames = formDefinition.sections.flatMap((s) => s.fields).map((f) => f.name);

      Object.entries(personalInfoFields).forEach(([fieldName, value]) => {
        if (value && formFieldNames.includes(fieldName)) {
          console.log(`Prefilling ${fieldName} with value:`, value);
          updateFormField(fieldName, value);
        }
      });

      setHasPrefilled(true);
    }
  }, [formDefinition, user, hasPrefilled, autofillConsent, showAutofillPrompt, updateFormField]);

  // Extract all fields once - memoized to prevent recalculation
  // MUST BE BEFORE ANY EARLY RETURNS to comply with Rules of Hooks
  const allFields = useMemo(() => {
    if (!formDefinition) return [];
    const fields: FormField[] = [];
    formDefinition.sections.forEach((section) => {
      section.fields.forEach((field) => {
        fields.push(field);
      });
    });
    return fields;
  }, [formDefinition]);

  // Memoize visible steps to prevent recalculation on every render
  const visibleSteps = useMemo(() => {
    if (allFields.length === 0) return [];
    return getVisibleSubsectionGroups(allFields, formData);
  }, [allFields, formData]);

  // Ensure currentStepIndex is valid after visibility changes
  useEffect(() => {
    if (visibleSteps.length > 0 && currentStepIndex >= visibleSteps.length) {
      setCurrentStepIndex(Math.max(0, visibleSteps.length - 1));
    }
  }, [visibleSteps.length, currentStepIndex]);

  // Memoize form progress
  const formProgress = useMemo(() => {
    if (!formDefinition || allFields.length === 0) return 0;

    const requiredFields = allFields.filter((field) => field.required);

    if (requiredFields.length === 0) return 100;

    const filledRequiredFields = requiredFields.filter((field) => {
      const value = formData?.[field.name];
      return value !== undefined && value !== null && value !== '';
    });

    return Math.round((filledRequiredFields.length / requiredFields.length) * 100 * 100) / 100;
  }, [formDefinition, allFields, formData]);

  // Check if a field should be visible based on showWhen conditions
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.showWhen) return true;

    const dependencyValue = formData[field.showWhen.field];

    // Handle 'equals' condition
    if (field.showWhen.equals !== undefined) {
      return dependencyValue === field.showWhen.equals;
    }

    // Handle 'in' condition
    if (field.showWhen.in !== undefined) {
      return Array.isArray(field.showWhen.in) && field.showWhen.in.includes(dependencyValue as string);
    }

    // If no valid condition is found, show the field
    return true;
  };

  // Validate a single field
  const validateField = (_fieldName: string, value: unknown, fieldDefinition: FormField): string | null => {
    // Don't validate hidden fields
    if (!isFieldVisible(fieldDefinition)) return null;

    if (fieldDefinition.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Ce champ est obligatoire';
    }

    if (fieldDefinition.name === 'email' && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return 'Veuillez entrer une adresse email valide';
      }
    }

    if (fieldDefinition.validation) {
      const { min, max, pattern } = fieldDefinition.validation;

      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          return `La valeur doit être au moins ${min}`;
        }
        if (max !== undefined && value > max) {
          return `La valeur doit être au plus ${max}`;
        }
      }

      if (typeof value === 'string' && pattern) {
        if (typeof pattern === 'string') {
          const regex = new RegExp(pattern);
          if (value && !regex.test(value)) {
            return 'Format invalide';
          }
        } else if (typeof pattern === 'object' && pattern !== null) {
          // Handle complex pattern validation (could be extended for more sophisticated validation)
          // For now, we'll skip validation for object patterns
          console.log('Complex pattern validation not implemented yet:', pattern);
        }
      }
    }

    return null;
  };

  // Handle field change - memoized to prevent infinite loops
  const handleFieldChange = useCallback(
    (fieldName: string, value: unknown) => {
      updateFormField(fieldName, value);

      // Clear error for this field
      setErrors((prev) => {
        if (prev[fieldName]) {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        }
        return prev;
      });
    },
    [updateFormField]
  );

  // Wizard navigation handlers
  const handleWizardNext = () => {
    if (!formDefinition || visibleSteps.length === 0) return;

    if (currentStepIndex < visibleSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleWizardPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formDefinition || !selectedType) return;

    // Validate all sections
    let hasErrors = false;
    const allErrors: Record<string, string> = {};

    formDefinition.sections.forEach((section) => {
      section.fields.forEach((field) => {
        // Only validate visible fields
        if (!isFieldVisible(field)) return;

        const value = formData[field.name];
        const error = validateField(field.name, value, field);
        if (error) {
          allErrors[field.name] = error;
          hasErrors = true;
        }
      });
    });

    if (hasErrors) {
      setErrors(allErrors);
      return;
    }

    // Transform form data to the expected format
    const transformedData = transformFormData(formDefinition, formData);

    // Submit to calculateComparison mutation
    try {
      // Transition to loading step first
      setCurrentStep('loading');

      // Wait for the API response
      const response = await calculateComparison(transformedData).unwrap();

      // Pass response to parent for processing
      trackComparateurFormSubmit({
        category: selectedType ?? undefined,
        status: 'success',
      });
      onComparisonSuccess(response);
    } catch (error) {
      // Extract error message
      const errorMessage =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : (error as { data?: { error?: { message?: string } } })?.data?.error?.message || 'Une erreur est survenue lors du calcul de la comparaison';

      // Pass error to parent for handling
      onComparisonError(errorMessage);
      trackComparateurFormSubmit({
        category: selectedType ?? undefined,
        status: 'error',
        errorMessage,
      });
      console.error('Comparison calculation failed:', error);
    }
  };

  // Transform form data to API format - send as nested structure with formData property
  const transformFormData = (definition: FormDefinition, data: Record<string, unknown>) => {
    // Filter and structure the form data according to API schema
    let apiFormData: Record<string, unknown> = {};

    // Get all field names from the form definition
    const allFields = definition.sections.flatMap((section) => section.fields);
    const fieldNames = allFields.map((field) => field.name);

    // Only include fields that are defined in the form schema
    // Filter out empty strings and null values for string fields to avoid backend validation errors
    fieldNames.forEach((fieldName) => {
      const value = data[fieldName];
      if (value !== undefined) {
        // Skip empty strings for text/string fields - let backend validation handle required fields
        if (typeof value === 'string' && value === '') {
          // Skip empty strings - don't include them in the payload
          return;
        }
        apiFormData[fieldName] = value;
      }
    });

    // Don't set empty string defaults for required fields
    // Let the backend transformation handle missing required fields with proper defaults

    // Automatically set saveQuote to true
    apiFormData.saveQuote = true;

    // Apply backend schema transformations (date formats, enum mappings, etc.)
    apiFormData = transformFormDataForBackend(definition.category, apiFormData);

    // Special handling for optionalGuarantees - ensure it's an object
    if (apiFormData.optionalGuarantees && typeof apiFormData.optionalGuarantees === 'object') {
      // Keep as is if it's already an object
    } else {
      // Set default structure for optionalGuarantees
      apiFormData.optionalGuarantees = {
        assistance0km: false,
        replacementVehicle: false,
        extendedDriverProtection: false,
        legalDefense: false,
        theftFire: false,
      };
    }

    // Special handling for securityEquipment - ensure it's an array
    if (Array.isArray(apiFormData.securityEquipment)) {
      // Keep as is if it's already an array
    } else if (apiFormData.securityEquipment === true) {
      // Convert boolean true to array of default equipment
      apiFormData.securityEquipment = ['alarm', 'anti_theft'];
    } else {
      // Set default empty array
      apiFormData.securityEquipment = [];
    }

    return {
      category: definition.category,
      formData: apiFormData,
      includeUserContract: false,
    };
  };

  // Render field based on type
  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];

    // Special case for previousInsurer field to use InsurerField component
    if (field.name === 'previousInsurer') {
      return (
        <InsurerField
          key={field.name}
          field={field}
          value={(value as string) || ''}
          onChange={(val) => handleFieldChange(field.name, val)}
          error={error}
          category={selectedType && selectedType !== 'moto' ? (selectedType as 'auto' | 'home' | 'health' | 'life' | 'disability') : undefined}
        />
      );
    }

    switch (field.type) {
      case 'text':
        return <TextField key={field.name} field={field} value={(value as string) || ''} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'textarea':
        return <TextAreaField key={field.name} field={field} value={(value as string) || ''} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'number':
        return <NumberField key={field.name} field={field} value={(value as number) || 0} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'select':
        return <SelectField key={field.name} field={field} value={(value as string) || ''} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'radio':
        return <RadioField key={field.name} field={field} value={(value as string) || ''} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'checkbox':
        return <CheckboxField key={field.name} field={field} value={(value as boolean) || false} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'date':
        return <DateField key={field.name} field={field} value={(value as string) || ''} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'card':
        return <CardField key={field.name} field={field} value={(value as string) || ''} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'slider':
        return (
          <SliderField
            key={field.name}
            field={field}
            value={(value as number) || field.validation?.min || 0}
            onChange={(val) => handleFieldChange(field.name, val)}
            error={error}
          />
        );
      case 'autocomplete':
        return <AutocompleteField key={field.name} field={field} value={(value as string) || ''} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      case 'object':
        return <ObjectField key={field.name} field={field} value={(value as Record<string, unknown>) || {}} onChange={(val) => handleFieldChange(field.name, val)} error={error} />;
      default:
        return null;
    }
  };

  const renderFieldWithHelp = (field: FormField) => {
    return renderField(field);
  };

  // Helper functions for wizard UI
  const getCurrentWizardStep = (): SubsectionGroup | null => {
    if (!formDefinition || visibleSteps.length === 0) return null;
    return visibleSteps[currentStepIndex] || null;
  };

  const getTotalVisibleSteps = () => {
    return visibleSteps.length;
  };

  // Early returns MUST come after all hooks
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du formulaire...</p>
        </div>
      </div>
    );
  }

  if (!formDefinition) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur lors du chargement du formulaire</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assistant {selectedType === 'auto' ? 'Auto' : 'Habitation'}</h1>
          <p className="text-gray-600 text-lg">Remplissez les informations ci-dessous pour obtenir votre devis personnalisé</p>
        </motion.div>
        <button onClick={() => setCurrentStep('type')} className="text-[#1e51ab] hover:text-[#163d82] font-medium flex items-center">
          <FaChevronLeft className="h-4 w-4 mr-2" />
          Retour
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div className="bg-[#1e51ab] h-2 rounded-full transition-all duration-300" style={{ width: `${formProgress}%` }} />
      </div>

      {/* Autofill Consent Prompt */}
      {showAutofillPrompt && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <FaUser className="text-blue-400 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">Utiliser mes informations sauvegardées ?</h3>
              <p className="text-sm text-blue-600 mt-1">Nous pouvons pré-remplir le formulaire avec vos informations personnelles.</p>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={handleAcceptAutofill}
                  className="bg-[#1e51ab] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#163d82] transition-colors duration-200"
                >
                  Oui, pré-remplir
                </button>
                <button
                  onClick={handleDeclineAutofill}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Non, saisir manuellement
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {(comparisonError || submissionError) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur lors de la comparaison</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{comparisonError || (typeof submissionError === 'string' ? submissionError : 'Une erreur est survenue lors du calcul de la comparaison')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wizard Content */}
      <motion.div
        key={`wizard-step-${currentStepIndex}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        {getCurrentWizardStep() && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">{getCurrentWizardStep()!.label}</h2>
            </div>

            <div className="space-y-6">
              {getCurrentWizardStep()!
                .fields.filter((field) => isFieldVisible(field))
                .map((field, index) => (
                  <div key={`${getCurrentWizardStep()!.id}-${field.name}-${index}`}>{renderFieldWithHelp(field)}</div>
                ))}
            </div>

            {/* Wizard Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleWizardPrevious}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft className="h-4 w-4" />
                Précédent
              </button>

              <button
                onClick={handleWizardNext}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-[#1e51ab] text-white rounded-lg hover:bg-[#163d82] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Calcul en cours...
                  </>
                ) : currentStepIndex === getTotalVisibleSteps() - 1 ? (
                  <>
                    Comparer les offres
                    <FaArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Suivant
                    <FaArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FormView;
export type { FormViewProps };
