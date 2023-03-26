import React from 'react';
import { Container } from '@chakra-ui/react';

type LayoutProps = {
	children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
	return (
		<Container
			as="main"
			minH="100vh"
			maxW="container.lg"
			pt={`40px`}
			pb={`40px`}>
			{children}
		</Container>
	);
}
