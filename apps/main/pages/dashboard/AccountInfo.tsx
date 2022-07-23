import React, { useEffect } from "react";
import { Text, Box, HStack, Tag } from "@chakra-ui/react";
import { useStore } from "../../stores/authSession";
import { useGetAccount } from "../../hooks/accounts";

const AccountInfo = (props) => {
  const { account } = props;
  const { session } = useStore();
  const { data, isLoading } = useGetAccount(session);
  console.log("AccountInfo", props);

  if (isLoading) return <></>;
  return (
    <Box>
      <HStack pb="1">
         <Text fontSize="sm" color="indigo">Identicon</Text>
         <Text fontSize="sm">/ Tu cuenta</Text>
      </HStack>
      <Text fontSize="2xl" py={0} lineHeight="1.2em">
        {account && account.personal_info
          ? account.personal_info.full_name
          : "Aún sin nombre"}
      </Text>
      <HStack>
         <Text fontSize="sm">
           {account && account.verified
             ? `Verificado:`
             : `No verificado`}
         </Text>
         <Text size="sm" color='blue'>
           {account && account.personal_info
            ? account.subject_id
            : "?"}
          </Text>
       </HStack>
    </Box>
  );
};

export default AccountInfo;
