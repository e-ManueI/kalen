import Title from "@/app/components/text/title";
import FullScreenWrapper from "@/app/components/wrapper/full-screen-wrapper";
import { LoginForm } from "@/app/containers/auth/login-form";
import React from "react";

function Login() {
  return (
    <FullScreenWrapper className="space-y-8">
      <Title>Care Connect Login</Title>
      <LoginForm />
    </FullScreenWrapper>
  );
}

export default Login;
