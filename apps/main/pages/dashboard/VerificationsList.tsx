
import React, { useEffect } from "react";
import { Container, Heading, Box, Stack, Text, Button, Flex, Spacer, Icon, VStack } from '@chakra-ui/react';
import { useGetVerifications } from "../../hooks/verifications";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router';
import Link from 'next/link';

const VerificationsList = (props) => {
  const route = useRouter();
  const { session } = useAuth();
  const { data, isLoading } = useGetVerifications(session);
  let pending=[], emitted =[];  
  const { account } = props;
  console.log("VerificationList props=", props, account);

  useEffect(()=> {
    if (!isLoading && data) {
      console.log("Verifications list loaded", data);
      emitted = (data || []).filter((t) => ['FN'].includes(t.state));
    }
  }, [data]);

  // let arr = [1, 2].map((item, i) => (
  //   <Stack m="2rem" key={`skeleton-${i}`}>
  //     <p>{item}</p>
  //   </Stack>
  // ));

  function PendingItemsList(props) {
    const { items } = props;
    const pending = (data || []).filter((t) => ['UN','PN','ST'].includes(t.state));
    const emitted = (data || []).filter((t) => ['FN'].includes(t.state));
    if (!pending.length) {
      return (<p>No hay verificaciones pendientes</p>)
    };
    const vs = pending
      .map((v, i) => {
        const href = "/verifications/"+v.request_uid;
        return (
          <Link href={href} key={v.id}>
            <Flex cursor="pointer" 
              py={4} pr={6} pl={0}
              borderBottom="1px solid #eeb"
              alignItems="center">
              <Box w="6rem" align="center">
                <b>#{v.id}</b>
                <br/>
                {v.state}
                <Icon />
              </Box>
              <VStack align="left">
                <Text fontSize="lg" lineHeight="1em">
                  {v.personal_info.full_name}  
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="blue" lineHeight="1em">
                  {v.subject_id} 
                </Text>
              </VStack>
              <Spacer/>
              <Text>
                {v.created_at}
              </Text>
            </Flex>
          </Link>
        )
      }
    );
    return (
      <Box  borderRadius='lg' bg="#fefefe" >{vs}</Box>
    );
  }

  function EmmitedItemsList(props) {
    const { items } = props;
    const emitted = (data || []).filter((t) => ['FN'].includes(t.state));
    if (!emitted.length) {
      return (<p>No hay verificaciones emitidas</p>)
    };
    const vs = emitted
      .map((v, i) => 
        <Link  key={v.id} >
          <a href="#">
            {v.request_uid} | {v.state} {v.personal_info.full_name} {v.subject_id}
          </a>
        </Link>
    );
    return (
      <Box  borderWidth='1px' borderRadius='lg' >{vs}</Box>
    );
  }

  if (data) {
    return(
      <>
        <Text fontSize="12px" fontWeight="bold" pt={10} pb={8} pl="2rem">SOLICITUDES PENDIENTES</Text>
        <Box >
          <PendingItemsList items={data}/> 
        </Box>

        <Heading as="h2" fontSize="xs" mb={0} pb={0}>CERTIFICADOS EMITIDOS</Heading>
        <EmmitedItemsList items={data}/> 
      </>
    )
  }
  else {
    return(
      <Heading size="sm">Actualizando tu lista de verificaciones ... </Heading>
    ) 
  }
};

export default VerificationsList;
