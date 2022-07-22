
import React, { useEffect } from "react";
import { Container, Stack } from '@chakra-ui/react';
import { useGetVerifications } from "../../hooks/verifications";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router'

const VerificationsList = () => {
  const route = useRouter();
  const { session } = useAuth();
  const { data, isLoading } = useGetVerifications(session);
  
  useEffect(()=> {
    if (!isLoading && data) {
      console.log("Verifications list loaded", data);
    }
  }, [data]);

  // let arr = [1, 2].map((item, i) => (
  //   <Stack m="2rem" key={`skeleton-${i}`}>
  //     <p>{item}</p>
  //   </Stack>
  // ));

  function ItemsList() {
    const items = data;
    const vs = items.map((v, i) =>
      <li  key={v.id}>
        <a href="#">
          {v.request_uid} | {v.state} {v.personal_info.full_name} {v.subject_id}
        </a>
      </li>
    );
    return (
      <ul>{vs}</ul>
    );
  }

  const numbers = [1, 2, 3, 4, 5];
  if (data) {
    return <ItemsList /> 
  }
  else {
    return <p>Empty set</p>
  }
};

export default VerificationsList;
