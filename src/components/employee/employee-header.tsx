import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toCapitalized } from "@/utils";

interface EmployeeHeaderProps {
  employee: any;
}

export default function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  return (
    <Card className="border text-white">
      <CardContent className="">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-lg bg-red-400/20 flex items-center justify-center text-4xl font-bold">
            {employee?.full_name?.charAt(0)}
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{employee?.full_name}</h1>
            <p className="text-blue-100 mb-3">ID: {employee?.user?.employee_number}</p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{toCapitalized(employee?.gender)}</Badge>
              <Badge variant="secondary">{employee?.religion}</Badge>
              <Badge variant="secondary">{employee?.blood_type}</Badge>
              <Badge variant="secondary">{toCapitalized(employee?.marital_status)}</Badge>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="text-right">
            <p className="text-sm text-blue-100">Work Email</p>
            <p className="font-semibold mb-3">{employee?.user?.email}</p>
            <p className="text-sm text-blue-100">Personal Email</p>
            <p className="font-semibold">{employee?.personal_email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
