import React from "react";
import {
  Alert,
  AlertIcon,
  Text,
  Link, 
  Button, Box, Code
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const AlertAPIKey = (props: any) => {
  const { account, session } = props;
  const router = useRouter();

  if (account)
    return (
      <Alert status="success" borderRadius="lg" boxShadow="lg" mx="auto" mt={12}>
        <AlertIcon boxSize="32px" mr={4} />
        <Box>
          <Text mt={4} mb={2}><b>Tu clave de acceso a la API (API_KEY) es:</b></Text>
          <Code maxW="48rem" p={4}>{session.token}</Code>
          <Text my={4}>
            <Button colorScheme="indigo" color="primary" variant="outline">
              Genera una nueva clave
            </Button>
          </Text>
        </Box>
      </Alert>
    );
  return <></>;
};

export default AlertAPIKey;
