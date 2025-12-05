import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/app-context";
import { dateDisplay } from "@/utils/dates";

import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

interface PersonalInfoSectionProps {
  employee: any;
}

export default function PersonalInfoSection({ employee }: PersonalInfoSectionProps) {
  const fForm = useFormContext();
  console.log({ values: fForm.getValues() });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="font-semibold mt-1">{employee?.full_name ?? employee?.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Nickname</label>
            <p className="font-semibold mt-1">{employee?.nick_name ?? employee?.username}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
            <p className="font-semibold mt-1">{dateDisplay(employee?.birth_date)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Birth Place</label>
            <p className="font-semibold mt-1">{employee?.birth_place}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Gender</label>
            <p className="font-semibold mt-1 capitalize">{employee?.gender}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Religion</label>
            <p className="font-semibold mt-1">{employee?.religion}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
            <p className="font-semibold mt-1 capitalize">{employee?.marital_status}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
            <p className="font-semibold mt-1">{employee?.blood_type}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Province</label>
              <p className="font-semibold mt-1">{employee?.province.province_name}</p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">City</label>
              <p className="font-semibold mt-1">{employee?.city_address}</p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Street Address</label>
              <p className="font-semibold mt-1">{employee?.address}</p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Postal Code</label>
              <p className="font-semibold mt-1">{employee?.postal_code}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
