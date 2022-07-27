import * as React from "react";
import { Heading, Text, Box, Flex, HStack, Image, Spacer, IconButton, } from "@chakra-ui/react";
import { CloseIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { Navbar } from "../../components/Navbar";
import { useRouter } from "next/router";

const Header = (props) => {
  const { account, task } = props;
  const router = useRouter();

  return (
    <Navbar shadow={true}>
      <Flex alignItems="center" py={2}>
        <Box mr={4}>
          <Image
            src="/images/certificate-outline.svg"
            alt="Identicon logo"
            boxSize={"72px"} />
        </Box>
        <Box>
            <HStack pb="1">
             <Text fontSize="sm" color="indigo">Identicon</Text>
             <Text fontSize="sm">/ Fé de Vida / Reporte de validación</Text>
          </HStack>
          <Heading size="xs" fontWeight="normal">
            {task.full_name}
          </Heading>
          <Text fontSize="sm">
            Realizada por <b>{account.personal_info.full_name}</b>
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
