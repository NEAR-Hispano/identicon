import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
  HStack,
} from "@chakra-ui/react";

const Banner = (props: any) => {

  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = props.disclosureSignup;

  return (
    <Stack spacing={4} w="full" minW="44%" px={8}
      textAlign={{base: "center", md: "left"}}
      >
      <Heading as="h1" 
        size="lg" //{{ base:"4xl", md: "5xl" }}
        fontWeight="bold" 
        color="white"
        // colorScheme="white"
        >
        <span className="feature-heading">
          La fe de vida para ti o tus familiares sin moverte de tu casa
        </span>
      </Heading>
      <HStack spacing="5" pt={4}>
        <Box>
          <Button
            onClick={onOpenSignUp}
            variant={"solid"}
            colorScheme={"green"}
            size={"lg"}
            mr={4}
            px="xl"
            py={6}
            mb={4}
            borderRadius="xl"
          >
            <b>Solicítala ahora</b>
          </Button>
          <Link href="#que-es">
            <Button
              size={"md"}
              mr={4}
              mb={4}
              px="xl"
              py={6}
              borderRadius="xl"
              borderColor="gray.300"
              variant="outline"
            >
              Quiero más info
            </Button>
          </Link>
        </Box>
      </HStack>
    </Stack>
  )
}



const Hero = (props: any) => {

  return (
    <Box 
      minH="42rem" 
      borderBottom="0px #aac solid" mt="104px"
      backgroundImage={'url("images/group-seniors-beach_53876-82577.webp")'}
      backgroundSize="cover"
      backgroundPosition="center"
      w="100%"
      position="relative"
      >
      <Box bg="gray.900" opacity="0.85"
        rounded="lg" boxShadow="2xl"
        maxW="42rem"
        w="80%" 
        p={6} position="absolute" bottom={-4} left={12}>
        <Banner 
          disclosureSignup={props.disclosureSignup}
          />
      </Box>
    </Box>
  );
};

export default Hero;
