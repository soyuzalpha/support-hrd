import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateDisplay } from "@/utils/dates";
import { format } from "date-fns";
import { Activity } from "lucide-react";

interface ActivityLogsSectionProps {
  logs: any[];
}

export default function ActivityLogsSection({ logs }: ActivityLogsSectionProps) {
  if (logs?.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs?.map((log) => (
            <div key={log?.id_employeelog} className="flex gap-4 pb-4 border-b last:border-b-0">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
              </div>

              {/* Log content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-semibold text-xs">
                      {log?.action.id_contact ? "Contact Added" : "Family Member Added"}
                    </p>
                    <p className="text-xs text-muted-foreground">{dateDisplay(log.created_at)}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-muted p-2 rounded text-xs mt-2">
                  {log?.action.to && (
                    <pre className="text-muted-foreground font-mono overflow-auto max-h-24">
                      {JSON.stringify(log?.action?.to, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
