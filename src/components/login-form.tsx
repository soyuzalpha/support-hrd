"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toastAlert } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { isEmpty } from "@/utils";
import { useUser } from "@/context/app-context";
import { GlassContainer } from "./GlassContainer";
import Image from "next/image";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const fForm = useForm();
  const { updateUser } = useUser();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEmpty(fForm.getValues("login")) || isEmpty(fForm.getValues("password"))) {
        toastAlert.error("Email dan password tidak boleh kosong!");
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: fForm.getValues("login"), password: fForm.getValues("password") }),
        });

        const data = await response.json();

        await signIn("credentials", {
          redirect: false,
          login: fForm.getValues("login"),
          password: fForm.getValues("password"),
        });

        return data;
      }
    },
    onSuccess: (res) => {
      if (res && res?.code === 401) {
        toastAlert.error(res?.meta_data?.message || "Email atau password salah!");
      } else {
        const decoded = jwtDecode<any>(res?.data?.token);

        updateUser({
          email: decoded.email,
          id_division: decoded.id_division,
          id_position: decoded.id_position,
          id_role: decoded.id_role,
          id_user: decoded.id_user,
          name: decoded.name,
          token: res?.data?.token,
        });

        toastAlert.success("Login Berhasil 🎉");
        router.push("/dashboard");
      }
    },
    onError: (error: Error) => {
      toastAlert.error(error.message || "Terjadi kesalahan saat login!");
    },
  });

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-sm", className)} {...props}>
      <GlassContainer>
        <div className="flex justify-center mb-6">
          <Image src="/TRANSTAMA.png" alt="logo" width={200} height={200} className="w-52 h-auto object-contain" />
        </div>

        <div className="text-center mb-8">
          <CardTitle className="text-xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-white">Login your account to continue</CardDescription>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <FieldGroup>
              <Field>
                {/* <div className="grid gap-3">
                  <Label htmlFor="login">Username</Label>
                  <Input id="login" type="text" placeholder="admin" required {...fForm.register("login")} />
                </div> */}
                <FieldLabel htmlFor="login" className="text-white">
                  Username
                </FieldLabel>
                <Input
                  id="login"
                  type="text"
                  placeholder="admin"
                  required
                  className="text-white"
                  {...fForm.register("login")}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-white">
                    Password
                  </FieldLabel>
                  {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="text-white"
                  placeholder="Password"
                  {...fForm.register("password")}
                />
              </Field>
              <Field>
                <Button className="bg-white hover:bg-white text-black rounded-full" type="submit" size={"lg"}>
                  Login
                </Button>
                {/* <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription> */}
              </Field>
            </FieldGroup>
          </form>
        </div>
      </GlassContainer>
      {/* <FieldDescription className="px-6 text-center text-white">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:text-white!">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-white!">
          Privacy Policy
        </a>
        .
      </FieldDescription> */}
    </div>
  );
}
