import React from "react";
import { Flex, Text, Box, Stack } from '@chakra-ui/react';
import StateIcon from "../../components/StateIcon";
import { Loading } from '../../components/Loading';
import { shortStateDescription } from "../../constants/states";


export const ValidatorsList = (props: any) => {
  const { items } = props;

  if (!items) return(
    <Loading>
      Cargando la lista de validadores
    </Loading>
  )

  const vs = (items || []).map((t: any, i: any) => {
    return(
      <Box key={t.validator_id} 
        px={8} pt={6} pb={i===(items.length-1) ? 7 : 0}>
        <Flex alignItems="center">
          <Box width="2.5rem" textAlign="center">
            <StateIcon result={t.result} />
          </Box>
          <Stack spacing={0} lineHeight="1.4em">
            <Text>
              Anónimo ({t.validator_id.split('.')[0]})
            </Text>
            <Text fontSize="sm">
              <b>{shortStateDescription(t.result)}</b> 
              &nbsp; ({t.is_type})
              <br/>
              {t.remarks}
            </Text>
          </Stack>
        </Flex>
      </Box>
    )
  })

  return(vs.length 
    ? vs 
    : 'Aun no hay validadores asignados'
  );
}
