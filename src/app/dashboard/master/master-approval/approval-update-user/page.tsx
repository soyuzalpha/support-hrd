"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getEmployeeUpdateRequests } from "./api/master-approval-service";
import { DataTable } from "@/components/data-table";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import { useSelectFetcher } from "@/hooks/use-select-fetcher";
import CardMaster from "@/components/CardMaster";
import { columnsMasterApprovalLeave } from "./utils";
import DetailApproval from "./components/DetailApproval";
import { useDatatable } from "@/hooks/use-datatable";

const ApprovalUpdateUser = () => {
  const fForm = useForm();
  const { invalidate } = useAppRefreshQuery();

  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

  const { loadOptions: loadOptionsDivision } = useSelectFetcher({
    endpoint: "/getDivisions",
    labelKey: "name_division",
    valueKey: "id_division",
  });

  const {
    data: company,
    isLoading,
    currentState,
    setCurrentState,
  } = useDatatable({
    queryKey: "approval-update-user",
    queryFn: getEmployeeUpdateRequests,
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
    // fForm.setValue("status", createInputOptions(toCapitalized(row?.status ?? ""), row?.status));
    dDetail.handleOpen();
  };

  const handleClickEdit = (row: any) => {
    if (!row) return;

    // --- mapping request company, position, division
    // const mappedForm = {
    //   id_flowapprovalleave: row.id_flowapprovalleave ?? null,

    //   request_company: row.request_company_data
    //     ? {
    //         label: row.request_company_data.name_company,
    //         value: row.request_company_data.id_company,
    //       }
    //     : null,

    //   request_position: row.request_position_data
    //     ? {
    //         label: row.request_position_data.name_position,
    //         value: row.request_position_data.id_position,
    //       }
    //     : null,

    //   request_division: row.request_division_data
    //     ? {
    //         label: row.request_division_data.name_division,
    //         value: row.request_division_data.id_division,
    //       }
    //     : null,

    //   comments: row.comments ?? "",

    //   // --- mapping approver list
    //   approver:
    //     row.approver_list?.length > 0
    //       ? row.approver_list.map((item: any) => ({
    //           company: item.company ? { label: item.company.name_company, value: item.company.id_company } : null,
    //           position: item.position ? { label: item.position.name_position, value: item.position.id_position } : null,
    //           division: item.division ? { label: item.division.name_division, value: item.division.id_division } : null,
    //         }))
    //       : [],

    //   // --- status mapping (toggle)
    //   status: row.request_company_data?.status
    //     ? {
    //         label: row.request_company_data.status === "active" ? "Active" : "Inactive",
    //         value: row.request_company_data.status,
    //       }
    //     : { label: "Inactive", value: "inactive" },
    // };

    assignFormValues(row);
    dDialog.handleOpen();
  };

  return (
    <FormProvider {...fForm}>
      <DataTable
        isLoading={isLoading}
        data={company?.data?.data || []}
        columns={columnsMasterApprovalLeave({
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
        // dialogHandler={dDialog}
        listCard={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {company?.data?.data?.map((item, index) => (
              <CardMaster
                key={index}
                title={item?.name_typeleave}
                description={item?.description}
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
      <DetailApproval dialogHandler={dDetail} />
    </FormProvider>
  );
};

export default ApprovalUpdateUser;
