import React, { useEffect } from "react";
import { Text, Stack } from '@chakra-ui/react';
import { isVerificationDone, shortStateDescription } from "../../constants/states";

export default function ValidationStatus(props) {
  const { data } = props;
  if (data && isVerificationDone(data.result)) return (
    <Stack spacing={5} p={8}>
      <Text>
        Conclusión: <b>{shortStateDescription(data.result)}</b>
      </Text>
      <Text>
        Comentarios: <b>{data.remarks}</b>
      </Text>
      <Text>Evidencia (fotos y videos) ...</Text>
    </Stack>
  );
  return (<></>);
}
