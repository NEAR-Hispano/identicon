import React, { useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import { useGetCredentialMetadata } from "../../hooks/credentials";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
  Image,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { CalendarIcon, CloseIcon, TimeIcon } from "@chakra-ui/icons";
import moment from "moment";
const VerifiableCredential = (props: any) => {
  const { token_id } = props;
  const { data, isLoading } = useGetCredentialMetadata(token_id);
  const [credential, setCredential] = useState<any>();
  useEffect(() => {
    if (!isLoading) {
      const extraJson = JSON.parse(data.metadata.extra);
      setCredential({
        ...data,
        metadata: {
          ...data.metadata,
          extra: extraJson,
        },
      });
    }
  }, [data]);

  const 
    bg1 = useColorModeValue("white", "gray.900"),
    bg2 = useColorModeValue("gray.700", "gray.400"),
    bg3 = useColorModeValue("gray.50", "gray.800");
  
  if (!token_id || !data || isLoading)
    return <Loading>Cargando credencial</Loading>;

  return (
    <Center py={6}>
      <Box
        maxW={"320px"}
        w={"full"}
        bg={bg1}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
      >
        <Avatar
          size={"xl"}
          src={credential && credential.metadata.media}
          mb={4}
          pos={"relative"}
          _after={{
            content: '""',
            w: 4,
            h: 4,
            bg: "green.300",
            border: "2px solid white",
            rounded: "full",
            pos: "absolute",
            bottom: 0,
            right: 3,
          }}
        />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {credential && credential.metadata.extra.name}
        </Heading>
        <Stack spacing="10">
          <Text fontWeight={600} color={"gray.500"} mb={4}>
            {credential && credential.metadata.extra.subject_id}
          </Text>
          <Text
            textAlign={"center"}
            color={bg2}
            px={3}
          >
            {credential && credential.metadata.description}
          </Text>
          <Center>
            <Flex me="25px">
              <Icon
                as={CalendarIcon}
                w="20px"
                h="20px"
                me="6px"
                color="green.400"
              />
              <Text fontSize="sm" my="auto" fontWeight="500">
                {credential &&
                  moment(credential.metadata.issued_at).format("DD/MM/YYYY")}
              </Text>
            </Flex>
            <Flex>
              <Icon as={CloseIcon} w="20px" h="20px" me="6px" color="red.500" />
              <Text fontSize="sm" my="auto" fontWeight="500">
                {credential &&
                  moment(credential.metadata.expires_at).format("DD/MM/YYYY")}
              </Text>
            </Flex>
          </Center>
        </Stack>
        <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
          <Badge
            px={2}
            py={1}
            bg={bg3}
            fontWeight={"400"}
          >
            {credential && credential.metadata.title.toLowerCase()}
          </Badge>
        </Stack>
      </Box>
    </Center>
  );
};

export default VerifiableCredential;
