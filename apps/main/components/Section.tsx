import * as React from "react";
import { Stack, Text } from '@chakra-ui/react'

const SectionPanel = (props) => { 
  return (
    <Stack 
      width="100%" 
      margin="auto" spacing={3} pt={4} pb={4} px={8} mt={2} mb={4} 
      borderRadius="lg"
      bg="white" >
        { props.children }
    </Stack>
  );
};

const SectionHeading = (props) => {
  return (
    <Text ml={4} fontSize="sm" fontWeight="bold">
      { props.title }
    </Text>
  )
}

export { SectionHeading, SectionPanel };
