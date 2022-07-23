import { ReactNode } from 'react';
import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  Image,
  Skeleton
} from '@chakra-ui/react';

function Action({ children }: { children: ReactNode }) {
  return (
    <Box
      bg="white"
      mb={4}
      maxW="18rem"
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      borderRadius={'xl'}>
      {children}
    </Box>
  );
}

export default function CallToActions() {
  return (
    <Box py={6} as="section"
    id="more-info">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign="center"
        justify="center"
        spacing={{ base: 2, lg: 5 }}
        py={5}>
        <Action>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
            </HStack>
            <Text fontWeight="500" fontSize={{ base: 'md', lg: 'sm' }}>
              ¿ No estás registrada/o ?
            </Text>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}>
            <Text fontSize={{ base: 'lg', lg: 'md' }} textAlign="start" px={12}>
            Si deseas registrarte para solicitar la fé de vida tuya
            o de tus familiares o vecinos
            </Text>
            <Box w="80%" pt={7}>
              <Button w="full" color="indigo" variant="outline" borderRadius="xl">
                Crear una cuenta
              </Button>
            </Box>
          </VStack>
        </Action>
        <Action>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
            </HStack>
            <Text fontWeight="500" fontSize={{ base: 'md', lg: 'sm' }}>
              ¿ Ya tienes tu cuenta ?
            </Text>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}>
            <Text fontSize={{ base: 'lg', lg: 'md' }} textAlign="start" px={12}>
              Si ya tienes tu cuenta operativa, puedes
            </Text>
            <Box w="80%" pt={7}>
              <Button w="full" color="indigo" variant="outline" borderRadius="xl">
                Iniciar sesión
              </Button>
            </Box>
          </VStack>
        </Action>
        <Action>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
            </HStack>
            <Text fontWeight="500" fontSize={{ base: 'md', lg: 'sm' }}>
              ¿ Eres desarrollador ?
            </Text>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}>
            <Text fontSize={{ base: 'lg', lg: 'md' }} textAlign="start" px={12}>
              Si eres un desarrollador y deseas solicitar
              verificaciones desde tu App
            </Text>
            <Box w="80%" pt={7}>
              <Button w="full" color="indigo" variant="outline" borderRadius="xl">
                Comienza aquí
              </Button>
            </Box>
          </VStack>
        </Action>
      </Stack>
    </Box>
  );
}