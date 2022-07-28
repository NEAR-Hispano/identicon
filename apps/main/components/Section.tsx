import * as React from "react";
import { Stack, Text, Box } from '@chakra-ui/react'

const SectionPanel = (props) => { 
  return (
    <Box 
      width="100%" 
      margin="auto" 
      spacing={3} 
      // pt={4} pb={4} px={8} mt={2} mb={4} 
      {...props}
      borderRadius="lg"
      bg="white" >
        { props.children }
    </Box>
  );
};

const SectionHeading = (props) => {
  return (
    <Text ml={4} fontSize="sm" fontWeight="bold" pt={10} pb={2}>
      { props.title }
    </Text>
  )
}

export { SectionHeading, SectionPanel };
