import React from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td,TableCaption, TableContainer } from '@chakra-ui/react';
import { Loading } from '../../components/Loading';
import { stateDescription } from "../../constants/states";

// Todo; move to utils file
//From here ->
const langDescriptions = {
  'ar': 'Castellano'
}

const resultDescriptions = {
  null: 'Aún no hay resultados',
  'Approved': 'Aprobado' 
}

const getLangDescription = (str: string) => {
  let result = null;
  Object.entries(langDescriptions).find(([key, value]) => {
    if (key == str) {
      result = value;
      return true;
    }

    return false;
  });
  return result;
}
// <- to here

// Todo: create a new componenet file (components file) or use a chakra component
function Row(props: any) {
  const { label, content } = props;
  return <Tr>
    <Td>{label}</Td>
    <Td fontSize="md">{content}</Td>
  </Tr>
}


const PersonalData = (props: any) => {
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
      <Row label="Preferencias" content={"Se verificara usando '" + data.personal_info.preferred +"' al móvil "+data.personal_info.phone} />
      <Row label="Idiomas" content={data.personal_info.languages || getLangDescription(data.personal_info.country) }/>
      <Row label="Debe comenzar" content={data.must_start_utc} />
      <Row label="Debe finalizar" content={"Antes de "+data.must_end_utc} />
    </Table>
  );
}

export default PersonalData;
