import { useState } from "react";
import { User, Briefcase, GraduationCap, Users, FileText, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";

const EmployeeProfile = () => {
  const fForm = useFormContext();
  const [activeTab, setActiveTab] = useState("personal");
  const employeeData = fForm.getValues();

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "family", label: "Family", icon: Users },
    { id: "leave", label: "Leave Quota", icon: Calendar },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {employeeData?.employees?.nick_name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{employeeData?.employees?.full_name}</h1>
            <p className="text-gray-600 mb-3">
              {employeeData.position.name_position} • {employeeData.division.name_division}
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                {employeeData.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                {employeeData.employees.contacts[0]?.phone_number}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                {employeeData.employee_number}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {employeeData?.employments?.status?.toUpperCase() ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {/* Personal Info Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Full Name" value={employeeData.employees.full_name} />
                <InfoItem label="Nick Name" value={employeeData.employees.nick_name} />
                <InfoItem label="NIK" value={employeeData.employees.nik} />
                <InfoItem label="NPWP" value={employeeData.employees.npwp} />
                <InfoItem label="Birth Place" value={employeeData.employees.birth_place} />
                <InfoItem label="Birth Date" value={employeeData.employees.birth_date} />
                <InfoItem label="Gender" value={employeeData.employees.gender} />
                <InfoItem label="Religion" value={employeeData.employees.religion} />
                <InfoItem label="Marital Status" value={employeeData.employees.marital_status} />
                <InfoItem label="Blood Type" value={employeeData.employees.blood_type} />
                <InfoItem label="BPJS Kesehatan" value={employeeData.employees.bpjs_kesehatan} />
                <InfoItem label="BPJS Ketenagakerjaan" value={employeeData.employees.bpjs_ketenagakerjaan} />
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Address</p>
                    <p className="text-gray-600 text-xs">{employeeData.employees.address}</p>
                    <p className="text-gray-600 text-xs">
                      {employeeData.employees.city.city_name}, {employeeData.employees.province.province_name}{" "}
                      {employeeData.employees.postal_code}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employment Tab */}
          {activeTab === "employment" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Company" value={employeeData.company.name_company} />
                <InfoItem label="Position" value={employeeData.position.name_position} />
                <InfoItem label="Division" value={employeeData.division.name_division} />
                <InfoItem label="Employment Status" value={employeeData.employments.employment_status} />
                <InfoItem label="Join Date" value={employeeData.employments.join_date} />
                <InfoItem label="Work Duration" value={employeeData.employments.work_duration} />
                <InfoItem label="Work Location" value={employeeData.employments.work_location} />
                <InfoItem
                  label="Manager"
                  value={`${employeeData.employments.manager.name} (${employeeData.employments.manager.employee_number})`}
                />
              </div>

              {employeeData.employees.workhistory.length > 0 && (
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Work History</h3>
                  {employeeData.employees.workhistory.map((work, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                      <h4 className="font-medium text-gray-800">{work.position}</h4>
                      <p className="text-gray-600 text-xs">
                        {work.company_name} • {work.division}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {work.start_date} - {work.end_date}
                      </p>
                      <p className="text-gray-600 text-xs mt-2">{work.responsibilities}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-4">
              {employeeData.employees.educationhistory.map((edu, index) => (
                <div
                  key={index}
                  className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {edu.degree.name_degree}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{edu.school.school_name}</h4>
                      <p className="text-gray-700 mt-1">{edu.studyprogram.program_name}</p>
                      <p className="text-gray-600 text-xs mt-2">
                        {edu.start_date} - {edu.end_date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Family Tab */}
          {activeTab === "family" && (
            <div className="space-y-4">
              {employeeData.employees.family.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{member.name_family}</h4>
                      <p className="text-gray-600 mt-1">{member.relationship}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-xs">{member.phone_number}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leave Quota Tab */}
          {activeTab === "leave" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employeeData.leave_quotas.map((leave, index) => (
                <div
                  key={index}
                  className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200"
                >
                  <h4 className="font-semibold text-gray-800 text-lg mb-3">{leave.typeleave.name_typeleave}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year:</span>
                      <span className="font-medium text-gray-800">{leave.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Days:</span>
                      <span className="font-medium text-gray-800">{leave.total_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Used Days:</span>
                      <span className="font-medium text-red-600">{leave.used_days}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-green-200">
                      <span className="text-gray-600 font-medium">Remaining:</span>
                      <span className="font-bold text-green-600 text-lg">{leave.remaining_days}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-gray-800 font-medium text-xs">{value || "-"}</p>
  </div>
);

export default EmployeeProfile;
