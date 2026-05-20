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
  const dDialog = useDialogModal();
  const dDetail = useDialogModal();
  const dConfirm = useDialogModal();

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
    [setCurrentState],
  );

  // --------------------------------------------------
  // TABLE ITEM ACTION HANDLERS
  // --------------------------------------------------
  const assignFormValues = (row: any) => {
    fForm.reset();
    Object.entries(row).forEach(([key, value]) => {
      //@ts-ignore
      fForm.setValue(key, value);
    });
  };

  const handleClickDetail = (row: any) => {
    assignFormValues(row);
    dDetail.handleOpen();
  };

  const handleClickEdit = (row: any) => {
    if (!row) return;

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
                title={item?.full_name}
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
