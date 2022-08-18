import * as React from "react";
import { useState, useEffect } from "react";
import { Stack, VStack, Box, Flex, Text, Link, Image, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const WhoCanRequest = (props: any) => {

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
          <Text  fontSize="4xl" color="indigo.600">
            <span className="feature-heading">
              Quiénes pueden solicitarla
            </span>
          </Text>        
          <Text fontSize="lg" lineHeight="1.6em">
            Cualquier persona mayor de edad puede solicitarla para sí misma 
            o para uno o más de sus familiares. 
          </Text>
          <Text fontSize="lg" lineHeight="1.6em">
            Ten en cuenta que <b>antes de poder realizar una solicitud
            deberemos verificar tu identidad</b>, para lo cual deberás 
            darnos algunos datos mínimos de contacto.
          </Text>
          <VStack spacing={3} align="left" pl={2} fontWeight="bold">
            <Link color="blue.600" href="http://docs.identicon.network/faqs/solicitantes/#porque-necesitan-mis-datos">¿Porqué necesitan mis datos?</Link>
            <Link color="blue.600" href="http://docs.identicon.network/faqs/solicitantes/#que-datos-debo-proveer">¿Qué datos debo proveer para la verificación?</Link>
            <Link color="blue.600" href="http://docs.identicon.network/faqs/solicitantes/#cuantas-puedo-solicitar">¿Cuantas verificaciones puedo solicitar?</Link>
            <Link color="blue.600" href="http://docs.identicon.network/faqs/solicitantes/#tienen-algun-costo">¿Tienen algún costo ?</Link>
            <br/>
            <Button 
              variant={"solid"}
              colorScheme={"indigo"}
              onClick={onOpenSignUp}
              w="12rem" 
              borderRadius="xl">
              Solicítala ahora
            </Button>
          </VStack>
        </Stack>

        <Box pl={16} >
          <Image 
            objectFit="cover"
            alt="Validator images"
            src="/images/mano-levantada-round.png"
            boxSize={"480px"}
            />
        </Box>

      </Flex>
    </Box>
  )
}

export default WhoCanRequest;
