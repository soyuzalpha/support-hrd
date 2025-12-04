"use client";

import { AppContainer } from "@/components/app-container";
import CardMaster from "@/components/CardMaster";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { DataTable } from "@/components/data-table";
import { useDatatable } from "@/hooks/use-datatable";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { createInputOptions, isEmpty, toCapitalized } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { activateLeaveRequest, deleteLeaveRequest, getLeaveRequests } from "./api/leaves-service";
import { columnsLeaves } from "./utils";
import FormLeaves from "./components/FormLeaves";
import { toastAlert } from "@/lib/toast";

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
    queryKey: "leaves",
    queryFn: getLeaveRequests,
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
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });
    fForm.setValue("list_attachments", row.attachments || []);
    fForm.setValue("id_typeleave", createInputOptions(row.type_leaves.name_typeleave, row.type_leaves.id_typeleave));
    fForm.setValue("status", createInputOptions(toCapitalized(row.status), row.status));
    dDialog.handleOpen();
  };

  const mutationActive = useMutation({
    mutationFn: activateLeaveRequest,
  });

  const mutationDeactive = useMutation({
    mutationFn: deleteLeaveRequest,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    const mutation = isEmpty(row?.deleted_at) ? mutationDeactive : mutationActive;

    console.log({ row });

    mutation.mutate(
      { id_leaverequest: row.id_leaverequest },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["leaves"]]);
          dConfirm.handleClose();
        },
        onError: (err) => {
          toastAlert.error(err.message || "Gagal ubah status");
        },
      }
    );
  };
  return (
    <AppContainer title="Leaves">
      <FormProvider {...fForm}>
        <DataTable
          isLoading={isLoading}
          data={company?.data?.data || []}
          columns={columnsLeaves({
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
              // console.log({ row });
            },
            onClickEdit: (row) => {
              handleClickEdit(row.original);
              // console.log({ row });
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
                  title={item.name_company}
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

        <FormLeaves dialogHandler={dDialog} />
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
    </AppContainer>
  );
};

export default Page;
