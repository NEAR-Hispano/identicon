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
          <Text  fontSize="4xl" color="indigo.600" fontWeight={800}>
            Qué es
          </Text>        
          <Text fontSize="lg" lineHeight="1.6em">
            <b>Identicon.network</b>es una comunidad de informáticos 
            y validadores, focalizados en simplificar la 
            verificación de identidades.
          </Text>
          <Text fontSize="lg" lineHeight="1.6em">
            Puedes realizar validaciones de la Fé de Vida
            en forma totalmente anónima, tanto remotas 
            como presenciales, y serás recompensada/o 
            por cada validación realizada.           
          </Text>
          <VStack spacing={3} align="left" pl={2} fontWeight="bold">
            <Link color="blue.600" >¿Cómo puedes convertirte en un validador?</Link>
            <Link color="blue.600" >¡Qué tareas debes realizar como validador?</Link>
            <br/>
            <Button 
              onClick={onOpenSignUp}
              w="12rem" color="indigo" variant="outline" borderRadius="xl">
              Comienza aquí
            </Button>
          </VStack>
        </Stack>

        <Box pl={16}>
          <Image 
            objectFit="cover"
            alt="Validator images"
            src="/images/validators-collage.png"
            boxSize={"360px"}
            />
        </Box>

      </Flex>
    </Box>
  )
}

export default WhatIsThis;
