"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { useForm, Resolver } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
  phone: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  const errors: Record<string, any> = {};

  if (!values.name) {
    errors.name = {
      type: "required",
      message: "Name is required.",
    };
  }

  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required.",
    };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = {
      type: "pattern",
      message: "Invalid email format.",
    };
  }

  if (!values.phone) {
    errors.phone = {
      type: "required",
      message: "Phone number is required.",
    };
  } else if (!/^\d{10}$/.test(values.phone)) {
    // Simple 10-digit phone number validation
    errors.phone = {
      type: "pattern",
      message: "Invalid phone number format (e.g., 1234567890).",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors: errors,
  };
};

export default function MemberForm({
  onSubmit,
  loading,
}: {
  onSubmit: any;
  loading: boolean;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 my-2"
    >
      <Input {...register("name")} placeholder="Enter member name" />
      <Input
        {...register("email", {
          required: "Required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
        placeholder="Enter member email"
      />
      <Input
        {...register("phone", {
          pattern: {
            value: /^.{10}$/,
            message: "Invalid phone number",
          },
        })}
        type="number"
        placeholder="Enter member phone # (optional)"
      />
      <Button disabled={loading}>Add Member</Button>
      <Alert className="block" variant="destructive">
        <p>{errors?.name && errors.name.message}</p>
        <p>{errors?.email && errors.email.message}</p>
        <p>{errors?.phone && errors.phone.message}</p>
      </Alert>
    </form>
  );
}
