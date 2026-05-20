"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createInputOptions, generateErrorMessage, isEmpty, toCapitalized } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getEmployeeById, getEmployeeByUser } from "../master/master-employee/api/master-position-service";
import StaffDetail from "./components/StaffDetail";
import FormEmployee from "../master/master-employee/components/FormRole";
import FormUser from "../master/master-user/components/FormUser";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import { getUserById } from "../master/master-user/api/master-position-service";
import { toastAlert } from "@/lib/toast";
import { useUser } from "@/hooks/useUser";

const Detail = () => {
  const fForm = useForm();
  const { user } = useUser();
  const dUpdate = useDialogModal();
  const dUser = useDialogModal();
  const [activeTab, setActiveTab] = useState("personal");
  const [isDisabledInputUser, setIsDisabledInputUser] = useState(false);

  const queryEmployeeByUser = useQuery({
    queryKey: ["detail-employee", user?.id],
    queryFn: () => getEmployeeByUser(user?.id),
    enabled: !!user?.id,
  });

  const mutationDetailEmploye = useMutation({
    mutationFn: getEmployeeById,
  });

  const handleClickDetail = () => {
    mutationDetailEmploye.mutate(queryEmployeeByUser?.data?.data?.id_employee, {
      onSuccess: (res) => {
        setIsDisabledInputUser(true);
        Object.entries(res.data).forEach(([key, value]) => {
          fForm.setValue(key, value);
        });
        fForm.setValue("id_user", {
          ...user,
          label: user?.name,
          value: user?.id,
        });
        fForm.setValue("gender", createInputOptions(toCapitalized(res?.data?.gender), res?.data.gender));
        fForm.setValue("religion", createInputOptions(toCapitalized(res?.data?.religion), res?.data.religion));
        fForm.setValue(
          "marital_status",
          createInputOptions(toCapitalized(res?.data?.marital_status), res?.data.marital_status),
        );
        fForm.setValue("blood_type", createInputOptions(res?.data?.blood_type, res?.data.blood_type));
        fForm.setValue(
          "id_province",
          createInputOptions(res?.data.province?.province_name, res?.data?.province?.id_province),
        );
        fForm.setValue("id_city", createInputOptions(res?.data?.city?.city_name, res?.data?.city?.id_city));
        fForm.setValue(
          "family",
          res?.data.family?.map((item) => ({
            ...item,
            relationship: createInputOptions(toCapitalized(item.relationship), item.relationship),
            last_education: createInputOptions(item?.last_education, item?.last_education),
          })),
        );
        fForm.setValue(
          "work_histories",
          res?.data.workhistory?.map((item) => ({
            ...item,
          })),
        );
        fForm.setValue(
          "education_histories",
          res?.data.educationhistory?.map((item) => ({
            ...item,
            id_school: createInputOptions(toCapitalized(item?.school?.school_name), item.school?.id_school),
            id_degree: createInputOptions(toCapitalized(item?.degree?.name_degree), item.degree?.id_degree),
            id_studyprogram: createInputOptions(
              toCapitalized(item?.studyprogram?.program_name),
              item.studyprogram?.id_studyprogram,
            ),
          })),
        );
        fForm.setValue("list_documents", res?.data.documents);
        fForm.setValue("documents", []);
        dUpdate.handleOpen();
      },
      onError: (err) => {
        const message = generateErrorMessage(err);
        toastAlert.error(message);
      },
    });
  };

  const handleAddEmployeeData = () => {
    if (user) {
      console.log({ user });
      setIsDisabledInputUser(true);
      Object.entries(user).forEach(([key, value]) => {
        fForm.setValue(key, value);
      });
      fForm.setValue("id_user", {
        ...user,
        label: user?.name,
        value: user?.id,
      });
      fForm.setValue("personal_email", user?.email);
      fForm.setValue("full_name", user?.name);
      fForm.setValue("nick_name", user?.username);

      dUpdate.handleOpen();
    }
  };

  const mutationDetailUser = useMutation({
    mutationFn: getUserById,
  });

  const handleChangePassword = () => {
    if (user) {
      mutationDetailUser.mutate(user?.id, {
        onSuccess: (res) => {
          fForm.reset();
          fForm.setValue("id", res?.data?.id);
          fForm.setValue("name", res?.data?.name);
          fForm.setValue("username", res?.data?.username);
          fForm.setValue("email", res?.data?.email);
          fForm.setValue("id_company", {
            ...res?.data?.company,
            label: res?.data?.company?.name_company,
            value: res?.data?.company?.id_company,
          });
          fForm.setValue("id_position", {
            ...res?.data?.position,
            label: res?.data?.position?.name_position,
            value: res?.data?.position?.id_position,
          });
          fForm.setValue("id_division", {
            ...res?.data?.division,
            label: res?.data?.division?.name_division,
            value: res?.data?.division?.id_division,
          });
          dUser.handleOpen();
        },
        onError: (err) => {
          toastAlert.error(generateErrorMessage(err));
        },
      });
    }
  };

  const staffData = queryEmployeeByUser?.data?.data ?? DEFAULT_STAFF_DATA;
  const isFirstLogin = isEmpty(user?.first_login_at);

  // console.log({
  //   query: queryEmployeeByUser?.data?.data,
  //   user,
  //   staffData,
  // });

  return (
    <FormProvider {...fForm}>
      <StaffDetail
        staffData={staffData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleClickDetail={handleClickDetail}
        handleAddEmployeeData={handleAddEmployeeData}
        handleChangePassword={handleChangePassword}
      />

      <FormEmployee
        dialogHandler={dUpdate}
        handleRefetchEmployee={queryEmployeeByUser.refetch}
        isDisabledInputUser={isDisabledInputUser}
      />
      <FormUser dialogHandler={dUser} isFirstLogin={isFirstLogin} />
    </FormProvider>
  );
};

export default Detail;

const DEFAULT_STAFF_DATA = {
  id_employee: null,
  nik: "",
  npwp: "",
  bpjs_kesehatan: "",
  bpjs_ketenagakerjaan: "",
  full_name: "-",
  nick_name: "",
  personal_email: "-",
  birth_place: "-",
  birth_date: null,
  gender: "-",
  religion: "-",
  marital_status: "-",
  blood_type: "-",
  address: "-",
  city: {
    city_name: "-",
  },
  province: {
    province_name: "-",
  },
  postal_code: "-",
  age: 0,
  user: {
    name: "-",
    username: "-",
    employee_number: "-",
    email: "-",
    company: {
      name_company: "-",
      address_company: "-",
      phone_company: "-",
    },
    position: {
      name_position: "-",
    },
    division: {
      name_division: "-",
    },
  },
  contacts: [],
  family: [],
  workhistory: [],
  educationhistory: [],
};
