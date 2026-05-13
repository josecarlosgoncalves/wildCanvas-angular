export interface ProductBase {
  imagem: string;
  titulo: string;
  autor: string;
  dataQuadro: string;
  descricao: string;
  quantidade: number;
  preco: number;
}

export interface Product extends ProductBase {
  id: number | string;
}

export interface ProductCreate extends ProductBase {}

export interface ProductQuantidadeUpdate {
  quantidade: number;
}
