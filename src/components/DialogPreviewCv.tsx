import { UseDialogModalReturn } from "@/hooks/use-dialog-modal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AppGridContainer } from "./app-grid-container";
import { useScreenHeight } from "@/hooks/use-screen-height";
import { CVContent } from "./cv-preview2";
import { Download } from "lucide-react";
import { useRef } from "react";
import CvPdfDocument from "./cd-pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useFormContext } from "react-hook-form";

const DialogPreviewCv = ({ dialogHandler }: { dialogHandler: UseDialogModalReturn }) => {
  const fFom = useFormContext();
  const userData = fFom.getValues();

  return (
    <Dialog open={dialogHandler.open} onOpenChange={dialogHandler.handleClose}>
      <DialogContent size="xxxl">
        <DialogHeader>
          <DialogTitle>Detail</DialogTitle>
          <DialogDescription>Details user</DialogDescription>
        </DialogHeader>

        <AppGridContainer maxHeight={useScreenHeight() - 200}>
          {/* BUTTON */}
          <div className="flex items-center justify-end mb-3 gap-3">
            <PDFDownloadLink
              document={<CvPdfDocument userData={userData} />}
              fileName={`${userData?.employees?.full_name}-CV.pdf`}
            >
              {({ loading }) => (
                <Button type="button" size={"lg"} variant={"glassInfo"}>
                  <Download size={18} />
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>

          {/* PREVIEW */}
          <CVContent userData={userData} />
        </AppGridContainer>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPreviewCv;
