import * as React from "react";
import { useState, useEffect } from "react";
import { Heading, Stack, VStack, Box, Flex, Text, Link, Image, Button, useToast } from "@chakra-ui/react";

const Footer = (props: any) => {
  return(
    <Box  bg="gray.700" pt={32} pb={24} borderBottom="0px #fff solid">
    <Flex alignItems="start" justifyContent="space-between"
      direction={{ base: "column-reverse", md: "row" }}
      wrap="wrap"
      px={16}
      mx="auto"
      maxW="container.xl">
      <Flex alignItems="center" justifyContent="start">
        <Image src="images/identicon-logo-v3.svg" alt="Identicon logo" boxSize="48px" display="inline-block"
        boxShadow="0px 0px 8px #ccc" borderRadius="100%"/>
        <Box pl={3}>
          <Text color="white" fontWeight="bold" fontSize="xl">Identicon.network</Text>
          <Text color="gray.300" fontSize="sm">Uniendo tu vida digital y real</Text>
        </Box>
      </Flex>
      <Box>
        <VStack spacing={4} align="flex-start" color="white" fontSize="lg">
          <Text fontSize="sm" color="gray.400">INFORMACiÓN</Text>
          <Link href="#que-es">Qué es</Link>
          <Link href="#como-funciona">Como funciona</Link>
          <Link href="#quienes-pueden-solicitar">Quiénes pueden solicitarla</Link>
          <Link href="#unete-a-validadores">Únete a nuestros Validadores</Link>
          <Link href="#eres-desarrollador">¿Eres desarrollador?</Link>
          {/* <Link href="#nuestro-equipo">Nuestro equipo</Link> */}
        </VStack>
      </Box>
      <Box>
        <VStack spacing={4} align="flex-start" color="white">
        <Text fontSize="sm" color="gray.400">DOCUMENTOS</Text>
          <Link href="">Preguntas frecuentes</Link>
          <Link href="">Manifiesto (Whitepaper)</Link>
          <Link href="">Tecnología y NEAR</Link>
          <Link href="https://github.com/NEAR-Hispano/identicon/blob/master/docs/apis/gateway-api.md">Nuestra API</Link>
        </VStack>
      </Box>
      <Box>
        <VStack spacing={4} align="flex-start" color="white">
          <Text fontSize="sm" color="gray.400">CONTACTOS</Text>
          <Link href="">Discord</Link>
          <Link href="">Twitter</Link>
          <Link href="">Github</Link>
        </VStack>
      </Box>
    </Flex>
    </Box>
  );
}

export default Footer;