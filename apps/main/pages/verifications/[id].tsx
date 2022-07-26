import React, { useEffect } from "react";
import { Container, Flex, Heading, Spacer, Text, IconButton, Box } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td,TableCaption, TableContainer } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons'
import { useGetAccount } from "../../hooks/accounts";
import { useGetSingleVerification } from "../../hooks/verifications";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router';
import { stateDescription } from "../../constants/states";

export default function VerificationContainer(props: Props) {
  const { account_id } = props;
  const router = useRouter();
  const { session } = useAuth();
  const id = router.query && router.query.id ? router.query.id : "";
  const { data, isLoading } = useGetSingleVerification(id);
  
  useEffect(()=> {
    if (!isLoading && data && data.personal_info) {
      console.log("Requester account info loaded", data);
    }
  }, [data]);


  function Row(props) {
    const { label, content } = props;
    return <Tr>
      <Td>{label}</Td>
      <Td>{content}</Td>
    </Tr>
  }

  const langDescriptions = {
    'ar': 'Castellano'
  }

  const resultDescriptions = {
    null: 'Aún no hay resultados',
  }

  return (
    <>
      <Container maxW="container.xl" id="dashboard">
        {(data) &&
          <>
            <Flex alignItems="center">
              <Box>
                <Heading size="sm">Prueba de Vida #{data.id}</Heading>
                <Text fontSize="sm">Uid: {data.request_uid}</Text>
              </Box>
              <Spacer/>
              <Box>
                <IconButton 
                  onClick={() => router.push('/dashboard')}
                  aria-label='Cerrar' icon={<CloseIcon />}
                  />
              </Box>
            </Flex>
            <Table variant="simple" colorScheme="teal">
              <Row label="Para" content={data.personal_info.full_name} />
              <Row label="Pais, Doc y Numero" content={data.subject_id} />
              <Row label="Estado" content={stateDescription([data.state])} />
              <Row label="Preferencias" content={"Se verificara usando " + data.personal_info.preferred +" al móvil "+data.personal_info.phone} />
              <Row label="Idiomas" content={data.personal_info.languages || langDescriptions[data.personal_info.country]} />
              <Row label="Debe comenzar" content={data.must_start_utc} />
              <Row label="Debe finalizar" content={"Antes de "+data.must_end_utc} />
              <Row label="Resultado" content={resultDescriptions[data.result]} />
            </Table>
            <Text fontSize="xs" pt="lg">
              Verification content:
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </Text>
          </>
        }
      </Container>
    </>
  );
}
