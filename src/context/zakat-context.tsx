import React, {
	createContext,
	useContext,
	useReducer,
	useCallback,
	type ReactNode,
} from 'react';
import type {
	ZakatCalculationResult,
	ZakatMaalInputs,
	ZakatProfesiInputs,
	ZakatType,
} from '../types';

// State types
interface ZakatState {
	// Current active tab
	currentTab: number;
	activeZakatType: ZakatType;

	// Form states
	profesiInputs: ZakatProfesiInputs;
	maalInputs: ZakatMaalInputs;

	// Calculation results
	calculationResult: ZakatCalculationResult;
	isCalculating: boolean;

	// Modal state
	isResultModalOpen: boolean;

	// Error state
	error: string | null;
}

// Action types
type ZakatAction =
	| {
			type: 'SET_ACTIVE_TAB';
			payload: { tabIndex: number; zakatType: ZakatType };
	  }
	| {
			type: 'UPDATE_PROFESI_FIELD';
			payload: { field: keyof ZakatProfesiInputs; value: string };
	  }
	| {
			type: 'UPDATE_MAAL_FIELD';
			payload: { field: keyof ZakatMaalInputs; value: string };
	  }
	| { type: 'UPDATE_PROFESI_INPUTS'; payload: ZakatProfesiInputs }
	| { type: 'UPDATE_MAAL_INPUTS'; payload: ZakatMaalInputs }
	| { type: 'RESET_PROFESI_FORM' }
	| { type: 'RESET_MAAL_FORM' }
	| { type: 'SET_CALCULATING'; payload: boolean }
	| { type: 'SET_CALCULATION_RESULT'; payload: ZakatCalculationResult }
	| { type: 'OPEN_RESULT_MODAL' }
	| { type: 'CLOSE_RESULT_MODAL' }
	| { type: 'SET_ERROR'; payload: string | null }
	| { type: 'CLEAR_ERROR' };

// Context value type
interface ZakatContextValue {
	state: ZakatState;
	// Tab actions
	setActiveTab: (tabIndex: number, zakatType: ZakatType) => void;

	// Form actions
	updateProfesiField: (field: keyof ZakatProfesiInputs, value: string) => void;
	updateMaalField: (field: keyof ZakatMaalInputs, value: string) => void;
	updateProfesiInputs: (inputs: ZakatProfesiInputs) => void;
	updateMaalInputs: (inputs: ZakatMaalInputs) => void;
	resetProfesiForm: () => void;
	resetMaalForm: () => void;

	// Calculation actions
	setCalculating: (isCalculating: boolean) => void;
	setCalculationResult: (result: ZakatCalculationResult) => void;

	// Modal actions
	openResultModal: () => void;
	closeResultModal: () => void;

	// Error actions
	setError: (error: string | null) => void;
	clearError: () => void;
}

// Initial state
const initialProfesiInputs: ZakatProfesiInputs = {
	penghasilan: { value: '', isError: false, errorMessage: '' },
	bonus: { value: '', isError: false, errorMessage: '' },
};

const initialMaalInputs: ZakatMaalInputs = {
	emas: { value: '', isError: false, errorMessage: '' },
	tabungan: { value: '', isError: false, errorMessage: '' },
	asset: { value: '', isError: false, errorMessage: '' },
	hutang: { value: '', isError: false, errorMessage: '' },
};

const initialState: ZakatState = {
	currentTab: 0,
	activeZakatType: 'profesi',
	profesiInputs: initialProfesiInputs,
	maalInputs: initialMaalInputs,
	calculationResult: { isEligible: false, value: 0 },
	isCalculating: false,
	isResultModalOpen: false,
	error: null,
};

