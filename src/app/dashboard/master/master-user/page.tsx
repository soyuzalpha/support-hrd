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
import { getCityByProvince } from "../master-zones/api/master-zones-service";
import { exportToCSV } from "@/utils/export-csv";

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

  const { loadOptions: loadOptionsPosition } = useSelectFetcher({
    endpoint: "/getPositions",
    labelKey: "name_position",
    valueKey: "id_position",
  });

  const { loadOptions: loadOptionsDivision } = useSelectFetcher({
    endpoint: "/getDivisions",
    labelKey: "name_division",
    valueKey: "id_division",
  });

  const { loadOptions: loadOptionsProvince } = useSelectFetcher({
    endpoint: "/getProvinces",
    labelKey: "province_name",
    valueKey: "id_province",
  });

  const { loadOptions: loadOptionsDegree } = useSelectFetcher({
    endpoint: "/getDegrees",
    labelKey: "name_degree",
    valueKey: "id_degree",
    extraParams: { onEmployeeEducation: 1 },
  });
  const { loadOptions: loadOptionsSchool } = useSelectFetcher({
    endpoint: "/getSchools",
    labelKey: "school_name",
    valueKey: "id_school",
  });
  const { loadOptions: loadOptionsProgramStudy } = useSelectFetcher({
    endpoint: "/getStudyprograms",
    labelKey: "program_name",
    valueKey: "id_studyprogram",
  });

  const mutationGetCityByProvince = useMutation({
    mutationFn: getCityByProvince,
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
      type: "async-select",
      name: "id_position",
      label: "Positions",
      placeholder: "Search Position...",
      loadOptions: loadOptionsPosition,
    },
    {
      type: "async-select",
      name: "id_devision",
      label: "Divisions",
      placeholder: "Search Division...",
      loadOptions: loadOptionsDivision,
    },
    {
      type: "async-select",
      name: "id_province",
      label: "Province",
      placeholder: "Search Province...",
      loadOptions: loadOptionsProvince,
      onValueChange: (value) => {
        fForm.setValue("id_city", null);
        mutationGetCityByProvince.reset();
        mutationGetCityByProvince.mutate({ id_province: value?.value, onEmployeeAddress: 1 });
      },
    },
    {
      type: "select",
      name: "id_city",
      label: "City",
      // options: [],
      options: mutationGetCityByProvince.data
        ? mutationGetCityByProvince?.data?.data?.data?.map((city: any) => ({
            label: city.city_name,
            value: city.id_city,
          }))
        : [],
      placeholder: "Search City...",
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
    {
      type: "async-select",
      name: "id_school",
      label: "School",
      placeholder: "Search School...",
      loadOptions: loadOptionsSchool,
    },
    {
      type: "async-select",
      name: "id_degree",
      label: "Degree",
      placeholder: "Search Degree...",
      loadOptions: loadOptionsDegree,
    },
    {
      type: "async-select",
      name: "id_studyprogram",
      label: "Study Program",
      placeholder: "Search Study Program...",
      loadOptions: loadOptionsProgramStudy,
    },
  ];

  const handleExport = async (isAll = false) => {
    try {
      let exportedData = [];

      if (isAll) {
        const res = await getUsers({
          ...currentState,
          page: 1,
          limit: 999999,
          is_all_data: 1,
        });

        exportedData = res?.data || res;
      } else {
        // export yang tampil di datatable
        exportedData = company || [];
      }

      if (!exportedData.length) {
        alert("No data available for export.");
        return;
      }

      exportToCSV("users", exportedData);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  console.log({ city: mutationGetCityByProvince?.data?.data?.data });

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
          },
          onClickDetail: (row) => {
            handleClickDetail(row.original);
          },
          onClickEdit: (row) => {
            handleClickEdit(row.original);
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
        useExport={true}
        onExport={() => {
          handleExport(true);
        }}
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
