import { contractPreferenceFields, preferenceFields } from './commonFields';

import type { RawFormFieldDefinition } from '../../types/comparison.types';
import { autoSpecificFields } from './autoSpecificFields';

export const autoFormDefinition: RawFormFieldDefinition[] = [...autoSpecificFields, ...contractPreferenceFields, ...preferenceFields];
