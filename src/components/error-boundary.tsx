import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Button,
	VStack,
	Heading,
	Text,
	Box,
} from '@chakra-ui/react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
	errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
		this.setState({
			error,
			errorInfo,
		});
	}

	private handleReset = () => {
		this.setState({ hasError: false, error: undefined, errorInfo: undefined });
	};

	private handleReload = () => {
		window.location.reload();
	};

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<Box p={8} maxW="lg" mx="auto" mt={8}>
					<VStack spacing={6} align="stretch">
						<Alert status="error" borderRadius="md">
							<AlertIcon />
							<Box>
								<AlertTitle>Terjadi kesalahan!</AlertTitle>
								<AlertDescription>
									Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau muat ulang halaman.
								</AlertDescription>
							</Box>
						</Alert>

						<VStack spacing={4}>
							<Heading size="md" color="gray.600">
								Apa yang bisa Anda lakukan?
							</Heading>
							<VStack spacing={2} align="stretch">
								<Button 
									colorScheme="blue" 
									onClick={this.handleReset}
									variant="solid"
								>
									Coba Lagi
								</Button>
								<Button 
									colorScheme="gray" 
									onClick={this.handleReload}
									variant="outline"
								>
									Muat Ulang Halaman
								</Button>
							</VStack>
						</VStack>

						{process.env.NODE_ENV === 'development' && (
							<Alert status="warning" borderRadius="md">
								<AlertIcon />
								<Box>
									<AlertTitle fontSize="sm">Development Info:</AlertTitle>
									<AlertDescription fontSize="xs">
										<Text as="pre" whiteSpace="pre-wrap" fontSize="xs">
											{this.state.error?.message}
											{this.state.errorInfo?.componentStack}
										</Text>
									</AlertDescription>
								</Box>
							</Alert>
						)}
					</VStack>
				</Box>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;