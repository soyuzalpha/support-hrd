import { AppContainer } from "@/components/app-container";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import { DialogDescription } from "@radix-ui/react-dialog";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { User, Calendar, Activity, FileText } from "lucide-react";
import { dateDisplay } from "@/utils/dates";
import { GlassContainer } from "@/components/GlassContainer";
import { AppGridContainer } from "@/components/app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import PersonalInfoSection from "@/components/employee/personal-info-section";
import ContactsSection from "@/components/employee/contacts-section";
import FamilySection from "@/components/employee/family-section";
import UserDetailCard from "./UserInfo";

const DetailRole = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fForm = useFormContext();
  const details = fForm.getValues();

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxl" glass={true}>
        <DialogHeader>
          <DialogTitle>{details.name_position}</DialogTitle>
          <DialogDescription>Details</DialogDescription>
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 300}>
          <UserDetailCard data={fForm.getValues()} />
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
