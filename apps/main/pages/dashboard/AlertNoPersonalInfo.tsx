import React from "react";
import {
  Alert,
  AlertIcon,
  Text,
  Link
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const AlertNoPersonalInfo = (props: any) => {
  const { account } = props;
  const router = useRouter();

  if (account && !account.subject_id)
    return (
      <Alert status="warning" borderRadius="lg" boxShadow="lg" mx="auto" mt={12}>
        <AlertIcon boxSize="32px" mr={4} />
        <Text fontSize="lg" lineHeight="1.75em">
          <b>No puedes solicitar ninguna Fe de Vida hasta que no 
            hayas completado tus datos personales.</b>
          <br/>
          <Text>
            Por favor &nbsp;
            <Link 
              href='#'
              onClick={() => router.push("/personal-info")}
              color="blue"
              >
              actualiza tus datos personales
            </Link>
          </Text>
        </Text>
      </Alert>
    );
  return <></>;
};

export default AlertNoPersonalInfo;
