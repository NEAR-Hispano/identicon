import React from "react";
import { Flex, Text, Box } from '@chakra-ui/react';
import StateIcon from "../../components/StateIcon";
import { Loading } from '../../components/Loading';
import { shortStateDescription } from "../../constants/states";


export const ValidatorsList = (props) => {
  const { items } = props;

  if (!items) return(
    <Loading>
      Cargando la lista de validadores
    </Loading>
  )

  const vs = (items || []).map((t, i) => {
    return(
      <Box key={t.validator_id} 
        px={8} pt={6} pb={i===(items.length-1) ? 7 : 0}>
        <Flex alignItems="center">
          <Box width="2.5rem" textAlign="center">
            <StateIcon result={t.result} />
          </Box>
          <Text m={0} p={0} lineHeight="1em">
            Anónimo ({t.validator_id.split('.')[0]})
            <br/>
            <b>{shortStateDescription(t.result)}</b> 
            &nbsp; ({t.is_type})
            <br/>
            {t.remarks}
          </Text>
        </Flex>
      </Box>
    )
  })

  return(vs.length 
    ? vs 
    : 'Aun no hay validadores asignados'
  );
}
