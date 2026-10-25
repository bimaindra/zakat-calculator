import { Box, Container, Text } from '@chakra-ui/react';

const Footer = () => {
  const getYear = new Date().getFullYear();
  return (
    <Box as={`footer`} p={`4`} borderTop={`1px`} borderColor={`gray.200`}>
      <Container display={`flex`} justifyContent={`center`} maxW="container.lg">
        <Text fontSize={`sm`} fontWeight={`normal`} textColor={`gray.600`}>
          &copy; {getYear} | by Bima Indra Mulya
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
