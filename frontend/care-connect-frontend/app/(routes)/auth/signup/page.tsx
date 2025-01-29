import Title from "@/app/components/text/title";
import FullScreenWrapper from "@/app/components/wrapper/full-screen-wrapper";
import { SignupForm } from "@/app/containers/auth/signup-form";
import React from "react";

function Register() {
  return (
    <FullScreenWrapper className="space-y-8">
      <Title>Care Connect Signup</Title>
      <SignupForm> </SignupForm>
    </FullScreenWrapper>
  );
}

export default Register;
