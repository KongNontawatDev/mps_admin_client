export const initialLoginForm = {
  user_name: '',
  password: ''
};

export type FormLoginType = typeof initialLoginForm;

export type FormResetPasswordType = {
  user_name:string
  email:string
}

export type FormConfirmPasswordType = {
  id:number
  password:string
}

export type FormLoginResponse = {
  id:number
  user_name:string
  first_name:string
  last_name:string
  email:string
  image:string
  level:number
  accessToken:string
}

export default {
  initialLoginForm,
}

