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
// import { FaCheckCircle } from 'react-icons/fa';
import { CheckCircleIcon } from "@chakra-ui/icons";

function PriceWrapper({ children }: { children: ReactNode }) {
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

export default function ThreeTierPricing() {
  return (
    <Box py={6}>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}>

        // Left
        <PriceWrapper>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
                <Image
                  src="1F64B.svg"
                  alt="Lovely Image"
                  fallback={<Skeleton />}
                  maxH="96px" minW="96px"
                  objectFit="cover"
                />
            </HStack>
            <Text fontWeight="500" fontSize="sm">
              ¿ No estás registrada/o ?
            </Text>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}>
            <Text spacing={3} textAlign="start" px={12}>
            Si deseas registrarte para solicitar la fé de vida tuya
            o de tus familiares o vecinos
            </Text>
            <Box w="80%" pt={7}>
              <Button w="full" color="indigo" variant="outline" borderRadius="xl">
                Comienza aquí
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

        // Center
        <PriceWrapper>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
              <Image
                  src="1F91D.svg"
                  alt="Lovely Image"
                  fallback={<Skeleton />}
                  maxH="96px" minW="96px"
                  objectFit="cover"
                />
            </HStack>
            <Text fontWeight="500" fontSize="sm">
              ¿ Ya tienes tu cuenta ?
            </Text>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}>
            <Text spacing={3} textAlign="start" px={12}>
              Si ya tienes tu cuenta operativa, puedes
            </Text>
            <Box w="80%" pt={7}>
              <Button w="full" color="indigo" variant="outline" borderRadius="xl">
                Iniciar la sesión
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

        // Right
        <PriceWrapper>
          <Box py={4} px={12}>
            <HStack justifyContent="center">
              <Image
                  src="1F9D1-200D-1F4BB.svg"
                  alt="Lovely Image"
                  fallback={<Skeleton />}
                  maxH="96px" minW="96px"
                  objectFit="cover"
              />
            </HStack>
            <Text fontWeight="500" fontSize="sm">
              ¿ Eres desarrollador ?
            </Text>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}>
            <Text spacing={3} textAlign="start" px={12}>
              Si eres un desarrollador y deseas solicitar
              verificaciones desde tu App
            </Text>
            <Box w="80%" pt={7}>
              <Button w="full" color="indigo" variant="outline" borderRadius="xl">
                Comienza aquí
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

      </Stack>
    </Box>
  );
}
