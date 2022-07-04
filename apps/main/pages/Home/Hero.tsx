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
import CallToActions from "./CallToActions";

type HeroProps = {};
const Hero = (props: HeroProps) => {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="wrap"
      px={8}
      mb={16}
      {...props}
    >
      <Stack spacing={4} w={{ base: "80%", md: "40%" }}>
        <Heading as="h1" size="xl" fontWeight="bold" color="primary.800">
          La fé de vida para tí o tus familiares sin moverte de tu casa
        </Heading>
        <HStack spacing="3">
          <Box>
            <Button
              variant={"solid"}
              colorScheme={"indigo"}
              size={"lg"}
              mr={4}
              px="xl"
              py={6}
              borderRadius="xl"
            >
              Solicítala ahora
            </Button>
            <Link href="/#more-info">
            <Button
              size={"md"}
              mr={4}
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
      <Box
        w={{ base: "100%", sm: "65%", md: "55%" }}
      >
        <Image
          src="man-woman-beach.jpg"
          boxSize="100%"
          rounded="1rem"
          shadow="2xl"
        />
      </Box>
    </Flex>
  );
};

export default Hero;
