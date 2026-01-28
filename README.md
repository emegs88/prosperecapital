# Prospere Capital - Dashboard do Investidor

Plataforma completa de gestão de investimentos com visual premium estilo fintech/gestora.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos e visualizações
- **Framer Motion** - Animações
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🎨 Design System

### Cores
- **Preto**: `#000000` - Fundo principal
- **Branco**: `#FFFFFF` - Texto principal
- **Vermelho Prospere**: `#DC2626` - Destaques e ações
- **Dourado**: `#D4AF37` - Detalhes opcionais
- **Cinzas**: Escala completa para UI

### Tema
- Fundo escuro premium
- Cards grandes com números destacados
- Layout responsivo (desktop first)
- Animações leves e elegantes

## 📄 Páginas e Módulos

### 1. Dashboard (Home)
- 4 cards principais com métricas
- Divisão de saldo (disponível, bloqueado, em aviso)
- Gráficos:
  - Evolução do Patrimônio (linha)
  - Rentabilidade Mensal (barras)
  - Projeção Futura (3 cenários)
  - Distribuição da Carteira (pizza)

### 2. Simulador de Aporte
- Inputs configuráveis (valor, tipo, prazo, pool)
- Cálculos de projeção com juros compostos
- Gráficos mês a mês
- Comparação de cenários (conservador/base/agressivo)

### 3. Módulo de Resgate (D+30)
- Solicitação de resgate total ou parcial
- Timeline visual do processo
- Aviso prévio de 30 dias
- Status: Em aviso / Em liquidação / Pago

### 4. Extrato
- Lista completa de transações
- Filtros por tipo, data e busca
- Exportação PDF/CSV
- Totais calculados

### 5. Pools / Operações
- Visualização dos pools disponíveis
- Métricas de cada pool
- Comparativo de performance
- Detalhes de composição

### 6. Admin
- Controle de investidores
- Gestão de aportes
- Estoque de cartas
- Vendas BidCon
- DRE (Demonstração de Resultados)

## 📊 Dados Mockados

O projeto inclui dados mockados realistas para:
- Investidores
- Aportes
- Transações
- Resgates
- Pools
- Rentabilidades

## 🔧 Estrutura do Projeto

```
fundoinvestimentos/
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Dashboard
│   ├── simulador/         # Simulador
│   ├── resgate/           # Resgates
│   ├── extrato/           # Extrato
│   ├── pools/             # Pools
│   └── admin/             # Admin
├── components/            # Componentes React
│   ├── ui/                # Componentes base
│   └── layout/            # Layout components
├── lib/                   # Utilitários
│   ├── mockData.ts        # Dados mockados
│   ├── calculations.ts    # Cálculos financeiros
│   └── utils.ts           # Helpers
└── types/                 # TypeScript types
```

## 🧮 Cálculos Financeiros

O sistema inclui funções para:
- Juros compostos
- Projeções futuras
- Cenários (conservador/base/agressivo)
- Rentabilidade média
- Lucro total

## 🎯 Próximos Passos

- Integração com Supabase/Firebase
- Autenticação de usuários
- Integração com API BidCon
- Geração de relatórios PDF
- Notificações em tempo real

## 📝 Licença

Este projeto é privado e propriedade da Prospere Capital.
