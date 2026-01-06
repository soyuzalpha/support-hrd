"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = { data: any };

const fallbackInitial = (str?: string) => (str ? str.charAt(0).toUpperCase() : "?");

const F = (v: any) => v ?? "—";

export default function UserDetailCard({ data }: Props) {
  if (!data) return <p>No data found</p>;

  return (
    <div className="space-y-6">
      {/* ================== HEADER ================== */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={data?.photo} alt={data?.name} />
            <AvatarFallback>{fallbackInitial(data?.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{F(data.name)}</p>
            <p className="text-xs text-muted-foreground">{F(data.username)}</p>
            <p className="text-xs text-muted-foreground">Emp. No: {F(data.employee_number)}</p>
          </div>
        </CardContent>
      </Card>

      {/* ================== BASIC ================== */}
      <Section
        title="Basic Information"
        items={{
          Email: F(data.email),
          Company: F(data.company?.name_company),
          Position: F(data.position?.name_position),
          Division: F(data.division?.name_division),
        }}
      />

      {/* ================== EMPLOYMENT ================== */}
      <Section
        title="Employment"
        items={{
          Status: F(data.employments?.employment_status),
          "Join Date": F(data.employments?.join_date),
          "End Date": F(data.employments?.end_date),
          "Work Location": F(data.employments?.work_location),
          Duration: F(data.employments?.work_duration),
        }}
      />

      {/* ================== PERSONAL ================== */}
      <Section
        title="Personal Info"
        items={{
          "Full Name": F(data.employees?.full_name),
          Nickname: F(data.employees?.nick_name),
          Gender: F(data.employees?.gender),
          Birth: `${F(data.employees?.birth_place)}, ${F(data.employees?.birth_date)}`,
          Religion: F(data.employees?.religion),
          "Marital Status": F(data.employees?.marital_status),
          "Blood Type": F(data.employees?.blood_type),
          Age: F(data.employees?.age),
          Address: F(data.employees?.address),
        }}
      />

      {/* ================== CONTACTS ================== */}
      <ListSection
        title="Contacts"
        data={data.employees?.contacts}
        emptyText="No contact data"
        mapItem={(c: any) => ({
          Phone: F(c.phone_number),
          "Created By": F(c.creator?.name),
        })}
      />

      {/* ================== FAMILY ================== */}
      <ListSection
        title="Family"
        data={data.employees?.family}
        emptyText="No family data"
        mapItem={(f: any) => ({
          Name: F(f.name_family),
          Relationship: F(f.relationship),
          Phone: F(f.phone_number),
        })}
      />

      {/* ================== DOCUMENTS ================== */}
      <ListSection
        title="Documents"
        data={data.employees?.documents}
        emptyText="No documents"
        mapItem={(d: any) => ({
          Type: F(d.document_type),
          File: (
            <a href={d.url} className="underline text-blue-600" target="_blank">
              View File
            </a>
          ),
        })}
      />

      {/* ================== WORK HISTORY ================== */}
      <ListSection
        title="Work History"
        data={data.employees?.workhistory}
        emptyText="No work history"
        mapItem={(w: any) => ({
          Company: F(w.company_name),
          Position: F(w.position),
          Period: `${F(w.start_date)} → ${w.end_date ?? "Present"}`,
        })}
      />

      {/* ================== EDUCATION ================== */}
      <ListSection
        title="Education"
        data={data.employees?.educationhistory}
        emptyText="No education history"
        mapItem={(e: any) => ({
          Degree: F(e.degree?.name_degree),
          Program: F(e.studyprogram?.program_name),
          School: F(e.school?.school_name),
        })}
      />
    </div>
  );
}

/* ================== REUSABLE COMPONENTS ================== */

function Section({ title, items }: { title: string; items: Record<string, any> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs">
        {Object.entries(items).map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ListSection({
  title,
  data,
  emptyText,
  mapItem,
}: {
  title: string;
  data: any[];
  emptyText: string;
  mapItem: (item: any) => Record<string, any>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">
        {!data?.length && <p className="text-muted-foreground">{emptyText}</p>}

        {data?.map((item, i) => {
          const mapped = mapItem(item);
          return (
            <div key={i} className="space-y-1">
              {Object.entries(mapped).map(([k, v]) => (
                <p key={k}>
                  <span className="text-muted-foreground">{k}: </span>
                  <span className="font-medium">{v}</span>
                </p>
              ))}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
