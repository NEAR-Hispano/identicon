import * as React from "react";
import { Box, Link, Text, Heading } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { CloseIcon, ArrowBackIcon } from '@chakra-ui/icons'

const HelpLink = (props: any) => {
  const { label, xref } = props;
  return (
    <Box mb={4}>
      &gt; &nbsp;
      <Link href={xref} isExternal color="blue" pl={2}>
        {label} 
      </Link>
    </Box>
  )
}

const Helpbar = (props: any) => {
  return(
    <div>
      <Heading size="xxs" mb="1rem">Un poco de ayuda de tus amigos</Heading>
      <HelpLink label="Necesitas mas info ?" xref="a" />
      <HelpLink label="Que es una verficación de la Fe de vida ?" xref="b" />
      <HelpLink label="Cual es la diferencia entre remota y presencial ?" xref="b" />
    </div>
  )
}

export default Helpbar;