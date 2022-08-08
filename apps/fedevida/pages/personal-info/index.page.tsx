import React from "react";
import PersonalInfo from "./PersonalInfo";
import { useStore } from "../../stores/authSession";
export default function PersonalInfoContainer() {
  const { session } = useStore();
  return (
    <>
      <PersonalInfo account_id={session.id} />
    </>
  );
}
