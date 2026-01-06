"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getFlowapprovalleave } from "./api/master-approval-service";
import { DataTable } from "@/components/data-table";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { createInputOptions, toCapitalized } from "@/utils";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import { FilterField } from "@/components/dynamicFilterForm";
import FormApproval from "./components/FormApproval";
import CardMaster from "@/components/CardMaster";
import { columnsMasterApprovalLeave } from "./utils";
import { useMutation } from "@tanstack/react-query";
import DetailApproval from "./components/DetailApproval";

const MasterCompany = () => {
  const fForm = useForm();
  const { invalidate } = useAppRefreshQuery();

  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

  // -------------------------------
  // LOCAL STATE FOR TABLE CONTROL
  // -------------------------------
  const [tableState, setTableState] = React.useState({
    page: 1,
    limit: 10,
    searchKey: "",
  });

  // -------------------------------
  // ASYNC SELECTS LOADER
  // -------------------------------
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

  // -------------------------------
  // FETCH DATA
  // -------------------------------
  const mutation = useMutation({
    mutationFn: (params: any) => getFlowapprovalleave(params),
  });

  // -------------------------------
  // FILTER HANDLER
  // -------------------------------
  const handleFilterSubmit = (filters: Record<string, any>) => {
    const mappedFilters = Object.entries(filters).reduce((acc: any, [key, value]) => {
      // now TS won't complain because we assert possible shape
      if (value && typeof value === "object" && "value" in value) {
        acc[key] = value.value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    const newState = { ...tableState, page: 1, ...mappedFilters };
    setTableState(newState);
    mutation.mutate(newState);
  };

  const handlePaginationChange = (newState: any) => {
    const merged = { ...tableState, ...newState };
    setTableState(merged);
    mutation.mutate(merged);
  };

  // --------------------------------------------------
  // TABLE ITEM ACTION HANDLERS
  // --------------------------------------------------
  const assignFormValues = (row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });
  };

  const handleClickDetail = (row: any) => {
    assignFormValues(row);
    fForm.setValue("status", createInputOptions(toCapitalized(row?.status ?? ""), row?.status));
    dDetail.handleOpen();
  };

  const handleClickEdit = (row: any) => {
    if (!row) return;

    // --- mapping request company, position, division
    const mappedForm = {
      id_flowapprovalleave: row.id_flowapprovalleave ?? null,

      request_company: row.request_company_data
        ? {
            label: row.request_company_data.name_company,
            value: row.request_company_data.id_company,
          }
        : null,

      request_position: row.request_position_data
        ? {
            label: row.request_position_data.name_position,
            value: row.request_position_data.id_position,
          }
        : null,

      request_division: row.request_division_data
        ? {
            label: row.request_division_data.name_division,
            value: row.request_division_data.id_division,
          }
        : null,

      comments: row.comments ?? "",

      // --- mapping approver list
      approver:
        row.approver_list?.length > 0
          ? row.approver_list.map((item: any) => ({
              company: item.company ? { label: item.company.name_company, value: item.company.id_company } : null,
              position: item.position ? { label: item.position.name_position, value: item.position.id_position } : null,
              division: item.division ? { label: item.division.name_division, value: item.division.id_division } : null,
            }))
          : [],

      // --- status mapping (toggle)
      status: row.request_company_data?.status
        ? {
            label: row.request_company_data.status === "active" ? "Active" : "Inactive",
            value: row.request_company_data.status,
          }
        : { label: "Inactive", value: "inactive" },
    };

    assignFormValues(mappedForm);
    dDialog.handleOpen();
  };

  // -------------------------------
  // DYNAMIC FILTER CONFIG
  // -------------------------------
  const filters: FilterField[] = [
    {
      type: "async-select",
      name: "request_company",
      label: "Company",
      placeholder: "Search Company...",
      loadOptions: loadOptionsCompany,
    },
    {
      type: "async-select",
      name: "request_position",
      label: "Position",
      placeholder: "Search Position...",
      loadOptions: loadOptionsPosition,
    },
    {
      type: "async-select",
      name: "request_division",
      label: "Division",
      placeholder: "Search Division...",
      loadOptions: loadOptionsDivision,
    },
  ];

  return (
    <FormProvider {...fForm}>
      <DataTable
        isLoading={mutation.isPending}
        data={mutation.data?.data || []}
        count={mutation.data?.data?.total || 0}
        currentState={tableState}
        setCurrentState={handlePaginationChange}
        withFilter={true}
        filters={filters}
        withSearch={true}
        onSubmitFilter={handleFilterSubmit}
        columns={columnsMasterApprovalLeave({
          onClickData: (row) => {
            assignFormValues(row.original);
            dConfirm.handleOpen();
          },
          onClickDetail: (row) => handleClickDetail(row.original),
          onClickEdit: (row) => handleClickEdit(row.original),
        })}
        dialogHandler={dDialog}
        listCard={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {mutation.data?.data?.map((item, index) => (
              <CardMaster
                description=""
                key={index}
                title={item.request_company_data.name_company}
                item={item}
                onClickDetail={() => handleClickDetail(item)}
                onClickEdit={() => handleClickEdit(item)}
                onClickAction={() => {
                  assignFormValues(item);
                  dConfirm.handleOpen();
                }}
              />
            ))}
          </div>
        }
      />
      <FormApproval dialogForm={dDialog} />
      <DetailApproval dialogHandler={dDetail} />
    </FormProvider>
  );
};

export default MasterCompany;
