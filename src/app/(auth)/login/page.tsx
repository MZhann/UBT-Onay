"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await loginUser(data);
      console.log(response);
      toast({
        variant: "success",
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/"); // Redirect after successful login
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="flex w-full pt-28 justify-center min-h-screen bg-[#03174C] relative z-0">
      <Image  src="/assets/images/decoration/auth-bottom-left.png" className="absolute left-4 bottom-4 -z-10" width={380} height={380} alt='decor' /> 
      <Image  src="/assets/images/decoration/auth-top-left.png" className="absolute left-5 top-5 -z-10" width={320} height={320} alt='decor' /> 
      <Image  src="/assets/images/decoration/auth-top-right.png" className="absolute right-0 top-0 -z-10" width={350} height={310} alt='decor' /> 
      <Image  src="/assets/images/decoration/auth-bottom-right.png" className="absolute right-5 bottom-5 -z-10" width={450} height={410} alt='decor' /> 
      <Card className="w-11/12 sm:w-1/2 md:w-1/3">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-white">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <div>
              <Label htmlFor="email" className="pl-1 text-white">
                email
              </Label>
              <Input
                id="email"
                className="border-4 border-myindigo"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="pl-1 text-white">
                password
              </Label>
              <Input
                id="password"
                type="password"
                className="border-4 border-myindigo"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              variant="indigo"
              className="w-full h-10 rounded-lg"
            >
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center flex justify-center">
          <p className="text-sm text-white">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
