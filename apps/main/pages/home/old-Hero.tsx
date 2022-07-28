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
    <Box mt="140px">
      <Flex
        align="center"
        justify={{ base: "center", md: "space-around", xl: "space-between" }}
        direction={{ base: "column-reverse", md: "row" }}
        wrap="wrap"
        px={24}
        py={16}
        maxW="container.xl"
        mx="auto"
        {...props}
        >
        <Stack spacing={4} w={{ base: "80%", md: "40%" }}>
          <Heading as="h1" size="lg" fontWeight="bold" color="primary.800">
            La fé de vida para tí o tus familiares sin moverte de tu casa
          </Heading>
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
            src="images/group-seniors-beach_53876-82577.webp"
            //src="images/man-woman-beach.jpg"
            boxSize="100%"
            rounded="1rem"
            shadow="2xl"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Hero;
