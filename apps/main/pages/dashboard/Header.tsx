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
  IconButton,
  Avatar,
  AvatarBadge,
  Stack,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { AddIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { colors, primaryColor } from "../../constants/colors";
import Jazzicon from 'react-jazzicon'
import { useStore as useAuth } from "../../stores/authSession";
import { useRouter } from "next/router";
import AccountInfo from "./AccountInfo";
import ActionBar from "../../components/ActionBar";

const Header = (props: any) => {
  const { account } = props;
  const [signInAccountId, setSignInAccountId] = useState("");
  const [accountData, setAccountData] = useState<any>();
  const [isSignedIn, setisSignedIn] = useState(false);
  const { session, deleteSession } = useAuth();
  const router = useRouter();
  const toast = useToast();

  console.log("Dashboard Header", account);

  useEffect(() => {
    if (session && session.id != "") setisSignedIn(true);
  }, [session]);

  const logout = async () => {
    deleteSession();
    setisSignedIn(false);
  };

  return (
    <Navbar shadow={true}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={5} alignItems={"center"}>
          <Box position="relative">
            <Jazzicon diameter={72} seed={Math.round(Math.random() * 10000000)} />                    
            <Image 
              alt="Identicon logo"
              src="images/logo.png" 
              boxSize={"32px"} 
              position="absolute" top="-2px" left="-8px" 
              onClick={() => router.push(`/`)} />
          </Box>
          <AccountInfo
            account={account} />
        </HStack>
        <ActionBar
          account={account} />
      </Flex>
    </Navbar>
  );
};

export default Header;
