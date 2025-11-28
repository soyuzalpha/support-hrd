"use client";

import { useDatatable } from "@/hooks/use-datatable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DataTable } from "@/components/data-table";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { activateDivision, deleteDivision, getDivisions } from "./api/master-position-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { columnsMasterDivision, formSchemaDivision } from "./utils";
import FormRole from "./components/FormRole";
import * as z from "zod";
import { createInputOptions, isEmpty, toCapitalized } from "@/utils";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import DetailRole from "./components/DetailRole";
import CardMaster from "@/components/CardMaster";

const MasterDivision = () => {
  const { invalidate } = useAppRefreshQuery();
  const fForm = useForm<z.infer<typeof formSchemaDivision>>({
    resolver: zodResolver(formSchemaDivision),
    defaultValues: {
      id_division: null,
      name_division: "",
      description_division: "",
      status: { label: "Active", value: "active" },
    },
  });

  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

  // const permissions = usePermissions();

  const {
    data: company,
    isLoading,
    currentState,
    setCurrentState,
  } = useDatatable({
    queryKey: "divisions",
    queryFn: getDivisions,
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
    dDialog.handleOpen();
  };

  const mutationActive = useMutation({
    mutationFn: activateDivision,
  });

  const mutationDeactive = useMutation({
    mutationFn: deleteDivision,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    //@ts-ignore
    const mutation = isEmpty(row.deleted_at) ? mutationDeactive : mutationActive;

    console.log({ row });

    mutation.mutate(
      { id_position: row.id_division },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["positions"]]);
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
        columns={columnsMasterDivision({
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
        listCard={
          <div className="grid grid-cols-3 gap-3">
            {company?.data?.data?.map((item, index) => (
              <CardMaster
                key={index}
                title={item?.name_division}
                description={item?.description_division}
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

export default MasterDivision;
