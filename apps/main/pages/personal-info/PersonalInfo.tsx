import React from "react";
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
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { colors } from "../../constants/colors";
import { useFormik } from "formik";
import { PersonalInforData } from "../../models/accounts";
import { useUpdateAccount } from "../../hooks/accounts";
import { useStore } from "../../stores/authSession";
type Props = {
  account_id: string;
};

const PersonalInfo = (props: Props) => {
  const { account_id } = props;
  const initialValuesSignUp: PersonalInforData = {
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
  };
  const { session } = useStore();
  const { updateAccount, isUpdating, isUpdateSuccess, updateData } =
    useUpdateAccount(session);
  const form = useFormik({
    initialValues: initialValuesSignUp,
    validateOnMount: true,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: PersonalInforData) => {
      console.log("calling update account");
      const result = await updateAccount({
        uid: account_id,
        personal_info: values,
      });
      console.log("update result:", result);
    },
  });

  return (
    <>
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
        {/* <FormLabel>Gender</FormLabel>
      <RadioGroup
        defaultValue="M"
        value={form.values.sex}
        onBlur={form.handleBlur}
        onChange={form.handleChange}
      >
        <Stack spacing={4} direction="row">
          <Radio value="M">Male</Radio>
          <Radio value="F">Female</Radio>
          <Radio value="N">N/D</Radio>
        </Stack>
      </RadioGroup> */}
        <FormLabel>Pais</FormLabel>
        <Input
          id="country"
          name="country"
          placeholder="Argentina"
          value={form.values.country}
          onPaste={form.handleChange}
          onBlur={form.handleBlur}
          onChange={form.handleChange}
        />
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
      </FormControl>

      <Button
        colorScheme="blue"
        mr={3}
        onClick={(e: any) => form.handleSubmit(e)}
      >
        Guardar
      </Button>
    </>
  );
};

export default PersonalInfo;
