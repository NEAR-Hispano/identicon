import React, { useEffect } from "react";
import { Container, Heading } from '@chakra-ui/react';
import { colors } from '../../../constants/colors';
import { useGetAccount } from "../../hooks/accounts";
import { useGetVerifications } from "../../hooks/verifications";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router';
import Header from './Header'
import VerificationsList from './VerificationsList';
import AssignmentsList from './AssignmentsList';

type Props = {
  account_id: string;
};

export default function Dashboard(props: Props) {
  const { account_id } = props;
  const route = useRouter();
  const { session } = useAuth();
  const { data, isLoading } = useGetAccount(session);

  useEffect(() => {
    if (session && !session.id) route.push("/home");
  }, [session]);
  
  useEffect(()=> {
    if (!isLoading && data && data.personal_info) {
      console.log("Requester account info loaded", data);
    }
  }, [data]);

  return (
    <>
      {data && (
        <Header account={data}/>
      )}
      <Container maxW="container.xl" id="dashboard">
        {(data && (data.type === 'RQ' || data.type === 'EX')) &&
          <>
            <VerificationsList account={data} />
          </>
        }
        {(data && data.type === 'VL') &&
          <>
            <Heading size="xs" mt="md">Lista de tareas</Heading>
            <AssignmentsList  account={data} />
          </>
        }
      </Container>

    </>
  );
}
