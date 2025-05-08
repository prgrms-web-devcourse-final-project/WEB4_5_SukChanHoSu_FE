export type SignupRequest = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type SignupResponse = {
  code: string;
  message: string;
  data: {
    email: string;
    password: string;
    role: string;
  };
};
