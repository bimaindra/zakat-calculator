import { Box, Container, Text } from '@chakra-ui/react';

export default function Footer() {
	return (
		<Box
			as={`footer`}
			p={`4`}
			borderTop={`1px`}
			borderColor={`InactiveBorder`}>
			<Container
				display={`flex`}
				justifyContent={`flex-end`}
				maxW="container.lg">
				<Text
					fontSize={`sm`}
					fontWeight={`bold`}>
					&copy; 2023
				</Text>
			</Container>
		</Box>
	);
}
