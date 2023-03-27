import {
	Box,
	Button,
	Flex,
	Heading,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Text,
	Input,
	Stack,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	useToast,
	Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import Footer from './components/Footer';
import Header from './components/Header';
import Layout from './components/Layout';

const initialInput = {
	zProfesi: {
		penghasilan: {
			value: '',
			isError: false,
		},
		bonus: {
			value: '',
			isError: false,
		},
	},
	zMaal: {
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
	},
};
const initialResult = {
	isEligible: false,
	value: 0,
};
const goldPrice = 1089000;
const emptyValue = undefined || 0;

export default function App() {
	const [input, setInput] = useState(initialInput);
	const [result, setResult] = useState(initialResult);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const getNishabYearly = goldPrice * 85;
	const getNishabMonthy = (goldPrice * 85) / 12;
	const toast = useToast();

	const handleCalculateZProfesi = () => {
		const income = Number(input.zProfesi.penghasilan.value);
		const bonus = Number(input.zProfesi.bonus.value);
		const sumIncome = income + bonus;
		let zakat = sumIncome * 0.025;

		// validate if empty
		if (income === emptyValue) {
			setInput({
				...input,
				zProfesi: {
					penghasilan: {
						...input.zProfesi.penghasilan,
						isError: true,
					},
					bonus: {
						...input.zProfesi.bonus,
						isError: true,
					},
				},
			});
			return;
		}

		// check if eligible for Zakat
		if (sumIncome > getNishabMonthy) {
			setResult({
				isEligible: true,
				value: zakat,
			});
		} else {
			setResult({
				isEligible: false,
				value: 0,
			});
		}

		// show toast
		toast({
			title: 'Mohon tunggu.',
			description: 'Sedang mengkalkulasi...',
			status: 'info',
			duration: 1750,
			isClosable: true,
		});

		// open modal
		setTimeout(() => {
			onOpen();
		}, 2000);
	};

	const handleCalculateZMaal = () => {
		const totalTreasure =
			Number(input.zMaal.asset.value) +
			Number(input.zMaal.emas.value) +
			Number(input.zMaal.tabungan.value) -
			Number(input.zMaal.hutang.value);
		const zakat = totalTreasure * 0.025;

		if (
			Number(input.zMaal.emas.value) === emptyValue ||
			Number(input.zMaal.tabungan.value) === emptyValue ||
			Number(input.zMaal.asset.value) === emptyValue
		) {
			setInput({
				...input,
				zMaal: {
					emas: {
						value: input.zMaal.emas.value,
						isError: true,
					},
					tabungan: {
						value: input.zMaal.tabungan.value,
						isError: true,
					},
					asset: {
						value: input.zMaal.asset.value,
						isError: true,
					},
					hutang: {
						...input.zMaal.hutang,
						value: input.zMaal.hutang.value,
					},
				},
			});
			return;
		}

		// check if eligible for Zakat
		if (totalTreasure > getNishabYearly) {
			setResult({
				isEligible: true,
				value: zakat,
			});
		} else {
			setResult({
				isEligible: false,
				value: 0,
			});
		}

		// show toast
		toast({
			title: 'Mohon tunggu.',
			description: 'Sedang mengkalkulasi...',
			status: 'info',
			duration: 1750,
			isClosable: true,
		});

		// open modal
		setTimeout(() => {
			onOpen();
		}, 2000);
	};

	return (
		<>
			<Header />
			<Layout>
				<Box
					maxW={`container.sm`}
					mx={`auto`}
					textAlign={`center`}>
					<Heading
						as={`h1`}
						size={`xl`}>
						Hitung Zakatmu...
					</Heading>
				</Box>
				<Box
					pt={`10`}
					mx={`auto`}
					maxW={`container.sm`}>
					<Tabs onChange={() => setInput(initialInput)}>
						<TabList>
							<Tab>Zakat Penghasilan</Tab>
							<Tab>Zakat Maal</Tab>
						</TabList>

						<TabPanels>
							<TabPanel>
								<Box
									mb={6}
									lineHeight={`tall`}>
									<Text mb={`4`}>
										<b>
											<em>Zakat Penghasilan</em>
										</b>{' '}
										atau yang dikenal juga sebagai{' '}
										<b>
											<em>Zakat Profesi</em>
										</b>{' '}
										adalah bagian dari zakat maal yang wajib dikeluarkan atas
										harta yang berasal dari pendapatan / penghasilan rutin dari
										pekerjaan yang tidak melanggar syariah.
									</Text>
									<Text mb={`4`}>
										Nishab zakat penghasilan sebesar 85 gram emas per tahun.
										Kadar zakat penghasilan senilai 2,5%. Dalam praktiknya,
										zakat penghasilan dapat ditunaikan setiap bulan dengan nilai
										nishab per bulannya adalah setara dengan nilai seperduabelas
										dari 85 gram emas, dengan kadar 2,5%.
									</Text>
									<Text mb={`4`}>
										Jadi apabila penghasilan setiap bulan telah melebihi nilai
										nishab bulanan, maka wajib dikeluarkan zakatnya sebesar 2,5%
										dari penghasilannya tersebut.
									</Text>
									<Text mb={`4`}>
										Standar harga emas yg digunakan untuk 1 gram nya adalah Rp
										1.089.000,-. Sementara nishab yang digunakan adalah sebesar
										85 gram emas.
									</Text>
									<Text>
										<em>
											(Sumber: Al Qur'an Surah Al Baqarah ayat 267, Peraturan
											Menteri Agama Nomer 31 Tahun 2019, Fatwa MUI Nomer 3 Tahun
											2003, dan pendapat Shaikh Yusuf Qardawi).
										</em>
									</Text>
								</Box>
								<Stack spacing={4}>
									<FormControl
										isRequired
										isInvalid={input.zProfesi.penghasilan.isError}>
										<FormLabel fontWeight={`bold`}>
											Jumlah pendapatan /bulan
										</FormLabel>
										<Input
											as={CurrencyInput}
											prefix={`Rp`}
											groupSeparator={`.`}
											decimalSeparator={`,`}
											decimalsLimit={4}
											placeholder="Rp."
											value={
												input.zProfesi.penghasilan.value !== undefined
													? input.zProfesi.penghasilan.value
													: ''
											}
											onValueChange={(value: any) =>
												setInput({
													...input,
													zProfesi: {
														penghasilan: {
															value: value,
															isError: value === undefined ? true : false,
														},
														bonus: input.zProfesi.bonus,
													},
												})
											}
										/>
										{input.zProfesi.penghasilan.isError && (
											<FormErrorMessage>Mohon di isi!</FormErrorMessage>
										)}
									</FormControl>
									<FormControl>
										<FormLabel fontWeight={`bold`}>
											Bonus, THR dan lainnya
										</FormLabel>
										<Input
											as={CurrencyInput}
											prefix={`Rp`}
											groupSeparator={`.`}
											decimalSeparator={`,`}
											decimalsLimit={4}
											placeholder="Rp."
											value={
												input.zProfesi.bonus.value !== undefined
													? input.zProfesi.bonus.value
													: ''
											}
											onValueChange={(value: any) => {
												setInput({
													...input,
													zProfesi: {
														penghasilan: input.zProfesi.penghasilan,
														bonus: {
															value: value,
															isError: value === undefined ? true : false,
														},
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
											onClick={handleCalculateZProfesi}>
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
							</TabPanel>

							<TabPanel>
								<Box
									mb={6}
									lineHeight={`tall`}>
									<Text mb={`4`}>
										<b>
											<em>Zakat Maal</em>
										</b>{' '}
										yang dimaksud dalam perhitungan ini adalah zakat yang
										dikenakan atas uang, emas, surat berharga, dan aset yang
										disewakan. Tidak termasuk harta pertanian, pertambangan, dan
										lain-lain yang diatur dalam UU No.23/2011 tentang
										pengelolaan zakat.
									</Text>
									<Text mb={`4`}>
										Zakat maal harus sudah mencapai nishab (batas minimum) dan
										terbebas dari hutang serta kepemilikan telah mencapai 1
										tahun (haul). Nishab zakat maal sebesar 85 gram emas. Kadar
										zakatnya senilai 2,5%.
									</Text>
									<Text mb={`4`}>
										Standar harga emas yg digunakan untuk 1 gram nya adalah Rp
										1.089.000,-. Sementara nishab yang digunakan adalah sebesar
										85 gram emas.
									</Text>
									<Text>
										<em>
											(Sumber: Al Qur'an Surah Al Baqarah ayat 267, Peraturan
											Menteri Agama Nomer 31 Tahun 2019, Fatwa MUI Nomer 3 Tahun
											2003, dan pendapat Shaikh Yusuf Qardawi).
										</em>
									</Text>
								</Box>
								<Stack spacing={4}>
									<FormControl
										isRequired
										isInvalid={input.zMaal.emas.isError}>
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
											value={
												input.zMaal.emas.value !== undefined
													? input.zMaal.emas.value
													: ''
											}
											onValueChange={(value: any) =>
												setInput({
													...input,
													zMaal: {
														emas: {
															value: value,
															isError: value === undefined ? true : false,
														},
														tabungan: input.zMaal.tabungan,
														asset: input.zMaal.asset,
														hutang: input.zMaal.hutang,
													},
												})
											}
										/>
										{input.zMaal.emas.isError && (
											<FormErrorMessage>Mohon di isi!</FormErrorMessage>
										)}
									</FormControl>
									<FormControl
										isRequired
										isInvalid={input.zMaal.tabungan.isError}>
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
												input.zMaal.tabungan.value !== undefined
													? input.zMaal.tabungan.value
													: ''
											}
											onValueChange={(value: any) =>
												setInput({
													...input,
													zMaal: {
														tabungan: {
															value: value,
															isError: value === undefined ? true : false,
														},
														emas: input.zMaal.emas,
														asset: input.zMaal.asset,
														hutang: input.zMaal.hutang,
													},
												})
											}
										/>
										{input.zMaal.tabungan.isError && (
											<FormErrorMessage>Mohon di isi!</FormErrorMessage>
										)}
									</FormControl>
									<FormControl
										isRequired
										isInvalid={input.zMaal.asset.isError}>
										<FormLabel fontWeight={`bold`}>
											Kendaraan, rumah, aset lain
										</FormLabel>
										<Input
											as={CurrencyInput}
											prefix={`Rp`}
											groupSeparator={`.`}
											decimalSeparator={`,`}
											decimalsLimit={4}
											placeholder="Rp."
											value={
												input.zMaal.asset.value !== undefined
													? input.zMaal.asset.value
													: ''
											}
											onValueChange={(value: any) =>
												setInput({
													...input,
													zMaal: {
														asset: {
															value: value,
															isError: value === undefined ? true : false,
														},
														emas: input.zMaal.emas,
														tabungan: input.zMaal.tabungan,
														hutang: input.zMaal.hutang,
													},
												})
											}
										/>
										{input.zMaal.asset.isError && (
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
											value={
												input.zMaal.hutang.value !== undefined
													? input.zMaal.hutang.value
													: ''
											}
											onValueChange={(value: any) =>
												setInput({
													...input,
													zMaal: {
														hutang: {
															value: value,
															isError: value === undefined ? true : false,
														},
														emas: input.zMaal.emas,
														tabungan: input.zMaal.tabungan,
														asset: input.zMaal.asset,
													},
												})
											}
										/>
									</FormControl>
									<Flex columnGap={`4`}>
										<Button
											mt={4}
											colorScheme="teal"
											type="button"
											onClick={handleCalculateZMaal}>
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
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Layout>
			<Footer />

			{/*Modal Result*/}
			<Modal
				closeOnOverlayClick={false}
				isOpen={isOpen}
				onClose={onClose}
				size={`lg`}
				isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody
						textAlign={'center'}
						py={`4`}>
						<Heading
							as={`h5`}
							size={`lg`}
							lineHeight={`base`}>
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
									variant={`dashed`}
								/>
								<Text
									fontWeight={`bold`}
									fontSize={`2xl`}
									lineHeight={`base`}>
									Sebesar <br /> Rp
									{new Intl.NumberFormat('de-DE', {
										maximumSignificantDigits: 4,
									}).format(result.value)}
									,-
								</Text>
							</>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							mr={3}
							onClick={onClose}>
							Tutup
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
