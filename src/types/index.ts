import type { ReactNode } from 'react';

export interface ChildrenProps {
	children: ReactNode;
}

export interface ZakatCalculationResult {
	isEligible: boolean;
	value: number;
}


export interface FormFieldState {
	value: string;
	isError: boolean;
	errorMessage?: string;
}

export interface ValidationRule {
	type: 'required' | 'minValue' | 'maxValue' | 'pattern';
	value?: number | string | RegExp;
	message: string;
}

export interface FormFieldConfig {
	key: string;
	label: string;
	isRequired: boolean;
	validationRules?: ValidationRule[];
	placeholder?: string;
	helpText?: string;
}

export type ZakatMaalInputs = {
	emas: FormFieldState;
	tabungan: FormFieldState;
	asset: FormFieldState;
	hutang: FormFieldState;
};

export type ZakatProfesiInputs = {
	penghasilan: FormFieldState;
	bonus: FormFieldState;
};

export type ZakatType = 'profesi' | 'maal';

export interface ZakatConstants {
	goldPrice: number;
	nishabMultiplier: number;
	zakatRate: number;
	monthsPerYear: number;
}
