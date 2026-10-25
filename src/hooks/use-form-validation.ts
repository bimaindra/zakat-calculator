import { useCallback } from 'react';
import type {
  FormFieldState,
  ZakatMaalInputs,
  ZakatProfesiInputs,
  ValidationRule,
  FormFieldConfig,
} from '../types';
import { FORM_FIELDS } from '../constants';

export const useFormValidation = () => {
  const validateField = useCallback(
    (value: string, rules: ValidationRule[] = []): { isValid: boolean; errorMessage?: string } => {
      if (!value || value.trim() === '') {
        const requiredRule = rules.find((rule) => rule.type === 'required');
        if (requiredRule) {
          return { isValid: false, errorMessage: requiredRule.message };
        }
        return { isValid: true };
      }

      const numericValue = Number(value);
      if (isNaN(numericValue)) {
        return { isValid: false, errorMessage: 'Nilai harus berupa angka' };
      }

      for (const rule of rules) {
        switch (rule.type) {
          case 'required':
            if (!value || value.trim() === '') {
              return { isValid: false, errorMessage: rule.message };
            }
            break;
          case 'minValue':
            if (numericValue < (rule.value as number)) {
              return { isValid: false, errorMessage: rule.message };
            }
            break;
          case 'maxValue':
            if (numericValue > (rule.value as number)) {
              return { isValid: false, errorMessage: rule.message };
            }
            break;
          case 'pattern':
            const pattern = rule.value as RegExp;
            if (!pattern.test(value)) {
              return { isValid: false, errorMessage: rule.message };
            }
            break;
        }
      }

      return { isValid: true };
    },
    []
  );

  const validateFormInputs = useCallback(
    <T extends Record<string, FormFieldState>>(inputs: T, formType: 'profesi' | 'maal'): T => {
      const fieldConfigs = FORM_FIELDS[formType];
      const validatedInputs = { ...inputs };

      fieldConfigs.forEach((config: FormFieldConfig) => {
        const fieldKey = config.key as keyof T;
        const field = inputs[fieldKey];

        if (field) {
          const validation = validateField(field.value, config.validationRules);
          validatedInputs[fieldKey] = {
            ...field,
            isError: !validation.isValid,
            errorMessage: validation.errorMessage,
          } as T[keyof T];
        }
      });

      return validatedInputs;
    },
    [validateField]
  );

  const validateZakatMaalInputs = useCallback(
    (inputs: ZakatMaalInputs): ZakatMaalInputs => {
      return validateFormInputs(inputs, 'maal');
    },
    [validateFormInputs]
  );

  const validateZakatProfesiInputs = useCallback(
    (inputs: ZakatProfesiInputs): ZakatProfesiInputs => {
      return validateFormInputs(inputs, 'profesi');
    },
    [validateFormInputs]
  );

  const hasValidationErrors = useCallback(
    (inputs: ZakatMaalInputs | ZakatProfesiInputs): boolean => {
      return Object.values(inputs).some((field) => field.isError);
    },
    []
  );

  const createFieldState = useCallback(
    (value: string, isError: boolean = false, errorMessage?: string): FormFieldState => ({
      value,
      isError,
      errorMessage,
    }),
    []
  );

  return {
    validateField,
    validateFormInputs,
    validateZakatMaalInputs,
    validateZakatProfesiInputs,
    hasValidationErrors,
    createFieldState,
  };
};
