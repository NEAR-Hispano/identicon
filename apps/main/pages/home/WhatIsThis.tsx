import * as React from "react";
import { useState, useEffect } from "react";
import { Stack, VStack, Box, Flex, Text, Link, Image, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const WhatIsThis = (props: any) => {

  const router = useRouter();
  const toast = useToast();

  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = props.disclosureSignup;

  return (
    <Box bg="gray.200" pt={32} pb={24} borderBottom="0px #fff solid">
      <Flex alignItems="center"
        justify="center"
        direction={{ base: "column-reverse", md: "row" }}
        wrap="wrap"
        px={16}
        mx="auto"
        maxW="container.xl">

        <Stack spacing={4} maxW="30rem">
          <Text fontSize="4xl" color="indigo.600">
            <span className="feature-heading">Qué es</span>
          </Text>        
          <Text fontSize="lg" lineHeight="1.6em">
            <Link color="primary" href="http://identicon.network"><b>Identicon.network</b></Link> 
            &nbsp; es una comunidad decentralizada (<Link color="blue.600" href="https://es.wikipedia.org/wiki/Organizaci%C3%B3n_aut%C3%B3noma_descentralizada#:~:text=Una%20Organizaci%C3%B3n%20Aut%C3%B3noma%20Descentralizada%20(en,programas%20de%20ordenador%20llamados%20contratos">DAO</Link>) de  
            validadores e informáticos, focalizados en la <b>
            verificación de identidades digitales  
            vinculadas a nuestras identidades reales</b>.
          </Text>
          <Text fontSize="lg" lineHeight="1.6em">
            Nuestro <b>protocolo de verificación</b> aplica
            a muchos casos de uso tales como verificación 
            de identidad, verificación de vida, verificación de activos, verificación de 
            proveedores de bienes y servicios, KYC y varios casos más.
          </Text>
          <VStack spacing={3} align="left" pl={2} fontWeight="bold">
            <Link color="blue.600" href="http://docs.identicon.network/intro/manifest/">Lee nuestro Manifiesto</Link>
            <Link color="blue.600" href="http://docs.identicon.network/tech/techstack/">Nuestra tecnología (NEAR Protocol)</Link>
            <br/>
            <Link href="https://near.org/">
              <Box bgColor="blue.200" w="10rem" pl={2} borderRadius="sm" py={1}>
                  <Flex alignItems={"center"} justifyContent="start">
                    <Image src="images/near_logo_stack.svg" alt="Right Icon" boxSize="48px"/>
                    <Text maxW="6rem" fontSize="xs" textAlign="left" lineHeight="1.1em" ml="0.5rem">
                      Developers in Residence Program</Text>
                  </Flex>
              </Box>
            </Link>
          </VStack>
        </Stack>

        <Box pl={16}>
          <Image 
            objectFit="cover"
            alt="Validator images"
            src="/images/comunidad-round.png"
            boxSize={"480px"}
            />
        </Box>

      </Flex>
    </Box>
  )
}

export default WhatIsThis;
