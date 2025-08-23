import React, { KeyboardEvent } from 'react';
import { Flex, Button } from '@chakra-ui/react';

interface FormActionsProps {
	onCalculate: () => void;
	onReset: () => void;
	isCalculateDisabled?: boolean;
	isCalculating?: boolean;
}

const FormActions = ({
	onCalculate,
	onReset,
	isCalculateDisabled = false,
	isCalculating = false,
}: FormActionsProps) => {
	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		// Handle Enter key for primary action
		if (event.key === 'Enter' && !isCalculateDisabled && !isCalculating) {
			event.preventDefault();
			onCalculate();
		}
	};

	return (
		<Flex 
			gap={4} 
			onKeyDown={handleKeyDown}
			role="group"
			aria-label="Form actions">
			<Button
				mt={4}
				colorScheme="teal"
				type="submit"
				isDisabled={isCalculateDisabled}
				isLoading={isCalculating}
				loadingText="Menghitung..."
				onClick={onCalculate}
				aria-describedby="calculate-help"
				data-testid="calculate-button">
				Hitung Zakat
			</Button>
			<Button
				mt={4}
				colorScheme="red"
				variant="outline"
				type="button"
				onClick={onReset}
				aria-describedby="reset-help"
				data-testid="reset-button"
				isDisabled={isCalculating}>
				Reset Form
			</Button>
			{/* Hidden descriptions for screen readers */}
			<div id="calculate-help" style={{ display: 'none' }}>
				Tekan untuk menghitung jumlah zakat yang harus dibayar
			</div>
			<div id="reset-help" style={{ display: 'none' }}>
				Tekan untuk mengosongkan semua input form
			</div>
		</Flex>
	);
};

export default FormActions;
