import React from 'react';
import {
  Button,
  Text,
  ButtonProps,
  Box,
  Flex,
  HStack,
  Link,
  LinkOverlay,
  Container,
  useBreakpointValue,
  ButtonGroup,
  Spacer,
  Square,
  Image,
  useToast,
  Show,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  IconButton,
  Avatar,
  AvatarBadge,
  Stack,
  Center,
  useColorModeValue,
  Heading,
  Skeleton,
  Icon,
} from "@chakra-ui/react";
import { colors } from '../../../constants/colors';

type Props = {
  shortVersion?: boolean
}

export const Hero = () => (
  <Box maxW="7xl" mx="auto" px={{ base: '0', lg: '12' }} py={{ base: '0', lg: '12' }}>
    <Stack direction={{ base: 'column-reverse', lg: 'row' }} spacing={{ base: '0', lg: '20' }}>

      // Left
      <Box
        width={{ lg: 'sm' }}
        transform={{ base: 'translateY(-50%)', lg: 'none' }}
        bg={{ base: useColorModeValue('gray.100', 'gray.700'), lg: 'transparent' }}
        mx={{ base: '6', md: '8', lg: '0' }}
        px={{ base: '6', md: '8', lg: '0' }}
        py={{ base: '6', md: '8', lg: '12' }}
      >
        <Stack spacing={{ base: '8', lg: '10' }}>
          <Stack spacing={{ base: '2', lg: '4' }}>
            <Heading size="xl" color={useColorModeValue('indigo.500', 'indigo.300')}>
              La fe de vida
            </Heading>
            <Heading size="md" fontWeight="normal">
              para ti o tus familiares sin moverte de tu casa
            </Heading>
          </Stack>
          <HStack spacing="3">
            <Box>
              <Button
                variant={"solid"}
                colorScheme={"green"}
                size={"lg"}
                mr={4}
                px="xl"
                py={6}
                borderRadius="xl"
                >
                Solicítala ahora
              </Button>
              <Button
                size={"md"}
                mr={4}
                px="xl"
                py={6}
                borderRadius="xl"
                borderColor="gray.300"
                variant="outline"
              >
                ¿ Más info ?
              </Button>
            </Box>
          </HStack>
        </Stack>
      </Box>

      // Right
      <Flex flex="1" overflow="hidden">
        <Image
          src="landing-hero.png"
          alt="Lovely Image"
          fallback={<Skeleton />}
          maxH="450px"
          minW="300px"
          objectFit="cover"
          flex="1"
        />
      </Flex>

    </Stack>
  </Box>
)

export default Hero;
