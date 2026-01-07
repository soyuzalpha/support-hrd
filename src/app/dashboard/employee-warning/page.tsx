"use client";

import { AppContainer } from "@/components/app-container";
import CardMaster from "@/components/CardMaster";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { DataTable } from "@/components/data-table";
import { useDatatable } from "@/hooks/use-datatable";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { createInputOptions, isEmpty } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { restoreEmployeeWarning, deleteEmployeeWarning, getEmployeeWarnings } from "./api/employee-warning-service";
import { columnsEmployeeWarning } from "./utils";
import FormLeaves from "./components/FormEmployeeWarning";
import { toastAlert } from "@/lib/toast";
import LeaveRequestDetailCard from "./components/DetailLeave";

const Page = () => {
  const fForm = useForm();
  const { invalidate } = useAppRefreshQuery();
  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

  const {
    data: company,
    isLoading,
    currentState,
    setCurrentState,
  } = useDatatable({
    queryKey: "employee-warning",
    queryFn: getEmployeeWarnings,
    initialParams: {
      page: 1,
      limit: 10,
      searchKey: "",
    },
  });

  const handleStateChange = React.useCallback(
    (newState) => {
      setCurrentState(newState);
    },
    [setCurrentState]
  );

  const handleClickDetail = (row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });
    dDetail.handleOpen();
  };

  const handleClickEdit = (row: any) => {
    console.log({ row });
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });

    fForm.setValue("id_user", createInputOptions(row.employee_data.user_data.name, row.employee_data.user_data.id));
    fForm.setValue("warning_level", createInputOptions(row.warning_level, row.warning_level));
    dDialog.handleOpen();
  };

  const mutationActive = useMutation({
    mutationFn: restoreEmployeeWarning,
  });

  const mutationDeactive = useMutation({
    mutationFn: deleteEmployeeWarning,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    const mutation = isEmpty(row?.deleted_at) ? mutationDeactive : mutationActive;

    mutation.mutate(
      { id_employee_warning: row.id_employee_warning },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["employee-warning"]]);
          dConfirm.handleClose();
        },
        onError: (err) => {
          toastAlert.error(err.message || "Gagal ubah status");
        },
      }
    );
  };
  return (
    <AppContainer title="Employee Warning">
      <FormProvider {...fForm}>
        <DataTable
          isLoading={isLoading}
          data={company?.data?.data || []}
          columns={columnsEmployeeWarning({
            onClickData: (row) => {
              Object.entries(row.original).forEach(([key, value]) => {
                //@ts-ignore
                fForm.setValue(key, value);
              });
              dConfirm.handleOpen();
            },
            onClickDetail: (row) => {
              handleClickDetail(row.original);
            },
            onClickEdit: (row) => {
              handleClickEdit(row.original);
            },
          })}
          count={company?.data?.total || 0}
          currentState={currentState}
          setCurrentState={handleStateChange}
          withSearch={true}
          dialogHandler={dDialog}
          listCard={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {company?.data?.data?.map((item, index) => (
                <CardMaster
                  key={index}
                  title={item?.employee_data?.full_name}
                  description={item?.useer?.email}
                  item={item}
                  onClickDetail={() => {
                    handleClickDetail(item);
                  }}
                  onClickEdit={() => {
                    handleClickEdit(item);
                  }}
                  onClickAction={() => {
                    Object.entries(item).forEach(([key, value]) => {
                      //@ts-ignore
                      fForm.setValue(key, value);
                    });
                    dConfirm.handleOpen();
                  }}
                  children={<></>}
                />
              ))}
            </div>
          }
        />

        <FormLeaves dialogHandler={dDialog} />
        <LeaveRequestDetailCard dialogHandler={dDetail} />

        <ConfirmationDialog
          onConfirm={() => handleClickChangeStatus()}
          open={dConfirm.open}
          cancelLabel="Cancel"
          isLoading={mutationActive.isPending || mutationDeactive.isPending}
          title="Change Status"
          onCancel={dConfirm.handleClose}
        />
      </FormProvider>
    </AppContainer>
  );
};

export default Page;
