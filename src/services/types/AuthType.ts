export const formLoginInitial = {
  user_name: '',
  password: ''
};

export type FormLoginType = typeof formLoginInitial;

export type FormResetPasswordType = {
  user_name:string
  email:string
}

export type FormConfirmPasswordType = {
  id:number
  password:string
}

export type FormLoginResponse = {
  id: number
  first_name: string | null
  last_name: string | null
  user_name: string | null
  password: string | null
  email: string | null
  tel: string | null
  level: number | null
  image: string | null
  created_at: Date | null
  accessToken:string
}

