"use client";

import { useDatatable } from "@/hooks/use-datatable";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DataTable } from "@/components/data-table";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { deleteUser, getUserById, getUsers } from "./api/master-position-service";
import { columnsMasterUser } from "./utils";
import FormUser from "./components/FormUser";
import { createInputOptions, toCapitalized } from "@/utils";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toastAlert } from "@/lib/toast";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import CardMaster from "@/components/CardMaster";
import DetailRole from "./components/DetailRole";

const MasterUser = () => {
  const { invalidate } = useAppRefreshQuery();
  const fForm = useForm();

  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

  const {
    data: company,
    isLoading,
    currentState,
    setCurrentState,
  } = useDatatable({
    queryKey: "users",
    queryFn: getUsers,
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

  const mutationDetail = useMutation({
    mutationFn: getUserById,
  });

  const handleClickDetail = (row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });
    fForm.setValue("status", createInputOptions(toCapitalized(row.status), row.status));
    fForm.setValue("id_company", createInputOptions(row?.company?.name_company, row?.company?.id_company));
    dDetail.handleOpen();
  };

  const handleClickEdit = (row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });

    fForm.setValue(
      "id_company",
      createInputOptions(toCapitalized(row?.company?.name_company), row?.company?.id_company)
    );
    fForm.setValue(
      "id_position",
      createInputOptions(toCapitalized(row?.position?.name_position), row?.position?.id_position)
    );
    fForm.setValue(
      "id_division",
      createInputOptions(toCapitalized(row?.division?.name_division), row?.division?.id_division)
    );

    dDialog.handleOpen();
  };

  // const mutationActive = useMutation({
  //   mutationFn: activatePosition,
  // });

  const mutationDeactive = useMutation({
    mutationFn: deleteUser,
  });

  const handleClickChangeStatus = () => {
    const row = fForm.getValues();
    //@ts-ignore
    // const mutation = isEmpty(row.deleted_at) ? mutationDeactive : mutationActive;

    console.log({ row });

    mutationDeactive.mutate(
      { id: row.id },
      {
        onSuccess: (res) => {
          toastAlert.success(res.message || "Berhasil");
          invalidate([["users"]]);
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
        columns={columnsMasterUser({
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
                title={item?.name}
                description={item?.email}
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

      <FormUser dialogHandler={dDialog} />
      <DetailRole dialogHandler={dDetail} />

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

export default MasterUser;
