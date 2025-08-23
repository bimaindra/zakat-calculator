import React, { useEffect, useRef } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Heading,
	Text,
	Divider,
} from '@chakra-ui/react';
import type { ZakatCalculationResult } from '../types';
import { UI_CONFIG } from '../constants';

interface ResultModalProps {
	isOpen: boolean;
	result: ZakatCalculationResult;
	onClose: () => void;
}

const ResultModal = ({ isOpen, result, onClose }: ResultModalProps) => {
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const modalContentRef = useRef<HTMLDivElement>(null);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('id-ID', {
			maximumSignificantDigits: UI_CONFIG.maxSignificantDigits,
		}).format(value);
	};

	// Focus management
	useEffect(() => {
		if (isOpen && modalContentRef.current) {
			// Focus the modal content for screen readers
			modalContentRef.current.focus();
		}
	}, [isOpen]);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Escape') {
			onClose();
		}
	};

	const resultText = result.isEligible 
		? `Anda wajib menunaikan zakat sebesar ${result.value !== 0 ? `Rp ${formatCurrency(result.value)}` : ''}`
		: 'Anda tidak wajib menunaikan zakat';

	return (
		<Modal
			closeOnOverlayClick={false}
			isOpen={isOpen}
			onClose={onClose}
			size="lg"
			isCentered
			initialFocusRef={closeButtonRef}
			onEsc={onClose}>
			<ModalOverlay />
			<ModalContent
				ref={modalContentRef}
				tabIndex={-1}
				role="dialog"
				aria-labelledby="result-modal-title"
				aria-describedby="result-modal-description"
				onKeyDown={handleKeyDown}>
				<ModalHeader id="result-modal-title">
					Hasil Perhitungan Zakat
				</ModalHeader>
				<ModalCloseButton
					aria-label="Tutup dialog hasil perhitungan"
				/>
				<ModalBody
					textAlign="center"
					py={4}
					id="result-modal-description">
					<Heading
						as="h2"
						size="lg"
						lineHeight="base"
						aria-live="polite"
						role="status">
						{result.isEligible ? (
							<>
								Anda wajib menunaikan <br />
								Zakat.
							</>
						) : (
							<>
								Anda tidak wajib menunaikan <br /> Zakat.
							</>
						)}
					</Heading>
					{result.value !== 0 && (
						<>
							<Divider
								my={4}
								variant="dashed"
								role="separator"
								aria-hidden="true"
							/>
							<Text
								fontWeight="bold"
								fontSize="2xl"
								lineHeight="base"
								role="status"
								aria-label={`Jumlah zakat yang harus dibayar: ${formatCurrency(result.value)} rupiah`}>
								Sebesar <br /> 
								<span aria-hidden="true">
									Rp {formatCurrency(result.value)},-
								</span>
							</Text>
						</>
					)}
					
					{/* Hidden text for screen readers with complete information */}
					<div style={{ display: 'none' }} aria-hidden="false">
						{resultText}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						ref={closeButtonRef}
						mr={3}
						onClick={onClose}
						colorScheme="blue"
						data-testid="close-result-modal"
						aria-describedby="close-button-help">
						Tutup
					</Button>
					<div id="close-button-help" style={{ display: 'none' }}>
						Tekan untuk menutup dialog dan kembali ke form
					</div>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ResultModal;
