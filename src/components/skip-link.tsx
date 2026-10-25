import { Box, Link } from '@chakra-ui/react';

const SkipLink = () => {
  return (
    <Box
      position="absolute"
      top="-40px"
      left="6px"
      background="blue.600"
      color="white"
      padding="8px"
      borderRadius="md"
      textDecoration="none"
      zIndex="9999"
      fontSize="sm"
      fontWeight="bold"
      _focus={{
        top: '6px',
      }}
      _focusVisible={{
        top: '6px',
      }}
    >
      <Link
        href="#main-content"
        color="white"
        _hover={{ textDecoration: 'none' }}
        onClick={(e) => {
          e.preventDefault();
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Langsung ke konten utama
      </Link>
    </Box>
  );
};

export default SkipLink;
