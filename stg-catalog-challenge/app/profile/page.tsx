'use client'

import { useSession } from '@supabase/auth-helpers-react'
import AuthGuard from '@/components/auth-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  const session = useSession()

  const ProfileComponent = (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">{session?.user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ID do Usuário</label>
              <p className="text-sm text-gray-600 font-mono">{session?.user?.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Criação</label>
              <p className="text-sm text-gray-600">
                {session?.user?.created_at ? new Date(session.user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              Editar Perfil
            </Button>
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
            <Button variant="destructive" className="w-full">
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <AuthGuard>
      {ProfileComponent}
    </AuthGuard>
  )
} 