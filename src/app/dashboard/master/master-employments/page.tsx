"use client";

import { useDatatable } from "@/hooks/use-datatable";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { activateEmployment, deleteEmployment, getEmployments } from "./api/master-employements-service";
import { DataTable } from "@/components/data-table";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { createInputOptions, isEmpty, toCapitalized } from "@/utils";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import CardMaster from "@/components/CardMaster";
import { columnsMasterEmployements } from "./utils";
import FormEmployements from "./components/FormEmployments";
import DetailEmployements from "./components/DetailEmployements";

const MasterEmployements = () => {
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
    queryKey: "employements",
    queryFn: getEmployments,
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
    fForm.setValue("status", createInputOptions(toCapitalized(row.status), row.status));
    dDetail.handleOpen();
  };

  const handleClickEdit = (row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });
    fForm.setValue("status", createInputOptions(toCapitalized(row.status), row.status));
    fForm.setValue("id_user", createInputOptions(row.user.name, row.user.id_user));
    fForm.setValue("id_manager", createInputOptions(row.manager.name, row.manager.id));
    fForm.setValue(
      "employment_status",
      createInputOptions(toCapitalized(row.employment_status), row.employment_status)
    );
    dDialog.handleOpen();
  };

  const mutationActive = useMutation({
    mutationFn: activateEmployment,
  });

  const mutationDeactive = useMutation({
    mutationFn: deleteEmployment,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    const mutation = isEmpty(row?.deleted_at) ? mutationDeactive : mutationActive;

    console.log({ row });

    mutation.mutate(
      { id_employment: row.id_employment },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["companys"]]);
          dConfirm.handleClose();
        },
        onError: (err) => {
          toastAlert.error(err.message || "Gagal ubah status");
        },
      }
    );
  };

  console.log({ company });

  return (
    <FormProvider {...fForm}>
      <DataTable
        isLoading={isLoading}
        data={company?.data?.data || []}
        columns={columnsMasterEmployements({
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
          <div className="grid grid-cols-3 gap-3">
            {company?.data?.data?.map((item, index) => (
              <CardMaster
                key={index}
                title={item.user.name}
                description={item.user.email}
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

      <FormEmployements dialogHandler={dDialog} />
      <DetailEmployements dialogHandler={dDetail} />

      <ConfirmationDialog
        onConfirm={() => handleClickChangeStatus()}
        open={dConfirm.open}
        cancelLabel="Cancel"
        isLoading={mutationActive.isPending || mutationDeactive.isPending}
        title="Change Status"
        onCancel={dConfirm.handleClose}
      />
    </FormProvider>
  );
};

export default MasterEmployements;
