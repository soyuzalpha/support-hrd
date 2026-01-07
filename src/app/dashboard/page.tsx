"use client";

import { AppContainer } from "@/components/app-container";

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
    <div className="space-y-3">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <DashboardGreeting />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
        </div>
      </div>
    </div>

    // <div className="space-y-3">
    //   <div className="@container/main flex flex-1 flex-col gap-2">
    //     <DashboardGreeting />

    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
    //       <CardSummaryDashboard
    //         title="Active Users"
    //         renderValue={() => activeUserData?.data?.active_users ?? 0}
    //         isLoading={isLoadingActiveUser}
    //         icon={Users}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Inactive Users"
    //         renderValue={() => userNotActiveData?.data?.total ?? 0}
    //         isLoading={isLoadingUserNotActive}
    //         icon={UserX}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Users by Gender"
    //         renderValue={() => <ListDataRenderer data={userByGenderData?.data?.users_by_gender} />}
    //         isLoading={isLoadingUserByGender}
    //         icon={UserRound}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Users by Education"
    //         renderValue={() => <ListDataRenderer data={userByEducationData?.data?.users_by_education} />}
    //         isLoading={isLoadingUserByEducation}
    //         icon={GraduationCap}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Users by Company"
    //         renderValue={() => <ListDataRenderer data={userByCompanyData?.data?.users_by_company} />}
    //         isLoading={isLoadingUserByCompany}
    //         icon={Building2}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Users by Province"
    //         renderValue={() => <ListDataRenderer data={userByProvinceData?.data?.users_by_province} />}
    //         isLoading={isLoadingUserByProvince}
    //         icon={MapPin}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Users by City"
    //         renderValue={() => <ListDataRenderer data={userByCityData?.data?.users_by_city} />}
    //         isLoading={isLoadingUserByCity}
    //         icon={Building}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Users by Age"
    //         renderValue={() => <ListDataRenderer data={userByAgeData?.data?.users_by_age_group} />}
    //         isLoading={isLoadingUserByAge}
    //         icon={Clock}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Users by Division"
    //         renderValue={() => (
    //           <ListDataRenderer data={userByCompanyDivisionData?.data?.users_by_company_and_division} />
    //         )}
    //         isLoading={isLoadingUserByCompanyDivision}
    //         icon={Network}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Company Positions"
    //         renderValue={() => (
    //           <ListDataRenderer data={userByCompanyPositionData?.data?.users_by_company_and_position} />
    //         )}
    //         isLoading={isLoadingUserByCompanyPosition}
    //         icon={Briefcase}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="Users by Position"
    //         renderValue={() => <ListDataRenderer data={userByPositionData?.data?.users_by_position} />}
    //         isLoading={isLoadingUserByPosition}
    //         icon={Users2}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />

    //       <CardSummaryDashboard
    //         title="User By Years Of Service"
    //         renderValue={() => <ListDataRenderer data={userYearService?.data?.users_by_years_of_service} />}
    //         isLoading={isLoadingUserYearService}
    //         icon={Clock}
    //         action={undefined}
    //         footer={undefined}
    //         value={undefined}
    //       />
    //     </div>
    //   </div>
    // </div>
  );
};

export default Dashboard;
