"use client";

import { useDatatable } from "@/hooks/use-datatable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getAttendanceSummaries, deleteAttendanceSummary } from "./api/attendance-summary-service";
import { DataTable } from "@/components/data-table";
import { columnsSummaryAttendance } from "./utils/index";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { createInputOptions, isEmpty, toCapitalized } from "@/utils";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import CardMaster from "@/components/CardMaster";
import FormAttendancePeriod from "./components/FormAttendanceSummary";

const Period = () => {
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
    queryKey: "summary-attendances",
    queryFn: getAttendanceSummaries,
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

  //   const mutationActive = useMutation({
  //     mutationFn: activateCompany,
  //   });

  const mutationDeactive = useMutation({
    mutationFn: deleteAttendanceSummary,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    const mutation = mutationDeactive;

    mutation.mutate(
      { id_periodattendance: row.id_periodattendance },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["period-attendances"]]);
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
        withFilter={false}
        columns={columnsSummaryAttendance({
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
                title={item?.user?.name}
                description={item?.user?.company?.name_company}
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

      <FormAttendancePeriod dialogHandler={dDialog} />
      {/* <DetailCompany dialogHandler={dDetail} /> */}

      <ConfirmationDialog
        onConfirm={() => handleClickChangeStatus()}
        open={dConfirm.open}
        cancelLabel="Cancel"
        isLoading={mutationDeactive.isPending}
        title="Change Status"
        onCancel={dConfirm.handleClose}
      />
    </FormProvider>
  );
};

export default Period;
