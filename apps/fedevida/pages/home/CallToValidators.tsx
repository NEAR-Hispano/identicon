import * as React from "react";
import { useState, useEffect } from "react";
import { Stack, VStack, Box, Flex, Text, Link, Image, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const CallToValidators = (props: any) => {

  const router = useRouter();
  const toast = useToast();

  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = props.disclosureSignup;

  return (
    <Box bg="gray.100" py={24} borderBottom="1px #aac solid">
      <Flex alignItems="center"
        justify="center"
        direction={{ base: "column-reverse", md: "row" }}
        wrap="wrap"
        px={16}
        mx="auto"
        maxW="container.xl">

        <Box pr={16}>
          <Image 
            objectFit="cover"
            alt="Validator images"
            src="/images/red-validadores-round.png"
            boxSize={"490px"}
            />
        </Box>

        <Stack spacing={4} maxW="30rem">
          <Text  fontSize="4xl" color="indigo.600">
            <span className="feature-heading">
              Únete a nuestros Validadores
            </span>
          </Text>        
          <Text fontSize="lg" lineHeight="1.6em">
            Es simple y solo necesitas tu móvil.
          </Text>
          <Text fontSize="lg" lineHeight="1.6em">
            Puedes realizar validaciones de la Fé de Vida
            en forma totalmente anónima, tanto remotas 
            como presenciales, y serás recompensada/o 
            por cada validación realizada.           
          </Text>
          <VStack spacing={3} align="left" pl={2} fontWeight="bold">
            <Link color="blue.600" >¿Cómo puedes convertirte en un validador?</Link>
            <Link color="blue.600" >¿Qué tareas debes realizar como validador?</Link>
            <Link color="blue.600" >¿Cómo se les recompensa y cuando?</Link>
            <br/>
            <Button 
              onClick={onOpenSignUp}
              w="12rem" color="indigo" 
              colorScheme="indigo"
              variant="outline" borderRadius="xl">
              Comienza aquí
            </Button>
          </VStack>
        </Stack>
      </Flex>
    </Box>
  )
}

export default CallToValidators;
