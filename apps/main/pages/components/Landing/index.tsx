import React from 'react';
import { Container, Show, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { colors } from '../../../constants/colors';
import Hero from './Hero'
import ThreeTierPricing from './StartersSection'

type Props = {
  shortVersion?: boolean
}

const LandingPage = (props: Props) => {
  return (
    <>
    <Container maxW="100%" bg="white">
      <Container maxW="container.2xl" id="dashboard">
        <Hero />                
      </Container>
      {/* <ThreeTierPricing /> */}
    </Container>
    <Container maxW="container.xl">
      <ThreeTierPricing />
    </Container>
  </>
);
};

export default LandingPage;
