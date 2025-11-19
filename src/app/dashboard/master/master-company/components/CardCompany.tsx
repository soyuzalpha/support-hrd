"use client";

import Show from "@/components/show";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/dates";
import { IconCircleCheckFilled, IconXboxX } from "@tabler/icons-react";

const CardCompany = ({
  datas,
  handleClickRow,
  isLoading,
}: {
  datas: any[];
  handleClickRow: (item) => void;
  isLoading: boolean;
}) => {
  return (
    <div className="">
      {/* Loading */}
      <Show.When isTrue={isLoading}>
        <div className="w-full h-32 flex items-center justify-center text-gray-600 dark:text-gray-300">
          <h1>Loading...</h1>
        </div>
      </Show.When>

      {/* Data kosong */}
      <Show.When isTrue={!datas.length && !isLoading}>
        <div className="w-full h-32 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          No Results.
        </div>
      </Show.When>

      {/* Isi kartu */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {datas.map((item, index) => (
          <Card
            key={item.id_datacompany || index}
            // className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 cursor-pointer
            //            hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => handleClickRow(item)}
          >
            <CardHeader>
              <CardTitle className="font-semibold ">{item.name}</CardTitle>
            </CardHeader>

            <CardContent className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="capitalize">Bank:</span>
                <p className="font-medium">{item.bank}</p>
              </div>

              <div className="flex justify-between">
                <span className="capitalize">Account:</span>
                <p className="font-mono text-xs">{item.account_number}</p>
              </div>

              <div className="flex justify-between">
                <span className="capitalize">Branch:</span>
                <p>{item.branch}</p>
              </div>

              <div className="flex justify-between">
                <span className="capitalize">SWIFT:</span>
                <p className="font-mono text-xs">{item.swift}</p>
              </div>
            </CardContent>

            <CardFooter className="w-full">
              <div className="text-sm space-y-1 w-full">
                <div className="flex justify-between items-center">
                  <span className="capitalize">Status:</span>
                  <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1 inline-flex items-center">
                    {item.status === 1 ? (
                      <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                    ) : (
                      <IconXboxX className="fill-red-500 dark:fill-red-400" />
                    )}
                    {item.status === 1 ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="capitalize">Created At:</span>
                  <p>{formatDate(item.created_at)}</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardCompany;
