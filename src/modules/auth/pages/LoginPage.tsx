import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/modules/core/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import { Input } from "@/modules/core/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/modules/core/components/ui/field";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/modules/lib/utils";
import { useAuthService } from "../services/useAuthService";
import { toast } from "sonner";
import type { GenericErrorResponse } from "@/modules/core/services/api";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";

type LoginFormValues = {
  username: string;
  password: string;
};

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login, getProfile } = useAuthService();
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login({
        username: values.username,
        password: values.password,
      });
      const profile = await getProfile();
      setUser(profile);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        (error as unknown as GenericErrorResponse).errorMsg ??
          "Some error happened.",
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-90 flex-col gap-4.5 p-4"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Sign In</h1>
          <p className="text-[#64748b]">
            Welcome back. Enter your credentials to continue.
          </p>
        </div>
        <Alert>
          <InfoIcon />
          <AlertTitle>Demo Purposes Only</AlertTitle>
          <AlertDescription>
            Use "emilys" as username and "emilyspass" as password.
          </AlertDescription>
        </Alert>
        <Field data-invalid={!!errors.username}>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            placeholder="Username"
            aria-invalid={!!errors.username}
            {...register("username", {
              required: "Username is required",
              maxLength: {
                value: 30,
                message: "Username must be 30 characters or fewer",
              },
            })}
          />
          <FieldError
            errors={errors.username ? [errors.username] : undefined}
          />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            aria-invalid={!!errors.password}
            {...register("password", {
              required: "Password is required",
              maxLength: {
                value: 30,
                message: "Password must be 30 characters or fewer",
              },
            })}
          />
          <FieldError
            errors={errors.password ? [errors.password] : undefined}
          />
        </Field>
        <Button
          type="submit"
          className={cn("w-full", loading && "cursor-progress")}
          disabled={loading}
        >
          {loading ? "Loading" : "Login"}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
