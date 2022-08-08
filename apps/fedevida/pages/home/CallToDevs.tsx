import * as React from "react";
import { useState, useEffect } from "react";
import { Stack, VStack, Box, Flex, Text, Link, Image, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const CallToDevs = (props: any) => {

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
              ¿Eres desarrollador?
            </span>
          </Text>        
          <Text fontSize="lg" lineHeight="1.6em">
            Puedes usar nuestra API para hacer solicitudes 
            desde tus aplicaciones. Ideal cuando necesitas conocer a tus clientes 
            y consumidores (KYC) por razones regulatorias u otras.
          </Text>
          <Text fontSize="lg" lineHeight="1.6em">
            Solicita la verificación de una o más personas y
            nosotros nos ocuparemos. Cuando estén finalizadas
            te notificaremos por email, o bien puedes acceder 
            desde tu App al estado de la verificación.
          </Text>
          <Text fontSize="lg" lineHeight="1.6em">
            
          </Text>
          <VStack spacing={3} align="left" pl={2} fontWeight="bold">
            <Link color="blue.600" href="">Como usar la API</Link>
            <Link color="blue.600" href="">Documentos técnicos</Link>
            <br/>
            <Button 
              variant={"outline"}
              colorScheme={"indigo"}
              color="indigo" 
              onClick={onOpenSignUp}
              w="12rem" 
              borderRadius="xl">
              Comienza ahora
            </Button>
          </VStack>
        </Stack>

        <Box pl={16} >
          <Image 
            objectFit="cover"
            alt="Validator images"
            src="/images/for-devs-round.png"
            boxSize={"480px"}
            />
        </Box>

      </Flex>
    </Box>
  )
}

export default CallToDevs;
