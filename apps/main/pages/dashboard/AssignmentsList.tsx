
import React, { useEffect } from "react";
import { Container, Heading, Box, Stack, Text, Button, Flex, Spacer, Icon, VStack } from '@chakra-ui/react';
import { useGetTasksAssigned } from "../../hooks/tasks";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router';
import Link from 'next/link';
import { isVerificationDone, isVerificationPending } from "../../constants/states";

const AssignmentsList = (props) => {
  const route = useRouter();
  const { session } = useAuth();
  const { data, isLoading } = useGetTasksAssigned(session);
  let pending=[], emitted =[];  
  const { account } = props;
  console.log("VerificationList props=", props, account);

  useEffect(()=> {
    if (!isLoading && data) {
      console.log("Tasks list loaded", data);
    }
  }, [data]);

  // let arr = [1, 2].map((item, i) => (
  //   <Stack m="2rem" key={`skeleton-${i}`}>
  //     <p>{item}</p>
  //   </Stack>
  // ));

  function AssignedItemsList(props) {
    const { items } = props;
    const pending = (data || []);
    if (!pending.length) {
      return (<p>No hay asignaciones pendientes</p>)
    };
    const vs = pending
      .map((t, i) => {
        const href = "/report-result/"+t.uid;
        return (
          <Link href={href} key={t.uid}>
            <Flex cursor="pointer" 
              py={4} pr={6} pl={0}
              borderBottom="1px solid #eeb"
              alignItems="center">
              <Box w="6rem" align="center">
                {t.result}
                <Icon />
              </Box>
              <VStack align="left">
                <Text fontSize="lg" lineHeight="1em">
                  {t.full_name}  
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="blue" lineHeight="1em">
                  {t.subject_id} 
                </Text>
              </VStack>
              <Spacer/>
              <Text>
                {t.must_start} 
                <br/> 
                {t.must_end}
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

  if (data) {
    return(
      <>
        <Text fontSize="12px" fontWeight="bold" pt={10} pb={2} pl="4">TUS VALIDACIONES PENDIENTES</Text>
        <Box >
          <AssignedItemsList items={data}/> 
        </Box>

        {/* <Heading as="h2" fontSize="xs" mb={0} pb={0}>CERTIFICADOS EMITIDOS</Heading>
        <EmmitedItemsList items={data}/>  */}
      </>
    )
  }
  else {
    return(
      <Heading size="sm" mt={12}>Actualizando tu lista de tareas ... </Heading>
    ) 
  }
};

export default AssignmentsList;
