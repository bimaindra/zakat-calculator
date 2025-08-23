import React from 'react';
import {
	Box,
	Heading,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Text,
	VisuallyHidden,
} from '@chakra-ui/react';
import Footer from './components/footer';
import Header from './components/header';
import Layout from './components/layout';
import ZakatMaal from './components/zakat-maal';
import ZakatProfesi from './components/zakat-profesi';
import ResultModal from './components/result-modal';
import SkipLink from './components/skip-link';
import { useZakatTabs, useZakatModal } from './hooks/use-zakat-state';

export default function App() {
	const { currentTab, handleTabChange } = useZakatTabs();
	const modalProps = useZakatModal();

	return (
		<>
			<SkipLink />
			<Header />
			<Layout>
				<main 
					id="main-content" 
					tabIndex={-1}
					role="main"
					aria-label="Kalkulator Zakat">
					<Box
						maxW="container.sm"
						mx="auto"
						textAlign="center">
						<Heading
							as="h1"
							size="xl"
							mb={4}
							id="page-title">
							Yuk, Hitung Zakatmu...
						</Heading>
						<Text mb={2}>
							Tunaikan zakat sebagai bentuk syukur atas rezeki yang telah
							diberikan, dan untuk membantu meringankan beban sesama.
						</Text>
						<Text>
							Bersyukur dengan memberi dan rasakan berkah yang melimpah.
						</Text>
						<VisuallyHidden>
							<p>
								Aplikasi ini membantu Anda menghitung zakat profesi dan zakat maal 
								berdasarkan nilai nisab terkini. Silakan pilih jenis zakat yang ingin dihitung 
								menggunakan tab di bawah ini.
							</p>
						</VisuallyHidden>
					</Box>
					<Box
						pt={10}
						mx="auto"
						maxW="container.sm">
						<Tabs
							index={currentTab}
							onChange={handleTabChange}
							isLazy
							aria-label="Pilih jenis zakat">
							<TabList 
								role="tablist"
								aria-label="Jenis zakat">
								<Tab
									role="tab"
									aria-controls="zakat-profesi-panel"
									id="zakat-profesi-tab"
									aria-selected={currentTab === 0}
									data-testid="tab-profesi">
									Zakat Profesi
								</Tab>
								<Tab
									role="tab"
									aria-controls="zakat-maal-panel"
									id="zakat-maal-tab"
									aria-selected={currentTab === 1}
									data-testid="tab-maal">
									Zakat Maal
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel
									role="tabpanel"
									id="zakat-profesi-panel"
									aria-labelledby="zakat-profesi-tab"
									tabIndex={0}>
									<ZakatProfesi />
								</TabPanel>
								<TabPanel
									role="tabpanel"
									id="zakat-maal-panel"
									aria-labelledby="zakat-maal-tab"
									tabIndex={0}>
									<ZakatMaal />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Box>
				</main>
			</Layout>
			<Footer />

			<ResultModal {...modalProps} />
		</>
	);
}
