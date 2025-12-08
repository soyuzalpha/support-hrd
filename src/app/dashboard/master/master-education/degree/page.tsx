"use client";

import React from "react";
import FormEducation from "./components/FormEducation";
import { FormProvider, useForm } from "react-hook-form";
import { DataTable } from "@/components/data-table";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { useDatatable } from "@/hooks/use-datatable";
import { deleteMasterEducation, getMasterEducation, restoreMasterEducation } from "./api/master-education-service";
import { createInputOptions, isEmpty, toCapitalized } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import CardMaster from "@/components/CardMaster";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { columnsMasterEducation } from "./utils";

const Degree = () => {
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
    queryKey: "degree",
    queryFn: getMasterEducation,
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
    mutationFn: restoreMasterEducation,
  });

  const mutationDeactive = useMutation({
    mutationFn: deleteMasterEducation,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    const mutation = isEmpty(row?.deleted_at) ? mutationDeactive : mutationActive;

    mutation.mutate(
      { id_degree: row.id_degree },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["degree"]]);
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
        columns={columnsMasterEducation({
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
                title={item.name_degree}
                description={""}
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

      <FormEducation dialogHandler={dDialog} />
      {/* <DetailCompany dialogHandler={dDetail} /> */}

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

export default Degree;
