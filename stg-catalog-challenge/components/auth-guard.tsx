'use client'

import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const session = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Aguarda um pouco para verificar se a sessão carrega
    const timer = setTimeout(() => {
      // Se não há sessão após o delay, redireciona
      if (session === null) {
        router.push('/auth/login')
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [session, router])

  // Se está carregando, mostra loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando autenticação...</div>
      </div>
    )
  }

  // Se não há sessão, não renderiza nada
  if (session === null) {
    return null
  }

  // Se há sessão, renderiza o conteúdo protegido
  return <>{children}</>
} 