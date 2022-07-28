import React from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td,TableCaption, TableContainer } from '@chakra-ui/react';
import { Loading } from '../../components/Loading';
import { stateDescription } from "../../constants/states";


const langDescriptions = {
  'ar': 'Castellano'
}

const resultDescriptions = {
  null: 'Aún no hay resultados',
}

function Row(props) {
  const { label, content } = props;
  return <Tr>
    <Td>{label}</Td>
    <Td  fontSize="md">{content}</Td>
  </Tr>
}


export const PersonalData = (props) => {
  const { data } = props;

  if (!data) return(
    <Loading>
      Cargando los datos personales
    </Loading>
  )

  return (
    <Table variant="simple" colorScheme="teal" borderRadius="lg">
      <Row label="Para" content={data.personal_info.full_name} />
      <Row label="Pais, Doc y Numero" content={data.subject_id} />
      <Row label="Estado" content={stateDescription([data.state])} />
      <Row label="Preferencias" content={"Se verificara usando '" + data.personal_info.preferred +"' al móvil "+data.personal_info.phone} />
      <Row label="Idiomas" content={data.personal_info.languages || langDescriptions[data.personal_info.country]} />
      <Row label="Debe comenzar" content={data.must_start_utc} />
      <Row label="Debe finalizar" content={"Antes de "+data.must_end_utc} />
      <Row label="Resultado" content={resultDescriptions[data.result]} />
    </Table>
  );
}
