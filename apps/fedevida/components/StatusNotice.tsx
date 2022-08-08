import React from "react";
import { Flex, Text, Box, propNames } from '@chakra-ui/react';
import StateIcon from "./StateIcon";
import { Loading } from './Loading';
import { stateDescription } from "../constants/states";

// todo move to components folder
const Boxed = (props: any) => {
  return (
    <Box bg="yellow.50" boxShadow='lg' rounded='lg' >
      {props.children}
    </Box>  
  )
}


const StatusNotice = (props: any) => {
  const { state } = props;

  if (!state) return(
    <Boxed>
      <Loading>
        Cargando el estado de esta solicitud
      </Loading>
    </Boxed>
  )

  return(
    <Boxed>
      <Flex alignItems="center" p={6}>
        <Box width="4rem" textAlign="center" fontSize="3xl">
          <StateIcon result={state} />
        </Box>
        <Text ml={0} p={0} lineHeight="1em">
          <b>{stateDescription(state)}</b> 
        </Text>
      </Flex>
    </Boxed>
  )
}

export default StatusNotice;
