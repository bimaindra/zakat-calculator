import React from 'react';
import { Stack } from '@chakra-ui/react';
import CurrencyInput from './input-currency';
import ZakatInfo from './zakat-info';
import FormActions from './form-actions';
import { FORM_FIELDS } from '../constants';
import { useZakatForm, useZakatCalculationState } from '../hooks/use-zakat-state';
import type { ZakatType } from '../types';

interface BaseZakatCalculatorProps {
  type: ZakatType;
}

const BaseZakatCalculator = ({ type }: BaseZakatCalculatorProps) => {
  const { inputs, updateField, resetForm } = useZakatForm(type);
  const { handleCalculation, isCalculating } = useZakatCalculationState();

  const handleCalculate = () => {
    handleCalculation(type);
  };

  const fields = FORM_FIELDS[type];

  const formId = `zakat-${type}-form`;
  const formTitle = type === 'profesi' ? 'Formulir Zakat Profesi' : 'Formulir Zakat Maal';

  return (
    <>
      <ZakatInfo type={type} />
      <form
        id={formId}
        role="form"
        aria-label={formTitle}
        onSubmit={(e) => {
          e.preventDefault();
          handleCalculate();
        }}
      >
        <Stack spacing={4} role="group" aria-labelledby={`${formId}-title`}>
          <div id={`${formId}-title`} style={{ display: 'none' }}>
            {formTitle}
          </div>
          {fields.map((field, index) => (
            <CurrencyInput
              key={field.key}
              label={field.label}
              value={(inputs as any)[field.key]?.value || ''}
              isRequired={field.isRequired}
              isError={(inputs as any)[field.key]?.isError || false}
              errorMessage={(inputs as any)[field.key]?.errorMessage || 'Mohon diisi!'}
              placeholder={field.placeholder}
              helpText={field.helpText}
              onValueChange={(value) => updateField(field.key as keyof typeof inputs, value || '')}
              autoComplete={
                field.key === 'penghasilan' ? 'off' : field.key === 'tabungan' ? 'off' : 'off'
              }
              data-testid={`${type}-${field.key}`}
            />
          ))}
          <FormActions
            onCalculate={handleCalculate}
            onReset={resetForm}
            isCalculating={isCalculating}
          />
        </Stack>
      </form>
    </>
  );
};

export default React.memo(BaseZakatCalculator);
