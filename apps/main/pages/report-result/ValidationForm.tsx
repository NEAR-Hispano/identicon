import React, { useEffect } from "react";
import { Button, FormControl, FormErrorMessage, FormLabel,
  Input, Select, Textarea, Spacer, Flex, 
  Text, useToast } from "@chakra-ui/react";
import { useFormik, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { ValidationResultData } from "../../models/validations";
import { useReportResult } from "../../hooks/tasks";
import { useStore as useAuth } from "../../stores/authSession";


export default function ValidationForm(props) {
  const { data } = props;
  const router = useRouter();
  const { session } = useAuth();
  const toast = useToast();
  const { reportResult, isProcessing, isRequestSuccess } = useReportResult(session);

  useEffect(() => {
    if (isProcessing) {
      toast({
        title: "EStamos enviando tu resultado ...",
        status: "success",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
    }
  }, [isProcessing]);
  
  useEffect(() => {
    if (isRequestSuccess) {
      toast({
        title: "Enviamos tu resultado",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000)
    }
  }, [isRequestSuccess]);
  

  const initialValues: ValidationResultData = {
    uid: data.uid,
    result: "",
    matches: "0",
    remarks: "",
    contents: "",
  };

  const form = useFormik({
    initialValues: initialValues,
    //validationSchema: schemaValidation,
    validateOnMount: true,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: ValidationResultData) => {
      //alert(JSON.stringify(values, null, 2));
      const result = await reportResult({...values});
      alert(JSON.stringify(result, null, 2));
    },
  });

  return (
    <>
      {(data) &&
        <>
          <FormControl
            mt={6}
            isInvalid={
              !!form.values.matches &&
              !!form.touched.matches &&
              !!form.errors.matches
            }
            >
            <FormLabel>
              ¿ Coinciden los datos personales con los indicados 
              en su Documento de Identidad ?
            </FormLabel>
            <Select
              id="matches"
              name="matches"
              value={form.values.matches}
              onPaste={form.handleChange}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              >
              <option value="0">NO coinciden</option>
              <option value="1">SI coinciden</option>
            </Select>
            <FormErrorMessage>{form.errors.matches}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              !!form.values.result &&
              !!form.touched.result &&
              !!form.errors.result
            }
            >
            <FormLabel>Conclusión</FormLabel>
            <Select
              id="result"
              name="result"
              placeholder="Selecciona el resultado"
              value={form.values.result}
              onPaste={form.handleChange}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              >
              <option value="WillNotDo">No lo haré</option>
              <option value="NotPossible">No es posible realizar</option>
              <option value="Rejected">Rechazado</option>
              <option value="Approved">Aprobado</option>
            </Select>
            <FormErrorMessage>{form.errors.result}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              !!form.values.remarks &&
              !!form.touched.remarks &&
              !!form.errors.remarks
            }
            >
            <FormLabel>Comentarios</FormLabel>
            <Textarea
              id="remarks"
              name="remarks"
              value={form.values.remarks}
              onPaste={form.handleChange}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
            />
            <FormErrorMessage>{form.errors.remarks}</FormErrorMessage>
          </FormControl>

          <FormControl pt={8} pb={6}>
            <Flex>
              <Button colorScheme="gray" borderRadius="3xl" mr={3} 
                onClick={() => router.push("/")}>
                <b>&lt;</b> &nbsp; Lo haré después !
              </Button>
              <Spacer/>
              <Button colorScheme="indigo"  mr={3} borderRadius="3xl"
                onClick={(e: any) => form.handleSubmit(e)}>
                Envía tu reporte !
              </Button>
            </Flex>
          </FormControl>
        </>
      }
    </>
  );
}
