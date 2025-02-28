export type LoginFormValues = {
  login: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type Theme = "dark" | "light" | "system";
