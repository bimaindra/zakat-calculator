import { Box, Container, Text } from '@chakra-ui/react';

export default function Footer() {
	return (
		<Box
			as={`footer`}
			p={`4`}
			borderTop={`1px`}
			borderColor={`gray.200`}>
			<Container
				display={`flex`}
				justifyContent={`center`}
				maxW="container.lg">
				<Text
					fontSize={`sm`}
					fontWeight={`normal`}
					textColor={`gray.600`}>
					&copy; 2023 | by Bima Indra Mulya
				</Text>
			</Container>
		</Box>
	);
}
