# Oldisco - Extreme Metal Selo

E-commerce premium para CDs de black metal com rádio online integrada, blog e estética dark brutal.

## Tecnologias

- **React 19** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **React Router** - Roteamento
- **Tailwind CSS** - Estilização (via CDN)
- **Framer Motion** - Animações
- **Lucide React** - Ícones

## Como Executar

### Pré-requisitos

- Node.js instalado

### Instalação e Execução

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Executar em modo desenvolvimento:
   ```bash
   npm run dev
   ```

3. Build para produção:
   ```bash
   npm run build
   ```

4. Preview do build:
   ```bash
   npm run preview
   ```

## Estrutura do Projeto

```
frontend/
├── App.tsx              # Componente principal e roteamento
├── index.tsx            # Entry point
├── index.html           # HTML base
├── vite.config.ts       # Configuração do Vite
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração TypeScript
├── types.ts             # Tipos TypeScript
├── constants.tsx        # Dados mock (produtos, posts)
├── components/          # Componentes React
│   ├── Header.tsx
│   ├── AudioPlayer.tsx
│   ├── CartSidebar.tsx
│   ├── Logo.tsx
│   └── ProductCard.tsx
└── pages/               # Páginas/rotas
    ├── Home.tsx
    └── Checkout.tsx
```

## Features

- 🎵 Catálogo de produtos (CDs)
- 🛒 Carrinho de compras com persistência local
- 📻 Player de rádio online integrado
- 💳 Checkout multi-etapas
- 📱 Design responsivo e dark mode
- 🎨 Estética brutalista e minimalista

## Notas

- O projeto usa **HashRouter** para navegação
- Dados mock estão em `constants.tsx`
- Carrinho persiste no `localStorage`
- Tailwind CSS é carregado via CDN no `index.html`