// Reducer
const zakatReducer = (state: ZakatState, action: ZakatAction): ZakatState => {
	switch (action.type) {
		case 'SET_ACTIVE_TAB':
			return {
				...state,
				currentTab: action.payload.tabIndex,
				activeZakatType: action.payload.zakatType,
				error: null,
			};

		case 'UPDATE_PROFESI_FIELD':
			return {
				...state,
				profesiInputs: {
					...state.profesiInputs,
					[action.payload.field]: {
						value: action.payload.value,
						isError: false,
						errorMessage: '',
					},
				},
			};

		case 'UPDATE_MAAL_FIELD':
			return {
				...state,
				maalInputs: {
					...state.maalInputs,
					[action.payload.field]: {
						value: action.payload.value,
						isError: false,
						errorMessage: '',
					},
				},
			};

		case 'UPDATE_PROFESI_INPUTS':
			return {
				...state,
				profesiInputs: action.payload,
			};

		case 'UPDATE_MAAL_INPUTS':
			return {
				...state,
				maalInputs: action.payload,
			};

		case 'RESET_PROFESI_FORM':
			return {
				...state,
				profesiInputs: initialProfesiInputs,
			};

		case 'RESET_MAAL_FORM':
			return {
				...state,
				maalInputs: initialMaalInputs,
			};

		case 'SET_CALCULATING':
			return {
				...state,
				isCalculating: action.payload,
				error: null,
			};

		case 'SET_CALCULATION_RESULT':
			return {
				...state,
				calculationResult: action.payload,
				isCalculating: false,
			};

		case 'OPEN_RESULT_MODAL':
			return {
				...state,
				isResultModalOpen: true,
			};

		case 'CLOSE_RESULT_MODAL':
			return {
				...state,
				isResultModalOpen: false,
			};

		case 'SET_ERROR':
			return {
				...state,
				error: action.payload,
				isCalculating: false,
			};

		case 'CLEAR_ERROR':
			return {
				...state,
				error: null,
			};

		default:
			return state;
	}
};

// Create context
const ZakatContext = createContext<ZakatContextValue | null>(null);

// Provider component
interface ZakatProviderProps {
	children: ReactNode;
}

export const ZakatProvider: React.FC<ZakatProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(zakatReducer, initialState);

	// Tab actions
	const setActiveTab = useCallback((tabIndex: number, zakatType: ZakatType) => {
		dispatch({ type: 'SET_ACTIVE_TAB', payload: { tabIndex, zakatType } });
	}, []);

	// Form actions
	const updateProfesiField = useCallback(
		(field: keyof ZakatProfesiInputs, value: string) => {
			dispatch({ type: 'UPDATE_PROFESI_FIELD', payload: { field, value } });
		},
		[]
	);

	const updateMaalField = useCallback(
		(field: keyof ZakatMaalInputs, value: string) => {
			dispatch({ type: 'UPDATE_MAAL_FIELD', payload: { field, value } });
		},
		[]
	);

	const updateProfesiInputs = useCallback((inputs: ZakatProfesiInputs) => {
		dispatch({ type: 'UPDATE_PROFESI_INPUTS', payload: inputs });
	}, []);

	const updateMaalInputs = useCallback((inputs: ZakatMaalInputs) => {
		dispatch({ type: 'UPDATE_MAAL_INPUTS', payload: inputs });
	}, []);

	const resetProfesiForm = useCallback(() => {
		dispatch({ type: 'RESET_PROFESI_FORM' });
	}, []);

	const resetMaalForm = useCallback(() => {
		dispatch({ type: 'RESET_MAAL_FORM' });
	}, []);

	// Calculation actions
	const setCalculating = useCallback((isCalculating: boolean) => {
		dispatch({ type: 'SET_CALCULATING', payload: isCalculating });
	}, []);

	const setCalculationResult = useCallback((result: ZakatCalculationResult) => {
		dispatch({ type: 'SET_CALCULATION_RESULT', payload: result });
	}, []);

	// Modal actions
	const openResultModal = useCallback(() => {
		dispatch({ type: 'OPEN_RESULT_MODAL' });
	}, []);

	const closeResultModal = useCallback(() => {
		dispatch({ type: 'CLOSE_RESULT_MODAL' });
	}, []);

	// Error actions
	const setError = useCallback((error: string | null) => {
		dispatch({ type: 'SET_ERROR', payload: error });
	}, []);

	const clearError = useCallback(() => {
		dispatch({ type: 'CLEAR_ERROR' });
	}, []);

	const contextValue: ZakatContextValue = {
		state,
		setActiveTab,
		updateProfesiField,
		updateMaalField,
		updateProfesiInputs,
		updateMaalInputs,
		resetProfesiForm,
		resetMaalForm,
		setCalculating,
		setCalculationResult,
		openResultModal,
		closeResultModal,
		setError,
		clearError,
	};

	return (
		<ZakatContext.Provider value={contextValue}>
			{children}
		</ZakatContext.Provider>
	);
};

// Custom hook to use context
export const useZakatContext = (): ZakatContextValue => {
	const context = useContext(ZakatContext);
	if (!context) {
		throw new Error('useZakatContext must be used within a ZakatProvider');
	}
	return context;
};
