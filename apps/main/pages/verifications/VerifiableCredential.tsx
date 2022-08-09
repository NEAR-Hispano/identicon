import React, { useEffect } from "react";
import { Loading } from "../../components/Loading";
import { useGetCredentialMetadata } from "../../hooks/credentials";
import { Image } from "@chakra-ui/react";
const VerifiableCredential = (props: any) => {
  const { token_id } = props;
  const { data: credential, isLoading } = useGetCredentialMetadata(
    token_id
  );

  if (!token_id || !credential || isLoading) return <Loading>Cargando credencial</Loading>;

  return (
    <Image src={credential.metadata.media} alt="Credential" boxSize={"50px"} />
  );
};

export default VerifiableCredential;
