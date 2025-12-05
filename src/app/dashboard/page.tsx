"use client";

import { AppContainer } from "@/components/app-container";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { useUser } from "@/context/app-context";
import { useColorSchema } from "@/hooks/use-color-schema";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getEmployeeByUser } from "./master/master-employee/api/master-position-service";
import EmployeeHeader from "@/components/employee/employee-header";
import PersonalInfoSection from "@/components/employee/personal-info-section";
import ContactsSection from "@/components/employee/contacts-section";
import FamilySection from "@/components/employee/family-section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ActivityLogsSection from "@/components/employee/activity-logs-section";
import { FormProvider, useForm } from "react-hook-form";
import { isEmpty } from "@/utils";
import LoadingLayer from "@/components/loading";
import { getUserById } from "./master/master-user/api/master-position-service";
import { Spinner } from "@/components/ui/spinner";
import FormEmployee from "./master/master-employee/components/FormRole";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { LeaveQuotaList } from "@/components/LeaveQuotaDisplay";

const Dashboard = () => {
  const fForm = useForm();
  const { user, updateUser } = useUser();
  const { getColorSchemaColors, schema, mounted, getColorSchemaList } = useColorSchema();
  // console.log({ colors: getColorSchemaColors, schema, mounted, getColorSchemaList, user });

  const mutationGetUser = useMutation({
    mutationFn: getUserById,
  });

  const userDetail = useMutation({
    mutationFn: getEmployeeByUser,
  });

  useEffect(() => {
    if (user) {
      mutationGetUser.mutate(user.id_user, {
        onSuccess: (res) => {
          updateUser({
            ...user,
            userDatas: res?.data,
          });

          if (user) {
            userDetail.mutate(user.id_user, {
              onSuccess: (res) => {
                fForm.setValue("employee_data", res?.data);
              },
            });
          }
        },
        onError: (err) => {
          console.log({ err });
        },
      });
    }
  }, [user?.id_user]);

  return (
    <FormProvider {...fForm}>
      <LoadingLayer isLoading={mutationGetUser.isPending || userDetail.isPending} />

      <AppContainer title="Dashboard">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {/* Header Section */}
            <EmployeeHeader employee={fForm.getValues("employee_data")} />

            {/* Main Content Grid */}
            <div className="grid gap-6 mt-8 lg:grid-cols-3">
              {/* Left Column - Personal Info */}
              <div className="lg:col-span-2 space-y-6">
                <PersonalInfoSection employee={fForm.getValues("employee_data")} />
                <ContactsSection contacts={fForm.getValues("employee_data")?.contacts} />
                <FamilySection family={fForm.getValues("employee_data")?.family} />
              </div>

              {/* Right Column - Quick Info */}
              <div className="space-y-6">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg">User Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Employee Number</p>
                      <p className="font-semibold">{fForm.getValues("employee_data")?.user?.employee_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-semibold">{fForm.getValues("employee_data")?.user?.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-semibold">{fForm.getValues("employee_data")?.user?.company?.name_company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Position</p>
                      <p className="font-semibold">{fForm.getValues("employee_data")?.user?.position?.name_position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Division</p>
                      <p className="font-semibold">{fForm.getValues("employee_data")?.user?.division?.name_division}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Identities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">NIK</p>
                      <p className="font-mono text-sm">{fForm.getValues("employee_data")?.nik}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">NPWP</p>
                      <p className="font-mono text-sm">{fForm.getValues("employee_data")?.npwp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">BPJS Kesehatan</p>
                      <p className="font-mono text-sm">{fForm.getValues("employee_data")?.bpjs_kesehatan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">BPJS Ketenagakerjaan</p>
                      <p className="font-mono text-sm">{fForm.getValues("employee_data")?.bpjs_ketenagakerjaan}</p>
                    </div>
                  </CardContent>
                </Card>

                <LeaveQuotaList data={user?.userDatas?.leave_quotas} />
              </div>
            </div>

            {/* Activity Logs Section */}
            {/* <div className="mt-8">
            <ActivityLogsSection logs={fForm.getValues("employee_data")?.logs} />
          </div> */}

            {/* <div className="flex flex-col gap-4  md:gap-6">
            <SectionCards />
            <div className="">
              <ChartAreaInteractive />
            </div>
          </div> */}
          </div>
        </div>
      </AppContainer>
    </FormProvider>
  );
};

export default Dashboard;

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
