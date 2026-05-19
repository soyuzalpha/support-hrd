import React from "react";
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
  Pencil,
  Lock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isEmpty, toCapitalized } from "@/utils";
import { Spinner } from "@/components/ui/spinner";
import Show from "@/components/show";
import { useUser } from "@/hooks/useUser";

const StaffDetail = ({
  staffData,
  activeTab,
  setActiveTab,
  handleClickDetail,
  handleAddEmployeeData,
  handleChangePassword,
}: {
  staffData: any;
  activeTab: string;
  setActiveTab: any;
  handleClickDetail: () => void;
  handleAddEmployeeData: () => void;
  handleChangePassword?: () => void;
}) => {
  const [mounted, setMounted] = React.useState(false);
  const { user } = useUser();
  const isFirstLogin = isEmpty(user?.first_login_at);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto p-2 mt-3">
      {/* ── First Login Alert Banner (above header) ──────────────────────── */}
      {isFirstLogin && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Password belum diubah</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Anda perlu mengganti password sebelum dapat mengakses profil lengkap Anda.
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white gap-1.5 text-xs"
            onClick={handleChangePassword}
          >
            Ganti Password
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Show.When isTrue={!isFirstLogin}>
        <div className="relative overflow-hidden rounded-xl border bg-background/20 backdrop-blur-md shadow mb-4">
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

          <div className="relative z-10 px-6 pt-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex items-end gap-4">
                <div
                  suppressHydrationWarning
                  className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold shrink-0 translate-y-4 text-black"
                >
                  {(staffData?.nick_name ?? staffData?.full_name ?? "-").charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl text-black font-semibold leading-tight">{staffData?.full_name}</p>
                  <p className="text-sm md:text-base text-black/70">
                    {staffData?.user?.position?.name_position} • {staffData?.user?.division?.name_division}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <Show.When isTrue={!isFirstLogin && !isEmpty(staffData?.id_employee)}>
                  <Button type="button" variant={"outline"} onClick={handleClickDetail}>
                    <Pencil />
                  </Button>
                </Show.When>

                <Show.When isTrue={!isFirstLogin && isEmpty(staffData?.id_employee)}>
                  <Button type="button" variant={"outline"} onClick={handleAddEmployeeData}>
                    Add Employee Data
                  </Button>
                </Show.When>

                <div className="flex flex-wrap gap-2 justify-end">
                  <Badge variant="secondary" className="bg-white/90 text-blue-900">
                    {staffData?.user?.employee_number}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 text-purple-900">
                    {staffData?.user?.company?.name_company}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-medium truncate">{staffData?.personal_email || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{staffData?.contacts?.[0]?.phone_number || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Location</p>
                <p className="font-medium">{staffData?.city?.city_name || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
              </div>
            </div>
          </div>
        </div>
      </Show.When>

      {/* ── Tabs + Lock overlay wrapper ───────────────────────────────── */}
      <div className="relative">
        {/* Lock overlay — covers entire tabs section when isFirstLogin */}
        {isFirstLogin && (
          <div className="absolute inset-0 z-20 rounded-xl overflow-hidden">
            {/* Frosted blur backdrop */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

            {/* Centered lock card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 bg-white/90 border border-amber-200 rounded-2xl px-10 py-8 shadow-xl text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">Profil Terkunci</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ganti password Anda terlebih dahulu untuk membuka akses profil lengkap.
                  </p>
                </div>
                <Button
                  type="button"
                  className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
                  onClick={handleChangePassword}
                >
                  <Lock className="w-4 h-4" />
                  Ganti Password Sekarang
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs content (blurred/locked when isFirstLogin) */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex gap-3 items-start w-full">
            {/* ── Left sidebar ──────────────────────────────────────── */}
            <div className="w-48 shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
                Profile Sections
              </p>
              <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-0.5 p-0">
                {[
                  { value: "personal", icon: User, label: "Personal Info" },
                  { value: "employment", icon: Briefcase, label: "Employment" },
                  { value: "education", icon: GraduationCap, label: "Education" },
                  { value: "documents", icon: FileText, label: "Documents" },
                ].map(({ value, icon: Icon, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="w-full justify-start gap-2.5 px-3 py-2.5 text-sm rounded-lg
                               text-gray-600 hover:bg-gray-50 transition-colors
                               data-[state=active]:bg-orange-50
                               data-[state=active]:text-yellow-900
                               data-[state=active]:font-medium
                               data-[state=active]:shadow-sm"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* ── Right content ─────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Personal Info */}
              <TabsContent value="personal" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="w-4 h-4" /> Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
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
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InfoRow label="Street Address" value={staffData?.address} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-0">
                      <InfoRow label="City" value={staffData?.city?.city_name} />
                      <InfoRow label="Province" value={staffData?.province?.province_name} />
                      <InfoRow label="Postal Code" value={staffData?.postal_code} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                          Email Addresses
                        </p>
                        <InfoRow label="Personal Email" value={staffData?.personal_email} icon={Mail} />
                        <InfoRow label="Work Email" value={staffData?.user?.email} icon={Mail} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                          Phone Numbers
                        </p>
                        {staffData?.contacts?.map((contact: any) => (
                          <InfoRow key={contact?.id_contact} label="Phone" value={contact?.phone_number} icon={Phone} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" /> Family & Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staffData?.family?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {staffData.family.map((member: any) => (
                          <div
                            key={member?.id_family}
                            className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{member?.name_family}</p>
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
              </TabsContent>

              {/* Employment */}
              <TabsContent value="employment" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Current Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
                      <InfoRow label="Employee Number" value={staffData?.user?.employee_number} />
                      <InfoRow label="Username" value={staffData?.user?.username} />
                      <InfoRow label="Position" value={staffData?.user?.position?.name_position} icon={Briefcase} />
                      <InfoRow label="Division" value={staffData?.user?.division?.name_division} />
                      <InfoRow label="Company" value={staffData?.user?.company?.name_company} />
                      <InfoRow label="Work Email" value={staffData?.user?.email} icon={Mail} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Work History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staffData?.workhistory?.length > 0 ? (
                      <div className="space-y-4">
                        {staffData.workhistory.map((work: any) => (
                          <div
                            key={work?.id_workshistory}
                            className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-orange-50 transition-colors rounded-r-md"
                          >
                            <p className="font-semibold text-sm">{work?.position}</p>
                            <p className="text-sm text-gray-600 font-medium">{work?.company_name}</p>
                            <p className="text-sm text-gray-500">{work?.division}</p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {work?.start_date} – {work?.end_date}
                            </p>
                            {work?.responsibilities && (
                              <p className="text-sm text-gray-600 mt-2 pl-3 border-l-2 border-gray-200">
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
              </TabsContent>

              {/* Education */}
              <TabsContent value="education" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> Education History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staffData?.educationhistory?.length > 0 ? (
                      <div className="space-y-4">
                        {staffData.educationhistory.map((edu: any) => (
                          <div
                            key={edu?.id_educationhistory}
                            className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-orange-50 transition-colors rounded-r-md"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{edu?.school?.school_name}</p>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  {edu?.degree?.name_degree} – {edu?.studyprogram?.program_name}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {edu?.start_date} – {edu?.end_date}
                                </p>
                                {edu?.responsibilities && (
                                  <p className="text-sm text-gray-600 mt-2 pl-3 border-l-2 border-gray-200">
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

              {/* Documents */}
              <TabsContent value="documents" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Identity Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          label: "NIK (ID Card)",
                          value: staffData?.nik,
                          bgColor: "bg-blue-100",
                          iconColor: "text-blue-600",
                        },
                        {
                          label: "NPWP (Tax ID)",
                          value: staffData?.npwp,
                          bgColor: "bg-green-100",
                          iconColor: "text-green-600",
                        },
                        {
                          label: "BPJS Kesehatan",
                          value: staffData?.bpjs_kesehatan,
                          bgColor: "bg-red-100",
                          iconColor: "text-red-600",
                        },
                        {
                          label: "BPJS Ketenagakerjaan",
                          value: staffData?.bpjs_ketenagakerjaan,
                          bgColor: "bg-orange-100",
                          iconColor: "text-orange-600",
                        },
                      ].map(({ label, value, bgColor, iconColor }) => (
                        <div key={label} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
                              <FileText className={`w-4 h-4 ${iconColor}`} />
                            </div>
                            <span className="font-semibold text-sm">{label}</span>
                          </div>
                          <p className="text-sm text-gray-600 font-mono">{value || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
            {/* end right content */}
          </div>
          {/* end flex row */}
        </Tabs>
      </div>
      {/* end relative wrapper */}
    </div>
  );
};

export default StaffDetail;

// ─── InfoRow ──────────────────────────────────────────────────────────────────

const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ElementType }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />}
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900 wrap-break-word">{value || "-"}</p>
    </div>
  </div>
);
