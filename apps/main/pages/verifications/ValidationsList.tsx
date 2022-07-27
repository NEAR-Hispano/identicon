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


export const ValidationsList = (props) => {
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
