
import React, { useEffect } from "react";
import Hero from "./Hero";
import CallToActions from "./CallToActions";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router'
type Props = {
  account_id: string;
};

const Home = (props: Props) => {
  const { account_id } = props;
  const route = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (session && session.id != "") route.push("/dashboard");
  }, [session]);

  return (
    <>
      <Hero />
      <CallToActions />
    </>
  );
};

export default Home;
