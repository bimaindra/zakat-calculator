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
import Footer from './components/Footer';
import Header from './components/Header';
import Layout from './components/Layout';
import ZakatMaal from './components/ZakatMaal';
import ZakatProfesi from './components/ZakatProfesi';

const initialResult = {
	isEligible: false,
	value: 0,
};

export default function App() {
	const [result, setResult] = useState(initialResult);
	const [currentTabsIndex, setCurrentTabsIndex] = useState(0);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const handleResult = (result: any) => {
		if (result) {
			// set result
			setResult(result);

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
		}
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
						size={`xl`}
						mb={4}>
						Yuk, Hitung Zakatmu...
					</Heading>
					<Text>
						Tunaikan zakat sebagai bentuk syukur atas rezeki yang telah
						diberikan, dan untuk membantu meringankan beban sesama.
					</Text>
					<Text>
						Bersyukur dengan memberi dan rasakan berkah yang melimpah.
					</Text>
				</Box>
				<Box
					pt={`10`}
					mx={`auto`}
					maxW={`container.sm`}>
					<Tabs
						defaultIndex={currentTabsIndex}
						onChange={(index) => {
							setCurrentTabsIndex(index);
						}}>
						<TabList>
							<Tab>Zakat Profesi</Tab>
							<Tab>Zakat Maal</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<ZakatProfesi
									id={0}
									currentActive={currentTabsIndex}
									onHandleCalculate={handleResult}
								/>
							</TabPanel>
							<TabPanel>
								<ZakatMaal
									id={1}
									currentActive={currentTabsIndex}
									onHandleCalculate={handleResult}
								/>
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
