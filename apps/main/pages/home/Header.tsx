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
import { AddIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import { colors, primaryColor } from "../../constants/colors";
import { useStore as useAuth } from "../../stores/authSession";
import { useRouter } from "next/router";
import SignUpModal from "./SignUpModal";
import OtpModal from "./OTPVerificationModal";
import LoginModal from "./LoginModal";

//const Header: React.FC<ButtonProps> = (props: any) => {
const Header = (props: any) => {
  const [signInAccountId, setSignInAccountId] = useState("");
  const [accountData, setAccountData] = useState<any>();
  const [isSignedIn, setisSignedIn] = useState(false);
  const { session, deleteSession } = useAuth();
  
  const [otpVerificationData, setotpVerificationData] = useState({
    session: "",
  });

  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = props.disclosureSignup;

  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = props.disclosureLogin;

  const {
    isOpen: isOpenOtp,
    onOpen: onOpenOtp,
    onClose: onCloseOtp,
  } = useDisclosure();

  const router = useRouter();
  const toast = useToast();

  const onSignUp = (data: any) => {
    toast({
      title: "El password de un solo uso ha sido enviado",
      status: "success",
      duration: 9000,
      position: "top-right",
      isClosable: true,
    });
    onCloseSignUp();
    setotpVerificationData(data);
    onOpenOtp();
  };

  const onLogin = (data: any) => {
    toast({
      title: "El password de un solo uso ha sido enviado",
      status: "success",
      duration: 9000,
      position: "top-right",
      isClosable: true,
    });
    onCloseLogin();
    setotpVerificationData(data);
    onOpenOtp();
  };

  useEffect(() => {
    if (session && session.id != "") setisSignedIn(true);
  }, [session]);

  const logout = async () => {
    deleteSession();
    setisSignedIn(false);
  };

  return (
    <>
      <SignUpModal
        onSuccess={onSignUp}
        isOpen={isOpenSignUp}
        onClose={onCloseSignUp}
        onOpen={onOpenSignUp}
      />
      <LoginModal
        onSuccess={onLogin}
        isOpen={isOpenLogin}
        onClose={onCloseLogin}
        onOpen={onOpenLogin}
      />
      <OtpModal
        data={otpVerificationData}
        setisSignedIn={setisSignedIn}
        setSignInAccountId={setSignInAccountId}
        isOpen={isOpenOtp}
        onClose={onCloseOtp}
        onOpen={onOpenOtp}
      />
      <Box as="section" pb={{ base: "6", md: "6" }} bg="white" boxShadow="sm" position="fixed" top="0" w="full">
        <Box as="nav" alignContent="flex-end">
          <Container maxW="container.2xl" pt={{ base: "3", lg: "4" }}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
              <HStack spacing={5} alignItems={"center"}>
                {/* <Box position="relative">
                  <Image src="logo.png" boxSize={"72px"} />
                </Box> */}
                <Flex
                  onClick={() => router.push(`/`)}
                  cursor="pointer"
                  alignItems="center"
                >
                  <HStack spacing={2} alignItems={"center"}>
                    <Image
                      objectFit="cover"
                      src="images/logo.png"
                      alt="logo"
                      boxSize={"48px"}
                    />

                    <Box>
                      <Text fontSize="xl" fontWeight="bold" color="indigo.600">
                        Identicon
                      </Text>
                      <Text fontSize="xs">Uniendo tu vida digital y real</Text>
                    </Box>
                  </HStack>
                </Flex>
              </HStack>

              <HStack h={16} alignItems={"center"} justifyContent="flex-end">
                <Box>
                  <Button
                    variant={"solid"}
                    colorScheme={"indigo"}
                    borderRadius="xl"
                    onClick={onOpenSignUp}
                  >
                    Crea tu cuenta
                  </Button>
                </Box>
                <Spacer />
                <Box>
                  <Button
                    borderRadius="xl"
                    borderColor="gray.300"
                    variant="outline"
                    onClick={onOpenLogin}
                  >
                    Inicia sesión
                  </Button>
                </Box>
              </HStack>
            </Flex>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Header;
