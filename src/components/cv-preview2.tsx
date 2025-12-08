import { Briefcase, Mail, Phone } from "lucide-react";
import { formatDate } from "@/utils/dates";

export const CVContent = ({ userData }: { userData: any }) => (
  <div>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>

    <div className="bg-white print-content" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header Section */}
      <div className="bg-[#7B091F] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{userData?.employees?.full_name}</h1>
          <p className="text-xl text-slate-200 mb-4">
            {userData?.position?.name_position} - {userData?.division?.name_division}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{userData?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>{userData?.employees?.contacts?.[0]?.phone_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} />
              <span>{userData?.employee_number}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Personal Information */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium">Full Name</p>
              <p className="text-slate-800">{userData?.employees?.full_name}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">NIK</p>
              <p className="text-slate-800">{userData?.employees?.nik}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Birth Place & Date</p>
              <p className="text-slate-800">
                {userData?.employees?.birth_place}, {formatDate(userData?.employees?.birth_date)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Age</p>
              <p className="text-slate-800">{userData?.employees?.age} years</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Gender</p>
              <p className="text-slate-800 capitalize">{userData?.employees?.gender}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Blood Type</p>
              <p className="text-slate-800">{userData?.employees?.blood_type}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Religion</p>
              <p className="text-slate-800">{userData?.employees?.religion}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Marital Status</p>
              <p className="text-slate-800 capitalize">{userData?.employees?.marital_status}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 font-medium">Address</p>
              <p className="text-slate-800">
                {userData?.employees?.address}, {userData?.employees?.city?.city_name},{" "}
                {userData?.employees?.province?.province_name} {userData?.employees?.postal_code}
              </p>
            </div>
          </div>
        </section>

        {/* Employment Information */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
            Employment Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium">Company</p>
              <p className="text-slate-800">{userData?.company?.name_company}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Position</p>
              <p className="text-slate-800">{userData?.position?.name_position}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Division</p>
              <p className="text-slate-800">{userData?.division?.name_division}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Employment Status</p>
              <p className="text-slate-800 capitalize">{userData?.employments?.employment_status}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Join Date</p>
              <p className="text-slate-800">{formatDate(userData?.employments?.join_date)}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Work Duration</p>
              <p className="text-slate-800">{userData?.employments?.work_duration}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Work Location</p>
              <p className="text-slate-800">{userData?.employments?.work_location}</p>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
            Emergency Contact
          </h2>
          {userData?.employees?.family.map((member, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 font-medium">Name</p>
                <p className="text-slate-800">{member?.name_family}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Relationship</p>
                <p className="text-slate-800">{member?.relationship.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Phone Number</p>
                <p className="text-slate-800">{member?.phone_number}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Education History */}
        {userData?.employees?.educationhistory && userData?.employees?.educationhistory?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
              Education History
            </h2>
            <div className="space-y-4">
              {userData?.employees?.educationhistory?.map((edu, index) => (
                <div key={index} className="border-l-4 border-slate-300 pl-4">
                  <h3 className="font-semibold text-slate-800">
                    {edu?.degree?.name_degree} - {edu?.studyprogram?.program_name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">{edu?.school?.school_name}</p>
                  <p className="text-slate-500 text-sm">
                    {formatDate(edu?.start_date)} - {formatDate(edu?.end_date)}
                  </p>
                  {edu?.responsibilities && <p className="text-slate-600 text-sm mt-2">{edu?.responsibilities}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work History */}
        {userData?.employees?.workhistory && userData?.employees?.workhistory?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
              Work History
            </h2>
            <div className="space-y-4">
              {userData?.employees?.workhistory?.map((work, index) => (
                <div key={index} className="border-l-4 border-slate-300 pl-4">
                  <h3 className="font-semibold text-slate-800">{work?.position}</h3>
                  <p className="text-slate-600 text-sm mb-1">
                    {work?.company_name} - {work?.division}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {formatDate(work?.start_date)} - {formatDate(work?.end_date)}
                  </p>
                  {work?.responsibilities && <p className="text-slate-600 text-sm mt-2">{work?.responsibilities}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leave Quota */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 pb-2 border-slate-300">
            Leave Quota ({userData?.leave_quotas[0]?.year})
          </h2>
          <div className="space-y-2">
            {userData?.leave_quotas?.map((quota, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded">
                <span className="font-medium text-slate-800">{quota?.typeleave?.name_typeleave}</span>
                <span className="text-slate-600">
                  {quota?.remaining_days} / {quota?.total_days} days remaining
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Document Images - Single Page */}
      {userData?.employees?.documents?.length > 0 && (
        <div className="page-break-before max-w-4xl mx-auto p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 pb-2 border-b-2 border-slate-300">Documents</h2>
          <div className="space-y-6">
            {userData?.employees?.documents.map((doc, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2">
                  <p className="font-medium text-slate-800">{doc?.document_type}</p>
                </div>
                <div className="p-4">
                  <img
                    src={doc.url}
                    alt={doc.document_type}
                    className="w-full h-auto rounded"
                    onError={(e) => {
                      //@ts-ignore
                      e.target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2394a3b8" font-family="Arial" font-size="16"%3EImage not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-8 pb-8 pt-4 text-center text-xs text-slate-500">
        <p>Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
    </div>
  </div>
);
