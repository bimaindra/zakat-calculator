import { useCallback } from 'react';
import type {
	ZakatCalculationResult,
	ZakatMaalInputs,
	ZakatProfesiInputs,
} from '../types';
import { ZAKAT_CONFIG } from '../constants';
import { useErrorHandler } from './use-error-handler';

export const useZakatCalculation = () => {
	const { handleCalculationError } = useErrorHandler();

	const validateNumericInputs = useCallback((inputs: Record<string, any>) => {
		for (const [key, field] of Object.entries(inputs)) {
			const value = Number(field.value);
			if (field.value && isNaN(value)) {
				throw new Error(`Nilai ${key} harus berupa angka yang valid`);
			}
			if (value < 0) {
				throw new Error(`Nilai ${key} tidak boleh negatif`);
			}
		}
	}, []);

	const calculateZakatMaal = useCallback(
		(inputs: ZakatMaalInputs): ZakatCalculationResult => {
			try {
				validateNumericInputs(inputs);

				const emas = Number(inputs.emas.value) || 0;
				const tabungan = Number(inputs.tabungan.value) || 0;
				const asset = Number(inputs.asset.value) || 0;
				const hutang = Number(inputs.hutang.value) || 0;

				const totalWealth = emas + tabungan + asset - hutang;
				
				if (totalWealth < 0) {
					throw new Error('Total kekayaan tidak boleh negatif setelah dikurangi hutang');
				}

				const nishabYearly = ZAKAT_CONFIG.goldPrice * ZAKAT_CONFIG.nishabMultiplier;

				if (totalWealth < nishabYearly) {
					return { isEligible: false, value: 0 };
				}

				const zakatAmount = totalWealth * ZAKAT_CONFIG.zakatRate;
				return { isEligible: true, value: Math.round(zakatAmount) };
			} catch (error) {
				handleCalculationError(error as Error);
				return { isEligible: false, value: 0 };
			}
		},
		[validateNumericInputs, handleCalculationError]
	);

	const calculateZakatProfesi = useCallback(
		(inputs: ZakatProfesiInputs): ZakatCalculationResult => {
			try {
				validateNumericInputs(inputs);

				const penghasilan = Number(inputs.penghasilan.value) || 0;
				const bonus = Number(inputs.bonus.value) || 0;

				if (penghasilan <= 0 && bonus <= 0) {
					throw new Error('Minimal salah satu dari penghasilan atau bonus harus diisi');
				}

				const totalIncome = penghasilan + bonus;
				const nishabMonthly =
					(ZAKAT_CONFIG.goldPrice * ZAKAT_CONFIG.nishabMultiplier) /
					ZAKAT_CONFIG.monthsPerYear;

				if (totalIncome < nishabMonthly) {
					return { isEligible: false, value: 0 };
				}

				const zakatAmount = totalIncome * ZAKAT_CONFIG.zakatRate;
				return { isEligible: true, value: Math.round(zakatAmount) };
			} catch (error) {
				handleCalculationError(error as Error);
				return { isEligible: false, value: 0 };
			}
		},
		[validateNumericInputs, handleCalculationError]
	);

	return {
		calculateZakatMaal,
		calculateZakatProfesi,
	};
};
