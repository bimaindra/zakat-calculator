import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useZakatContext } from '../context/zakat-context';
import { useZakatCalculation } from './use-zakat-calculation';
import { useFormValidation } from './use-form-validation';
import { useScreenReader } from './use-screen-reader';
import { UI_CONFIG } from '../constants';
import type { ZakatType, ZakatMaalInputs, ZakatProfesiInputs } from '../types';

// Hook for tab management
export const useZakatTabs = () => {
  const { state, setActiveTab } = useZakatContext();
  const { announceNavigation } = useScreenReader();

  const handleTabChange = useCallback(
    (index: number) => {
      const zakatType: ZakatType = index === 0 ? 'profesi' : 'maal';
      setActiveTab(index, zakatType);

      // Announce tab change to screen readers
      const tabName = zakatType === 'profesi' ? 'Zakat Profesi' : 'Zakat Maal';
      announceNavigation(`Beralih ke tab ${tabName}`);
    },
    [setActiveTab, announceNavigation]
  );

  return {
    currentTab: state.currentTab,
    activeZakatType: state.activeZakatType,
    handleTabChange,
  };
};

// Hook for form management
export const useZakatForm = (type: ZakatType) => {
  const {
    state,
    updateProfesiField,
    updateMaalField,
    updateProfesiInputs,
    updateMaalInputs,
    resetProfesiForm,
    resetMaalForm,
  } = useZakatContext();

  const inputs = type === 'profesi' ? state.profesiInputs : state.maalInputs;

  const updateField = useCallback(
    (field: string, value: string) => {
      if (type === 'profesi') {
        updateProfesiField(field as keyof ZakatProfesiInputs, value);
      } else {
        updateMaalField(field as keyof ZakatMaalInputs, value);
      }
    },
    [type, updateProfesiField, updateMaalField]
  );

  const updateInputs = useCallback(
    (newInputs: any) => {
      if (type === 'profesi') {
        updateProfesiInputs(newInputs as ZakatProfesiInputs);
      } else {
        updateMaalInputs(newInputs as ZakatMaalInputs);
      }
    },
    [type, updateProfesiInputs, updateMaalInputs]
  );

  const resetForm = useCallback(() => {
    if (type === 'profesi') {
      resetProfesiForm();
    } else {
      resetMaalForm();
    }
  }, [type, resetProfesiForm, resetMaalForm]);

  return {
    inputs,
    updateField,
    updateInputs,
    resetForm,
  };
};

// Hook for calculation management
export const useZakatCalculationState = () => {
  const {
    state,
    setCalculating,
    setCalculationResult,
    openResultModal,
    setError,
    updateProfesiInputs,
    updateMaalInputs,
  } = useZakatContext();

  const { calculateZakatMaal, calculateZakatProfesi } = useZakatCalculation();
  const { validateZakatMaalInputs, validateZakatProfesiInputs, hasValidationErrors } =
    useFormValidation();
  const { announceStatus, announceError, announceSuccess } = useScreenReader();
  const toast = useToast();

  const handleCalculation = useCallback(
    async (type: ZakatType) => {
      try {
        setCalculating(true);
        announceStatus('Memulai proses perhitungan zakat');

        const inputs = type === 'profesi' ? state.profesiInputs : state.maalInputs;
        const validatedInputs =
          type === 'profesi'
            ? validateZakatProfesiInputs(inputs as ZakatProfesiInputs)
            : validateZakatMaalInputs(inputs as ZakatMaalInputs);

        if (hasValidationErrors(validatedInputs)) {
          if (type === 'profesi') {
            updateProfesiInputs(validatedInputs as ZakatProfesiInputs);
          } else {
            updateMaalInputs(validatedInputs as ZakatMaalInputs);
          }
          setCalculating(false);
          announceError(
            'Terdapat kesalahan dalam pengisian form. Silakan periksa kembali input Anda.'
          );
          return;
        }

        // Show loading toast and announce
        toast({
          title: 'Mohon tunggu.',
          description: 'Sedang mengkalkulasi...',
          status: 'info',
          duration: UI_CONFIG.toastDuration,
          isClosable: true,
        });
        announceStatus('Sedang menghitung zakat, mohon tunggu sebentar');

        // Calculate result
        const result =
          type === 'profesi'
            ? calculateZakatProfesi(inputs as ZakatProfesiInputs)
            : calculateZakatMaal(inputs as ZakatMaalInputs);

        setCalculationResult(result);

        // Announce calculation completion
        const zakatTypeName = type === 'profesi' ? 'profesi' : 'maal';
        const statusMessage = result.isEligible
          ? `Perhitungan selesai. Anda wajib membayar zakat ${zakatTypeName} sebesar ${new Intl.NumberFormat('id-ID').format(result.value)} rupiah`
          : `Perhitungan selesai. Anda tidak wajib membayar zakat ${zakatTypeName}`;
        announceSuccess(statusMessage);

        // Show result modal after delay
        setTimeout(() => {
          openResultModal();
        }, UI_CONFIG.modalDelay);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Terjadi kesalahan saat menghitung';
        setError(errorMessage);
        announceError(`Perhitungan gagal: ${errorMessage}`);
      }
    },
    [
      state.profesiInputs,
      state.maalInputs,
      setCalculating,
      setCalculationResult,
      openResultModal,
      setError,
      updateProfesiInputs,
      updateMaalInputs,
      calculateZakatMaal,
      calculateZakatProfesi,
      validateZakatMaalInputs,
      validateZakatProfesiInputs,
      hasValidationErrors,
      toast,
    ]
  );

  return {
    isCalculating: state.isCalculating,
    calculationResult: state.calculationResult,
    handleCalculation,
  };
};

// Hook for modal management
export const useZakatModal = () => {
  const { state, closeResultModal } = useZakatContext();

  return {
    isOpen: state.isResultModalOpen,
    result: state.calculationResult,
    onClose: closeResultModal,
  };
};

// Hook for error management
export const useZakatError = () => {
  const { state, setError, clearError } = useZakatContext();

  return {
    error: state.error,
    setError,
    clearError,
    hasError: !!state.error,
  };
};
