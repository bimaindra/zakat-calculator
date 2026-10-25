import { Box, Container, Text } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box
      as={`header`}
      w={`100%`}
      px={`4`}
      py={`4`}
      backgroundColor={`whiteAlpha.200`}
      boxShadow={`lg`}
    >
      <Container display={`flex`} justifyContent={`space-between`} maxW="container.lg" px={0}>
        <Text fontSize={`xl`} fontWeight={`bold`}>
          💸 &nbsp; Kalkulator Zakat
        </Text>
      </Container>
    </Box>
  );
};

export default Header;
