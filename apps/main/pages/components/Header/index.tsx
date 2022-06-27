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
import { colors, primaryColor } from "../../../constants/colors";
import { useStore as useBalance } from "../../../stores/authSession";
import { useRouter } from "next/router";
import { formatToLocaleNear } from "../../../lib/util";
import { useLogin, useRecovery, useSignUp } from "../../../hooks/sessions";
import { useGetAccount } from "../../../hooks/accounts";
import SignUpModal from "./SignUpModal";
import { useDisclosure } from "@chakra-ui/hooks";
import OtpModal from "./OTPVerificationModal";
import LoginModal from "./LoginModal";
import AccountInfo from "./AccountInfo";

const Header: React.FC<ButtonProps> = (props) => {
  const [signInAccountId, setSignInAccountId] = useState("");
  const [accountData, setAccountData] = useState<any>()
  const [isSignedIn, setisSignedIn] = useState(false);
  const { signUp, isSigningUp, isSignUpSuccess, signUpData } = useSignUp();
  const { login, isLogginIn, isLoginSuccess, loginData } = useLogin();
  const { recovery, isRecovering, isRecoverySuccess, recoveryData } =
    useRecovery();
  const [otpVerificationData, setotpVerificationData] = useState({
    session: "",
  });
  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = useDisclosure();
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();
  const {
    isOpen: isOpenOtp,
    onOpen: onOpenOtp,
    onClose: onCloseOtp,
  } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const [signInUser, setSignInUser] = useState({
    verified: true,
    subject_id: "ar_dni_12345678",
    personalInfo: {
      address: "123 calle falsa",
      full_name: "Maria Guillermina Holdich",
      age: 50,
      sex: "female",
      birthday: "1956-05-12",
      country: "Argentina",
      region: "Buenos Aires",
      comune: "8000",
    },
  });
  useEffect(() => {
    if (isSignUpSuccess || isRecoverySuccess) {
      toast({
        title: "OTP was successfully sent",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      onCloseSignUp();
      onCloseLogin();
      if (isSignUpSuccess) {
        setotpVerificationData(signUpData);
      } else {
        setotpVerificationData(recoveryData);
      }
      onOpenOtp();
    }
  }, [isSignUpSuccess, isRecoverySuccess]);

  const logout = async () => {};

  const onClickLogin = async () => {};

  return (
    <>
      <SignUpModal
        onSignUp={signUp}
        isOpen={isOpenSignUp}
        onClose={onCloseSignUp}
        onOpen={onOpenSignUp}
      />
      <LoginModal
        onLogin={recovery}
        isOpen={isOpenLogin}
        onClose={onCloseLogin}
        onOpen={onOpenLogin}
      />
      <OtpModal
        data={otpVerificationData}
        setisSignedIn={setisSignedIn}
        setSignInAccountId={setSignInAccountId}
        onLogin={login}
        isOpen={isOpenOtp}
        onClose={onCloseOtp}
        onOpen={onOpenOtp}
      />
      <Box as="section" pb={{ base: "12", md: "12" }}>
        <Box as="nav" alignContent="flex-end">
          <Container maxW="container.2xl" py={{ base: "3", lg: "4" }}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
              <HStack spacing={5} alignItems={"center"}>
                <Box position="relative">
                  <Image src="identicon.png" boxSize={"72px"} />
                </Box>
                {isSignedIn && (
                  <AccountInfo setAccountData={setAccountData} />
                )}
              </HStack>
              {isSignedIn && (
                <Flex alignItems={"center"}>
                  <Button
                    variant={"solid"}
                    colorScheme={"green"}
                    size={"sm"}
                    mr={4}
                    pl="1rem"
                    pr="1.25rem"
                    py={5}
                    borderRadius="3xl"
                    leftIcon={<AddIcon />}
                    disabled={accountData && !accountData.verified }
                  >
                    Solicitar una Fé de Vida
                  </Button>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      <Avatar
                        size={"sm"}
                        src={
                          "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                        }
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={()=> router.push("/personal-info")} >Mis datos personales</MenuItem>
                      <MenuItem>Preferencias</MenuItem>
                      <MenuDivider />
                      <MenuItem>Salir</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              )}
              {!isSignedIn && (
                <HStack h={16} alignItems={"center"} justifyContent="flex-end">
                  <Box>
                    <Button
                      color="blue"
                      borderColor="blue"
                      variant="outline"
                      onClick={onOpenLogin}
                    >
                      Log in
                    </Button>
                  </Box>
                  <Spacer />
                  <Box>
                    <Button
                      color="blue"
                      borderColor="blue"
                      variant="outline"
                      onClick={onOpenSignUp}
                    >
                      Crear una cuenta
                    </Button>
                  </Box>
                </HStack>
              )}
            </Flex>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Header;
