import {
	Box,
	Button,
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
} from '@chakra-ui/react';
import { useState } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';

const initialInput = {
	zProfesi: {
		penghasilan: {
			value: 0,
			isError: false,
		},
		bonus: {
			value: 0,
			isError: false,
		},
	},
	zMaal: {
		emas: {
			value: 0,
			isError: false,
		},
		tabungan: {
			value: 0,
			isError: false,
		},
		asset: {
			value: 0,
			isError: false,
		},
		hutang: {
			value: 0,
			isError: false,
		},
	},
};

const initialResult = {
	text: '',
	value: 0,
};

const goldPrice = 1089000;

export default function App() {
	const [input, setInput] = useState(initialInput);
	const [result, setResult] = useState(initialResult);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const getNishabMonthy = (goldPrice * 85) / 12;

	const handleCalculateProfesi = () => {
		let income = input.zProfesi.penghasilan.value + input.zProfesi.bonus.value;
		let zakat = income * 0.025;

		// validate if empty
		if (
			input.zProfesi.penghasilan.value === 0 ||
			input.zProfesi.bonus.value === 0
		) {
			setInput({
				...input,
				zProfesi: {
					penghasilan: {
						value: input.zProfesi.penghasilan.value,
						isError: true,
					},
					bonus: {
						value: input.zProfesi.bonus.value,
						isError: true,
					},
				},
			});
			return;
		}

		// check if eligible for Zakat
		if (income > getNishabMonthy) {
			setResult({
				text: 'Anda wajib bayar zakat penghasilan!',
				value: zakat,
			});
		} else {
			setResult({
				text: 'Anda tidak wajib bayar zakat penghasilan!',
				value: 0,
			});
		}

		setTimeout(() => {
			onOpen();
		}, 2000);
	};

	const handleCalculateMaal = () => {};

	return (
		<>
			<Header />
			<Layout>
				<Box
					w={`container.sm`}
					mx={`auto`}
					textAlign={`center`}>
					<Heading
						as={`h1`}
						size={`xl`}
						noOfLines={1}>
						Hitung Zakatmu...
					</Heading>
				</Box>
				<Box
					pt={`10`}
					mx={`auto`}
					maxW={`container.sm`}>
					<Tabs onChange={() => setInput(initialInput)}>
						<TabList>
							<Tab>Zakat Profesi</Tab>
							<Tab>Zakat Maal</Tab>
						</TabList>

						<TabPanels>
							<TabPanel>
								<Box
									mb={6}
									lineHeight={`tall`}>
									<Text mb={`4`}>
										Zakat penghasilan atau yang dikenal juga sebagai zakat
										profesi adalah bagian dari zakat maal yang wajib dikeluarkan
										atas harta yang berasal dari pendapatan / penghasilan rutin
										dari pekerjaan yang tidak melanggar syariah.
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
											Jumlah pendapatan per bulan
										</FormLabel>
										<Input
											placeholder="Rp."
											value={
												input.zProfesi.penghasilan.value !== 0
													? input.zProfesi.penghasilan.value
													: ''
											}
											onChange={(e) =>
												setInput({
													...input,
													zProfesi: {
														penghasilan: {
															value: Number(e.target.value),
															isError:
																Number(e.target.value) === 0 ? true : false,
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
									<FormControl
										isRequired
										isInvalid={input.zProfesi.bonus.isError}>
										<FormLabel fontWeight={`bold`}>
											Bonus, THR dan lainnya
										</FormLabel>
										<Input
											placeholder="Rp."
											value={
												input.zProfesi.bonus.value !== 0
													? input.zProfesi.bonus.value
													: ''
											}
											onChange={(e) =>
												setInput({
													...input,
													zProfesi: {
														penghasilan: input.zProfesi.penghasilan,
														bonus: {
															value: Number(e.target.value),
															isError:
																Number(e.target.value) === 0 ? true : false,
														},
													},
												})
											}
										/>
										{input.zProfesi.bonus.isError && (
											<FormErrorMessage>Mohon di isi!</FormErrorMessage>
										)}
									</FormControl>
									<Box>
										<Button
											mt={4}
											colorScheme="teal"
											type="button"
											onClick={handleCalculateProfesi}>
											Hitung
										</Button>
									</Box>
								</Stack>
							</TabPanel>

							<TabPanel>
								<Box
									mb={6}
									lineHeight={`tall`}>
									<Text mb={`4`}>
										Zakat maal yang dimaksud dalam perhitungan ini adalah zakat
										yang dikenakan atas uang, emas, surat berharga, dan aset
										yang disewakan. Tidak termasuk harta pertanian,
										pertambangan, dan lain-lain yang diatur dalam UU No.23/2011
										tentang pengelolaan zakat.
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
											placeholder="Rp."
											value={
												input.zMaal.emas.value !== 0
													? input.zMaal.emas.value
													: ''
											}
											onChange={(e) =>
												setInput({
													...input,
													zMaal: {
														emas: {
															value: Number(e.target.value),
															isError:
																Number(e.target.value) === 0 ? true : false,
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
											placeholder="Rp."
											value={
												input.zMaal.tabungan.value !== 0
													? input.zMaal.tabungan.value
													: ''
											}
											onChange={(e) =>
												setInput({
													...input,
													zMaal: {
														tabungan: {
															value: Number(e.target.value),
															isError:
																Number(e.target.value) === 0 ? true : false,
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
											placeholder="Rp."
											value={
												input.zMaal.asset.value !== 0
													? input.zMaal.asset.value
													: ''
											}
											onChange={(e) =>
												setInput({
													...input,
													zMaal: {
														asset: {
															value: Number(e.target.value),
															isError:
																Number(e.target.value) === 0 ? true : false,
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
											placeholder="Rp."
											value={
												input.zMaal.hutang.value !== 0
													? input.zMaal.hutang.value
													: ''
											}
											onChange={(e) =>
												setInput({
													...input,
													zMaal: {
														hutang: {
															value: Number(e.target.value),
															isError:
																Number(e.target.value) === 0 ? true : false,
														},
														emas: input.zMaal.emas,
														tabungan: input.zMaal.tabungan,
														asset: input.zMaal.asset,
													},
												})
											}
										/>
									</FormControl>
									<Box>
										<Button
											mt={4}
											colorScheme="teal"
											type="button"
											onClick={onOpen}>
											Hitung
										</Button>
									</Box>
								</Stack>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Layout>

			{/*Modal Result*/}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size={`xl`}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Hasil Perhitungan</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Heading as={`h5`}>{result.text}</Heading>
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
