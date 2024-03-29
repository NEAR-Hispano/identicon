import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PageLoading from "../../components/PageLoading";

export default function ProjectDetailsContainer() {
  const router = useRouter();
  const toast = useToast();
  const id = router.query && router.query.id ? router.query.id : "";

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoaded(true);
    })();
  }, [ toast]);

  if (!id || !isLoaded) return <PageLoading />;

  return (
    <>
    </>
  );
}
