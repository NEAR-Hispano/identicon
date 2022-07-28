import * as React from "react";
import { Flex, Text, Spinner } from '@chakra-ui/react'

export const Loading = (props) => {
  return (
    <Flex alignItems="center" p={4}>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='indigo.600'
        size='lg'
        />
      <Text ml={8} color="gray.700">
        {props.children}
      </Text>
    </Flex>
  )
}
