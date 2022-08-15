import * as React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Text,
  ButtonProps,
  Box,
  Flex,
  HStack,
  Link,
  LinkOverlay,
  Container,
  useBreakpointValue,
  ButtonGroup,
  Spacer,
  Square,
  Image,
  useToast,
  Show,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tag,
  IconButton,
  Avatar,
  AvatarBadge,
  Stack,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { colors, primaryColor } from "../constants/colors";
import { useStore as useAuth } from "../stores/authSession";
import { useRouter } from "next/router";
import { useDisclosure } from "@chakra-ui/hooks";
import AccountInfo from "../pages/dashboard/AccountInfo";
interface Props {
  account: any;
}

const ActionBar = ({ account }: Props) => {
  const [signInAccountId, setSignInAccountId] = useState("");
  const [isSignedIn, setisSignedIn] = useState(false);
  const { session, deleteSession } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (session && session.id != "") setisSignedIn(true);
  }, [session]);

  const logout = async () => {
    deleteSession();
    setisSignedIn(false);
  };

  return (
    <>
      <Flex alignItems={"center"}>
        {account.type === "RQ" && account.subject_id && (
          <Button
            variant={"solid"}
            colorScheme={"green"}
            size={"md"}
            fontWeight="bold"
            mr={4}
            pl="1rem"
            pr="1.25rem"
            py={6}
            borderRadius="3xl"
            leftIcon={<AddIcon />}
            cursor="pointer"
            onClick={() => router.push("/request-verification")}
          >
            Solicita una Fé de Vida
          </Button>
        )}
        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            variant={"link"}
            cursor={"pointer"}
            minW={0}
          >
            <Button
              variant={"outline"}
              size={"sm"}
              mr={4}
              px="2"
              py={2}
              cursor="pointer"
              borderRadius="3xl"
            >
              {account && account.email}
            </Button>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => router.push("/personal-info")}>
              Mis datos personales
            </MenuItem>
            <MenuItem>Preferencias</MenuItem>
            <MenuDivider />
            <MenuItem onClick={logout}>Salir </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </>
  );
};

export default ActionBar;
