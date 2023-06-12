import { Container } from '@chakra-ui/react';
import { ChildrenProps } from '../types';

export default function Layout({ children }: ChildrenProps) {
	return (
		<Container
			as={`main`}
			minH={`100vh`}
			maxW={`container.lg`}
			position={`relative`}
			pt={`40px`}
			pb={`40px`}>
			{children}
		</Container>
	);
}
