import React, { useEffect } from "react";
import { Text, Box, HStack } from "@chakra-ui/react";
import { useStore } from "../../../stores/authSession";
import { useGetAccount } from "../../../hooks/accounts";

const AccountInfo: React.FC<any> = (props) => {
  const { accountData, setAccountData } = props;
  const { session } = useStore();
  const { data, isLoading } = useGetAccount(session);
  useEffect(() => {
    if (data) {
      setAccountData(data);
    }
  }, [data]);

  if (isLoading) return <></>;
  return (
    <Box>
      <Text fontSize="22px" fontWeight="bold">
        {accountData && accountData.personal_info
          ? accountData.personal_info.full_name
          : "NN"}
      </Text>
      {accountData &&
       <HStack fontSize={"14px"}>
       <Text>
         {accountData.verified
           ? `Verificado:`
           : `No verificado:`}
       </Text>
       <Text color="blue">{accountData.subject_id} </Text>
     </HStack>
      }
     
    </Box>
  );
};

export default AccountInfo;
