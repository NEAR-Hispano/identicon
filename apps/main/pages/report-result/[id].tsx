import React, { useEffect } from "react";
import { Alert, AlertIcon,
  IconButton, useToast, Container, Spacer, Flex, 
  Text, Box } from "@chakra-ui/react";
import { useFormik, Form, Formik } from "formik";
import { CloseIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { ValidationResultData } from "../../models/validations";
import { useGetSingleTask } from "../../hooks/tasks";
import { useGetAccount } from "../../hooks/accounts";
import { useStore as useAuth } from "../../stores/authSession";
import { useRouter } from "next/router";
//import schemaValidation from "./schemaValidation";
import { Header } from '../../components/Header';
import { SectionPanel, SectionHeading } from '../../components/Section'
import PersonalData from './PersonalData';
import ValidationForm from "./ValidationForm";
import ValidationStatus from './ValidationStatus';
import { AlertProtectData, AlertValidationInstructions, AlertDone } from "./Alerting";


const ReportResult = (props) => {
  const router = useRouter();
  const toast = useToast();
  const { session } = useAuth();
  const uid = router.query && router.query.id ? router.query.id : "";
  
  const account = useGetAccount(session);

  const task = useGetSingleTask(uid);
  
  const initialValues: ValidationResultData = {
    full_name: "",
    subject_id: "",
  };

  return (
    <>
      <Header 
        isLoading={!(task && task.data)}
        breadcrumb={`/ Fe de vida / Reporte de Validación`}
        title={task && task.data 
          ? `${task.data.full_name}` 
          : ''}
        subtitle={account && account.data 
          ? `Solicitada por ${account.data.personal_info.full_name}` 
          : ''}
        bigImage={`certificate-outline.svg`} >
        <IconButton 
          onClick={() => router.push('/dashboard')}
          borderRadius="full"
          aria-label='Cerrar' 
          icon={<CloseIcon />} />
      </Header>

      <Container maxW="container.xl" px="2rem" pb="4rem">
        <br/>
        <AlertProtectData data={task && task.data} />
        <AlertValidationInstructions data={task && task.data} />
        <AlertDone data={task && task.data} />

        <SectionHeading title="DATOS PERSONALES A VALIDAR" />
        <SectionPanel>
          {task && task.data &&
            <PersonalData data={task.data} />
          }
        </SectionPanel>
        
        <SectionHeading title="RESULTADO DE LA VALIDACIÓN" />
        <SectionPanel>
            <ValidationForm data={task && task.data} />
            <ValidationStatus data={task && task.data} />
        </SectionPanel>

      </Container>

      <hr/>
    </>
  );
};

export default ReportResult;
