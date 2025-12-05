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
import { FilterField } from "@/components/dynamicFilterForm";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";

const MasterUser = () => {
  const { invalidate } = useAppRefreshQuery();
  const fForm = useForm();

  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

  const { loadOptions: loadOptionsCompany } = useSelectFetcher({
    endpoint: "/getCompany",
    labelKey: "name_company",
    valueKey: "id_company",
  });

  const {
    data: company,
    isLoading,
    currentState,
    setCurrentState,
    refetch,
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

  const handleFilterSubmit = (filters: Record<string, any>) => {
    const mappedFilters = Object.entries(filters).reduce((acc: any, [key, value]) => {
      if (value && typeof value === "object" && "value" in value) {
        acc[key] = value.value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    // build new query params
    const newParams = {
      ...currentState,
      page: 1, // reset pagination
      ...mappedFilters,
    };

    // update datatable state
    setCurrentState(newParams);

    // refetch data using updated params
    refetch(newParams);
  };

  const filters: FilterField[] = [
    {
      type: "async-select",
      name: "id_company",
      label: "Company",
      placeholder: "Search Company...",
      loadOptions: loadOptionsCompany,
    },
    {
      type: "number",
      name: "min_age",
      label: "Minimum Age",
      placeholder: "Minimum age",
    },
    {
      type: "number",
      name: "max_age",
      label: "Maximum Age",
      placeholder: "Maximum age",
    },
    {
      type: "number",
      name: "min_work",
      label: "Min Work",
      placeholder: "Min work",
    },
    {
      type: "number",
      name: "max_work",
      label: "Max Work",
      placeholder: "Max work",
    },
  ];

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
        withFilter={true}
        filters={filters}
        onSubmitFilter={handleFilterSubmit}
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
