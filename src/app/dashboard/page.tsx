"use client";

import { AppContainer } from "@/components/app-container";
import { useUser } from "@/context/app-context";
import { useColorSchema } from "@/hooks/use-color-schema";
import { FormProvider, useForm } from "react-hook-form";

const Dashboard = () => {
  const fForm = useForm();
  const { user, updateUser } = useUser();
  const { getColorSchemaColors, schema, mounted, getColorSchemaList } = useColorSchema();

  return (
    <FormProvider {...fForm}>
      <AppContainer title="Dashboard">
        <h1></h1>
      </AppContainer>
    </FormProvider>
  );
};

export default Dashboard;
