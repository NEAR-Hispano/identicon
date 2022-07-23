import React, { useEffect } from "react";
import {
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Show,
  Select,
  FormErrorMessage,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useToast
} from "@chakra-ui/react";
import { colors } from "../../constants/colors";
import { useFormik, Form, Formik } from "formik";
import { PersonalInfoData } from "../../models/accounts";
import { useUpdateAccount, useGetAccount } from "../../hooks/accounts";
import { useStore as useAuth } from "../../stores/authSession";
import {useRouter} from 'next/router'
type Props = {
  account_id: string;
};

const PersonalInfo = (props: Props) => {
  const route = useRouter();
  const { account_id } = props;
  const toast = useToast();
 
  const { session } = useAuth();
  const { data, isLoading } = useGetAccount(session);
  const { updateAccount, isUpdating, isUpdateSuccess, updateData } =
    useUpdateAccount(session);
    const initialValuesSignUp: PersonalInfoData = {
      full_name: "",
      birthday: "",
      age: 0,
      sex: "M",
      country: "",
      region: "",
      comune: "",
      address: "",
      coordinates: "",
      languages: "",
      phone: "",
      preferred: "",
      health: "",
      extras: "",
      email: "",
      dni:""
    };
  const form = useFormik({
    initialValues: initialValuesSignUp,
    validateOnMount: true,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: PersonalInfoData) => {
      console.log("calling update account");
      const result = await updateAccount({
        uid: session.id,
        personal_info: values,
      });
      console.log("update result:", result);
    },
  });

  useEffect(()=> {
    if (!isLoading && data && data.personal_info) {
      form.setValues(data.personal_info);
    }
  }, [data]);
  
  useEffect(() => {
    if (isUpdateSuccess) {
      toast({
        title: "Información personal actualizada",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      setTimeout(() => {
        route.push("/dashboard");
      }, 3000);
    }
  }, [isUpdateSuccess])

  return (
    <>
      <Stack maxWidth={600} margin="auto" spacing={8} marginTop={8}>
        <FormControl>
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
            !!form.values.dni &&
            !!form.touched.dni &&
            !!form.errors.dni
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
        </FormControl>

      <FormControl>
        <Button
          mr={3}
          onClick={() => route.push("/dashboard")}
        >
          Volver
        </Button>
        <Button
          colorScheme="indigo"
          mr={3}
          onClick={(e: any) => { form.handleSubmit(e); }}
        >
          Guardar
        </Button>
      </FormControl>
      </Stack>
    </>
  );
};

export default PersonalInfo;
