import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import App from './App';
import ErrorBoundary from './components/error-boundary';
import { ZakatProvider } from './context/zakat-context';
import './assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<ErrorBoundary>
				<ZakatProvider>
					<App />
				</ZakatProvider>
			</ErrorBoundary>
		</ChakraProvider>
	</React.StrictMode>
);
