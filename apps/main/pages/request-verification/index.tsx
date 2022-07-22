import React, { useEffect } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useFormik, Form, Formik } from "formik";
import { PersonalInfoData } from "../../models/accounts";
import { RequestVerificationData } from "../../models/verifications";
import { useRequestVerification } from "../../hooks/verifications";
import { useStore as useAuth } from "../../stores/authSession";
import { useRouter } from "next/router";
import schemaValidation from "./schemaValidation";
import { useGetAccount } from "../../hooks/accounts";
type Props = {
  account_id: string;
};

const RequestVerification = (props: Props) => {
  const route = useRouter();
  const { account_id } = props;
  const toast = useToast();
  const { session } = useAuth();
  const { data, isLoading } = useGetAccount(session);
  //   const { data, isLoading } = useGetAccount(session);
  const { requestVerification, isProcessing, isRequestSuccess, requestData } =
    useRequestVerification(session);
  const initialValues: RequestVerificationData = {
    full_name: "",
    birthday: "",
    country: "ar",
    address: "",
    languages: "",
    phone: "",
    preferred: "",
    health: "",
    extras: "",
    email: "",
    dni: "",
    type: "ProofOfLife",
    verificationType: "remote",
    requestFor: "me",
  };
  const form = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    validateOnMount: true,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: RequestVerificationData) => {
      console.log("calling request verification", {subject_id: data.subject_id, ...values});
      // const personal_info = {
      //   full_name: values.full_name,
      //   birthday: values.birthday,
      //   country: values.country,
      //   address: values.address,
      //   phone: values.phone,
      //   email: values.email,
      //   dni: values.dni,
      // }
      const result = await requestVerification({subject_id: data.subject_id, ...values});
      console.log("result:", result);
    },
  });

  useEffect(() => {
    if (isRequestSuccess) {
      toast({
        title: "Solicitud de verificación procesada exitosamente",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
    }
  }, [isRequestSuccess]);

  return (
    <>
      <Stack maxWidth="96%" margin="auto" spacing={5} marginTop={5} p="4" border="1px solid red">
        <FormControl
          isInvalid={
            !!form.values.requestFor &&
            !!form.touched.requestFor &&
            !!form.errors.requestFor
          }
        >
          <FormLabel>
            ¿ La fé de vida es para tí o para otra persona ?
          </FormLabel>
          <RadioGroup
            id="requestFor"
            value={form.values.requestFor}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          >
            <Stack spacing={4} direction="row">
              <Radio value="me">Para mí</Radio>
              <Radio value="other">Para otra persona</Radio>
            </Stack>
          </RadioGroup>
          <FormErrorMessage>{form.errors.requestFor}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.verificationType &&
            !!form.touched.verificationType &&
            !!form.errors.verificationType
          }
        >
          <FormLabel>¿ Que tipo de verficación necesítas ?</FormLabel>
          <RadioGroup
            id="verificationType"
            value={form.values.verificationType}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          >
            <Stack spacing={4} direction="row">
              <Radio value="remote">Remota, por WhatsApp o Telegram</Radio>
              <Radio value="onSite">Presencial, con visita al domicilio</Radio>
            </Stack>
          </RadioGroup>
          <FormErrorMessage>{form.errors.verificationType}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.full_name &&
            !!form.touched.full_name &&
            !!form.errors.full_name
          }
        >
          <FormLabel>Nombre Completo</FormLabel>
          <Input
            id="full_name"
            name="full_name"
            placeholder="Juan Perez"
            value={form.values.full_name}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          />
          <FormErrorMessage>{form.errors.full_name}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.birthday &&
            !!form.touched.birthday &&
            !!form.errors.birthday
          }
        >
          <FormLabel>Fecha de Nacimiento</FormLabel>
          <Input
            id="birthday"
            name="birthday"
            placeholder="01/01/1979"
            value={form.values.birthday}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          />

          <FormErrorMessage>{form.errors.birthday}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.country &&
            !!form.touched.country &&
            !!form.errors.country
          }
        >
          <FormLabel>Pais</FormLabel>
          <Select
            id="country"
            name="country"
            placeholder="Seleccione un país"
            value={form.values.country}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          >
            <option value="ar">Argentina</option>
            <option value="mx">Mexico</option>
            <option value="ve">Venezuela</option>
            <option value="bo">Bolivia</option>
            <option value="cl">Chile</option>
            <option value="uy">Uruguay</option>
            <option value="ve">Peru</option>
          </Select>
          <FormErrorMessage>{form.errors.country}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.region &&
            !!form.touched.region &&
            !!form.errors.region
          }
        >
          <FormLabel>Provincia</FormLabel>
          <Input
            id="region"
            name="region"
            placeholder="Tucuman"
            value={form.values.region}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          />
          <FormErrorMessage>{form.errors.region}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.comune &&
            !!form.touched.comune &&
            !!form.errors.comune
          }
        >
          <FormLabel>Ciudad</FormLabel>
          <Input
            id="comune"
            name="comune"
            placeholder="Tafi del Valle"
            value={form.values.comune}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          />
          <FormErrorMessage>{form.errors.region}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.address &&
            !!form.touched.address &&
            !!form.errors.address
          }
        >
          <FormLabel>Dirección</FormLabel>
          <Input
            id="address"
            name="address"
            placeholder="Av. Juan Calchaquí 400"
            value={form.values.address}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          />
          <FormErrorMessage>{form.errors.address}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.phone && !!form.touched.phone && !!form.errors.phone
          }
        >
          <FormLabel>Teléfono</FormLabel>
          <Input
            id="phone"
            name="phone"
            placeholder="011111111111"
            value={form.values.phone}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          />
          <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            !!form.values.dni && !!form.touched.dni && !!form.errors.dni
          }
        >
          <FormLabel>DNI</FormLabel>
          <Input
            id="dni"
            name="dni"
            placeholder="Número"
            value={form.values.dni}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          />
          <FormErrorMessage>{form.errors.dni}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={
            !!form.values.email && !!form.touched.email && !!form.errors.email
          }
        >
          <FormLabel>Email</FormLabel>
          <Input
            id="email"
            name="email"
            placeholder="my@email.com"
            value={form.values.email}
            onPaste={form.handleChange}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
          />
          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <Button mr={3} onClick={() => route.push("/")}>
            Cancelar
          </Button>
          <Button
            colorScheme="indigo"
            mr={3}
            onClick={(e: any) => form.handleSubmit(e)}
          >
            Solicítala ahora
          </Button>
        </FormControl>
      </Stack>
    </>
  );
};

export default RequestVerification;
