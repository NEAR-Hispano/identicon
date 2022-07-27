
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


  const ListItem = (props) => {
    const 
      refTo = props.refTo,
      t = props.item;
    return (
      <Link href={refTo} key={t.uid}>
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
            {t.timing1}
            {t.timing2 && 
              <><br/>{t.timing2}</>
            }
          </Text>
        </Flex>
      </Link>
    )    
  }

  
  const SectionHeading = (props) => {
    return (
      <Text fontSize="12px" fontWeight="bold" pt={10} pb={2} pl="4">
        {props.title}
      </Text>
    )
  }

  const SectionPanel = (props) => {
    return (
      <Box  borderRadius='lg' bg="#fefefe" >
        {props.children}
      </Box>
    )
  }


  function AssignedItemsList(props) {
    const { items } = props;
    const pending = (data || []).filter((t) => (t.state === 'P'));
    if (!pending.length) {
      return (<p>No hay asignaciones pendientes</p>)
    };
    const vs = pending
      .map((t) => {
        const refTo = "/report-result/"+t.uid;
        const item = {
          uid: t.uid,
          result: t.result,
          subject_id: t.subject_id,
          full_name: t.full_name,
          timing1: t.must_start,
          timing2: t.must_end
        }
        return (
          <ListItem refTo={refTo} item={item} key={t.uid}/>
        )
      }
    );
    return vs.length ? vs : <Text>No hay validaciones pendientes</Text> ;
  }

  function CompletedItemsList(props) {
    const { items } = props;
    const done = (data || []).filter((t) => (t.state === 'F'));
    const vs = done
      .map((t) => {
        const refTo = "/report-result/"+t.uid;
        const item = {
          uid: t.uid,
          result: t.result,
          subject_id: t.subject_id,
          full_name: t.full_name,
          timing1: `Realizada ${t.updated_at}`,
          timing2: null
        }
        return (
          <ListItem refTo={refTo} item={item} key={t.uid}/>
        )
      }
    );
    return vs.length ? vs : <Text>No hay validaciones finalizadas</Text> ;
  }

  if (data) {
    return(
      <>
        <SectionHeading title='TUS VALIDACIONES PENDIENTES' />
        <SectionPanel>
          <AssignedItemsList items={data}/> 
        </SectionPanel>

        <SectionHeading title='VALIDACIONES FINALIZADAS' />
        <SectionPanel>
          <CompletedItemsList items={data}/> 
        </SectionPanel>
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
