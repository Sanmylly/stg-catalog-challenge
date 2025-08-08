import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrinho',
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
