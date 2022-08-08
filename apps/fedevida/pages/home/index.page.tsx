
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
import Footer from "./Footer";
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
      <div id="que-es">
        <WhatIsThis
          disclosureSignup={disclosureSignup}
          disclosureLogin={disclosureLogin}
          />
      </div>
      <div id="como-funciona">
        <HowDoesItWork
          id="como-funciona"
          disclosureSignup={disclosureSignup}
          disclosureLogin={disclosureLogin}
          />
      </div>
      <div id="quienes-pueden-solicitar">
        <WhoCanRequest
          disclosureSignup={disclosureSignup}
          disclosureLogin={disclosureLogin}
          />
      </div>
      <div id="unete-a-validadores">
        <CallToValidators  
          disclosureSignup={disclosureSignup}
          disclosureLogin={disclosureLogin}
          />
      </div>
      <div id="eres-desarrollador">
        <CallToDevs
          disclosureSignup={disclosureSignup}
          disclosureLogin={disclosureLogin}
          />
      </div>
      <Footer/>
      
      <Header 
        disclosureSignup={disclosureSignup}
        disclosureLogin={disclosureLogin}
        />
    </>
  );
};

export default Home;
