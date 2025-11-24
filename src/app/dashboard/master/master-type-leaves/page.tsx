"use client";

import { useDatatable } from "@/hooks/use-datatable";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DataTable } from "@/components/data-table";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { activateTypeleave, deleteTypeleave, getTypeLeaveById, getTypeleaves } from "./api/master-position-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { columnsMasterPositions, formSchemaPosition } from "./utils";
import FormRole from "./components/FormRole";
import * as z from "zod";
import { createInputOptions, generateErrorMessage, isEmpty, toCapitalized } from "@/utils";
import DetailRole from "./components/DetailRole";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";

const MasterPosition = () => {
  const { invalidate } = useAppRefreshQuery();
  const fForm = useForm();

  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

  const mutationGetDetailTypeLeave = useMutation({
    mutationFn: getTypeLeaveById,
  });

  // const permissions = usePermissions();

  const {
    data: company,
    isLoading,
    currentState,
    setCurrentState,
  } = useDatatable({
    queryKey: "type-leaves",
    queryFn: getTypeleaves,
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
    console.log({ row });
    if (!row) return;

    mutationGetDetailTypeLeave.mutate(row.id_typeleave, {
      onSuccess: (res) => {
        Object.entries(res.data).forEach(([key, value]) => {
          fForm.setValue(key, value);
        });

        fForm.setValue("status", createInputOptions(toCapitalized(row.status), row.status));
        dDetail.handleOpen();
      },
      onError: (err) => {
        const message = generateErrorMessage(err);
        toastAlert.errorList(message);
      },
    });
  };

  const handleClickEdit = (row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });
    fForm.setValue("status", createInputOptions(toCapitalized(row.status), row.status));
    fForm.setValue("gender_specific", createInputOptions(toCapitalized(row.gender_specific), row.gender_specific));
    dDialog.handleOpen();
  };

  const mutationActive = useMutation({
    mutationFn: activateTypeleave,
  });

  const mutationDeactive = useMutation({
    mutationFn: deleteTypeleave,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    //@ts-ignore
    const mutation = isEmpty(row.deleted_at) ? mutationDeactive : mutationActive;

    mutation.mutate(
      { id_typeleave: row.id_typeleave },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["type-leaves"]]);
          dConfirm.handleClose();
        },
        onError: (err) => {
          toastAlert.error(err.message || "Gagal ubah status");
        },
      }
    );
  };

  return (
    <FormProvider {...fForm}>
      <DataTable
        isLoading={isLoading}
        data={company?.data?.data || []}
        columns={columnsMasterPositions({
          onClickData: (row) => {
            Object.entries(row.original).forEach(([key, value]) => {
              //@ts-ignore
              fForm.setValue(key, value);
            });
            dConfirm.handleOpen();

            console.log({ row });
          },
          onClickDetail: (row) => {
            handleClickDetail(row.original);
          },
          onClickEdit: (row) => {
            handleClickEdit(row.original);
            console.log({ row });
          },
        })}
        count={company?.data?.total || 0}
        currentState={currentState}
        setCurrentState={handleStateChange}
        withSearch={true}
        dialogHandler={dDialog}
      />

      <FormRole dialogHandler={dDialog} />
      <DetailRole dialogHandler={dDetail} />

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

export default MasterPosition;
