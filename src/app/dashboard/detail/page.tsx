"use client";

import { Button } from "@/components/ui/button";
import StaffProfile from "./components/StaffProfile";
import { useUser } from "@/context/app-context";

const Detail = () => {
  return (
    <div>
      <StaffProfile idUser={null} />
    </div>
  );
};

export default Detail;
