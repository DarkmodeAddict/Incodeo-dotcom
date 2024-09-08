'use client'
import React from 'react'
import { useAuthStore } from '@/store/Auth'

function LoginPage() {
  const {login} = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    if (!email || !password) {
      setError(() => 'Please fill fields')
      return
    }

    setIsLoading(() => true)
    setError(() => '')

    const loginResponse = await login(email.toString(), password.toString())

    if (loginResponse.error) {
      setError(() => loginResponse.error!.message)
    }

    setIsLoading(() => false)
  }
  return (
    <div>LoginPage</div>
  )
}

export default LoginPage