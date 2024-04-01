import  { useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import useAuthStore from '../../store/authStore'
import { getCurrentTimestamp } from '../../utils/dateFormat'
import { authRefreshToken } from '../../pages/auth/hooks'

type AcessTokenDecoded = {
  aud:string
  exp:number
  iat:number
}

type Props = {
}

const getExpFromToken = (token:string):number=> {
  if(token == '') return 0
  const {exp}:AcessTokenDecoded = Object(jwt_decode(token))
  return exp
}

export default function PrivateRoute({}: Props) {
  const navigete = useNavigate()
  const [isLoggedIn,accessToken,setAccessToken,setIsLoggedIn,resetAuth] = useAuthStore((state) => [state.isLoggedIn,state.accessToken,state.setAccessToken,state.setIsLoggedIn,state.resetAuth,state.user]);

  const accessTokenExp = getExpFromToken(accessToken)
  const currentTimestamp = getCurrentTimestamp()

  const toDoRefreshToken = async() => {
    try {
      const data = await authRefreshToken(accessToken)
      
      setAccessToken(data.accessToken)
      setIsLoggedIn(true)
    } catch (error) {
      resetAuth()
      navigete('/login')
    }
  }

  useEffect(()=>{
    if(currentTimestamp > accessTokenExp) {
      console.log('Session has expired');
      resetAuth()
      navigete('/login')
    }
    const needToRefreshToken = ((accessTokenExp - currentTimestamp) < 60 )
    
    if(needToRefreshToken) {
      toDoRefreshToken()
    }
  },[])

  if(!isLoggedIn){
    return <Navigate to={'/login'} replace/>
  }
  return <Outlet/>
}
