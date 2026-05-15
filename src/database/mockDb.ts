// utilizado para popular, simular o banco de dados
export interface Categoria {
  id_categoria: number;
  dc_categoria: string;
}

export interface Fornecedor {
  id_fornecedor: number;
  dc_fornecedor: string;
}

export interface Produto {
  id_produto: number;
  dc_produto: string;
  vinculo_imagem: string;
  preco: number;
  estoque_minimo: number;
  id_categoria: number;
  id_fornecedor: number;
}

export interface Estoque {
  id_estoque: number;
  id_produto: number;
  quantidade_atual: number;
  dt_ultima_atualizacao: string;
}

export interface LoteEstoque {
  id_lote: number;
  id_produto: number;
  dt_vencimento: string;
  quantidade_lote: number;
  dt_entrada: string;
}

// Criamos um tipo específico para o ENUM da tabela
export type TipoMovimento = 'ENTRADA' | 'SAIDA';

export interface Movimentacao {
  id_movimentacao: number;
  tipo_movimento: TipoMovimento;
  quantidade: number;
  dt_movimentacao: string;
  id_lote: number;
  id_produto: number;
}

// Tipo global que engloba todo o nosso "banco"
export interface MockDatabase {
  categorias: Categoria[];
  fornecedores: Fornecedor[];
  produtos: Produto[];
  estoque: Estoque[];
  lote_estoque: LoteEstoque[];
  movimentacao: Movimentacao[];
}


export const db: MockDatabase = {
  categorias: [
    { id_categoria: 1, dc_categoria: 'Alimentos Básicos' },
    { id_categoria: 2, dc_categoria: 'Bebidas' },
    { id_categoria: 3, dc_categoria: 'Limpeza e Higiene' },
  ],

  fornecedores: [
    { id_fornecedor: 1, dc_fornecedor: 'Distribuidora Alvorada' },
    { id_fornecedor: 2, dc_fornecedor: 'Bebidas Sul Ltda' },
    { id_fornecedor: 3, dc_fornecedor: 'LimpBem Indústria' },
  ],

  produtos: [
    {
      id_produto: 1,
      dc_produto: 'Arroz Branco 5kg',
      vinculo_imagem: 'https://via.placeholder.com/150/e0e0e0/808080?text=Arroz',
      preco: 25.50,
      estoque_minimo: 50,
      id_categoria: 1,
      id_fornecedor: 1,
    },
    {
      id_produto: 2,
      dc_produto: 'Refrigerante Cola 2L',
      vinculo_imagem: 'https://via.placeholder.com/150/e0e0e0/808080?text=Refrigerante',
      preco: 8.90,
      estoque_minimo: 100,
      id_categoria: 2,
      id_fornecedor: 2,
    },
    {
      id_produto: 3,
      dc_produto: 'Desinfetante Lavanda 1L',
      vinculo_imagem: 'https://via.placeholder.com/150/e0e0e0/808080?text=Desinfetante',
      preco: 6.50,
      estoque_minimo: 30,
      id_categoria: 3,
      id_fornecedor: 3,
    },
  ],

  estoque: [
    {
      id_estoque: 1,
      id_produto: 1, 
      quantidade_atual: 40, 
      dt_ultima_atualizacao: '2024-10-25T14:30:00Z',
    },
    {
      id_estoque: 2,
      id_produto: 2, 
      quantidade_atual: 150, 
      dt_ultima_atualizacao: '2024-10-26T09:15:00Z',
    },
    {
      id_estoque: 3,
      id_produto: 3, 
      quantidade_atual: 35, 
      dt_ultima_atualizacao: '2024-10-20T11:00:00Z',
    },
  ],

  lote_estoque: [
    {
      id_lote: 1,
      id_produto: 1, 
      dt_vencimento: '2025-05-10',
      quantidade_lote: 40,
      dt_entrada: '2024-10-10T08:00:00Z',
    },
    {
      id_lote: 2,
      id_produto: 2, 
      dt_vencimento: '2024-11-30', 
      quantidade_lote: 100,
      dt_entrada: '2024-09-15T10:00:00Z',
    },
  ],

  movimentacao: [
    {
      id_movimentacao: 1,
      tipo_movimento: 'ENTRADA',
      quantidade: 100,
      dt_movimentacao: '2024-09-15T10:00:00Z',
      id_lote: 2,
      id_produto: 2,
    },
    {
      id_movimentacao: 2,
      tipo_movimento: 'SAIDA',
      quantidade: 10,
      dt_movimentacao: '2024-10-25T14:30:00Z',
      id_lote: 1,
      id_produto: 1,
    },
  ],
};