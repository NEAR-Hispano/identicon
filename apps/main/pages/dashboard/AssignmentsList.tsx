
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
      .map((v, i) => {
        const href = "/tasks/request_uid?"+v.request_uid;
        const info = JSON.parse(v.info);
        const task = v.validations[0];
        return (
          <Link href={href} key={v.id}>
            <Flex cursor="pointer" 
              py={4} pr={6} pl={0}
              borderBottom="1px solid #eeb"
              alignItems="center">
              <Box w="6rem" align="center">
                <b>#{v.id}</b>
                <br/>
                {task.result}
                <Icon />
              </Box>
              <VStack align="left">
                <Text fontSize="lg" lineHeight="1em">
                  {info.full_name}  
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="blue" lineHeight="1em">
                  {info.subject_id} 
                </Text>
              </VStack>
              <Spacer/>
              <Text>
                {v.when.starts} 
                <br/> 
                { v.when.ends }
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
        <Text fontSize="12px" fontWeight="bold" pt={10} pb={8} pl="2rem">TAREAS PENDIENTES</Text>
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
