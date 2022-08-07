
import React, { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import Header from "./Header";
import Hero from "./Hero";
import CallToActions from "./CallToActions";
import CallToValidators from "./CallToValidators";
import WhatIsThis from './WhatIsThis';
import HowDoesItWork from "./HowDoesItWork";
import WhoCanRequest from "./WhoCanRequest";
import CallToDevs from "./CallToDevs";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router'

const Home = () => {

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
      <WhatIsThis
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        />
      <HowDoesItWork
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        />
      <WhoCanRequest
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        />
      {/* <CallToActions 
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        /> */}
      <CallToValidators  
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        />
      <CallToDevs
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
