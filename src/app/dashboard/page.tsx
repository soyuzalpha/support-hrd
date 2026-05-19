"use client";

import {
  useDashboardUsersActive,
  useDashboardUsersByEducation,
  useDashboardUsersByCompany,
  useDashboardUsersByCompanyDivision,
  useDashboardUsersByCompanyPosition,
  useDashboardUsersByPosition,
  useDashboardUsersByProvince,
  useDashboardUsersByCity,
  useDashboardUsersByGender,
  useDashboardUsersByAgeGroup,
  useDashboardUsersNotActive,
  useDashboardUsersByYearsOfService,
} from "@/hooks/useDashboard";

import CardSummaryDashboard, { ListDataRenderer } from "@/components/CardSummaryDashboard";

import {
  Users,
  GraduationCap,
  Building2,
  Network,
  Briefcase,
  MapPin,
  Building,
  Users2,
  UserRound,
  Clock,
  UserX,
} from "lucide-react";
import DashboardGreeting from "@/components/DashboardGreeting";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: usersActiveData, isLoading: isLoadingUsersActive } = useDashboardUsersActive();

  const { data: usersByEducationData, isLoading: isLoadingUsersByEducation } = useDashboardUsersByEducation();

  const { data: usersByCompanyData, isLoading: isLoadingUsersByCompany } = useDashboardUsersByCompany();

  const { data: usersByCompanyDivisionData, isLoading: isLoadingUsersByCompanyDivision } =
    useDashboardUsersByCompanyDivision();

  const { data: usersByCompanyPositionData, isLoading: isLoadingUsersByCompanyPosition } =
    useDashboardUsersByCompanyPosition();

  const { data: usersByPositionData, isLoading: isLoadingUsersByPosition } = useDashboardUsersByPosition();

  const { data: usersByProvinceData, isLoading: isLoadingUsersByProvince } = useDashboardUsersByProvince();

  const { data: usersByCityData, isLoading: isLoadingUsersByCity } = useDashboardUsersByCity();

  const { data: usersByGenderData, isLoading: isLoadingUsersByGender } = useDashboardUsersByGender();

  const { data: usersByAgeGroupData, isLoading: isLoadingUsersByAgeGroup } = useDashboardUsersByAgeGroup();

  const { data: usersByYearsOfServiceData, isLoading: isLoadingUsersByYearsOfService } =
    useDashboardUsersByYearsOfService();

  const { data: usersNotActiveData, isLoading: isLoadingUsersNotActive } = useDashboardUsersNotActive();

  return (
    <div className="space-y-3 px-3">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <DashboardGreeting />

        <GroupedCard icon={UserRound} label="Gender & education">
          <div className="flex gap-3 min-h-0  ">
            {/* Gender column */}
            <div className="flex-1 min-w-0 ">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-2">
                Gender
              </p>
              {isLoadingUsersByGender ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <ListDataRenderer data={usersByGenderData?.data?.users_by_gender} />
              )}
            </div>

            <DividerCol />

            {/* Education column */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-2">
                Education
              </p>
              {isLoadingUsersByEducation ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <ListDataRenderer data={usersByEducationData?.data?.users_by_education} />
              )}
            </div>
          </div>
        </GroupedCard>

        {/* ── Section: Location ─────────────────────────────────────────── */}
        <SectionLabel>Location</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CardSummaryDashboard
            title="By province"
            renderValue={() => <ListDataRenderer data={usersByProvinceData?.data?.users_by_province} />}
            isLoading={isLoadingUsersByProvince}
            icon={MapPin}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
          <CardSummaryDashboard
            title="By city"
            renderValue={() => <ListDataRenderer data={usersByCityData?.data?.users_by_city} />}
            isLoading={isLoadingUsersByCity}
            icon={Building}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
        </div>

        {/* ── Section: Workforce ────────────────────────────────────────── */}
        <SectionLabel>Workforce</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <CardSummaryDashboard
            title="By company"
            renderValue={() => <ListDataRenderer data={usersByCompanyData?.data?.users_by_company} />}
            isLoading={isLoadingUsersByCompany}
            icon={Building2}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
          <CardSummaryDashboard
            title="By division"
            renderValue={() => (
              <ListDataRenderer data={usersByCompanyDivisionData?.data?.users_by_company_and_division} />
            )}
            isLoading={isLoadingUsersByCompanyDivision}
            icon={Network}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
          <CardSummaryDashboard
            title="Company positions"
            renderValue={() => (
              <ListDataRenderer data={usersByCompanyPositionData?.data?.users_by_company_and_position} />
            )}
            isLoading={isLoadingUsersByCompanyPosition}
            icon={Briefcase}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
          <CardSummaryDashboard
            title="By position"
            renderValue={() => <ListDataRenderer data={usersByPositionData?.data?.users_by_position} />}
            isLoading={isLoadingUsersByPosition}
            icon={Users2}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
        </div>

        {/* ── Section: Profile ──────────────────────────────────────────── */}
        <SectionLabel>Profile</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CardSummaryDashboard
            title="By age group"
            renderValue={() => <ListDataRenderer data={usersByAgeGroupData?.data?.users_by_age_group} />}
            isLoading={isLoadingUsersByAgeGroup}
            icon={Clock}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
          <CardSummaryDashboard
            title="Years of service"
            renderValue={() => <ListDataRenderer data={usersByYearsOfServiceData?.data?.users_by_years_of_service} />}
            isLoading={isLoadingUsersByYearsOfService}
            icon={Clock}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <CardSummaryDashboard
            title="Active Users"
            renderValue={() => usersActiveData?.data?.active_users ?? 0}
            isLoading={isLoadingUsersActive}
            icon={Users}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Inactive Users"
            renderValue={() => usersNotActiveData?.data?.total ?? 0}
            isLoading={isLoadingUsersNotActive}
            icon={UserX}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by Gender"
            renderValue={() => <ListDataRenderer data={usersByGenderData?.data?.users_by_gender} />}
            isLoading={isLoadingUsersByGender}
            icon={UserRound}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by Education"
            renderValue={() => <ListDataRenderer data={usersByEducationData?.data?.users_by_education} />}
            isLoading={isLoadingUsersByEducation}
            icon={GraduationCap}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by Company"
            renderValue={() => <ListDataRenderer data={usersByCompanyData?.data?.users_by_company} />}
            isLoading={isLoadingUsersByCompany}
            icon={Building2}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by Province"
            renderValue={() => <ListDataRenderer data={usersByProvinceData?.data?.users_by_province} />}
            isLoading={isLoadingUsersByProvince}
            icon={MapPin}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by City"
            renderValue={() => <ListDataRenderer data={usersByCityData?.data?.users_by_city} />}
            isLoading={isLoadingUsersByCity}
            icon={Building}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by Age Group"
            renderValue={() => <ListDataRenderer data={usersByAgeGroupData?.data?.users_by_age_group} />}
            isLoading={isLoadingUsersByAgeGroup}
            icon={Clock}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by Division"
            renderValue={() => (
              <ListDataRenderer data={usersByCompanyDivisionData?.data?.users_by_company_and_division} />
            )}
            isLoading={isLoadingUsersByCompanyDivision}
            icon={Network}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Company Positions"
            renderValue={() => (
              <ListDataRenderer data={usersByCompanyPositionData?.data?.users_by_company_and_position} />
            )}
            isLoading={isLoadingUsersByCompanyPosition}
            icon={Briefcase}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by Position"
            renderValue={() => <ListDataRenderer data={usersByPositionData?.data?.users_by_position} />}
            isLoading={isLoadingUsersByPosition}
            icon={Users2}
            value={undefined}
            action={undefined}
            footer={undefined}
          />

          <CardSummaryDashboard
            title="Users by Years of Service"
            renderValue={() => <ListDataRenderer data={usersByYearsOfServiceData?.data?.users_by_years_of_service} />}
            isLoading={isLoadingUsersByYearsOfService}
            icon={Clock}
            value={undefined}
            action={undefined}
            footer={undefined}
          />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;

const GroupedCard = ({
  icon: Icon,
  label,
  children,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-xl p-4 flex flex-col gap-3 min-w-0 ${className} bg-card/20 border-white/20 shadow text-card-foreground flex flex-col gap-6 rounded-xl border py-6 backdrop-blur-sm`}
  >
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
      <span className="p-1.5 rounded-lg ">
        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </span>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
    </div>
    {children}
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-2 mb-1 px-0.5">
    {children}
  </p>
);

const DividerCol = () => <div className="w-px bg-gray-100 dark:bg-gray-800 self-stretch mx-1" />;
