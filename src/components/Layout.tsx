import { Container } from '@chakra-ui/react';
import type { ChildrenProps } from '../types';

type LayoutProps = ChildrenProps;

const Layout = ({ children }: LayoutProps) => {
  return (
    <Container as="main" minH="100vh" maxW="container.lg" position="relative" pt={10} pb={10}>
      {children}
    </Container>
  );
};

export default Layout;
