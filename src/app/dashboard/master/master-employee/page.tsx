"use client";

import { useDatatable } from "@/hooks/use-datatable";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DataTable } from "@/components/data-table";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { activateEmployee, deactivateEmployee, getEmployeeById, getEmployees } from "./api/master-position-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { columnsMasterPositions, formSchemaPosition } from "./utils";
import * as z from "zod";
import { createInputOptions, generateErrorMessage, isEmpty, toCapitalized } from "@/utils";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import FormRole from "./components/FormRole";
import DetailRole from "./components/DetailRole";
import CardMaster from "@/components/CardMaster";

const MasterEmployee = () => {
  const { invalidate } = useAppRefreshQuery();
  const fForm = useForm();

  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

  const mutationDetailEmploye = useMutation({
    mutationFn: getEmployeeById,
  });
  // const permissions = usePermissions();

  const {
    data: company,
    isLoading,
    currentState,
    setCurrentState,
  } = useDatatable({
    queryKey: "employees",
    queryFn: getEmployees,
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
    if (!row.id_employee) return;

    mutationDetailEmploye.mutate(row.id_employee, {
      onSuccess: (res) => {
        Object.entries(res.data).forEach(([key, value]) => {
          fForm.setValue(key, value);
        });

        dDetail.handleOpen();
      },
      onError: (err) => {
        const message = generateErrorMessage(err);
        toastAlert.error(message);
      },
    });
  };

  const handleClickEdit = (row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });
    fForm.setValue("id_user", createInputOptions(row?.user?.name, row.user.id));
    fForm.setValue("gender", createInputOptions(toCapitalized(row?.gender), row.gender));
    fForm.setValue("religion", createInputOptions(toCapitalized(row?.religion), row.religion));
    fForm.setValue("marital_status", createInputOptions(toCapitalized(row?.marital_status), row.marital_status));
    fForm.setValue("blood_type", createInputOptions(row?.blood_type, row.blood_type));

    fForm.setValue(
      "family",
      row.family?.map((item) => ({
        ...item,
        relationship: createInputOptions(toCapitalized(item.relationship), item.relationship),
      }))
    );

    fForm.setValue("list_documents", row.documents);

    dDialog.handleOpen();
  };

  const mutationActive = useMutation({
    mutationFn: activateEmployee,
  });

  const mutationDeactive = useMutation({
    mutationFn: deactivateEmployee,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    //@ts-ignore
    const mutation = isEmpty(row.deleted_at) ? mutationDeactive : mutationActive;

    mutation.mutate(
      { id_employee: row.id_employee },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["employees"]]);
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
                title={item?.full_name}
                description={item?.personal_email}
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

export default MasterEmployee;
