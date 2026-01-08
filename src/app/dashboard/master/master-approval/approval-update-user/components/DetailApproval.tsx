import React, { useState } from "react";
import {
  User,
  Briefcase,
  Building2,
  Phone,
  Users,
  GraduationCap,
  FileText,
  Mail,
  MapPin,
  Heart,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { useFormContext } from "react-hook-form";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { useMutation } from "@tanstack/react-query";
import { approveEmployeeUpdateRequest, rejectEmployeeUpdateRequest } from "../api/master-approval-service";
import { toastAlert } from "@/lib/toast";
import { generateErrorMessage, generateSuccessMessage, isEmpty } from "@/utils";
import { useAppRefreshQuery } from "@/hooks/use-refetch-data";
import Show from "@/components/show";

const DetailApproval = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const data = fForm.getValues();
  const { invalidate } = useAppRefreshQuery();

  const mutationReject = useMutation({
    mutationFn: rejectEmployeeUpdateRequest,
  });

  const mutationApprove = useMutation({
    mutationFn: approveEmployeeUpdateRequest,
  });

  const handleApproveApproval = () => {
    try {
      const payload = {
        id_employee_update_request: fForm.getValues("id_employee_update_request"),
      };

      mutationApprove.mutate(payload, {
        onSuccess: (res) => {
          toastAlert.success(generateSuccessMessage(res));
          dialogHandler.handleClose();
          invalidate([["approval-update-user"]]);
        },
        onError: (err) => {
          toastAlert.error(generateErrorMessage(err));
        },
      });
    } catch (error) {
      toastAlert.error("Something went wrong!");
    }
  };
  const handleRejectApproval = () => {
    try {
      const payload = {
        id_employee_update_request: fForm.getValues("id_employee_update_request"),
      };

      mutationReject.mutate(payload, {
        onSuccess: (res) => {
          toastAlert.success(generateSuccessMessage(res));
          dialogHandler.handleClose();
          invalidate([["approval-update-user"]]);
        },
        onError: (err) => {
          toastAlert.error(generateErrorMessage(err));
        },
      });
    } catch (error) {
      toastAlert.error("Something went wrong!");
    }
  };

  const approvedAt = fForm.getValues("approved_at");
  const rejectedAt = fForm.getValues("rejected_at");

  const isPending = isEmpty(approvedAt) && isEmpty(rejectedAt);

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="ultra" glass={true}>
        <DialogHeader>
          <DialogTitle>Details Approval</DialogTitle>
          {/* <DialogDescription>Details {details.name_company} Position</DialogDescription> */}
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <EmployeeUpdateDisplay />
        </AppGridContainer>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={dialogHandler.handleClose}>
              Close
            </Button>
          </DialogClose>

          <Show.When isTrue={isPending}>
            <div className="flex gap-2">
              <Button type="button" variant="glassSuccess" onClick={handleApproveApproval}>
                Approve
              </Button>

              <Button type="button" variant="glassError" onClick={handleRejectApproval}>
                Reject
              </Button>
            </div>
          </Show.When>

          {/* <Show.When isTrue={isEmpty(fForm.getValues("rejected_at")) && !isEmpty(fForm.getValues("approved_at"))}>
            <Button type="button" variant="glassError" onClick={() => handleRejectApproval()}>
              Reject
            </Button>
          </Show.When>

          <Show.When isTrue={isEmpty(fForm.getValues("approved_at")) && !isEmpty(fForm.getValues("rejected_at"))}>
            <Button type="button" variant="glassSuccess" onClick={() => handleApproveApproval()}>
              Approve
            </Button>
          </Show.When> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailApproval;

const EmployeeUpdateDisplay = () => {
  const fForm = useFormContext();
  const [activeTab, setActiveTab] = useState("personal");

  const data = fForm.getValues();

  // const data = {
  //   id_employee_update_request: 1,
  //   id_employee: 3,
  //   nik: "6112092901010004",
  //   npwp: "926837717704000",
  //   bpjs_kesehatan: "0003174107218",
  //   bpjs_ketenagakerjaan: "24095597159",
  //   full_name: "Norman Ardian",
  //   nick_name: "Norman",
  //   personal_email: "normanardian24@gmail.com",
  //   birth_place: "Pontianak",
  //   birth_date: "2026-01-07",
  //   gender: "male",
  //   religion: "Islam",
  //   marital_status: "single",
  //   blood_type: "B+",
  //   address: "jl leguti",
  //   city: 273,
  //   province: 16,
  //   postal_code: "15318",
  //   approved_at: "2026-01-07 09:53:13",
  //   approved_by: 1,
  //   created_at: "2026-01-07T09:52:29.000000Z",
  //   employee_data: {
  //     birth_date: "2001-01-24",
  //     age: 24,
  //     user: {
  //       name: "Norman Ardian",
  //       username: "norman",
  //       employee_number: "TRANSTAMA-2",
  //       email: "norman@transtama.com",
  //       company: {
  //         name_company: "Transtama Logistics Express",
  //         address_company: "Bendungan Hilir",
  //         phone_company: "09876545678",
  //       },
  //       position: {
  //         name_position: "Staff",
  //       },
  //       division: {
  //         name_division: "IT",
  //       },
  //     },
  //   },
  //   contacts_update_request_data: [
  //     {
  //       phone_number: "6285697780467",
  //     },
  //   ],
  //   family_update_request_data: [
  //     {
  //       name_family: "Sri Windany",
  //       relationship: "ORANG_TUA",
  //       phone_number: "6285348019735",
  //     },
  //   ],
  //   education_history_update_request_data: [
  //     {
  //       id_degree: 5,
  //       id_school: 4752,
  //       id_studyprogram: 90,
  //       start_date: "2025-07-01",
  //       end_date: "2026-01-03",
  //       responsibilities: "anu",
  //     },
  //   ],
  // };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Detect if field has changed
  const hasChanged = (oldValue, newValue) => {
    return oldValue !== newValue;
  };

  const ChangeIndicator = () => (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full ml-2">
      <AlertCircle className="w-3 h-3" />
      Changed
    </span>
  );

  const InfoRow = ({ label, value, oldValue = null, showChange = false }: any) => {
    const isChanged = oldValue !== null && hasChanged(oldValue, value);

    return (
      <div className="py-3 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <span className="text-gray-600 font-medium flex items-center">
            {label}
            {isChanged && <ChangeIndicator />}
          </span>
        </div>
        {isChanged ? (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">Old:</span>
              <span className="bg-red-50 text-red-700 px-3 py-1 rounded line-through">{oldValue || "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">New:</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded font-semibold">{value || "-"}</span>
            </div>
          </div>
        ) : (
          <div className="mt-1 text-gray-900">{value || "-"}</div>
        )}
      </div>
    );
  };

  const SectionHeader = ({ icon: Icon, title, changesCount }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-600" />
        {title}
      </h3>
      {changesCount > 0 && (
        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          {changesCount} Change{changesCount > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "contact", label: "Contact & Family", icon: Phone },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "metadata", label: "Request Info", icon: FileText },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {data.nick_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.full_name}</h1>
              <p className="text-gray-600 text-lg">{data.employee_data.user.employee_number}</p>
              <p className="text-sm text-gray-500">
                {data.employee_data.user.position.name_position} - {data.employee_data.user.division.name_division}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-green-100 text-green-800 px-5 py-2 rounded-full font-semibold text-lg mb-2">
              ✓ Approved
            </div>
            <p className="text-sm text-gray-600">
              <Clock className="inline w-4 h-4 mr-1" />
              {formatDateTime(data.approved_at)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Approved by: User #{data.approved_by}</p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-linear-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-lg shadow-md p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Update Request Summary</h3>
            <p className="text-gray-700 mb-3">
              This employee has requested changes to their personal information. Review the changes marked below.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Request ID</p>
                <p className="font-bold text-blue-600">#{data.id_employee_update_request}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Employee ID</p>
                <p className="font-bold text-gray-900">#{data.id_employee}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Created</p>
                <p className="font-bold text-gray-900 text-sm">{formatDate(data.created_at)}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <p className="font-bold text-green-600">Approved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-5 shadow-sm">
                  <SectionHeader icon={User} title="Personal Details" changesCount={1} />
                  <InfoRow label="Full Name" value={data.full_name} />
                  <InfoRow label="Nick Name" value={data.nick_name} />
                  <InfoRow label="Birth Place" value={data.birth_place} />
                  <InfoRow
                    label="Birth Date"
                    value={formatDate(data.birth_date)}
                    oldValue={formatDate(data.employee_data.birth_date)}
                    showChange={true}
                  />
                  <InfoRow label="Age" value={`${data.employee_data.age} years`} />
                  <InfoRow label="Gender" value={data.gender.charAt(0).toUpperCase() + data.gender.slice(1)} />
                  <InfoRow label="Religion" value={data.religion} />
                  <InfoRow
                    label="Marital Status"
                    value={data.marital_status.charAt(0).toUpperCase() + data.marital_status.slice(1)}
                  />
                  <InfoRow label="Blood Type" value={data.blood_type} />
                </div>

                <div className="space-y-6">
                  <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-sm">
                    <SectionHeader icon={FileText} title="Identification Numbers" changesCount={0} />
                    <InfoRow label="NIK (ID Number)" value={data.nik} />
                    <InfoRow label="NPWP (Tax ID)" value={data.npwp} />
                    <InfoRow label="BPJS Kesehatan" value={data.bpjs_kesehatan} />
                    <InfoRow label="BPJS Ketenagakerjaan" value={data.bpjs_ketenagakerjaan} />
                  </div>

                  <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-sm">
                    <SectionHeader icon={MapPin} title="Address Information" changesCount={0} />
                    <InfoRow label="Street Address" value={data.address} />
                    <InfoRow label="Postal Code" value={data.postal_code} />
                    <InfoRow label="City ID" value={data.city} />
                    <InfoRow label="Province ID" value={data.province} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "employment" && (
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-5 shadow-sm">
              <SectionHeader icon={Building2} title="Employment Information" changesCount={0} />
              <div className="grid md:grid-cols-2 gap-x-8">
                <InfoRow label="Employee Number" value={data.employee_data.user.employee_number} />
                <InfoRow label="Username" value={data.employee_data.user.username} />
                <InfoRow label="Company Email" value={data.employee_data.user.email} />
                <InfoRow label="Position" value={data.employee_data.user.position.name_position} />
                <InfoRow label="Division" value={data.employee_data.user.division.name_division} />
                <InfoRow label="Company" value={data.employee_data.user.company.name_company} />
                <InfoRow label="Company Address" value={data.employee_data.user.company.address_company} />
                <InfoRow label="Company Phone" value={data.employee_data.user.company.phone_company} />
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="bg-linear-to-br from-cyan-50 to-cyan-100 rounded-lg p-5 shadow-sm">
                <SectionHeader icon={Mail} title="Contact Information" changesCount={0} />
                <InfoRow label="Personal Email" value={data.personal_email} />
                {data.contacts_update_request_data.map((contact, idx) => (
                  <InfoRow key={idx} label={`Phone Number ${idx + 1}`} value={contact.phone_number} />
                ))}
              </div>

              <div className="bg-linear-to-br from-pink-50 to-pink-100 rounded-lg p-5 shadow-sm">
                <SectionHeader icon={Users} title="Family Members" changesCount={0} />
                {data.family_update_request_data.map((family, idx) => (
                  <div key={idx} className="mb-4 last:mb-0 p-5 bg-white rounded-lg border-2 border-pink-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <h4 className="font-bold text-gray-900">Family Member {idx + 1}</h4>
                    </div>
                    <InfoRow label="Name" value={family.name_family} />
                    <InfoRow label="Relationship" value={family.relationship.replace(/_/g, " ")} />
                    <InfoRow label="Phone Number" value={family.phone_number} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 shadow-sm">
              <SectionHeader icon={GraduationCap} title="Education History" changesCount={0} />
              {data.education_history_update_request_data.length > 0 ? (
                data.education_history_update_request_data.map((edu, idx) => (
                  <div
                    key={idx}
                    className="mb-4 last:mb-0 p-5 bg-white rounded-lg border-2 border-indigo-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-gray-900">Education Entry {idx + 1}</h4>
                    </div>
                    <InfoRow label="Degree ID" value={edu.id_degree} />
                    <InfoRow label="School ID" value={edu.id_school} />
                    <InfoRow label="Study Program ID" value={edu.id_studyprogram} />
                    <InfoRow label="Start Date" value={formatDate(edu.start_date)} />
                    <InfoRow label="End Date" value={formatDate(edu.end_date)} />
                    <InfoRow label="Responsibilities/Notes" value={edu.responsibilities} />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No education history available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="space-y-6">
              <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-5 shadow-sm">
                <SectionHeader icon={FileText} title="Request Metadata" changesCount={0} />
                <div className="grid md:grid-cols-2 gap-x-8">
                  <InfoRow label="Update Request ID" value={data.id_employee_update_request} />
                  <InfoRow label="Employee ID" value={data.id_employee} />
                  <InfoRow label="Created At" value={data.created_at} />

                  <InfoRow
                    label="Updated At"
                    value={
                      //@ts-ignore
                      data.updated_at
                    }
                  />
                  <InfoRow label="Approved At" value={data.approved_at} />
                  <InfoRow label="Approved By" value={`User #${data.approved_by}`} />
                  <InfoRow
                    label="Created By"
                    value={`User #${
                      //@ts-ignore
                      data.created_by
                    }`}
                  />
                  <InfoRow
                    label="Updated By"
                    value={`User #${
                      //@ts-ignore
                      data.updated_by
                    }`}
                  />
                  <InfoRow
                    label="Rejected At"
                    value={
                      //@ts-ignore
                      data.rejected_at || "N/A"
                    }
                  />
                  <InfoRow
                    label="Rejected By"
                    value={
                      //@ts-ignore
                      data.rejected_by || "N/A"
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
