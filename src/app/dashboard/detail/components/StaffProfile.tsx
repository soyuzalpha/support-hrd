"use client";
import { useEffect, useState } from "react";
import { createInputOptions, generateErrorMessage, isEmpty, toCapitalized } from "@/utils";
import { useUser } from "@/context/app-context";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { getEmployeeById, getEmployeeByUser } from "../../master/master-employee/api/master-position-service";
import { useDialogModal } from "@/hooks/use-dialog-modal";
import FormEmployee from "../../master/master-employee/components/FormRole";
import { toastAlert } from "@/lib/toast";
import StaffDetail from "./StaffDetail";
import FormUser from "../../master/master-user/components/FormUser";

const StaffProfile = ({ idUser }: { idUser: string | number | null }) => {
  const fForm = useForm();
  const dUpdate = useDialogModal();
  const dUser = useDialogModal();
  const [activeTab, setActiveTab] = useState("personal");
  const { user } = useUser();

  const userDetail = useMutation({
    mutationFn: getEmployeeByUser,
  });

  // Tentukan target id_user
  // const targetUserId = !idUser ? user?.id_user : idUser;

  // useEffect(() => {
  //   if (!targetUserId) return;

  //   userDetail.mutate(targetUserId, {
  //     onSuccess: (res) => {
  //       if (!user) return;

  //       updateUser({
  //         ...user,
  //         employee_datas: res?.data,
  //       });
  //     },
  //   });
  // }, [targetUserId]);

  const mutationDetailEmploye = useMutation({
    mutationFn: getEmployeeById,
  });

  const handleClickDetail = () => {
    if (!user.userDatas?.id) return;
    if (!user.employee_datas?.id_employee) return;

    mutationDetailEmploye.mutate(user.employee_datas?.id_employee, {
      onSuccess: (res) => {
        Object.entries(res.data).forEach(([key, value]) => {
          fForm.setValue(key, value);
        });

        fForm.setValue("id_user", {
          ...user?.userDatas,
          label: user?.userDatas?.name,
          value: user?.userDatas?.id,
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
            // relationship: createInputOptions(toCapitalized(item.relationship), item.relationship),
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

  const staffData = user?.employee_datas ?? DEFAULT_STAFF_DATA;
  const isFirstLogin = isEmpty(user?.userDatas?.first_login_at);

  return (
    <FormProvider {...fForm}>
      <StaffDetail
        staffData={staffData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleClickDetail={handleClickDetail}
        handleChangePassword={() => {
          if (!isEmpty(user)) {
            Object.entries(user?.userDatas).forEach(([key, value]) => {
              fForm.setValue(key, value);
            });

            fForm.setValue("id_company", {
              ...user?.userDatas?.company,
              label: user?.userDatas?.company?.name_company,
              value: user?.userDatas?.company?.id_company,
            });
            fForm.setValue("id_position", {
              ...user?.userDatas?.position,
              label: user?.userDatas?.position?.name_position,
              value: user?.userDatas?.position?.id_position,
            });
            fForm.setValue("id_division", {
              ...user?.userDatas?.division,
              label: user?.userDatas?.division?.name_division,
              value: user?.userDatas?.division?.id_division,
            });
            dUser.handleOpen();
          }
        }}
      />
      <FormEmployee dialogHandler={dUpdate} />
      <FormUser dialogHandler={dUser} isFirstLogin={isFirstLogin} />
    </FormProvider>
  );
};

export default StaffProfile;

const DEFAULT_STAFF_DATA = {
  id_employee: 0,
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
