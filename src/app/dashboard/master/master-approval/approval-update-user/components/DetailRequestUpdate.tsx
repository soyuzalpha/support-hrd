import Show from "@/components/show";
import { isEmpty } from "@/utils";
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
  IdCard,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const EmployeeUpdateDisplay = () => {
  const fForm = useFormContext();
  const [activeTab, setActiveTab] = useState("personal");
  const data = fForm.getValues();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = () => {
    if (!isEmpty(data?.approved_at)) return "Approved";
    if (!isEmpty(data?.rejected_at)) return "Rejected";
    return "Pending";
  };

  const hasChanged = (oldValue: any, newValue: any) => {
    if (oldValue === null && newValue === null) return false;
    return String(oldValue ?? "") !== String(newValue ?? "");
  };

  const ChangePill = () => (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded ml-1.5">
      <AlertCircle className="w-2.5 h-2.5" />
      changed
    </span>
  );

  const InfoRow = ({ label, value, oldValue = null }: { label: string; value: any; oldValue?: any }) => {
    const isChanged = oldValue !== null && hasChanged(oldValue, value);
    return (
      <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
        <span className="text-xs text-gray-500 shrink-0 min-w-40 flex items-center flex-wrap">
          {label}
          {isChanged && <ChangePill />}
        </span>
        {isChanged ? (
          <div className="text-right space-y-0.5">
            <div className="text-xs text-gray-400 line-through">{oldValue || "—"}</div>
            <div className="text-sm font-medium text-gray-900">{value || "—"}</div>
          </div>
        ) : (
          <span className="text-sm text-gray-900 text-right break-all">{value || "—"}</span>
        )}
      </div>
    );
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    changesCount = 0,
  }: {
    icon: any;
    title: string;
    changesCount?: number;
  }) => (
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </span>
      {changesCount > 0 && (
        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
          {changesCount} change{changesCount > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );

  // Derive changed field count for personal tab
  const personalChanges = [
    hasChanged(data?.employee_data?.birth_date, data?.birth_date),
    hasChanged(data?.employee_data?.birth_place, data?.birth_place),
    hasChanged(data?.employee_data?.gender, data?.gender),
    hasChanged(data?.employee_data?.religion, data?.religion),
    hasChanged(data?.employee_data?.marital_status, data?.marital_status),
    hasChanged(data?.employee_data?.blood_type, data?.blood_type),
    hasChanged(data?.employee_data?.nik, data?.nik),
    hasChanged(data?.employee_data?.npwp, data?.npwp),
    hasChanged(data?.employee_data?.bpjs_kesehatan, data?.bpjs_kesehatan),
    hasChanged(data?.employee_data?.bpjs_ketenagakerjaan, data?.bpjs_ketenagakerjaan),
    hasChanged(data?.employee_data?.address, data?.address),
    hasChanged(data?.employee_data?.city, data?.city),
    hasChanged(data?.employee_data?.province, data?.province),
    hasChanged(data?.employee_data?.postal_code, data?.postal_code),
  ].filter(Boolean).length;

  const status = getStatus();

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "contact", label: "Contact & family", icon: Phone },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "work", label: "Work history", icon: Building2 },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "metadata", label: "Request info", icon: FileText },
  ];

  return (
    <div className="space-y-3">
      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xl font-medium text-gray-500 shrink-0">
            {data.nick_name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-medium text-gray-900">{data.full_name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {data?.employee_data?.user?.employee_number} &middot; {data?.employee_data?.user?.position?.name_position}
              , {data?.employee_data?.user?.division?.name_division}
            </p>
            <p className="text-xs text-gray-400">{data?.employee_data?.user?.company?.name_company}</p>
          </div>
        </div>
        <div className="text-right">
          <Show.When isTrue={isEmpty(data?.approved_at) && isEmpty(data?.rejected_at)}>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
              Pending
            </div>
          </Show.When>
          <Show.When isTrue={!isEmpty(data?.approved_at)}>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-700 inline-block" />
              Approved
            </div>
          </Show.When>
          <Show.When isTrue={!isEmpty(data?.rejected_at)}>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
              Rejected
            </div>
          </Show.When>

          <Show.When isTrue={!isEmpty(data?.approved_at)}>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              {formatDateTime(data.approved_at)}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Approved by: User #{data.approved_by}</p>
          </Show.When>
          <Show.When isTrue={!isEmpty(data?.rejected_at)}>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              {formatDateTime(data.rejected_at)}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Rejected by: User #{data.rejected_by}</p>
          </Show.When>
          <Show.When isTrue={isEmpty(data?.approved_at) && isEmpty(data?.rejected_at)}>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              Submitted {formatDateTime(data.created_at)}
            </p>
          </Show.When>
        </div>
      </div>

      {/* Summary strip */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Request summary</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Request ID", value: `#${data.id_employee_update_request}` },
            { label: "Employee ID", value: `#${data.id_employee}` },
            { label: "Created", value: formatDate(data.created_at) },
            { label: "Status", value: status },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Personal */}
          {activeTab === "personal" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <SectionHeader icon={User} title="Personal details" changesCount={personalChanges} />
                <InfoRow label="Full name" value={data.full_name} oldValue={data?.employee_data?.full_name} />
                <InfoRow label="Nick name" value={data.nick_name} oldValue={data?.employee_data?.nick_name} />
                <InfoRow label="Birth place" value={data.birth_place} oldValue={data?.employee_data?.birth_place} />
                <InfoRow
                  label="Birth date"
                  value={formatDate(data?.birth_date)}
                  oldValue={formatDate(data?.employee_data?.birth_date)}
                />
                <InfoRow label="Age" value={`${data?.employee_data?.age} years`} />
                <InfoRow
                  label="Gender"
                  value={data.gender?.charAt(0).toUpperCase() + data.gender?.slice(1)}
                  oldValue={
                    data?.employee_data?.gender?.charAt(0).toUpperCase() + data?.employee_data?.gender?.slice(1)
                  }
                />
                <InfoRow label="Religion" value={data.religion} oldValue={data?.employee_data?.religion} />
                <InfoRow
                  label="Marital status"
                  value={data.marital_status?.charAt(0).toUpperCase() + data.marital_status?.slice(1)}
                  oldValue={
                    data?.employee_data?.marital_status?.charAt(0).toUpperCase() +
                    data?.employee_data?.marital_status?.slice(1)
                  }
                />
                <InfoRow label="Blood type" value={data.blood_type} oldValue={data?.employee_data?.blood_type} />
              </div>

              <div className="space-y-5">
                <div>
                  <SectionHeader icon={IdCard} title="ID numbers" />
                  <InfoRow label="NIK" value={data.nik} oldValue={data?.employee_data?.nik} />
                  <InfoRow label="NPWP" value={data.npwp} oldValue={data?.employee_data?.npwp} />
                  <InfoRow
                    label="BPJS Kesehatan"
                    value={data.bpjs_kesehatan}
                    oldValue={data?.employee_data?.bpjs_kesehatan}
                  />
                  <InfoRow
                    label="BPJS Ketenagakerjaan"
                    value={data.bpjs_ketenagakerjaan}
                    oldValue={data?.employee_data?.bpjs_ketenagakerjaan}
                  />
                </div>
                <div>
                  <SectionHeader icon={MapPin} title="Address" />
                  <InfoRow label="Street" value={data.address} oldValue={data?.employee_data?.address} />
                  <InfoRow label="Postal code" value={data.postal_code} oldValue={data?.employee_data?.postal_code} />
                  <InfoRow
                    label="City"
                    value={data?.city_data?.city_name ?? data.city}
                    oldValue={data?.employee_data?.city === data.city ? null : data?.employee_data?.city}
                  />
                  <InfoRow
                    label="Province"
                    value={data?.province_data?.province_name ?? data.province}
                    oldValue={data?.employee_data?.province === data.province ? null : data?.employee_data?.province}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Employment */}
          {activeTab === "employment" && (
            <div>
              <SectionHeader icon={Briefcase} title="Employment details" />
              <div className="grid md:grid-cols-2 gap-x-8">
                <InfoRow label="Employee number" value={data?.employee_data?.user?.employee_number} />
                <InfoRow label="Username" value={data?.employee_data?.user?.username} />
                <InfoRow label="Company email" value={data?.employee_data?.user?.email} />
                <InfoRow label="Position" value={data?.employee_data?.user?.position?.name_position} />
                <InfoRow label="Division" value={data?.employee_data?.user?.division?.name_division} />
                <InfoRow label="Company" value={data?.employee_data?.user?.company?.name_company} />
                <InfoRow label="Company address" value={data?.employee_data?.user?.company?.address_company} />
                <InfoRow label="Company phone" value={data?.employee_data?.user?.company?.phone_company} />
              </div>
            </div>
          )}

          {/* Contact & family */}
          {activeTab === "contact" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <SectionHeader icon={Mail} title="Contact info" />
                <InfoRow
                  label="Personal email"
                  value={data.personal_email}
                  oldValue={data?.employee_data?.personal_email}
                />
                {data.contacts_update_request_data.map((contact: any, idx: number) => {
                  const existing = data?.employee_data?.contacts?.[idx];
                  return (
                    <InfoRow
                      key={idx}
                      label={`Phone #${idx + 1}`}
                      value={contact.phone_number}
                      oldValue={existing ? existing.phone_number : null}
                    />
                  );
                })}
              </div>
              <div>
                <SectionHeader icon={Users} title="Family members" />
                {data.family_update_request_data.map((family: any, idx: number) => {
                  const existing = data?.employee_data?.family?.[idx];
                  return (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 last:mb-0">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        Member {idx + 1}
                      </p>
                      <InfoRow label="Name" value={family.name_family} oldValue={existing?.name_family ?? null} />
                      <InfoRow
                        label="Relationship"
                        value={family.relationship.replace(/_/g, " ")}
                        oldValue={existing ? existing.relationship.replace(/_/g, " ") : null}
                      />
                      <InfoRow label="Phone" value={family.phone_number} oldValue={existing?.phone_number ?? null} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {activeTab === "education" && (
            <div>
              <SectionHeader icon={GraduationCap} title="Education history" />
              {data.education_history_update_request_data.length > 0 ? (
                data.education_history_update_request_data.map((edu: any, idx: number) => {
                  const existing = data?.employee_data?.educationhistory?.[idx];
                  return (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 last:mb-0">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3">
                        Entry {idx + 1}
                      </p>
                      <div className="grid md:grid-cols-2 gap-x-8">
                        <InfoRow
                          label="Degree"
                          value={edu?.degree_data?.name_degree ?? edu.id_degree}
                          oldValue={existing ? (existing?.degree?.name_degree ?? existing.id_degree) : null}
                        />
                        <InfoRow
                          label="School"
                          value={edu?.school_data?.school_name ?? edu.id_school}
                          oldValue={existing ? (existing?.school?.school_name ?? existing.id_school) : null}
                        />
                        <InfoRow
                          label="Study program"
                          value={edu?.study_program_data?.program_name ?? edu.id_studyprogram}
                          oldValue={
                            existing ? (existing?.studyprogram?.program_name ?? existing.id_studyprogram) : null
                          }
                        />
                        <InfoRow
                          label="Start date"
                          value={formatDate(edu.start_date)}
                          oldValue={existing ? formatDate(existing.start_date) : null}
                        />
                        <InfoRow
                          label="End date"
                          value={formatDate(edu.end_date)}
                          oldValue={existing ? formatDate(existing.end_date) : null}
                        />
                        <InfoRow
                          label="Notes"
                          value={edu.responsibilities}
                          oldValue={existing?.responsibilities ?? null}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No education history</p>
                </div>
              )}
            </div>
          )}

          {/* Work history */}
          {activeTab === "work" && (
            <div>
              <SectionHeader icon={Building2} title="Work history" />
              {data.work_history_update_request_data?.length > 0 ? (
                data.work_history_update_request_data.map((work: any, idx: number) => {
                  const existing = data?.employee_data?.workhistory?.[idx];
                  return (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 last:mb-0">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3">
                        Entry {idx + 1}
                      </p>
                      <div className="grid md:grid-cols-2 gap-x-8">
                        <InfoRow label="Company" value={work.company_name} oldValue={existing?.company_name ?? null} />
                        <InfoRow label="Position" value={work.position} oldValue={existing?.position ?? null} />
                        <InfoRow label="Division" value={work.division} oldValue={existing?.division ?? null} />
                        <InfoRow
                          label="Start date"
                          value={formatDate(work.start_date)}
                          oldValue={existing ? formatDate(existing.start_date) : null}
                        />
                        <InfoRow
                          label="End date"
                          value={formatDate(work.end_date)}
                          oldValue={existing ? formatDate(existing.end_date) : null}
                        />
                        <InfoRow
                          label="Responsibilities"
                          value={work.responsibilities}
                          oldValue={existing?.responsibilities ?? null}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No work history</p>
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {activeTab === "documents" && (
            <div>
              <SectionHeader icon={FolderOpen} title="Documents on file" />
              {data?.employee_data?.documents?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {data.employee_data.documents.map((doc: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700">{doc.document_type}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{doc.file_name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Uploaded {formatDate(doc.created_at)}</p>
                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-gray-600 underline mt-1 inline-block"
                          >
                            View file →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No documents on file</p>
                </div>
              )}
              {data?.document_update_request_data?.length > 0 && (
                <div className="mt-4">
                  <SectionHeader icon={FileText} title="Requested document changes" />
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.document_update_request_data.map((doc: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700">{doc.document_type}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{doc.file_name}</p>
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-gray-600 underline mt-1 inline-block"
                            >
                              View file →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          {activeTab === "metadata" && (
            <div>
              <SectionHeader icon={FileText} title="Request metadata" />
              <div className="grid md:grid-cols-2 gap-x-8">
                <InfoRow label="Update request ID" value={data.id_employee_update_request} />
                <InfoRow label="Employee ID" value={data.id_employee} />
                <InfoRow label="Created at" value={formatDateTime(data.created_at)} />
                <InfoRow label="Updated at" value={formatDateTime((data as any).updated_at)} />
                <InfoRow label="Approved at" value={formatDateTime(data.approved_at)} />
                <InfoRow label="Approved by" value={data.approved_by ? `User #${data.approved_by}` : "—"} />
                <InfoRow label="Created by" value={`User #${(data as any).created_by}`} />
                <InfoRow
                  label="Updated by"
                  value={(data as any).updated_by ? `User #${(data as any).updated_by}` : "—"}
                />
                <InfoRow label="Rejected at" value={formatDateTime((data as any).rejected_at)} />
                <InfoRow
                  label="Rejected by"
                  value={(data as any).rejected_by ? `User #${(data as any).rejected_by}` : "—"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeUpdateDisplay;

// import Show from "@/components/show";
// import { isEmpty } from "@/utils";
// import {
//   User,
//   Briefcase,
//   Building2,
//   Phone,
//   Users,
//   GraduationCap,
//   FileText,
//   Mail,
//   MapPin,
//   Heart,
//   Clock,
//   AlertCircle,
//   IdCard,
// } from "lucide-react";
// import { useState } from "react";
// import { useFormContext } from "react-hook-form";

// const EmployeeUpdateDisplay = () => {
//   const fForm = useFormContext();
//   const [activeTab, setActiveTab] = useState("personal");
//   const data = fForm.getValues();

//   console.log({ data });

//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return "—";
//     return new Date(dateStr).toLocaleDateString("en-GB", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatDateTime = (dateStr: string) => {
//     if (!dateStr) return "—";
//     return new Date(dateStr).toLocaleString("en-GB", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const hasChanged = (oldValue: any, newValue: any) => oldValue !== newValue;

//   const ChangePill = () => (
//     <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded ml-1.5">
//       <AlertCircle className="w-2.5 h-2.5" />
//       changed
//     </span>
//   );

//   const InfoRow = ({ label, value, oldValue = null }: { label: string; value: any; oldValue?: any }) => {
//     const isChanged = oldValue !== null && hasChanged(oldValue, value);
//     return (
//       <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
//         <span className="text-xs text-gray-500 shrink-0 min-w-[140px] flex items-center">
//           {label}
//           {isChanged && <ChangePill />}
//         </span>
//         {isChanged ? (
//           <div className="text-right space-y-0.5">
//             <div className="text-xs text-gray-400 line-through">{oldValue || "—"}</div>
//             <div className="text-sm font-medium text-gray-900">{value || "—"}</div>
//           </div>
//         ) : (
//           <span className="text-sm text-gray-900 text-right">{value || "—"}</span>
//         )}
//       </div>
//     );
//   };

//   const SectionHeader = ({
//     icon: Icon,
//     title,
//     changesCount = 0,
//   }: {
//     icon: any;
//     title: string;
//     changesCount?: number;
//   }) => (
//     <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
//       <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
//         <Icon className="w-3.5 h-3.5" />
//         {title}
//       </span>
//       {changesCount > 0 && (
//         <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
//           {changesCount} change{changesCount > 1 ? "s" : ""}
//         </span>
//       )}
//     </div>
//   );

//   const tabs = [
//     { id: "personal", label: "Personal", icon: User },
//     { id: "employment", label: "Employment", icon: Briefcase },
//     { id: "contact", label: "Contact & family", icon: Phone },
//     { id: "education", label: "Education", icon: GraduationCap },
//     { id: "work", label: "Work history", icon: Building2 },
//     { id: "metadata", label: "Request info", icon: FileText },
//   ];

//   return (
//     <div className="space-y-3">
//       {/* Header card */}
//       <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xl font-medium text-gray-500 shrink-0">
//             {data.nick_name?.charAt(0)}
//           </div>
//           <div>
//             <h1 className="text-lg font-medium text-gray-900">{data.full_name}</h1>
//             <p className="text-xs text-gray-500 mt-0.5">
//               {data?.employee_data?.user?.employee_number} &middot; {data?.employee_data?.user?.position?.name_position}
//               , {data?.employee_data?.user?.division?.name_division}
//             </p>
//             <p className="text-xs text-gray-400">{data?.employee_data?.user?.company.name_company}</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <Show.When isTrue={isEmpty(data?.approved_at) && isEmpty(data?.rejected_at)}>
//             <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
//               <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
//               Pending
//             </div>
//           </Show.When>

//           <Show.When isTrue={!isEmpty(data?.approved_at)}>
//             <div className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 border border-green-200 px-3 py-1.5 rounded-full">
//               <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
//               Approved
//             </div>
//           </Show.When>

//           <Show.When isTrue={!isEmpty(data?.rejected_at)}>
//             <div className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-100 border border-red-200 px-3 py-1.5 rounded-full">
//               <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
//               Rejected
//             </div>
//           </Show.When>

//           <p className="text-xs text-gray-400 mt-1.5 flex items-center justify-end gap-1">
//             <Clock className="w-3 h-3" />
//             {formatDateTime(data.approved_at)}
//           </p>
//           <p className="text-[11px] text-gray-400 mt-0.5">Approved by: User #{data.approved_by}</p>
//         </div>
//       </div>

//       {/* Summary strip */}
//       <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
//         <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Request summary</p>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//           {[
//             { label: "Request ID", value: `#${data.id_employee_update_request}` },
//             { label: "Employee ID", value: `#${data.id_employee}` },
//             { label: "Created", value: formatDate(data.created_at) },
//             { label: "Status", value: "Approved" },
//           ].map((item) => (
//             <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-3">
//               <p className="text-[10px] text-gray-400 mb-1">{item.label}</p>
//               <p className="text-sm font-medium text-gray-900">{item.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//         <div className="flex border-b border-gray-200 overflow-x-auto">
//           {tabs.map(({ id, label, icon: Icon }) => (
//             <button
//               key={id}
//               onClick={() => setActiveTab(id)}
//               className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
//                 activeTab === id
//                   ? "border-gray-900 text-gray-900"
//                   : "border-transparent text-gray-400 hover:text-gray-700"
//               }`}
//             >
//               <Icon className="w-3.5 h-3.5" />
//               {label}
//             </button>
//           ))}
//         </div>

//         <div className="p-5">
//           {/* Personal */}
//           {activeTab === "personal" && (
//             <div className="grid md:grid-cols-2 gap-5">
//               <div>
//                 <SectionHeader icon={User} title="Personal details" changesCount={1} />
//                 <InfoRow label="Full name" value={data.full_name} />
//                 <InfoRow label="Nick name" value={data.nick_name} />
//                 <InfoRow label="Birth place" value={data.birth_place} />
//                 <InfoRow
//                   label="Birth date"
//                   value={formatDate(data?.birth_date)}
//                   oldValue={formatDate(data?.employee_data?.birth_date)}
//                 />
//                 <InfoRow label="Age" value={`${data.employee_data.age} years`} />
//                 <InfoRow label="Gender" value={data.gender.charAt(0).toUpperCase() + data.gender.slice(1)} />
//                 <InfoRow label="Religion" value={data.religion} />
//                 <InfoRow
//                   label="Marital status"
//                   value={data.marital_status.charAt(0).toUpperCase() + data.marital_status.slice(1)}
//                 />
//                 <InfoRow label="Blood type" value={data.blood_type} />
//               </div>
//               <div className="space-y-5">
//                 <div>
//                   <SectionHeader icon={IdCard} title="ID numbers" />
//                   <InfoRow label="NIK" value={data.nik} />
//                   <InfoRow label="NPWP" value={data.npwp} />
//                   <InfoRow label="BPJS Kesehatan" value={data.bpjs_kesehatan} />
//                   <InfoRow label="BPJS Ketenagakerjaan" value={data.bpjs_ketenagakerjaan} />
//                 </div>
//                 <div>
//                   <SectionHeader icon={MapPin} title="Address" />
//                   <InfoRow label="Street" value={data.address} />
//                   <InfoRow label="Postal code" value={data.postal_code} />
//                   <InfoRow label="City ID" value={data.city} />
//                   <InfoRow label="Province ID" value={data.province} />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Employment */}
//           {activeTab === "employment" && (
//             <div>
//               <SectionHeader icon={Briefcase} title="Employment details" />
//               <div className="grid md:grid-cols-2 gap-x-8">
//                 <InfoRow label="Employee number" value={data.employee_data.user.employee_number} />
//                 <InfoRow label="Username" value={data.employee_data.user.username} />
//                 <InfoRow label="Company email" value={data.employee_data.user.email} />
//                 <InfoRow label="Position" value={data.employee_data.user.position.name_position} />
//                 <InfoRow label="Division" value={data.employee_data.user.division.name_division} />
//                 <InfoRow label="Company" value={data.employee_data.user.company.name_company} />
//                 <InfoRow label="Company address" value={data.employee_data.user.company.address_company} />
//                 <InfoRow label="Company phone" value={data.employee_data.user.company.phone_company} />
//               </div>
//             </div>
//           )}

//           {/* Contact & family */}
//           {activeTab === "contact" && (
//             <div className="grid md:grid-cols-2 gap-5">
//               <div>
//                 <SectionHeader icon={Mail} title="Contact info" />
//                 <InfoRow label="Personal email" value={data.personal_email} />
//                 {data.contacts_update_request_data.map((contact: any, idx: number) => (
//                   <InfoRow key={idx} label={`Phone #${idx + 1}`} value={contact.phone_number} />
//                 ))}
//               </div>
//               <div>
//                 <SectionHeader icon={Users} title="Family members" />
//                 {data.family_update_request_data.map((family: any, idx: number) => (
//                   <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 last:mb-0">
//                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
//                       <Heart className="w-3 h-3" />
//                       Member {idx + 1}
//                     </p>
//                     <InfoRow label="Name" value={family.name_family} />
//                     <InfoRow label="Relationship" value={family.relationship.replace(/_/g, " ")} />
//                     <InfoRow label="Phone" value={family.phone_number} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Education */}
//           {activeTab === "education" && (
//             <div>
//               <SectionHeader icon={GraduationCap} title="Education history" />
//               {data.education_history_update_request_data.length > 0 ? (
//                 data.education_history_update_request_data.map((edu: any, idx: number) => (
//                   <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 last:mb-0">
//                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3">
//                       Entry {idx + 1}
//                     </p>
//                     <div className="grid md:grid-cols-2 gap-x-8">
//                       <InfoRow label="Degree ID" value={edu.id_degree} />
//                       <InfoRow label="School ID" value={edu.id_school} />
//                       <InfoRow label="Study program ID" value={edu.id_studyprogram} />
//                       <InfoRow label="Start date" value={formatDate(edu.start_date)} />
//                       <InfoRow label="End date" value={formatDate(edu.end_date)} />
//                       <InfoRow label="Notes" value={edu.responsibilities} />
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-10">
//                   <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-2" />
//                   <p className="text-sm text-gray-400">No education history</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Work history */}
//           {activeTab === "work" && (
//             <div>
//               <SectionHeader icon={Building2} title="Work history" />
//               {data.work_history_update_request_data?.length > 0 ? (
//                 data.work_history_update_request_data.map((work: any, idx: number) => (
//                   <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 last:mb-0">
//                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3">
//                       Entry {idx + 1}
//                     </p>
//                     <div className="grid md:grid-cols-2 gap-x-8">
//                       <InfoRow label="Company" value={work.company_name} />
//                       <InfoRow label="Position" value={work.position} />
//                       <InfoRow label="Division" value={work.division} />
//                       <InfoRow label="Start date" value={formatDate(work.start_date)} />
//                       <InfoRow label="End date" value={formatDate(work.end_date)} />
//                       <InfoRow label="Responsibilities" value={work.responsibilities} />
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-10">
//                   <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
//                   <p className="text-sm text-gray-400">No work history</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Metadata */}
//           {activeTab === "metadata" && (
//             <div>
//               <SectionHeader icon={FileText} title="Request metadata" />
//               <div className="grid md:grid-cols-2 gap-x-8">
//                 <InfoRow label="Update request ID" value={data.id_employee_update_request} />
//                 <InfoRow label="Employee ID" value={data.id_employee} />
//                 <InfoRow label="Created at" value={formatDateTime(data.created_at)} />
//                 <InfoRow label="Updated at" value={formatDateTime((data as any).updated_at)} />
//                 <InfoRow label="Approved at" value={formatDateTime(data.approved_at)} />
//                 <InfoRow label="Approved by" value={`User #${data.approved_by}`} />
//                 <InfoRow label="Created by" value={`User #${(data as any).created_by}`} />
//                 <InfoRow label="Updated by" value={`User #${(data as any).updated_by}`} />
//                 <InfoRow label="Rejected at" value={(data as any).rejected_at || "—"} />
//                 <InfoRow label="Rejected by" value={(data as any).rejected_by || "—"} />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeUpdateDisplay;
