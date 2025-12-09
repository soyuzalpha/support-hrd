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
import DialogPreviewCv from "@/components/DialogPreviewCv";
import FormEmployee from "../master-employee/components/FormRole";
import FormEmployements from "../master-employments/components/FormEmployments";

const MasterUser = () => {
  const { invalidate } = useAppRefreshQuery();
  const fForm = useForm();

  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();
  const dPreview = useDialogModal();
  const dEmployee = useDialogModal();
  const dEmployements = useDialogModal();

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
    extraParams: { onEmployeeEducation: 1 },
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

  const mutationGetUserById = useMutation({
    mutationFn: getUserById,
  });

  const handleClickEmployee = (row: any) => {
    if (!row) return;

    mutationGetUserById.mutate(row.id, {
      onSuccess: (res) => {
        const user = res.data;
        const emp = user.employees;

        // Set base fields
        Object.entries(user).forEach(([key, value]) => {
          //@ts-ignore
          fForm.setValue(key, value);
        });

        // Select-based fields
        fForm.setValue("id_employee", user?.employees?.id_employee);
        fForm.setValue("id_user", createInputOptions(user?.name, user.id));
        fForm.setValue("nik", user?.employees?.nik || "");
        fForm.setValue("npwp", user?.employees?.npwp || "");
        fForm.setValue("bpjs_kesehatan", user?.employees?.bpjs_kesehatan || "");
        fForm.setValue("bpjs_ketenagakerjaan", user?.employees?.bpjs_ketenagakerjaan || "");
        fForm.setValue("full_name", user?.employees?.full_name || "");
        fForm.setValue("nick_name", user?.employees?.nick_name || "");
        fForm.setValue("personal_email", user?.employees?.personal_email || "");
        fForm.setValue("postal_code", user?.employees?.postal_code || "");
        fForm.setValue("address", user?.employees?.address || "");
        fForm.setValue("birth_place", user?.employees?.birth_place || "");
        fForm.setValue("gender", createInputOptions(toCapitalized(emp?.gender), emp?.gender));
        fForm.setValue("religion", createInputOptions(toCapitalized(emp?.religion), emp?.religion));
        fForm.setValue("marital_status", createInputOptions(toCapitalized(emp?.marital_status), emp?.marital_status));
        fForm.setValue("blood_type", createInputOptions(emp?.blood_type, emp?.blood_type));
        fForm.setValue("id_province", createInputOptions(emp?.province?.province_name, emp?.province?.id_province));
        fForm.setValue("id_city", createInputOptions(emp?.city?.city_name, emp?.city?.id_city));

        // Contacts
        fForm.setValue("contacts", emp.contacts || []);

        // Family (select format)
        fForm.setValue(
          "family",
          emp.family?.map((item) => ({
            ...item,
            relationship: createInputOptions(toCapitalized(item.relationship), item.relationship),
          })) || []
        );

        // Work History (simple list)
        fForm.setValue(
          "work_histories",
          emp.workhistory?.map((item) => ({
            ...item,
          })) || []
        );

        // Education History (needs select formatting)
        fForm.setValue(
          "education_histories",
          emp.educationhistory?.map((item) => ({
            ...item,
            id_school: createInputOptions(item.school?.school_name, item.school?.id_school),
            id_degree: createInputOptions(item.degree?.name_degree, item.degree?.id_degree),
            id_studyprogram: createInputOptions(item.studyprogram?.program_name, item.studyprogram?.id_studyprogram),
          })) || []
        );

        // Documents
        fForm.setValue("list_documents", emp.documents || []);
        fForm.setValue("documents", []);

        dEmployee.handleOpen();
      },
      onError: (err) => {
        toastAlert.error(err.message || "Gagal mengambil data user");
      },
    });
  };

  const handleClickEmployements = (row: any) => {
    if (!row) return;

    mutationGetUserById.mutate(row.id, {
      onSuccess: (res) => {
        const normalized = normalizeUserToForm(res.data);

        Object.entries(normalized).forEach(([key, value]) => {
          fForm.setValue(key, value ?? "");
        });

        dEmployements.handleOpen();
      },

      onError: (err) => {
        toastAlert.error(err.message || "Gagal mengambil data user");
      },
    });
  };

  const safe = (val: any, fallback: any = "") => val ?? fallback;
  const opt = (label?: string, value?: any) => (label && value ? createInputOptions(label, value) : null);

  const normalizeUserToForm = (user: any) => {
    if (!user) return {};

    const emp = user?.employees ?? {};
    const employment = user?.employments ?? {};

    return {
      // User
      id_user: opt(user?.name, user?.id),
      ...user,

      // Employee base fields
      id_employee: safe(emp?.id_employee),
      nik: safe(emp?.nik),
      npwp: safe(emp?.npwp),
      bpjs_kesehatan: safe(emp?.bpjs_kesehatan),
      bpjs_ketenagakerjaan: safe(emp?.bpjs_ketenagakerjaan),
      full_name: safe(emp?.full_name),
      nick_name: safe(emp?.nick_name),
      personal_email: safe(emp?.personal_email),
      postal_code: safe(emp?.postal_code),
      address: safe(emp?.address),
      birth_place: safe(emp?.birth_place),

      gender: opt(toCapitalized(emp?.gender), emp?.gender),
      religion: opt(toCapitalized(emp?.religion), emp?.religion),
      marital_status: opt(toCapitalized(emp?.marital_status), emp?.marital_status),
      blood_type: safe(emp?.blood_type),

      id_province: opt(emp?.province?.province_name, emp?.province?.id_province),
      id_city: opt(emp?.city?.city_name, emp?.city?.id_city),

      // Contacts
      contacts: safe(emp?.contacts, []),

      // Family
      family: (emp?.family ?? []).map((item: any) => ({
        ...item,
        relationship: opt(toCapitalized(item?.relationship), item?.relationship),
      })),

      // Work history
      work_histories: safe(emp?.workhistory, []),

      // Education
      education_histories: (emp?.educationhistory ?? []).map((item: any) => ({
        ...item,
        id_school: opt(item?.school?.school_name, item?.school?.id_school),
        id_degree: opt(item?.degree?.name_degree, item?.degree?.id_degree),
        id_studyprogram: opt(item?.studyprogram?.program_name, item?.studyprogram?.id_studyprogram),
      })),

      // Documents
      list_documents: safe(emp?.documents, []),
      documents: [],

      // Employment
      id_employment: safe(employment?.id_employment),
      id_manager: opt(employment?.manager?.name, employment?.manager?.id),
      work_location: safe(employment?.work_location),
      join_date: safe(employment?.join_date),
      end_date: safe(employment?.end_date),
      employment_status: opt(toCapitalized(employment?.employment_status), employment?.employment_status),
      contract_start_date: safe(employment?.contract_start_date),
      contract_end_date: safe(employment?.contract_end_date),
      status: opt(toCapitalized(employment?.status), employment?.status),
      notes: safe(employment?.notes),
      attachments_list: safe(employment?.attachments, []),
    };
  };

  // const handleClickEmployements = (row: any) => {
  //   if (!row) return;

  //   mutationGetUserById.mutate(row.id, {
  //     onSuccess: (res) => {
  //       const user = res.data;
  //       const emp = user.employees;

  //       // Set base fields
  //       Object.entries(user).forEach(([key, value]) => {
  //         //@ts-ignore
  //         fForm.setValue(key, value);
  //       });

  //       // Select-based fields and set employee data to form
  //       fForm.setValue("id_employee", user?.employees?.id_employee);
  //       fForm.setValue("id_user", createInputOptions(user?.name, user.id));
  //       fForm.setValue("nik", user?.employees?.nik || "");
  //       fForm.setValue("npwp", user?.employees?.npwp || "");
  //       fForm.setValue("bpjs_kesehatan", user?.employees?.bpjs_kesehatan || "");
  //       fForm.setValue("bpjs_ketenagakerjaan", user?.employees?.bpjs_ketenagakerjaan || "");
  //       fForm.setValue("full_name", user?.employees?.full_name || "");
  //       fForm.setValue("nick_name", user?.employees?.nick_name || "");
  //       fForm.setValue("personal_email", user?.employees?.personal_email || "");
  //       fForm.setValue("postal_code", user?.employees?.postal_code || "");
  //       fForm.setValue("address", user?.employees?.address || "");
  //       fForm.setValue("birth_place", user?.employees?.birth_place || "");
  //       fForm.setValue("gender", createInputOptions(toCapitalized(emp?.gender), emp?.gender));
  //       fForm.setValue("religion", createInputOptions(toCapitalized(emp?.religion), emp?.religion));
  //       fForm.setValue("marital_status", createInputOptions(toCapitalized(emp?.marital_status), emp?.marital_status));
  //       fForm.setValue("blood_type", createInputOptions(emp?.blood_type, emp?.blood_type));
  //       fForm.setValue("id_province", createInputOptions(emp?.province?.province_name, emp?.province?.id_province));
  //       fForm.setValue("id_city", createInputOptions(emp?.city?.city_name, emp?.city?.id_city));

  //       // Contacts
  //       fForm.setValue("contacts", emp.contacts || []);

  //       // Family (select format)
  //       fForm.setValue(
  //         "family",
  //         emp.family?.map((item) => ({
  //           ...item,
  //           relationship: createInputOptions(toCapitalized(item.relationship), item.relationship),
  //         })) || []
  //       );

  //       // Work History (simple list)
  //       fForm.setValue(
  //         "work_histories",
  //         emp.workhistory?.map((item) => ({
  //           ...item,
  //         })) || []
  //       );

  //       // Education History (needs select formatting)
  //       fForm.setValue(
  //         "education_histories",
  //         emp.educationhistory?.map((item) => ({
  //           ...item,
  //           id_school: createInputOptions(item.school?.school_name, item.school?.id_school),
  //           id_degree: createInputOptions(item.degree?.name_degree, item.degree?.id_degree),
  //           id_studyprogram: createInputOptions(item.studyprogram?.program_name, item.studyprogram?.id_studyprogram),
  //         })) || []
  //       );

  //       // Documents
  //       fForm.setValue("list_documents", emp.documents || []);
  //       fForm.setValue("documents", []);

  //       // SET EMPLOYEMENT DATA TO FORM
  //       fForm.setValue("id_emplyoements", user?.employments?.id_employment);
  //       fForm.setValue(
  //         "id_manager",
  //         createInputOptions(user?.employments?.manager?.name, user?.employments?.manager?.id)
  //       );
  //       fForm.setValue("work_location", user?.employments?.work_location);
  //       fForm.setValue("join_date", user?.employments?.join_date);
  //       fForm.setValue("end_date", user?.employments?.end_date);
  //       fForm.setValue(
  //         "employment_status",
  //         createInputOptions(toCapitalized(user?.employments?.employment_status), user?.employments?.employment_status)
  //       );
  //       fForm.setValue("contract_start_date", user?.employments?.contract_start_date);
  //       fForm.setValue("contract_end_date", user?.employments?.contract_end_date);
  //       fForm.setValue(
  //         "status",
  //         createInputOptions(toCapitalized(user?.employments?.status), user?.employments?.status)
  //       );
  //       fForm.setValue("notes", user?.employments?.notes);

  //       dEmployements.handleOpen();
  //     },
  //     onError: (err) => {
  //       toastAlert.error(err.message || "Gagal mengambil data user");
  //     },
  //   });
  // };

  console.log({ values: fForm.getValues() });

  return (
    <FormProvider {...fForm}>
      <DataTable
        isLoading={isLoading}
        data={company?.data?.data || []}
        columns={columnsMasterUser({
          onCLickPreview: (row) => {
            Object.entries(row.original).forEach(([key, value]) => {
              //@ts-ignore
              fForm.setValue(key, value);
            });

            dPreview.handleOpen();
          },
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
          onClickEmployee: (row) => {
            handleClickEmployee(row.original);
          },
          onCLickEmployments: (row) => {
            handleClickEmployements(row.original);
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
      <DialogPreviewCv dialogHandler={dPreview} />
      <FormEmployee dialogHandler={dEmployee} />
      <FormEmployements dialogHandler={dEmployements} />

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
