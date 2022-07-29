
import React, { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import Header from "./Header";
import Hero from "./Hero";
import CallToActions from "./CallToActions";
import CallToValidators from "./CallToValidators";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router'
type Props = {
  account_id: string;
};

const Home = (props: Props) => {
  const route = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (session && session.id != "") {
      route.push("/dashboard");
    }
    else {
      route.push("/home");
    }
  }, [session]);

  // const {
  //   isOpen: isOpenSignUp,
  //   onOpen: onOpenSignUp,
  //   onClose: onCloseSignUp,
  // } = useDisclosure
  const disclosureSignup = useDisclosure();
  const disclosureLogin = useDisclosure();
  
  return (
    <>  
      <Hero 
        disclosureSignup={disclosureSignup}
        />
      <CallToActions 
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        />
      <CallToValidators  
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        />
      <Header 
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        />
      <br/><br/><br/><br/><br/>
    </>
  );
};

export default Home;
