import React, { useEffect } from "react";
import { Container, Flex, Heading, Spacer, Text, IconButton, Box } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td,TableCaption, TableContainer } from '@chakra-ui/react';


export default function PersonalData(props) {
  const { data } = props;
  
  function Row(props) {
    const { label, content } = props;
    return <Tr>
      <Td>{label}</Td>
      <Td><b>{content}</b></Td>
    </Tr>
  }

  return (
    <>
        {(data) &&
          <>
            <Text ml={0} fontSize="sm" fontWeight="bold">DATOS PERSONALES A VALIDAR</Text>
            <Table variant="simple" colorScheme="teal">
              <Row label="Nombre(s) y Apellido(s)" content={data.full_name} />
              <Row label="Pais, Doc y Número" content={data.subject_id} />
              <Row label="Fecha de Nacimiento" content={data.info.birthday} />
              <Row label="Sexo" content={data.info.sex} />
              <Row label="Móvil" content={data.info.phone} />
              <Row label="Email" content={data.info.email} />
            </Table>
          </>
        }
    </>
  );
}
