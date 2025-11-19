"use client";

import { AppContainer } from "@/components/app-container";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { useColorSchema } from "@/hooks/use-color-schema";
import React from "react";

const Dashboard = () => {
  const { getColorSchemaColors, schema, mounted, getColorSchemaList } = useColorSchema();
  console.log({ colors: getColorSchemaColors, schema, mounted, getColorSchemaList });

  return (
    <AppContainer title="Dashboard">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4  md:gap-6">
            <SectionCards />
            <div className="">
              <ChartAreaInteractive />
            </div>
            {/* <DataTable data={data} /> */}
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default Dashboard;
