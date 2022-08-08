
import * as React from "react";
import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";

export const Navbar = (props: any) => {
  const shadow = props.shadow ? "0px 2px 8px #d2d2d2" : "none";
  console.log("Navbar", props, shadow);
  return (
    <Box as="section" 
      width="100%"
      pb={{ base: "4", md: "4" }} 
      pt={{ base: "4", md: "4" }}
      px={6} 
      bg="#fefefe" 
      boxShadow={shadow}>
      {props.children}
    </Box>
  );
}
