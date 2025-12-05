import { AppContainer } from "@/components/app-container";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { DialogDescription } from "@radix-ui/react-dialog";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { User, Calendar, Activity, FileText, Phone, Users, FileImage } from "lucide-react";
import { dateDisplay } from "@/utils/dates";
import { GlassContainer } from "@/components/GlassContainer";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { toCapitalized } from "@/utils";

const DetailRole = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const details = fForm.getValues();

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>{details.full_name}</DialogTitle>
          <DialogDescription>Employee Details</DialogDescription>
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <div className="">
            {/* Header Card */}
            <div className="rounded-2xl shadow-lg mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{details.full_name}</h1>
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
                      {details.nick_name}
                    </span>
                  </div>
                  <p className="text-white text-sm">Employee ID: #{details.id_employee}</p>
                </div>
              </div>

              <GlassContainer>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-white">
                      <strong>NIK:</strong> {details.nik}
                    </p>
                    <p className="text-white">
                      <strong>NPWP:</strong> {details.npwp}
                    </p>
                    <p className="text-white">
                      <strong>Email:</strong> {details.personal_email}
                    </p>
                    <p className="text-white">
                      <strong>Birth:</strong> {details.birth_place}, {details.birth_date}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white">
                      <strong>Gender:</strong> {details.gender}
                    </p>
                    <p className="text-white">
                      <strong>Religion:</strong> {details.religion}
                    </p>
                    <p className="text-white">
                      <strong>Marital Status:</strong> {details.marital_status}
                    </p>
                    <p className="text-white">
                      <strong>Blood Type:</strong> {details.blood_type}
                    </p>
                  </div>
                </div>
              </GlassContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Contact Info */}
              <GlassContainer>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Contact Numbers</h2>
                </div>

                <div className="space-y-3">
                  {details?.contacts?.map((contact, index) => (
                    <div key={index} className="p-2 bg-white/10 rounded-lg">
                      <p className="text-white">{contact?.phone_number}</p>
                    </div>
                  ))}
                </div>
              </GlassContainer>

              {/* Family Info */}
              <GlassContainer>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="text-purple-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Family Members</h2>
                </div>

                <div className="space-y-3">
                  {details?.family?.map((member, index) => (
                    <div key={index} className="p-2 bg-white/10 rounded-lg">
                      <p className="text-white font-semibold">{member?.name_family}</p>
                      <p className="text-white text-sm">
                        {member?.relationship} - {member?.phone_number}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassContainer>
            </div>

            {/* Documents */}
            <GlassContainer>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <FileImage className="text-amber-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Documents</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {details?.documents?.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <p className="text-white font-semibold">{doc?.document_type}</p>
                    <p className="text-white text-sm truncate">{doc?.file_name}</p>
                  </a>
                ))}
              </div>
            </GlassContainer>
          </div>
        </AppGridContainer>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={dialogHandler.handleClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailRole;
