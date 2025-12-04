"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: any;
};

export default function UserDetailCard({ data }: Props) {
  if (!data) return <p>No data found</p>;

  return (
    <div className="space-y-4">
      {/* ========= USER BASIC INFO ========= */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Name:</strong> {data.name}
            </div>
            <div>
              <strong>Username:</strong> {data.username}
            </div>
            <div>
              <strong>Email:</strong> {data.email}
            </div>
            <div>
              <strong>Employee No:</strong> {data.employee_number}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========= COMPANY / POSITION ========= */}
      <Card>
        <CardHeader>
          <CardTitle>Company & Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Company:</strong> {data.company?.name_company}
            </div>
            <div>
              <strong>Position:</strong> {data.position?.name_position}
            </div>
            <div>
              <strong>Division:</strong> {data.division?.name_division}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========= EMPLOYMENT ========= */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Status:</strong> {data.employments?.employment_status}
            </div>
            <div>
              <strong>Join Date:</strong> {data.employments?.join_date}
            </div>
            <div>
              <strong>Work Location:</strong> {data.employments?.work_location}
            </div>
            <div>
              <strong>Duration:</strong> {data.employments?.work_duration}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========= PERSONAL EMPLOYEE ========= */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Gender:</strong> {data.employees?.gender}
            </div>
            <div>
              <strong>Religion:</strong> {data.employees?.religion}
            </div>
            <div>
              <strong>Birth Place:</strong> {data.employees?.birth_place}
            </div>
            <div>
              <strong>Birth Date:</strong> {data.employees?.birth_date}
            </div>
            <div>
              <strong>Blood Type:</strong> {data.employees?.blood_type}
            </div>
            <div>
              <strong>Address:</strong> {data.employees?.address}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========= CONTACTS ========= */}
      {data.employees?.contacts?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.employees.contacts.map((c: any, i: number) => (
              <div key={i} className="border p-2 rounded-md">
                <strong>{c.phone_number}</strong>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ========= FAMILY ========= */}
      {data.employees?.family?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Family Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.employees.family.map((f: any, i: number) => (
              <div key={i} className="border p-2 rounded-md">
                <strong>{f.name_family}</strong> — {f.relationship}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ========= LEAVE QUOTA ========= */}
      {data.leave_quotas?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Leave Quotas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.leave_quotas.map((l: any, i: number) => (
              <div key={i} className="border p-2 rounded-md">
                <strong>{l?.typeleave?.name_typeleave}</strong> ({l.year})<br />
                Total: {l.total_days} — Used: {l.used_days} — Remaining: {l.remaining_days}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
