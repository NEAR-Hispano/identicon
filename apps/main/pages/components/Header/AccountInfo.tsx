import React, {useEffect} from "react";
import { Text, Box } from "@chakra-ui/react";
import { useStore } from "../../../stores/authSession";
import { useGetAccount } from "../../../hooks/accounts";

const AccountInfo: React.FC<any> = (props) => {
  const {accountData, setAccountData} = props;
  const { session } = useStore();
  const { data, isLoadinAccount } = useGetAccount(session);
  useEffect(()=> {
    if (data) {
        setAccountData(data);
    }
       
  }, [isLoadinAccount, data])

  if (isLoadinAccount) return <></>
  return (
    <Box>
      <Text fontSize="22px" fontWeight="bold">
        {accountData && accountData.personal_info ? accountData.personal_info.full_name : 'NN'}
      </Text>
      <Text fontSize={"14px"} color="blue">
        {accountData && accountData.verified
          ? `Verificado: ${accountData.subject_id}`
          : "No verificado"}
      </Text>
    </Box>
  );
};

export default AccountInfo;
