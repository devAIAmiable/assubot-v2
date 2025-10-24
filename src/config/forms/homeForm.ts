import type { RawFormFieldDefinition } from '../../types/comparison.types';
import { homeSpecificFields } from './homeSpecificFields';
import { contractPreferenceFields, preferenceFields } from './commonFields';

export const homeFormDefinition: RawFormFieldDefinition[] = [...homeSpecificFields, ...contractPreferenceFields, ...preferenceFields];
