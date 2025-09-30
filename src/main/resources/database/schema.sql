-- 
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - CONFEITARIA MB
-- 
-- Projeto: Ateliê MB - Sistema de Gerenciamento de Confeitaria
-- Autor: Bruno Silva
-- Data: 30/09/2025
-- Descrição: Script para criação das tabelas principais
--            do sistema de gerenciamento da confeitaria
-- 

-- Criação do banco de dados (opcional)
-- CREATE DATABASE ateliemb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE ateliemb;

-- 
-- TABELA: tb_cliente
-- Descrição: Armazena informações dos clientes
-- 
CREATE TABLE tb_cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome_cliente VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para otimização
    INDEX idx_cliente_nome (nome_cliente),
    INDEX idx_cliente_cpf (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 
-- TABELA: tb_fornecedor
-- Descrição: Armazena informações dos fornecedores
-- 
CREATE TABLE tb_fornecedor (
    id_fornecedor INT PRIMARY KEY AUTO_INCREMENT,
    nome_fornecedor VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100),
    
    -- Índices para otimização
    INDEX idx_fornecedor_nome (nome_fornecedor),
    INDEX idx_fornecedor_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 
-- TABELA: tb_produto
-- Descrição: Catálogo de produtos da confeitaria
-- 
CREATE TABLE tb_produto (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    nome_produto VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    preco_custo NUMERIC(10, 2),
    preco_venda NUMERIC(10, 2) NOT NULL,
    id_fornecedor INTEGER,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Relacionamento com o fornecedor
    FOREIGN KEY (id_fornecedor) REFERENCES tb_fornecedor(id_fornecedor)
        ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Índices para otimização
    INDEX idx_produto_nome (nome_produto),
    INDEX idx_produto_ativo (ativo),
    INDEX idx_produto_fornecedor (id_fornecedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 
-- TABELA: tb_estoque
-- Descrição: Controle de estoque dos produtos
-- 
CREATE TABLE tb_estoque (
    id_estoque INT PRIMARY KEY AUTO_INCREMENT,
    id_produto INTEGER NOT NULL UNIQUE,
    quantidade INTEGER NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    data_ultima_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Chave estrangeira ligando ao produto
    FOREIGN KEY (id_produto) REFERENCES tb_produto(id_produto) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices para otimização
    INDEX idx_estoque_produto (id_produto),
    INDEX idx_estoque_quantidade (quantidade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 
-- TABELA: tb_venda
-- Descrição: Cabeçalho das transações de venda
-- 
CREATE TABLE tb_venda (
    id_venda INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INTEGER, -- NULL se for venda no balcão
    data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total NUMERIC(10, 2) NOT NULL,
    status_venda VARCHAR(50) NOT NULL DEFAULT 'Concluída',
    
    -- Relacionamento com o cliente
    FOREIGN KEY (id_cliente) REFERENCES tb_cliente(id_cliente)
        ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Índices para otimização
    INDEX idx_venda_data (data_venda),
    INDEX idx_venda_cliente (id_cliente),
    INDEX idx_venda_status (status_venda)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 
-- TABELA: tb_item_venda
-- Descrição: Itens detalhados de cada venda
-- 
CREATE TABLE tb_item_venda (
    id_item_venda INT PRIMARY KEY AUTO_INCREMENT,
    id_venda INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario_praticado NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    
    -- Relacionamentos
    FOREIGN KEY (id_venda) REFERENCES tb_venda(id_venda) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES tb_produto(id_produto) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Índices para otimização
    INDEX idx_item_venda (id_venda),
    INDEX idx_item_produto (id_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

