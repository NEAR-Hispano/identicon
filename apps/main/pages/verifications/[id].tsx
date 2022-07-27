import React, { useEffect } from "react";
import { Container, Flex, Heading, Spacer, Text, IconButton, Box, Spinner } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td,TableCaption, TableContainer } from '@chakra-ui/react';
import StateIcon from "../../components/StateIcon";
import { SectionHeading , SectionPanel } from '../../components/Section';
import { Header } from '../../components/Header';
import { CloseIcon } from '@chakra-ui/icons'
import { useGetAccount } from "../../hooks/accounts";
import { useGetSingleVerification } from "../../hooks/verifications";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router';
import { stateDescription, shortStateDescription } from "../../constants/states";

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


  const ValidationsList = (props) => {
    const { items } = props;
    const vs = (items || []).map((t) => {
      return(
        <Box key={t.validator_id}>
          <Flex alignItems="center">
            <Box width="2.5rem" textAlign="center">
              <StateIcon result={t.result} />
            </Box>
            <Text m={0} p={0} lineHeight="1em">
              Anónimo ({t.validator_id.split('.')[0]})
              <br/>
              <b>{shortStateDescription(t.result)}</b> 
              &nbsp; ({t.is_type})
              <br/>
              {t.remarks}
            </Text>
          </Flex>
        </Box>
      )
    })
    return(vs.length ? vs : 'Aun no hay validadores asignados');
  }

  return (
    <>
      <Header 
        isLoading={!data}
        breadcrumb={`/ Fe de vida / Solicitud en Proceso`}
        title={data && `${data.personal_info.full_name}`}
        subtitle={data && `Solicitada por ${data.requester.full_name}`}
        bigImage={`certificate-outline.svg`} >
        <IconButton 
          onClick={() => router.push('/dashboard')}
          borderRadius="full"
          aria-label='Cerrar' 
          icon={<CloseIcon />} />
      </Header>

      <Container maxW="container.xl" id="dashboard">
        <br/>
        {(!data) && <SectionPanel>
          <Flex alignItems="center">
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='indigo.600'
              size='lg'
              />
            <Text ml={8}>
              Un momentico por favor ....
            </Text>
          </Flex>
          </SectionPanel>
        }
        {(data) &&
          <>
            <Table variant="simple" colorScheme="teal" borderRadius="lg">
              <Row label="Para" content={data.personal_info.full_name} />
              <Row label="Pais, Doc y Numero" content={data.subject_id} />
              <Row label="Estado" content={stateDescription([data.state])} />
              <Row label="Preferencias" content={"Se verificara usando " + data.personal_info.preferred +" al móvil "+data.personal_info.phone} />
              <Row label="Idiomas" content={data.personal_info.languages || langDescriptions[data.personal_info.country]} />
              <Row label="Debe comenzar" content={data.must_start_utc} />
              <Row label="Debe finalizar" content={"Antes de "+data.must_end_utc} />
              <Row label="Resultado" content={resultDescriptions[data.result]} />
            </Table>

            <br/>
            <SectionHeading title="VALIDACIONES"/>
            <SectionPanel>
              <ValidationsList items={data && data.contract.validations} />
            </SectionPanel>

            <hr/>
            {/* {<Text fontSize="xs" pt="lg">
              Verification content:
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </Text>} */}
          </>
        }
      </Container>
    </>
  );
}
