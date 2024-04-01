import {useEffect} from 'react'
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

type Props = {}

export default function Logout({}: Props) {
  const navigate = useNavigate()
  const [resetAuth] = useAuthStore((state) => [state.resetAuth]);
  useEffect(()=>{
    resetAuth()
    navigate('/login')
  },[])
  return (
    <>...Logout</>
  )
}