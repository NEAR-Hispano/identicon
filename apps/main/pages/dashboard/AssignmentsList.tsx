
import React, { useEffect } from "react";
import { Container, Heading, Box, Stack, Text, Button, Flex, Spacer, Icon, VStack } from '@chakra-ui/react';
import StateIcon from '../../components/StateIcon';
import { SectionHeading, SectionPanel } from '../../components/Section';
import { useGetTasksAssigned } from "../../hooks/tasks";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router';
import Link from 'next/link';
import { isVerificationDone, isVerificationPending, stateDescription } from "../../constants/states";
import { prettyDatetime } from "../../utils/formatters";
import { ListItem } from './ListItem';

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


//   const ListItem = (props) => {
//     const 
//       refTo = props.refTo,
//       t = props.item;
//     return (
//       <Link href={refTo} key={t.uid}>
//         <Flex cursor="pointer" 
//           py={4} pr={6} pl={0}
//           borderBottom="1px solid #eeb"
//           alignItems="center">
//           <Box w="4rem" align="center" fontSize="2xl">
//             <StateIcon result={t.result} />
//           </Box>
//           <VStack align="left">
//             <Text fontSize="lg" lineHeight="1em">
//               {t.full_name}  
//             </Text>
//             <Text fontSize="xs" fontWeight="bold" color="blue" lineHeight="1em">
//               {t.subject_id} 
//             </Text>
//           </VStack>
//           <Spacer/>
//           <Text align="right" fontSize="sm" maxW="14rem">
//             {t.timing}
//             <br/>
//             {stateDescription(t.result)}
//           </Text>
//         </Flex>
//       </Link>
//     )    
//   }
// 
// 
//   function prettyDatetime(ts) {
//     let datetime = ts.split(' ');
//     let hhmmss = datetime[1].split(':');
//     return `${datetime[0]} ${hhmmss[0]}:${hhmmss[1]}`
//   }


  function AssignedItemsList(props) {
    const { items } = props;
    const pending = (data || []).filter((t) => (t.state === 'P'));
    const vs = pending.map((t) => {
        const refTo = "/report-result/"+t.uid;
        const item = {
          uid: t.uid,
          result: t.result,
          subject_id: t.subject_id,
          full_name: t.full_name,
          timing: `Solicitada: ${prettyDatetime(t.must_start)}`
        }
        return (
          <ListItem refTo={refTo} item={item} key={t.uid}/>
        )
      }
    );
    return(vs.length 
      ? vs 
      : <Text p={4}>No hay validaciones pendientes</Text>
    );
  }

  function CompletedItemsList(props) {
    const { items } = props;
    const done = (data || []).filter((t) => (t.state === 'F'));
    const vs = done.map((t) => {
        const refTo = "/report-result/"+t.uid;
        const item = {
          uid: t.uid,
          result: t.result,
          subject_id: t.subject_id,
          full_name: t.full_name,
          timing: `Realizada: ${prettyDatetime(t.updated_at)}`
        }
        return (
          <ListItem refTo={refTo} item={item} key={t.uid}/>
        )
      }
    );
    return(vs.length 
      ? vs 
      : <Text p={4}>No hay validaciones finalizadas</Text>
     );
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
