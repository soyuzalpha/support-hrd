import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";

interface ContactsSectionProps {
  contacts: any[];
}

export default function ContactsSection({ contacts }: ContactsSectionProps) {
  if (contacts?.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contacts?.map((contact) => (
            <div key={contact?.id_contact} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="font-semibold font-mono">{contact?.phone_number}</p>
              </div>
              <a
                href={`tel:${contact?.phone_number}`}
                className="px-3 py-2 bg-red-500  rounded-md hover:bg-red-600 transition-colors text-xs font-medium"
              >
                Call
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
