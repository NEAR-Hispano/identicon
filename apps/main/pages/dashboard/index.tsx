import React, { useEffect } from "react";
import { Container, Heading } from '@chakra-ui/react';
import { colors } from '../../../constants/colors';
import { useGetAccount } from "../../hooks/accounts";
import { useGetVerifications } from "../../hooks/verifications";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router';
import VerificationsList from './VerificationsList';

type Props = {
  account_id: string;
};

export default function DashboardContainer(props: Props) {
  const { account_id } = props;
  const route = useRouter();
  const { session } = useAuth();
  const { data, isLoading } = useGetAccount(session);
  
  useEffect(()=> {
    if (!isLoading && data && data.personal_info) {
      console.log("Requester account info loaded", data);
    }
  }, [data]);

  return (
    <>
      <Container maxW="container.2xl" id="dashboard">
        {/* <div>Account Data 
          <pre>{ JSON.stringify(data, null,2) }</pre>
        </div> */}
        if (data.type === 'RQ' || data.type === 'EX') {
          <>
            <Heading size="xs" mt="md">Lista de verificaciones</Heading>
            <VerificationsList />
          </>
        }
        if (data.type === 'VL') {
          <>
            <Heading size="xs" mt="md">Lista de verificaciones</Heading>
            <VerificationsList />
          </>
        }
      </Container>

    </>
  );
}
