export interface LoginFormValues {
  login: string;
  password: string;
}

export type Theme = "dark" | "light" | "system";

export interface IsSubmitting {
  isSubmitting: boolean;
}
