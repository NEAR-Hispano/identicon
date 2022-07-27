import React, { useEffect } from "react";
import { Alert, AlertIcon, Button, FormControl, FormErrorMessage, FormLabel,
  Input, Radio, RadioGroup, Select, Stack, useToast, Container, Spacer, Flex, 
  Text, Box } from "@chakra-ui/react";
import { useFormik, Form, Formik } from "formik";
import { ValidationResultData } from "../../models/validations";
import { useGetSingleTask } from "../../hooks/tasks";
import { useGetAccount } from "../../hooks/accounts";
import { useStore as useAuth } from "../../stores/authSession";
import { useRouter } from "next/router";
//import schemaValidation from "./schemaValidation";
import Header from './Header';
//import Helpbar from '../../components/Helpbar'
import PersonalData from './PersonalData';
import ValidationForm from "./ValidationForm";

function clone(o) {
  return JSON.parse(JSON.stringify(o))
};

const ReportResult = (props) => {
  const router = useRouter();
  const toast = useToast();
  const { session } = useAuth();
  const uid = router.query && router.query.id ? router.query.id : "";
  
  const account = useGetAccount(session);
  //const account = clone(data);

  const task = useGetSingleTask(uid);
  //const task = clone(data);
  
  const initialValues: ValidationResultData = {
    full_name: "",
    subject_id: "",
    //birthday: "",
    // country: "ar",
    // address: "",
    // languages: "",
    // phone: "",
    // preferred: "",
    // health: "",
    // extras: "",
    // email: "",
    // dni: "",
    // type: "ProofOfLife",
    // verificationType: "Remote",
  };

  // const form = useFormik({
  //   initialValues: initialValues,
  //   //validationSchema: schemaValidation,
  //   //validateOnMount: true,
  //   enableReinitialize: true,
  //   //validateOnBlur: true,
  //   //validateOnChange: true,
  //   onSubmit: async (values: ValidationResultData) => {
  //     console.log("calling request verification", {subject_id: data.subject_id, ...values});
  //     // const personal_info = {
  //     //   full_name: values.full_name,
  //     //   birthday: values.birthday,
  //     //   country: values.country,
  //     //   address: values.address,
  //     //   phone: values.phone,
  //     //   email: values.email,
  //     //   dni: values.dni,
  //     // }
  //     //const result = await requestVerification({subject_id: data.subject_id, ...values});
  //     //console.log("result:", result);
  //   },
  // });

  // useEffect(() => {
  //   if (isRequestSuccess) {
  //     toast({
  //       title: "Solicitud de verificación procesada exitosamente",
  //       status: "success",
  //       duration: 3000,
  //       position: "top-right",
  //       isClosable: true,
  //     });
  //     setTimeout(() => {
  //       router.push("/dashboard");
  //     }, 3000)
  //   }
  // }, [isRequestSuccess]);

  return (
    <>
    {account && account.data && task && task.data &&
      <Header 
        account={account.data} 
        task={task.data}
        shadow={true}/>
    }

    <Container maxW="container.xl" px="2rem">

      <Alert status='warning' borderRadius="lg" mx="auto" my={4}>
        <AlertIcon  boxSize='32px' mr={4}/>
        <Text fontSize="sm">
          Necesitamos que completes estos datos de la persona que será verificada. 
          <br/>Todos serán tratados respetando las leyes de Protección de Datos Personales.
          <br/><b>La verificación puede producirse dentro de las próximas 48 hs según disponibilidad.</b>
        </Text>
      </Alert>

      <Stack 
          width="100%" 
          margin="auto" spacing={5} marginTop={0} pt={6} pb={6} mb={12} px={8} mt={6}
          borderRadius="lg"
          bg="white" >

          {account && account.data && task && task.data &&
            <>
              <PersonalData data={task.data} />

              <ValidationForm data={task.data} />

              {/* <pre>
                {JSON.stringify(task.data,null,2)}
              </pre> */}
            </>
          }
        </Stack>

        {/* <Box width="40%" p={12} px={8}>
          Ayuda aqui 
        </Box> */}
      {/* </Flex> */}

    </Container>
    </>
  );
};

export default ReportResult;
