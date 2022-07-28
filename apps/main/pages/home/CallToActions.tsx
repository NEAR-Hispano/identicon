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
import { useRouter } from "next/router";

function Action({ children }: { children: ReactNode }) {
  return (
    <Box
      bg="white"
      mb={4}
      maxW="18rem"
      shadow="md"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      borderRadius={'lg'}>
      {children}
    </Box>
  );
}

const CallToActions = (props) => {

  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = props.disclosureSignup;

  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = props.disclosureLogin;

  return (
    <Box py={8} as="section" id="more-info" bg="gray.100" borderBottom="1px #aac solid">

      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign="center"
        justify="center"
        spacing={{ base: 2, lg: 5 }}
        maxW="container.xl"
        mx="auto"
        pt={8}
        pb={8}>
        <Action>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
              <Text fontSize="5xl">🙋‍♀️</Text>
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
              <Button 
                onClick={onOpenSignUp}
                w="full" color="indigo" variant="outline" borderRadius="xl">
                Crear una cuenta
              </Button>
            </Box>
          </VStack>
        </Action>
        <Action>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
              <Text fontSize="5xl">🤝</Text>
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
              <Button 
                onClick={onOpenLogin}
                w="full" color="indigo" variant="outline" borderRadius="xl">
                Iniciar sesión
              </Button>
            </Box>
          </VStack>
        </Action>
        <Action>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
              <Text fontSize="5xl">🧑🏽‍💻</Text>
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
              <Button 
                onClick={onOpenSignUp}
                w="full" color="indigo" variant="outline" borderRadius="xl">
                Comienza aquí
              </Button>
            </Box>
          </VStack>
        </Action>
      </Stack>
    </Box>
  );
}

export default CallToActions;
