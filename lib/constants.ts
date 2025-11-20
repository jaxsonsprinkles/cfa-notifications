import { Resolver } from "react-hook-form";

export const resolver: Resolver<any> = async (values) => {
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
