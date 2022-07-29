import * as React from "react";
import { Heading, Text, Box, Flex, HStack, Image, Spacer } from "@chakra-ui/react";
import { CloseIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { Navbar } from './Navbar';


export const Header = (props: any) => {
  const { bigImage, miniLogo, jazzIcon, breadcrumb, title, subtitle, isLoading } = props;

  return (
    <Navbar shadow={true}>
      <Flex alignItems="center" py={2}>
        <Box position="relative" mr={5}>
          <Image
            src={`/images/${bigImage}`}
            alt="Identicon logo"
            boxSize={"72px"} />
          <Image 
            alt="Identicon logo"
            src="/images/logo.png" 
            boxSize={"32px"} 
            position="absolute" top="-2px" left="-8px" /> 
        </Box>
        <Box>
            <HStack pb="1">
             <Text fontSize="sm" color="indigo">Identicon</Text>
             <Text fontSize="sm">
                {breadcrumb}
             </Text>
          </HStack>
          <Heading fontSize="xl" lineHeight="1.5em" fontWeight="bold">
            {isLoading ? '...' : title}
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {isLoading ? '...' : subtitle}
          </Text>
        </Box>
        <Spacer/>
        <Box>
          {props.children}
        </Box>
      </Flex>
    </Navbar>
  );
};
