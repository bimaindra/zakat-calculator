import { Box, Container, Text } from '@chakra-ui/react';

export default function Header() {
	return (
		<Box
			as={`header`}
			w={`100%`}
			px={`4`}
			py={`6`}
			backgroundColor={`whiteAlpha.200`}
			boxShadow={`lg`}>
			<Container
				display={`flex`}
				justifyContent={`space-between`}
				maxW="container.lg">
				<Text
					fontSize={`xl`}
					fontWeight={`bold`}>
					Kalkulator Zakat
				</Text>
			</Container>
		</Box>
	);
}
