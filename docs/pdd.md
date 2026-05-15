# Product Definition Document (PDD) - StockPlus Mobile MVP

## 1. Visão Geral do Projeto

Aplicativo mobile em React Native focado na gestão simplificada de Produtos e Categorias. O projeto utiliza uma arquitetura simples, navegação via props e dados mockados para simular um CRUD (Create, Read, Update, Delete) completo em memória.

## 2. Stack Tecnológica

- **Framework:** React Native (Expo recomendado para agilidade)
- **Linguagem:** TypeScript
- **Navegação:** React Navigation (Native Stack)
- **Gerenciamento de Estado:** `useState` local (inicializado com dados do `mockDb.ts`)
- **Estilização:** `StyleSheet` nativo

## 3. Estrutura de Pastas Esperada

```text
src/
├── components/          # Componentes reutilizáveis (Modais, Botões, Cards)
├── screens/             # Telas do aplicativo (Home, Produtos, Categorias)
├── navigation/          # Configuração do Stack Navigator
└── database/            # Contém o arquivo mockDb.ts com as interfaces e dados iniciais

```

## 4. Banco de Dados Mockado (`mockDb.ts`)

A IA deve utilizar o arquivo `mockDb.ts` fornecido anteriormente para inicializar os estados nas telas.

- **Interfaces Principais:** `Produto` e `Categoria`.
- _Nota para a IA:_ Como não há backend real, utilize `useState` nas telas de Produtos e Categorias, inicializando o estado com `db.produtos` e `db.categorias`. As operações de Adicionar, Editar e Excluir devem atualizar esses estados locais para refletir na UI imediatamente.

## 5. Fluxo de Navegação (Stack Navigator)

- `HomeScreen` (Rota Inicial)
- `ProdutosScreen`
- `CategoriasScreen`

---

## 6. Especificações das Telas

### 6.1. HomeScreen

- **UI:** Tela inicial limpa com um título de boas-vindas.
- **Ações:**
- Botão **"Gerenciar Produtos"**: Navega para `ProdutosScreen`.
- Botão **"Gerenciar Categorias"**: Navega para `CategoriasScreen`.

### 6.2. ProdutosScreen

- **Estado Local:** `produtos` (array do tipo `Produto[]`), inicializado com o mock.
- **Header / Topo:**
- Título da tela.
- Botão **"Adicionar Produto"**: Abre um Modal de Criação.

- **Listagem (FlatList):**
- Renderiza um card para cada produto contendo: Imagem (`vinculo_imagem`), Nome (`dc_produto`), Categoria (fazer um `find` no mock de categorias) e Valor (`preco` formatado).
- **Ações em cada Card (Botões/Ícones):**

1. **Editar:** Abre um Modal de Edição preenchido com os dados do item.
2. **Excluir:** Abre um `Alert` nativo de confirmação ("Tem certeza que deseja excluir?"). Se 'Sim', remove do estado local.
3. **Ver Detalhes:** Abre um Modal de Detalhes exibindo todas as informações associadas ao produto no banco (Estoque mínimo, fornecedor associado, etc.).

- **Modais:**
- **Modal de Criação/Edição:** Deve conter `TextInput` para os campos essenciais (Nome, Preço, URL da imagem, etc.) e botões "Cancelar" e "Salvar". Ao salvar, atualiza o estado local do array de produtos (adicionando um novo objeto com ID gerado ou atualizando o existente).
- **Modal de Detalhes:** Apenas leitura (`Text`), com um botão "Fechar".

### 6.3. CategoriasScreen

- **Estado Local:** `categorias` (array do tipo `Categoria[]`), inicializado com o mock.
- **Header / Topo:**
- Título da tela.
- Botão **"Adicionar Categoria"** (opcional/recomendado): Abre Modal para criar categoria.

- **Listagem (FlatList):**
- Renderiza um item de lista simples com o nome da categoria (`dc_categoria`).
- **Ações em cada Item:**

1. **Editar:** Abre um Modal de Edição com um input para alterar o nome da categoria.
2. **Excluir:** Abre um `Alert` nativo de confirmação. Se 'Sim', remove do estado local.

- **Modais:**
- **Modal de Edição de Categoria:** Contém um `TextInput` para o nome e botões "Cancelar" e "Salvar".

---

## 7. Regras de Desenvolvimento para a Coder

1. **Tipagem Estrita:** Utilize as interfaces do TypeScript exportadas no `mockDb.ts` para tipar estados, props e funções.
2. **Simplicidade:** Mantenha os componentes em arquivos separados se ficarem muito grandes, mas priorize a funcionalidade e clareza. Não utilize bibliotecas externas complexas (como Redux ou React Hook Form) a menos que estritamente necessário.
3. **Feedback Visual:** Utilize `Alert` ou `Toast` simples para informar o usuário de que uma ação (Salvar, Editar, Excluir) foi concluída com sucesso.
