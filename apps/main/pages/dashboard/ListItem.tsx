import { Heading, Box, Stack, Text, Flex, Spacer, Icon, VStack } from '@chakra-ui/react';
import StateIcon from '../../components/StateIcon';
import Link from 'next/link';
import { stateDescription, shortStateDescription } from "../../constants/states";

export const ListItem = (props) => {
  const 
    refTo = props.refTo,
    t = props.item;
  return (
    <Link href={refTo} key={t.uid}>
      <Flex cursor="pointer" 
        py={4} pr={6} pl={0}
        borderBottom="1px solid #eeb"
        alignItems="center">
        <Box w="4rem" align="center" fontSize="2xl">
          <StateIcon result={t.result} />
        </Box>
        <VStack align="left">
          <Text fontSize="lg" lineHeight="1em">
            {t.full_name}  
          </Text>
          <Text fontSize="xs" fontWeight="bold" color="blue" lineHeight="1em">
            {t.subject_id} 
          </Text>
        </VStack>
        <Spacer/>
        <Text align="right" fontSize="sm" maxW="14rem">
          {t.timing}
          <br/>
          {shortStateDescription(t.result)}
        </Text>
      </Flex>
    </Link>
  )    
}
