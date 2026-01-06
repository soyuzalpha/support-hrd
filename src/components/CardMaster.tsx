import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { dateDisplay } from "@/utils/dates";
import { Label } from "./ui/label";
import { toCapitalized } from "@/utils";
import { Separator } from "./ui/separator";
import { Eye, Pencil, MoreVertical } from "lucide-react";

const CardMaster = ({
  title,
  description,
  children,
  item,
  onClickAction,
  onClickDetail,
  onClickEdit,
}: {
  title: string;
  description: string;
  children?: React.ReactElement;
  item: any;
  onClickDetail: () => void;
  onClickEdit: () => void;
  onClickAction: () => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div>{children}</div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <Label className="text-xs text-muted-foreground">Created By</Label>
            <p className="font-medium text-xs">{toCapitalized(item?.creator?.username)}</p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Created At</Label>
            <p className="font-medium text-xs">{dateDisplay(item?.created_at)}</p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Update By</Label>
            <p className="font-medium text-xs">{item?.updater?.username ?? "-"}</p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Update At</Label>
            <p className="font-medium text-xs">{dateDisplay(item?.updated_at)}</p>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex gap-3">
        <Button size="xs" variant="glassInfo" className="gap-2 text-xs" onClick={onClickDetail}>
          <Eye className="w-4 h-4" />
          Detail
        </Button>

        <Button size="xs" variant={"glassWarning"} className="gap-2 text-xs" onClick={onClickEdit}>
          <Pencil className="w-4 h-4" />
          Edit
        </Button>

        <Button size="xs" variant={"glassDestructive"} className="gap-2 text-xs " onClick={onClickAction}>
          <MoreVertical className="w-4 h-4" />
          Action
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardMaster;
