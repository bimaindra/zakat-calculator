import React from 'react';

import {
	Box,
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
import { emptyValue, getNishabYearly } from './../libs/constants';

type ZakatMaalProps = {
	onHandleCalculate: any;
};

const ZakatMaal = ({ onHandleCalculate }: ZakatMaalProps) => {
	const initialInput = {
		emas: {
			value: '',
			isError: false,
		},
		tabungan: {
			value: '',
			isError: false,
		},
		asset: {
			value: '',
			isError: false,
		},
		hutang: {
			value: '',
			isError: false,
		},
	};
	const [input, setInput] = useState(initialInput);

	const handleCalculate = () => {
		const totalTreasure =
			Number(input.asset.value) +
			Number(input.emas.value) +
			Number(input.tabungan.value) -
			Number(input.hutang.value);
		const zakat = totalTreasure * 0.025;

		if (
			Number(input.emas.value) === emptyValue ||
			Number(input.tabungan.value) === emptyValue ||
			Number(input.asset.value) === emptyValue
		) {
			setInput({
				emas: {
					value: input.emas.value,
					isError: true,
				},
				tabungan: {
					value: input.tabungan.value,
					isError: true,
				},
				asset: {
					value: input.asset.value,
					isError: true,
				},
				hutang: {
					...input.hutang,
					value: input.hutang.value,
				},
			});
			return;
		}

		// check if eligible for Zakat
		if (totalTreasure > getNishabYearly) {
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
			<Box
				mb={6}
				lineHeight={`tall`}>
				<Text mb={`4`}>
					<b>
						<em>Zakat Maal</em>
					</b>{' '}
					yang dimaksud dalam perhitungan ini adalah zakat yang dikenakan atas
					uang, emas, surat berharga, dan aset yang disewakan. Tidak termasuk
					harta pertanian, pertambangan, dan lain-lain yang diatur dalam UU
					No.23/2011 tentang pengelolaan zakat.
				</Text>
				<Text mb={`4`}>
					Zakat maal harus sudah mencapai nishab (batas minimum) dan terbebas
					dari hutang serta kepemilikan telah mencapai 1 tahun (haul). Nishab
					zakat maal sebesar 85 gram emas. Kadar zakatnya senilai 2,5%.
				</Text>
				<Text mb={`4`}>
					Standar harga emas yg digunakan untuk 1 gram nya adalah Rp
					1.089.000,-. Sementara nishab yang digunakan adalah sebesar 85 gram
					emas.
				</Text>
				<Text>
					<em>
						(Sumber: Al Qur'an Surah Al Baqarah ayat 267, Peraturan Menteri
						Agama Nomer 31 Tahun 2019, Fatwa MUI Nomer 3 Tahun 2003, dan
						pendapat Shaikh Yusuf Qardawi).
					</em>
				</Text>
			</Box>
			<Stack spacing={4}>
				<FormControl
					isRequired
					isInvalid={input.emas.isError}>
					<FormLabel fontWeight={`bold`}>
						Nilai emas, perak, dan/atau permata
					</FormLabel>
					<Input
						as={CurrencyInput}
						prefix={`Rp`}
						groupSeparator={`.`}
						decimalSeparator={`,`}
						decimalsLimit={4}
						placeholder="Rp."
						value={input.emas.value !== undefined ? input.emas.value : ''}
						onValueChange={(value: any) =>
							setInput({
								emas: {
									value: value,
									isError: value === undefined ? true : false,
								},
								tabungan: input.tabungan,
								asset: input.asset,
								hutang: input.hutang,
							})
						}
					/>
					{input.emas.isError && (
						<FormErrorMessage>Mohon di isi!</FormErrorMessage>
					)}
				</FormControl>
				<FormControl
					isRequired
					isInvalid={input.tabungan.isError}>
					<FormLabel fontWeight={`bold`}>
						Uang tunai, tabungan, deposito
					</FormLabel>
					<Input
						as={CurrencyInput}
						prefix={`Rp`}
						groupSeparator={`.`}
						decimalSeparator={`,`}
						decimalsLimit={4}
						placeholder="Rp."
						value={
							input.tabungan.value !== undefined ? input.tabungan.value : ''
						}
						onValueChange={(value: any) =>
							setInput({
								tabungan: {
									value: value,
									isError: value === undefined ? true : false,
								},
								emas: input.emas,
								asset: input.asset,
								hutang: input.hutang,
							})
						}
					/>
					{input.tabungan.isError && (
						<FormErrorMessage>Mohon di isi!</FormErrorMessage>
					)}
				</FormControl>
				<FormControl
					isRequired
					isInvalid={input.asset.isError}>
					<FormLabel fontWeight={`bold`}>Kendaraan, rumah, aset lain</FormLabel>
					<Input
						as={CurrencyInput}
						prefix={`Rp`}
						groupSeparator={`.`}
						decimalSeparator={`,`}
						decimalsLimit={4}
						placeholder="Rp."
						value={input.asset.value !== undefined ? input.asset.value : ''}
						onValueChange={(value: any) =>
							setInput({
								asset: {
									value: value,
									isError: value === undefined ? true : false,
								},
								emas: input.emas,
								tabungan: input.tabungan,
								hutang: input.hutang,
							})
						}
					/>
					{input.asset.isError && (
						<FormErrorMessage>Mohon di isi!</FormErrorMessage>
					)}
				</FormControl>
				<FormControl>
					<FormLabel fontWeight={`bold`}>
						Jumlah hutang/cicilan (optional)
					</FormLabel>
					<Input
						as={CurrencyInput}
						prefix={`Rp`}
						groupSeparator={`.`}
						decimalSeparator={`,`}
						decimalsLimit={4}
						placeholder="Rp."
						value={input.hutang.value !== undefined ? input.hutang.value : ''}
						onValueChange={(value: any) =>
							setInput({
								hutang: {
									value: value,
									isError: value === undefined ? true : false,
								},
								emas: input.emas,
								tabungan: input.tabungan,
								asset: input.asset,
							})
						}
					/>
				</FormControl>
				<Flex columnGap={`4`}>
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

export default React.memo(ZakatMaal);
