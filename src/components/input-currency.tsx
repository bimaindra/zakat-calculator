import React, { useId } from 'react';
import {
	Input,
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
} from '@chakra-ui/react';
import CurrencyInputField from 'react-currency-input-field';
import { CURRENCY_CONFIG } from '../constants';

interface CurrencyInputProps {
	label: string;
	value: string;
	isRequired?: boolean;
	isError?: boolean;
	errorMessage?: string;
	placeholder?: string;
	helpText?: string;
	onValueChange: (value: string | undefined) => void;
	autoComplete?: string;
	'data-testid'?: string;
}

const CurrencyInput = ({
	label,
	value,
	isRequired = false,
	isError = false,
	errorMessage = 'Mohon di isi!',
	placeholder = CURRENCY_CONFIG.placeholder,
	helpText,
	onValueChange,
	autoComplete,
	'data-testid': testId,
}: CurrencyInputProps) => {
	const id = useId();
	const errorId = `${id}-error`;
	const helpId = `${id}-help`;

	// Create accessible description
	const ariaDescribedBy = [];
	if (isError && errorMessage) {
		ariaDescribedBy.push(errorId);
	}
	if (helpText) {
		ariaDescribedBy.push(helpId);
	}

	return (
		<FormControl
			isRequired={isRequired}
			isInvalid={isError}>
			<FormLabel 
				htmlFor={id} 
				fontWeight="bold"
				cursor="pointer">
				{label}
			</FormLabel>
			<Input
				as={CurrencyInputField}
				id={id}
				data-testid={testId}
				prefix={CURRENCY_CONFIG.prefix}
				groupSeparator={CURRENCY_CONFIG.groupSeparator}
				decimalSeparator={CURRENCY_CONFIG.decimalSeparator}
				decimalsLimit={CURRENCY_CONFIG.decimalsLimit}
				placeholder={placeholder}
				value={value || ''}
				onValueChange={onValueChange}
				autoComplete={autoComplete}
				aria-describedby={ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined}
				aria-invalid={isError}
				aria-required={isRequired}
				inputMode="numeric"
				role="textbox"
				aria-label={`${label}${isRequired ? ' (wajib diisi)' : ''}`}
			/>
			{isError ? (
				<FormErrorMessage 
					id={errorId}
					role="alert"
					aria-live="polite">
					{errorMessage}
				</FormErrorMessage>
			) : helpText ? (
				<FormHelperText 
					id={helpId}
					color="gray.600">
					{helpText}
				</FormHelperText>
			) : null}
		</FormControl>
	);
};

export default CurrencyInput;
