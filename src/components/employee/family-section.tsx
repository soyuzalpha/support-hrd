import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface FamilySectionProps {
  family: any[];
}

export default function FamilySection({ family }: FamilySectionProps) {
  if (family?.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Family Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {family?.map((member) => (
            <div key={member?.id_family} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{member.name_family}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {member?.relationship.toLowerCase().replace("_", " ")}
                  </p>
                </div>
                <span className="text-xs bg-muted px-2 py-1 rounded">{member?.relationship}</span>
              </div>
              <p className="text-sm font-mono text-muted-foreground">📞 {member?.phone_number}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
