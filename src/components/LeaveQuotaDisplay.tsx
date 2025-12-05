"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface LeaveQuotaDetailProps {
  data: any[];
}

export function LeaveQuotaList({ data }: LeaveQuotaDetailProps) {
  if (!data || data.length === 0)
    return <p className="text-sm text-muted-foreground">No leave quota data available.</p>;

  return (
    <div className="grid gap-4 grid-cols-1">
      {data.map((item) => (
        <LeaveQuotaCard key={item.id_leavequota} item={item} />
      ))}
    </div>
  );
}

function LeaveQuotaCard({ item }: { item: any }) {
  const rows = [
    { label: "Year", value: item.year },
    { label: "Leave Type", value: item?.typeleave?.name_typeleave },
    { label: "Total Days", value: item.total_days },
    { label: "Used Days", value: item.used_days },
    { label: "Remaining", value: item.remaining_days },
    { label: "Status", value: item?.typeleave?.status },
  ];

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader>
        <CardTitle className="text-base">
          {item?.typeleave?.name_typeleave} ({item?.year})
        </CardTitle>
        <p className="text-xs text-muted-foreground">Quota ID: {item?.id_leavequota}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {rows?.map((row) => (
            <div key={row.label} className="flex justify-between border-b py-1">
              <span className="text-xs text-muted-foreground">{row?.label}</span>
              <span className="font-medium text-sm">{row?.value ?? "-"}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Created</span>
            <span>{formatDate(item?.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span>Updated</span>
            <span>{formatDate(item?.updated_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
