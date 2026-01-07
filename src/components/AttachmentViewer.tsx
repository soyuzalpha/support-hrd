"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, FileText, ImageIcon, Calendar, User } from "lucide-react";
import Image from "next/image";
import { toastAlert } from "@/lib/toast";

interface Attachment {
  id_attachment_salesorder: number;
  id_salesorder: number;
  file_name: string;
  url: string;
  public_id: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
  deleted_at: string | null;
  deleted_by_name: string | null;
}

interface AttachmentViewerProps {
  attachments: Attachment[];
  title?: string;
}

export function AttachmentViewer({ attachments, title = "Attachments" }: AttachmentViewerProps) {
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleView = (attachment: Attachment) => {
    if (isImage(attachment.url)) {
      setSelectedAttachment(attachment);
    } else {
      window.open(attachment.url, "_blank");
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toastAlert.error("Download failed");
      console.error("Download failed:", error);
    }
  };

  if (!attachments || attachments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No attachments found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title} ({attachments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Kiri: Icon + Info + Badge */}
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 text-xs">
                    {isImage(attachment.url) ? (
                      <ImageIcon className="h-8 w-8 text-blue-500" />
                    ) : (
                      <FileText className="h-8 w-8 text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-xs">{attachment.file_name}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {attachment.created_by_name}
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        {formatDate(attachment.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Badge hanya muncul di desktop */}
                  <div className="hidden sm:block shrink-0">
                    <Badge variant={isImage(attachment.url) ? "default" : "secondary"}>
                      {isImage(attachment.url) ? "Image" : "File"}
                    </Badge>
                  </div>
                </div>

                {/* Kanan: Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(attachment);
                    }}
                    className="flex items-center gap-1 justify-center"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(attachment)}
                    className="flex items-center gap-1 justify-center"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                {/* Badge pindah ke bawah kalau mobile */}
                <div className="sm:hidden">
                  <Badge variant={isImage(attachment.url) ? "default" : "secondary"}>
                    {isImage(attachment.url) ? "Image" : "File"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      {selectedAttachment && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAttachment(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedAttachment.url || "/placeholder.svg"}
              alt={selectedAttachment.file_name}
              className="max-w-full max-h-full object-contain rounded-lg"
              width={500}
              height={500}
            />
            <Button
              className="absolute top-4 right-4"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedAttachment(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
