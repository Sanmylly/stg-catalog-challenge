# 🚀 STG Catalog Challenge

Sistema completo de e-commerce com autenticação e integração WhatsApp

## 📋 Descrição do Projeto

O STG Catalog Challenge é uma aplicação de e-commerce moderna desenvolvida com Next.js, TypeScript e Supabase. O sistema oferece um catálogo de produtos com funcionalidades completas de carrinho de compras, autenticação de usuários e integração direta com WhatsApp para finalização de pedidos.

### ✨ Principais Funcionalidades

- **Autenticação Completa**: Login/registro com email e proteção de rotas
- **Catálogo Responsivo**: Grid de produtos com busca e filtros
- **Carrinho Inteligente**: Gestão de quantidades e edição de itens
- **Checkout Completo**: Formulário de entrega e confirmação de pedido
- **Integração WhatsApp**: Finalização de pedidos via WhatsApp com mensagem formatada
- **Design Moderno**: Interface responsiva com tema escuro/claro

## 🛠️ Tecnologias Utilizadas

### Stack Principal
- **TypeScript** - Tipagem completa e desenvolvimento seguro
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface do usuário
- **Supabase** - Backend-as-a-Service (Auth + Database)
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones

### Dependências Principais
- `@supabase/auth-helpers-nextjs` - Autenticação Supabase
- `@supabase/supabase-js` - Cliente Supabase
- `next-themes` - Gerenciamento de temas
- `class-variance-authority` - Variantes de componentes
- `clsx` - Utilitário para classes CSS

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 🤖 IA Utilizada

### Ferramentas de IA Empregadas

1. **Cursor AI** - Desenvolvimento principal
   - Geração de componentes React/TypeScript
   - Estruturação de código e boas práticas
   - Debugging e otimização

2. **Chat GPT** - Assistência em desenvolvimento
   - Revisão de código e arquitetura
   - Sugestões de melhorias
   - Documentação técnica

### Como a IA Foi Utilizada

- **Desenvolvimento Inicial**: Estrutura base do projeto e configurações
- **Componentes UI**: Geração de componentes reutilizáveis com shadcn/ui
- **Integração Supabase**: Configuração de autenticação e banco de dados
- **Funcionalidades Core**: Implementação de carrinho, checkout e WhatsApp
- **Otimização**: Refinamento de código e performance
- **Documentação**: Criação desta documentação completa

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Supabase

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/stg-catalog-challenge.git
cd stg-catalog-challenge
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Configure o Banco de Dados Supabase

#### Tabela `products`
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100)
);
```

#### Tabela `cart_items`
```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
);
```

### 5. Popule o Banco com Produtos
Execute no SQL Editor do Supabase:

```sql
INSERT INTO products (name, description, price, image_url, category) VALUES
('iPhone 15 Pro', 'Smartphone Apple com chip A17 Pro', 8999.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab', 'Eletrônicos'),
('MacBook Air M2', 'Notebook Apple com chip M2', 12999.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 'Eletrônicos'),
('Nike Air Max', 'Tênis esportivo confortável', 599.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 'Esportes'),
('Sofá Moderno', 'Sofá 3 lugares em veludo', 2499.00, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', 'Casa'),
('Camiseta Básica', 'Camiseta 100% algodão', 89.90, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 'Roupas'),
('Fone Bluetooth', 'Fone sem fio com cancelamento de ruído', 299.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Eletrônicos'),
('Mesa de Jantar', 'Mesa de madeira 6 lugares', 899.00, 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf', 'Casa'),
('Calça Jeans', 'Calça jeans slim fit', 199.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d', 'Roupas'),
('Bicicleta Mountain', 'Bicicleta para trilhas', 1599.00, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890', 'Esportes'),
('Smart TV 55"', 'TV 4K com Android TV', 3499.00, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1', 'Eletrônicos'),
('Vestido Elegante', 'Vestido para ocasiões especiais', 399.00, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446', 'Roupas'),
('Cafeteira Expresso', 'Cafeteira automática', 899.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Casa');
```

### 6. Execute o Projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🔗 Links Funcionais

- **Aplicação**: [https://stg-catalog-challenge.vercel.app](https://stg-catalog-challenge.vercel.app)
- **Repositório**: [https://github.com/seu-usuario/stg-catalog-challenge](https://github.com/seu-usuario/stg-catalog-challenge)
- **Supabase**: [https://supabase.com](https://supabase.com)

## ✅ Checklist de Funcionalidades

### 🔐 Autenticação
- [x] Login com email
- [x] Registro de usuário
- [x] Proteção de rotas
- [x] Logout funcional
- [x] Recuperação de senha

### 🛍️ Catálogo
- [x] Grid responsivo com 12+ produtos
- [x] Busca/filtro por nome
- [x] Visualização detalhada de produtos
- [x] Adicionar ao carrinho
- [x] Categorias de produtos

### 🛒 Carrinho
- [x] Lista de produtos no carrinho
- [x] Editar quantidades
- [x] Remover itens
- [x] Cálculo de totais
- [x] Persistência no banco

### 📱 WhatsApp Integration
- [x] Gerar mensagem formatada
- [x] Link wa.me automático
- [x] Limpar carrinho pós-envio
- [x] Formato de mensagem conforme especificação

### 🎨 Design & UX
- [x] Design responsivo (mobile/tablet/desktop)
- [x] Cores profissionais (verde/azul)
- [x] Loading states
- [x] Feedback visual
- [x] Ícones Lucide React
- [x] Dark mode

### 🗄️ Banco de Dados
- [x] Tabela `products` com todos os campos
- [x] Tabela `cart_items` relacionada
- [x] Users via Supabase Auth
- [x] Relacionamentos corretos

### 📱 Telas Implementadas
- [x] Login/Registro com validações
- [x] Catálogo responsivo
- [x] Detalhes do produto
- [x] Carrinho com edição
- [x] Checkout completo
- [x] Confirmação WhatsApp

## 📱 Formato da Mensagem WhatsApp

A mensagem gerada segue exatamente o formato especificado:

```
🛍️ NOVO PEDIDO - STG CATALOG
👤 Cliente: [Nome]
📧 Email: [Email]

🛒 PRODUTOS:
•⁠  ⁠[Produto] - Qtd: [X] - R$ [valor]
•⁠  ⁠[Produto] - Qtd: [X] - R$ [valor]
💵 TOTAL: R$ [total final]
---
Pedido via STG Catalog
```

## 🎯 Diferenciais Implementados

- **Checkout Completo**: Formulário de entrega e métodos de pagamento


- **Design Moderno**: Interface profissional com tema escuro/claro
- **Responsividade**: Funciona perfeitamente em todos os dispositivos
- **Validações**: Formulários com validação completa
- **Feedback Visual**: Loading states e mensagens de sucesso

## 🚀 Deploy

O projeto está configurado para deploy automático no Vercel:

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 📊 Estrutura do Projeto

```
stg-catalog-challenge/
├── app/                    # App Router (Next.js 13+)
│   ├── auth/              # Páginas de autenticação
│   ├── cart/              # Página do carrinho
│   ├── checkout/          # Página de checkout
│   ├── product/           # Páginas de produtos
│   └── protected/         # Rotas protegidas
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── ...               # Componentes customizados
├── lib/                  # Utilitários e configurações
│   └── supabase/         # Configuração Supabase
└── public/               # Arquivos estáticos
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
