export type LoginFormValues = {
  login: string;
  password: string;
};

export type HandleLogin = {
  handleLogin: (values: LoginFormValues) => Promise<void>;
};
