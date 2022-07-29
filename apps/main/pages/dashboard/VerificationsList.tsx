
import React, { useEffect } from "react";
import { Container, Heading, Box, Stack, Text, Button, Flex, Spacer, Icon, VStack } from '@chakra-ui/react';
import StateIcon from '../../components/StateIcon';
import { Loading } from '../../components/Loading';
import { SectionHeading, SectionPanel } from '../../components/Section';
import { useGetVerifications } from "../../hooks/verifications";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router';
import Link from 'next/link';
import { isVerificationDone, isVerificationPending } from "../../constants/states";
import { prettyDatetime } from "../../utils/formatters";
import { ListItem } from './ListItem';


const VerificationsList = (props: any) => {
  const route = useRouter();
  const { session } = useAuth();
  const { data, isLoading } = useGetVerifications(session);
  let pending=[], emitted =[];  
  const { account } = props;
  console.log("VerificationList props=", props, account);

  useEffect(()=> {
    if (!isLoading && data) {
      console.log("Verifications list loaded", data);
    }
  }, [data]);


  function PendingItemsList(props: any) {
    const { items } = props;
    const pending = (data || []).filter((t: any) => isVerificationPending(t.state));
    const vs = pending.map((t: any) => {
        const refTo = "/verifications/"+t.request_uid;
        const item = {
          uid: t.uid,
          result: t.state,
          subject_id: t.subject_id,
          full_name: t.personal_info.full_name,
          timing: `Solicitada: ${prettyDatetime(t.created_at)}`
        }
        return (
          <ListItem refTo={refTo} item={item} key={t.uid}/>
        )
      }
    );
    return(vs.length 
      ? vs 
      : <Text p={4}>No hay verificaciones pendientes</Text>
     );
  }

  function EmmitedItemsList(props: any) {
    const { items } = props;
    const emitted = (data || []).filter((t: any) => isVerificationDone(t.state));
    const vs = emitted.map((t: any) => {
      const refTo = "/verifications/"+t.request_uid;
      const item = {
        uid: t.uid,
        result: t.state,
        subject_id: t.subject_id,
        full_name: t.personal_info.full_name,
        timing: `Solicitada: ${prettyDatetime(t.created_at)}`
      }
      return (
        <ListItem refTo={refTo} item={item} key={t.uid}/>
      )
    });
    return(vs.length 
      ? vs 
      : <Text p={4}>No hay certificados emitidos</Text>
     );
  }

  if (data) {
    return(
      <>
        <SectionHeading title="SOLICITUDES PENDIENTES" />
        <SectionPanel>
          <PendingItemsList items={data}/> 
        </SectionPanel>

        <SectionHeading title="CERTIFICADOS EMITIDOS" />
        <SectionPanel>
          <EmmitedItemsList items={data}/> 
        </SectionPanel>
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
