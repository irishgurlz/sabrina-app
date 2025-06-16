import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    Cookies.remove('token')
    navigate('/') 
  }, [navigate])

  return null 
}

export default Logout
