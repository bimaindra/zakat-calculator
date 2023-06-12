import React, { useEffect } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionButton,
	AccordionIcon,
	Box,
	Heading,
	Text,
	Stack,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { emptyValue, getNishabMonthy } from './../libs/constants';
import { ZakatTypes } from '../types';

const initialInput = {
	penghasilan: {
		value: '',
		isError: false,
	},
	bonus: {
		value: '',
		isError: false,
	},
};

const ZakatProfesi = ({ id, currentActive, onHandleCalculate }: ZakatTypes) => {
	const [input, setInput] = useState(initialInput);

	useEffect(() => {
		if (currentActive !== id) {
			setInput(initialInput);
		}
	}, [currentActive]);

	const handleCalculate = () => {
		const income = Number(input.penghasilan.value);
		const bonus = Number(input.bonus.value);
		const sumIncome = income + bonus;
		let zakat = sumIncome * 0.025;

		// validate if empty
		if (income === emptyValue) {
			setInput({
				penghasilan: {
					value: input.penghasilan.value,
					isError: true,
				},
				bonus: {
					value: input.bonus.value,
					isError: true,
				},
			});
			return;
		}

		// check if eligible for Zakat
		if (sumIncome > getNishabMonthy) {
			onHandleCalculate({
				isEligible: true,
				value: zakat,
			});
		} else {
			onHandleCalculate({
				isEligible: false,
				value: 0,
			});
		}
	};

	return (
		<>
			<Accordion
				allowToggle
				mb={6}>
				<AccordionItem border={`none`}>
					<Heading as={'h3'}>
						<AccordionButton
							px={0}
							py={2}
							mb={2}>
							<Box
								as="span"
								flex="1"
								textAlign="left"
								fontWeight={`bold`}
								fontSize={`lg`}>
								Informasi Selengkapnya...
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</Heading>
					<AccordionPanel>
						<Box lineHeight={`tall`}>
							<Text mb={`4`}>
								<b>
									<em>Zakat Profesi</em>
								</b>{' '}
								atau yang dikenal juga sebagai{' '}
								<b>
									<em>Zakat Penghasilan</em>
								</b>{' '}
								adalah bagian dari zakat maal yang wajib dikeluarkan atas harta
								yang berasal dari pendapatan / penghasilan rutin dari pekerjaan
								yang tidak melanggar syariah.
							</Text>
							<Text mb={`4`}>
								Nishab zakat penghasilan sebesar 85 gram emas per tahun. Kadar
								zakat penghasilan senilai 2,5%. Dalam praktiknya, zakat
								penghasilan dapat ditunaikan setiap bulan dengan nilai nishab
								per bulannya adalah setara dengan nilai seperduabelas dari 85
								gram emas, dengan kadar 2,5%.
							</Text>
							<Text mb={`4`}>
								Jadi apabila penghasilan setiap bulan telah melebihi nilai
								nishab bulanan, maka wajib dikeluarkan zakatnya sebesar 2,5%
								dari penghasilannya tersebut.
							</Text>
							<Text mb={`4`}>
								Standar harga emas yg digunakan untuk 1 gram nya adalah Rp
								1.089.000,-. Sementara nishab yang digunakan adalah sebesar 85
								gram emas.
							</Text>
							<Text>
								<em>
									(Sumber: Al Qur'an Surah Al Baqarah ayat 267, Peraturan
									Menteri Agama Nomer 31 Tahun 2019, Fatwa MUI Nomer 3 Tahun
									2003, dan pendapat Shaikh Yusuf Qardawi).
								</em>
							</Text>
						</Box>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Stack spacing={4}>
				<FormControl
					isRequired
					isInvalid={input.penghasilan.isError}>
					<FormLabel fontWeight={`bold`}>Jumlah pendapatan /bulan</FormLabel>
					<Input
						as={CurrencyInput}
						prefix={`Rp`}
						groupSeparator={`.`}
						decimalSeparator={`,`}
						decimalsLimit={4}
						placeholder="Rp."
						value={
							input.penghasilan.value !== undefined
								? input.penghasilan.value
								: ''
						}
						onValueChange={(value: any) =>
							setInput({
								penghasilan: {
									value: value,
									isError: value === undefined ? true : false,
								},
								bonus: input.bonus,
							})
						}
					/>
					{input.penghasilan.isError && (
						<FormErrorMessage>Mohon di isi!</FormErrorMessage>
					)}
				</FormControl>
				<FormControl>
					<FormLabel fontWeight={`bold`}>Bonus, THR dan lainnya</FormLabel>
					<Input
						as={CurrencyInput}
						prefix={`Rp`}
						groupSeparator={`.`}
						decimalSeparator={`,`}
						decimalsLimit={4}
						placeholder="Rp."
						value={input.bonus.value !== undefined ? input.bonus.value : ''}
						onValueChange={(value: any) => {
							setInput({
								penghasilan: input.penghasilan,
								bonus: {
									value: value,
									isError: value === undefined ? true : false,
								},
							});
						}}
					/>
				</FormControl>
				<Flex
					columnGap={`4`}
					display={`flex`}
					gap={4}>
					<Button
						mt={4}
						colorScheme="teal"
						type="button"
						onClick={handleCalculate}>
						Hitung
					</Button>
					<Button
						mt={4}
						colorScheme="red"
						type="button"
						onClick={() => setInput(initialInput)}>
						Reset
					</Button>
				</Flex>
			</Stack>
		</>
	);
};

export default React.memo(ZakatProfesi);
