// V3
"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  GraduationCap,
  Users,
  Phone,
  Briefcase,
  FileText,
  MapPin,
  Mail,
  Calendar,
  Heart,
  Droplet,
  Venus,
  Mars,
  Activity,
} from "lucide-react";
import { toCapitalized } from "@/utils";
import { useUser } from "@/context/app-context";
import { useMutation } from "@tanstack/react-query";
import { getEmployeeByUser } from "../master/master-employee/api/master-position-service";
import { Spinner } from "@/components/ui/spinner";

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

const StaffProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const { user, updateUser } = useUser();

  const userDetail = useMutation({
    mutationFn: getEmployeeByUser,
  });

  useEffect(() => {
    if (user) {
      userDetail.mutate(user.id_user, {
        onSuccess: (res) => {
          updateUser({
            ...user,
            employee_datas: res?.data,
          });
        },
      });
    }
  }, [user?.id_user]);

  const staffData = user?.employee_datas ?? DEFAULT_STAFF_DATA;

  const InfoRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500 mt-1 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 wrap-break-word">{value || "-"}</p>
      </div>
    </div>
  );

  if (userDetail.isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto p-2 mt-3">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-lg border bg-background/20 backdrop-blur-md shadow mb-6">
        {/* HEADER */}
        <div className="relative min-h-[200px] md:min-h-[180px] px-6 pt-6">
          {/* Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255, 182, 153, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 244, 214, 0.5) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 182, 153, 0.1) 0%, transparent 50%)
        `,
            }}
          />

          {/* Header Content */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 h-full">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold shrink-0 translate-y-6 text-black">
                {staffData?.nick_name?.charAt(0) || staffData?.full_name?.charAt(0)}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl text-black font-semibold">{staffData?.full_name}</p>
                <p className="text-sm md:text-base text-black/80">
                  {staffData?.user?.position?.name_position} • {staffData?.user?.division?.name_division}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="secondary" className="bg-white/90 text-blue-900">
                {staffData?.user?.employee_number}
              </Badge>
              <Badge variant="secondary" className="bg-white/90 text-purple-900">
                {staffData?.user?.company?.name_company}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* DETAIL SECTION */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Email</p>
              <p className="font-medium truncate">{staffData?.personal_email}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Phone</p>
              <p className="font-medium">{staffData?.contacts?.[0]?.phone_number || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Location</p>
              <p className="font-medium">{staffData?.city?.city_name}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Status</p>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section with Sidebar Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Sidebar with Tab List */}
          <div className="lg:col-span-1 h-fit">
            <div className="bg-background/20 px-3 py-3 shadow backdrop-blur-md rounded-2xl mb-3">
              <CardTitle className="text-lg">Profile Sections</CardTitle>
            </div>
            <div className="p-0">
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-2 space-y-1">
                <TabsTrigger
                  value="personal"
                  className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-orange-50 data-[state=active]:text-yellow-900"
                >
                  <User className="w-4 h-4" />
                  <span>Personal Info</span>
                </TabsTrigger>
                <TabsTrigger
                  value="employment"
                  className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-orange-50 data-[state=active]:text-yellow-900"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Employment</span>
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-orange-50 data-[state=active]:text-yellow-900"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-orange-50 data-[state=active]:text-yellow-900"
                >
                  <FileText className="w-4 h-4" />
                  <span>Documents</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Personal Info Tab */}
            <TabsContent value="personal" className="mt-0">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      <InfoRow label="Full Name" value={staffData?.full_name} />
                      <InfoRow label="Nickname" value={staffData?.nick_name} />
                      <InfoRow label="Birth Date" value={staffData?.birth_date} icon={Calendar} />
                      <InfoRow label="Birth Place" value={staffData?.birth_place} icon={MapPin} />
                      <InfoRow
                        label="Gender"
                        value={toCapitalized(staffData?.gender ?? "-")}
                        icon={staffData?.gender === "male" ? Venus : Mars}
                      />
                      <InfoRow label="Blood Type" value={staffData?.blood_type} icon={Droplet} />
                      <InfoRow label="Religion" value={staffData?.religion} icon={Heart} />
                      <InfoRow
                        label="Marital Status"
                        value={toCapitalized(staffData?.marital_status ?? "-")}
                        icon={Activity}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Identity Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      <InfoRow label="NIK" value={staffData?.nik} />
                      <InfoRow label="NPWP" value={staffData?.npwp} />
                      <InfoRow label="BPJS Kesehatan" value={staffData?.bpjs_kesehatan} />
                      <InfoRow label="BPJS Ketenagakerjaan" value={staffData?.bpjs_ketenagakerjaan} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <InfoRow label="Street Address" value={staffData?.address} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                        <InfoRow label="City" value={staffData?.city?.city_name} />
                        <InfoRow label="Province" value={staffData?.province?.province_name} />
                        <InfoRow label="Postal Code" value={staffData?.postal_code} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-sm mb-3 text-gray-700">Email Addresses</h3>
                        <div className="space-y-2">
                          <InfoRow label="Personal Email" value={staffData?.personal_email} icon={Mail} />
                          <InfoRow label="Work Email" value={staffData?.user?.email} icon={Mail} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-3 text-gray-700">Phone Numbers</h3>
                        <div className="space-y-2">
                          {staffData?.contacts?.map((contact) => (
                            <InfoRow
                              key={contact?.id_contact}
                              label="Phone Number"
                              value={contact?.phone_number}
                              icon={Phone}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Family & Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staffData?.family?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {staffData?.family?.map((member) => (
                          <div
                            key={member?.id_family}
                            className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm">{member?.name_family}</h4>
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {member?.relationship?.replace("_", " ")}
                                </Badge>
                                <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  {member?.phone_number}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No family contacts available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Employment Tab */}
            <TabsContent value="employment" className="mt-0">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Current Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      <InfoRow label="Employee Number" value={staffData?.user?.employee_number} />
                      <InfoRow label="Position" value={staffData?.user?.position?.name_position} icon={Briefcase} />
                      <InfoRow label="Division" value={staffData?.user?.division?.name_division} />
                      <InfoRow label="Company" value={staffData?.user?.company?.name_company} />
                      <InfoRow label="Username" value={staffData?.user?.username} />
                      <InfoRow label="Work Email" value={staffData?.user?.email} icon={Mail} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Work History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staffData?.workhistory?.length > 0 ? (
                      <div className="space-y-4">
                        {staffData?.workhistory?.map((work) => (
                          <div
                            key={work?.id_workshistory}
                            className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-orange-50 transition-colors rounded-md overflow-hidden"
                          >
                            <h4 className="font-semibold text-base">{work?.position}</h4>
                            <p className="text-sm text-gray-600 font-medium">{work?.company_name}</p>
                            <p className="text-sm text-gray-500">{work?.division}</p>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {work?.start_date} - {work?.end_date}
                            </p>
                            {work?.responsibilities && (
                              <p className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-gray-200">
                                {work?.responsibilities}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No work history available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {staffData?.educationhistory?.length > 0 ? (
                    <div className="space-y-4">
                      {staffData?.educationhistory?.map((edu) => (
                        <div
                          key={edu?.id_educationhistory}
                          className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-orange-50 transition-colors rounded-md overflow-hidden"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                              <GraduationCap className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-base">{edu?.school?.school_name}</h4>
                              <p className="text-sm text-gray-600 font-medium mt-1">
                                {edu?.degree?.name_degree} - {edu?.studyprogram?.program_name}
                              </p>
                              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {edu?.start_date} - {edu?.end_date}
                              </p>
                              {edu?.responsibilities && (
                                <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-gray-200">
                                  {edu?.responsibilities}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No education history available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Identity Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-semibold">NIK (ID Card)</span>
                      </div>
                      <p className="text-sm text-gray-600 font-mono">{staffData?.nik}</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="font-semibold">NPWP (Tax ID)</span>
                      </div>
                      <p className="text-sm text-gray-600 font-mono">{staffData?.npwp}</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="font-semibold">BPJS Kesehatan</span>
                      </div>
                      <p className="text-sm text-gray-600 font-mono">{staffData?.bpjs_kesehatan}</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="font-semibold">BPJS Ketenagakerjaan</span>
                      </div>
                      <p className="text-sm text-gray-600 font-mono">{staffData?.bpjs_ketenagakerjaan}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default StaffProfile;

// V2
// "use client";

// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   User,
//   GraduationCap,
//   Users,
//   Phone,
//   Briefcase,
//   FileText,
//   MapPin,
//   Mail,
//   Calendar,
//   Heart,
//   Droplet,
// } from "lucide-react";

// const StaffProfile = () => {
//   const [activeTab, setActiveTab] = useState("personal");

//   // Sample data based on your API
//   const staffData = {
//     id_employee: 2,
//     nik: "1234567890",
//     npwp: "1234567890123456",
//     bpjs_kesehatan: "1234567890",
//     bpjs_ketenagakerjaan: "1234567898765",
//     full_name: "Asep Saepudin",
//     nick_name: "Asep",
//     personal_email: "asep@mail.com",
//     birth_place: "Tangerang",
//     birth_date: "2025-12-10",
//     gender: "male",
//     religion: "Islam",
//     marital_status: "single",
//     blood_type: "AB+",
//     address: "Kp Nambo Rt/Rw 003/04 No.64, Serpong Tangerang Selatan, 15311",
//     city: {
//       city_name: "Kota Tangerang Selatan",
//     },
//     province: {
//       province_name: "Banten",
//     },
//     postal_code: "15311",
//     age: 0,
//     user: {
//       name: "Asep Saepudin",
//       username: "aseppp",
//       employee_number: "TRANSTAMA-3",
//       email: "asep@mail.com",
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
//     contacts: [
//       {
//         id_contact: 59,
//         phone_number: "6281234567890",
//       },
//     ],
//     family: [
//       {
//         id_family: 59,
//         name_family: "Test",
//         relationship: "LAINNYA",
//         phone_number: "628111223344",
//       },
//     ],
//     workhistory: [
//       {
//         id_workshistory: 25,
//         company_name: "TEST",
//         position: "test",
//         division: "test",
//         start_date: "2025-12-01",
//         end_date: "2025-12-11",
//         responsibilities: "test",
//       },
//     ],
//     educationhistory: [
//       {
//         id_educationhistory: 47,
//         start_date: "2025-12-01",
//         end_date: "2025-12-03",
//         responsibilities: "test",
//         degree: {
//           name_degree: "S1",
//         },
//         studyprogram: {
//           program_name: "Administrasi",
//         },
//         school: {
//           school_name: "AKADEMI ADMINISTRASI RUMAH SAKIT MATARAM",
//         },
//       },
//     ],
//   };

//   const InfoRow = ({ label, value, icon: Icon }: any) => (
//     <div className="flex items-start gap-3 py-2">
//       {Icon && <Icon className="w-4 h-4 text-gray-500 mt-1 shrink-0" />}
//       <div className="flex-1 min-w-0">
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="text-sm font-medium text-gray-900 wrap-break-word">{value || "-"}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="w-full container mx-auto p-2 mt-4">
//       {/* Header Section */}
//       <Card className="mb-6">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
//             <div className="flex items-start gap-4">
//               <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
//                 {staffData.nick_name?.charAt(0) || staffData.full_name?.charAt(0)}
//               </div>
//               <div>
//                 <CardTitle className="text-2xl">{staffData.full_name}</CardTitle>
//                 <CardDescription className="mt-1">
//                   {staffData.user.employee_number} • {staffData.user.position.name_position}
//                 </CardDescription>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   <Badge variant="secondary">{staffData.user.division.name_division}</Badge>
//                   <Badge variant="outline">{staffData.user.company.name_company}</Badge>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//       </Card>

//       {/* Tabs Section */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto">
//           <TabsTrigger value="personal" className="flex items-center gap-2 py-2">
//             <User className="w-4 h-4" />
//             <span className="hidden sm:inline">Personal</span>
//           </TabsTrigger>
//           <TabsTrigger value="employment" className="flex items-center gap-2 py-2">
//             <Briefcase className="w-4 h-4" />
//             <span className="hidden sm:inline">Employment</span>
//           </TabsTrigger>
//           <TabsTrigger value="contact" className="flex items-center gap-2 py-2">
//             <Phone className="w-4 h-4" />
//             <span className="hidden sm:inline">Contact</span>
//           </TabsTrigger>
//           <TabsTrigger value="family" className="flex items-center gap-2 py-2">
//             <Users className="w-4 h-4" />
//             <span className="hidden sm:inline">Family</span>
//           </TabsTrigger>
//           <TabsTrigger value="education" className="flex items-center gap-2 py-2">
//             <GraduationCap className="w-4 h-4" />
//             <span className="hidden sm:inline">Education</span>
//           </TabsTrigger>
//           <TabsTrigger value="documents" className="flex items-center gap-2 py-2">
//             <FileText className="w-4 h-4" />
//             <span className="hidden sm:inline">Documents</span>
//           </TabsTrigger>
//         </TabsList>

//         {/* Personal Info Tab */}
//         <TabsContent value="personal" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Basic Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-1">
//                 <InfoRow label="Full Name" value={staffData.full_name} icon={User} />
//                 <InfoRow label="Nickname" value={staffData.nick_name} icon={User} />
//                 <InfoRow label="Birth Date" value={staffData.birth_date} icon={Calendar} />
//                 <InfoRow label="Birth Place" value={staffData.birth_place} icon={MapPin} />
//                 <InfoRow label="Gender" value={staffData.gender} icon={User} />
//                 <InfoRow label="Blood Type" value={staffData.blood_type} icon={Droplet} />
//                 <InfoRow label="Religion" value={staffData.religion} icon={Heart} />
//                 <InfoRow label="Marital Status" value={staffData.marital_status} />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Identity & Address</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-1">
//                 <InfoRow label="NIK" value={staffData.nik} />
//                 <InfoRow label="NPWP" value={staffData.npwp} />
//                 <InfoRow label="BPJS Kesehatan" value={staffData.bpjs_kesehatan} />
//                 <InfoRow label="BPJS Ketenagakerjaan" value={staffData.bpjs_ketenagakerjaan} />
//                 <Separator className="my-3" />
//                 <InfoRow label="Address" value={staffData.address} icon={MapPin} />
//                 <InfoRow label="City" value={staffData.city.city_name} />
//                 <InfoRow label="Province" value={staffData.province.province_name} />
//                 <InfoRow label="Postal Code" value={staffData.postal_code} />
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Employment Tab */}
//         <TabsContent value="employment" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Current Position</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-1">
//                 <InfoRow label="Employee Number" value={staffData.user.employee_number} />
//                 <InfoRow label="Position" value={staffData.user.position.name_position} icon={Briefcase} />
//                 <InfoRow label="Division" value={staffData.user.division.name_division} />
//                 <InfoRow label="Company" value={staffData.user.company.name_company} />
//                 <InfoRow label="Username" value={staffData.user.username} />
//                 <InfoRow label="Work Email" value={staffData.user.email} icon={Mail} />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Work History</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {staffData.workhistory.length > 0 ? (
//                   <div className="space-y-4">
//                     {staffData.workhistory.map((work) => (
//                       <div key={work.id_workshistory} className="border-l-2 border-blue-500 pl-4">
//                         <h4 className="font-semibold text-sm">{work.position}</h4>
//                         <p className="text-sm text-gray-600">{work.company_name}</p>
//                         <p className="text-xs text-gray-500">{work.division}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {work.start_date} - {work.end_date}
//                         </p>
//                         {work.responsibilities && <p className="text-sm text-gray-600 mt-2">{work.responsibilities}</p>}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No work history available</p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Contact Tab */}
//         <TabsContent value="contact" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Contact Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-sm mb-3">Email Addresses</h3>
//                   <InfoRow label="Personal Email" value={staffData.personal_email} icon={Mail} />
//                   <InfoRow label="Work Email" value={staffData.user.email} icon={Mail} />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-sm mb-3">Phone Numbers</h3>
//                   {staffData.contacts.map((contact) => (
//                     <InfoRow key={contact.id_contact} label="Phone Number" value={contact.phone_number} icon={Phone} />
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Family Tab */}
//         <TabsContent value="family" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Family Contacts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {staffData.family.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {staffData.family.map((member) => (
//                     <div key={member.id_family} className="border rounded-lg p-4">
//                       <div className="flex items-start gap-3">
//                         <Users className="w-5 h-5 text-gray-500 mt-1" />
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-sm">{member.name_family}</h4>
//                           <Badge variant="secondary" className="mt-1 text-xs">
//                             {member.relationship.replace("_", " ")}
//                           </Badge>
//                           <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
//                             <Phone className="w-3 h-3" />
//                             {member.phone_number}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">No family contacts available</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Education Tab */}
//         <TabsContent value="education" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Education History</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {staffData.educationhistory.length > 0 ? (
//                 <div className="space-y-4">
//                   {staffData.educationhistory.map((edu) => (
//                     <div key={edu.id_educationhistory} className="border-l-2 border-purple-500 pl-4">
//                       <div className="flex items-start gap-2">
//                         <GraduationCap className="w-5 h-5 text-purple-500 mt-1" />
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-sm">{edu.school.school_name}</h4>
//                           <p className="text-sm text-gray-600 mt-1">
//                             {edu.degree.name_degree} - {edu.studyprogram.program_name}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {edu.start_date} - {edu.end_date}
//                           </p>
//                           {edu.responsibilities && <p className="text-sm text-gray-600 mt-2">{edu.responsibilities}</p>}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">No education history available</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Documents Tab */}
//         <TabsContent value="documents" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Identity Documents</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="border rounded-lg p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FileText className="w-4 h-4 text-gray-500" />
//                     <span className="font-semibold text-sm">NIK</span>
//                   </div>
//                   <p className="text-sm text-gray-600">{staffData.nik}</p>
//                 </div>
//                 <div className="border rounded-lg p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FileText className="w-4 h-4 text-gray-500" />
//                     <span className="font-semibold text-sm">NPWP</span>
//                   </div>
//                   <p className="text-sm text-gray-600">{staffData.npwp}</p>
//                 </div>
//                 <div className="border rounded-lg p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FileText className="w-4 h-4 text-gray-500" />
//                     <span className="font-semibold text-sm">BPJS Kesehatan</span>
//                   </div>
//                   <p className="text-sm text-gray-600">{staffData.bpjs_kesehatan}</p>
//                 </div>
//                 <div className="border rounded-lg p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FileText className="w-4 h-4 text-gray-500" />
//                     <span className="font-semibold text-sm">BPJS Ketenagakerjaan</span>
//                   </div>
//                   <p className="text-sm text-gray-600">{staffData.bpjs_ketenagakerjaan}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default StaffProfile;

// V1
// "use client";

// import { AppContainer } from "@/components/app-container";
// import { useUser } from "@/context/app-context";
// import { useMutation } from "@tanstack/react-query";
// import { useEffect } from "react";
// import EmployeeHeader from "@/components/employee/employee-header";
// import PersonalInfoSection from "@/components/employee/personal-info-section";
// import ContactsSection from "@/components/employee/contacts-section";
// import FamilySection from "@/components/employee/family-section";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { FormProvider, useForm } from "react-hook-form";
// import LoadingLayer from "@/components/loading";
// import { LeaveQuotaList } from "@/components/LeaveQuotaDisplay";
// import { getUserById } from "../master/master-user/api/master-position-service";
// import { getEmployeeByUser } from "../master/master-employee/api/master-position-service";

// const Dashboard = () => {
//   const fForm = useForm();
//   const { user, updateUser } = useUser();

//   const mutationGetUser = useMutation({
//     mutationFn: getUserById,
//   });

//   const userDetail = useMutation({
//     mutationFn: getEmployeeByUser,
//   });

//   useEffect(() => {
//     if (user) {
//       mutationGetUser.mutate(user.id_user, {
//         onSuccess: (res) => {
//           updateUser({
//             ...user,
//             userDatas: res?.data,
//           });

//           if (user) {
//             userDetail.mutate(user.id_user, {
//               onSuccess: (res) => {
//                 fForm.setValue("employee_data", res?.data);
//               },
//             });
//           }
//         },
//         onError: (err) => {
//           console.log({ err });
//         },
//       });
//     }
//   }, [user?.id_user]);

//   console.log({ user });

//   return (
//     <FormProvider {...fForm}>
//       <LoadingLayer isLoading={mutationGetUser.isPending || userDetail.isPending} />

//       <AppContainer title="User Info">
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             {/* Header Section */}
//             <EmployeeHeader employee={fForm.getValues("employee_data")} />

//             {/* Main Content Grid */}
//             <div className="grid gap-6 mt-8 lg:grid-cols-3">
//               {/* Left Column - Personal Info */}
//               <div className="lg:col-span-2 space-y-6">
//                 <PersonalInfoSection employee={fForm.getValues("employee_data")} />
//                 <ContactsSection contacts={fForm.getValues("employee_data")?.contacts} />
//                 <FamilySection family={fForm.getValues("employee_data")?.family} />
//               </div>

//               {/* Right Column - Quick Info */}
//               <div className="space-y-6">
//                 <Card className="border-l-4 border-l-red-500">
//                   <CardHeader>
//                     <CardTitle className="text-lg">User Info</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Employee Number</p>
//                       <p className="font-semibold">{fForm.getValues("employee_data")?.user?.employee_number}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Username</p>
//                       <p className="font-semibold">{fForm.getValues("employee_data")?.user?.username}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Company</p>
//                       <p className="font-semibold">{fForm.getValues("employee_data")?.user?.company?.name_company}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Position</p>
//                       <p className="font-semibold">{fForm.getValues("employee_data")?.user?.position?.name_position}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Division</p>
//                       <p className="font-semibold">{fForm.getValues("employee_data")?.user?.division?.name_division}</p>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-l-4 border-l-red-500">
//                   <CardHeader>
//                     <CardTitle className="text-lg">Identities</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <div>
//                       <p className="text-xs text-muted-foreground">NIK</p>
//                       <p className="font-mono text-xs">{fForm.getValues("employee_data")?.nik}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">NPWP</p>
//                       <p className="font-mono text-xs">{fForm.getValues("employee_data")?.npwp}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">BPJS Kesehatan</p>
//                       <p className="font-mono text-xs">{fForm.getValues("employee_data")?.bpjs_kesehatan}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">BPJS Ketenagakerjaan</p>
//                       <p className="font-mono text-xs">{fForm.getValues("employee_data")?.bpjs_ketenagakerjaan}</p>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <LeaveQuotaList data={user?.userDatas?.leave_quotas} />
//               </div>
//             </div>

//             {/* Activity Logs Section */}
//             {/* <div className="mt-8">
//             <ActivityLogsSection logs={fForm.getValues("employee_data")?.logs} />
//           </div> */}

//             {/* <div className="flex flex-col gap-4  md:gap-6">
//             <SectionCards />
//             <div className="">
//               <ChartAreaInteractive />
//             </div>
//           </div> */}
//           </div>
//         </div>
//       </AppContainer>
//     </FormProvider>
//   );
// };

// export default Dashboard;

// function formatDate(dateString: string | null) {
//   if (!dateString) return "-";
//   return new Date(dateString).toLocaleString("id-ID", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }
