import * as React from "react";
import { Heading, Text, Box, Flex, HStack, Image, Spacer, IconButton, } from "@chakra-ui/react";
import { CloseIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { Navbar } from "../../components/Navbar";
import { useRouter } from "next/router";

const Header = (props) => {
  const { account } = props;
  const router = useRouter();

  return (
    <Navbar shadow={true}>
      <Flex alignItems="center" py={2}>
        <Box mr={4}>
          <Image
            src="images/note-text-outline.svg"
            alt="Identicon logo"
            boxSize={"64px"} />
        </Box>
        <Box>
            <HStack pb="1">
             <Text fontSize="sm" color="indigo">Identicon</Text>
             <Text fontSize="sm">/ Nueva solicitud</Text>
          </HStack>
          <Heading size="xs" fontWeight="normal">
            Solicitud de verificación de la Fe de vida
          </Heading>
          <Text fontSize="sm">
            Solicitada por <b>{account.personal_info.full_name}</b>
          </Text>
        </Box>
        <Spacer/>
        <Box>
          <IconButton 
            onClick={() => router.push('/dashboard')}
            borderRadius="full"
            aria-label='Cerrar' 
            icon={<CloseIcon />}
            />
        </Box>
      </Flex>
    </Navbar>
  );
};

export default Header;
