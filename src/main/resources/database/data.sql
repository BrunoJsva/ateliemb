
-- DADOS DE EXEMPLO - CONFEITARIA MB
-- Projeto: Ateliê MB - Sistema de Gerenciamento de Confeitaria
-- Autor: Bruno Silva
-- Data: 30/09/2025
-- Descrição: Script com dados de exemplo para testes e desenvolvimento do sistema de confeitaria
-- INSERÇÃO DE FORNECEDORES

INSERT INTO tb_fornecedor (nome_fornecedor, telefone, email) VALUES 
('Doces & Sabores Distribuidora', '(11) 3456-7890', 'vendas@docesesabores.com.br'),
('Confeitaria Premium Ltda', '(11) 9876-5432', 'contato@confeitariapremium.com.br'),
('Chocolates Artesanais Brasil', '(11) 2345-6789', 'comercial@chocolatesartesanais.com.br'),
('Embalagens & Decorações', '(11) 8765-4321', 'atendimento@embalagensedecoracoes.com.br'),
('Ingredientes Especiais Nacional', '(11) 5678-9012', 'pedidos@ingredientesespeciais.com.br');

-- 
-- INSERÇÃO DE PRODUTOS
-- 
INSERT INTO tb_produto (nome_produto, descricao, preco_custo, preco_venda, id_fornecedor, ativo) VALUES 
-- Doces e Bolos
('Bolo de Chocolate - Fatia', 'Fatia de bolo de chocolate com cobertura de brigadeiro', 4.50, 8.90, 1, TRUE),
('Bolo de Cenoura - Fatia', 'Fatia de bolo de cenoura com cobertura de chocolate', 4.00, 7.90, 1, TRUE),
('Torta de Morango - Fatia', 'Fatia de torta de morango com chantilly', 6.50, 12.90, 1, TRUE),

-- Salgados
('Coxinha de Frango', 'Coxinha tradicional de frango desfiado', 2.20, 4.50, 2, TRUE),
('Pão de Açúcar', 'Pão de açúcar recheado com queijo', 1.80, 3.50, 2, TRUE),
('Empada de Palmito', 'Empada individual com recheio de palmito', 2.50, 5.00, 2, TRUE),

-- Chocolates
('Trufa de Chocolate Belga', 'Trufa artesanal de chocolate belga 70% cacau', 3.20, 6.50, 3, TRUE),
('Brigadeiro Gourmet', 'Brigadeiro gourmet com chocolate nobre', 2.80, 5.50, 3, TRUE),
('Bombom de Morango', 'Bombom recheado com ganache de morango', 3.50, 7.20, 3, TRUE),

-- Bebidas
('Café Expresso', 'Café expresso tradicional, xícara pequena', 1.50, 3.90, 5, TRUE),
('Cappuccino', 'Cappuccino cremoso com canela', 2.80, 6.90, 5, TRUE),
('Suco Natural de Laranja', 'Suco de laranja natural 300ml', 2.00, 4.90, 5, TRUE),

-- Itens Especiais
('Cupcake Decorado', 'Cupcake com cobertura buttercream e decoração temática', 4.20, 8.90, 4, TRUE),
('Torta Salgada - Fatia', 'Fatia de torta salgada de frango com catupiry', 5.50, 11.50, 4, TRUE),
('Mousse de Maracujá', 'Mousse de maracujá em taça individual', 3.80, 7.50, 4, TRUE);

-- 
-- INSERÇÃO DE ESTOQUE INICIAL
-- 
INSERT INTO tb_estoque (id_produto, quantidade) VALUES 
-- Doces e Bolos (fatias)
(1, 25),   -- Bolo de Chocolate
(2, 20),   -- Bolo de Cenoura
(3, 15),   -- Torta de Morango

-- Salgados (unidades)
(4, 50),   -- Coxinha de Frango
(5, 40),   -- Pão de Açúcar
(6, 30),   -- Empada de Palmito

-- Chocolates (unidades)
(7, 80),   -- Trufa de Chocolate
(8, 100),  -- Brigadeiro Gourmet
(9, 60),   -- Bombom de Morango

-- Bebidas (unidades/porções)
(10, 0),   -- Café Expresso (preparado na hora)
(11, 0),   -- Cappuccino (preparado na hora)
(12, 20),  -- Suco de Laranja

-- Itens Especiais (unidades)
(13, 35),  -- Cupcake Decorado
(14, 18),  -- Torta Salgada
(15, 25);  -- Mousse de Maracujá

-- 
-- INSERÇÃO DE CLIENTES
-- 
INSERT INTO tb_cliente (nome_cliente, cpf) VALUES 
('Maria Silva Santos', '123.456.789-01'),
('João Pereira Lima', '987.654.321-02'),
('Ana Costa Oliveira', '456.789.123-03'),
('Carlos Eduardo Souza', '789.123.456-04'),
('Fernanda Rodrigues', '321.654.987-05'),
('Roberto Almeida', '654.987.321-06'),
('Juliana Mendes', '159.753.486-07'),
('Paulo Henrique Silva', '852.963.741-08');

-- 
-- INSERÇÃO DE VENDAS DE EXEMPLO
-- 
INSERT INTO tb_venda (id_cliente, data_venda, valor_total, status_venda) VALUES 
-- Vendas com clientes cadastrados
(1, '2025-09-25 10:30:00', 67.70, 'Concluída'),
(2, '2025-09-26 14:15:00', 127.20, 'Concluída'),
(3, '2025-09-27 09:45:00', 90.70, 'Concluída'),
(NULL, '2025-09-28 16:20:00', 34.30, 'Concluída'),
(NULL, '2025-09-29 11:10:00', 79.50, 'Concluída');

-- 
-- INSERÇÃO DE ITENS DAS VENDAS
-- 
INSERT INTO tb_item_venda (id_venda, id_produto, quantidade, preco_unitario_praticado, subtotal) VALUES 
-- Venda 1 (Maria Silva) - Total: R$ 67,80
(1, 1, 2, 8.90, 17.80),   -- 2 fatias Bolo de Chocolate
(1, 4, 3, 4.50, 13.50),   -- 3 Coxinhas de Frango
(1, 7, 5, 6.50, 32.50),   -- 5 Trufas de Chocolate
(1, 10, 1, 3.90, 3.90),   -- 1 Café Expresso

-- Venda 2 (João Pereira) - Total: R$ 127,20
(2, 3, 4, 12.90, 51.60),  -- 4 fatias Torta de Morango
(2, 8, 8, 5.50, 44.00),   -- 8 Brigadeiros Gourmet
(2, 11, 2, 6.90, 13.80),  -- 2 Cappuccinos
(2, 13, 2, 8.90, 17.80),  -- 2 Cupcakes Decorados

-- Venda 3 (Ana Costa) - Total: R$ 90,70
(3, 2, 3, 7.90, 23.70),   -- 3 fatias Bolo de Cenoura
(3, 5, 4, 3.50, 14.00),   -- 4 Pães de Açúcar
(3, 14, 2, 11.50, 23.00), -- 2 fatias Torta Salgada
(3, 15, 4, 7.50, 30.00),  -- 4 Mousses de Maracujá

-- Venda 4 (Balcão) - Total: R$ 34,90
(4, 6, 3, 5.00, 15.00),   -- 3 Empadas de Palmito
(4, 9, 2, 7.20, 14.40),   -- 2 Bombons de Morango
(4, 12, 1, 4.90, 4.90),   -- 1 Suco de Laranja

-- Venda 5 (Balcão) - Total: R$ 79,50
(5, 1, 3, 8.90, 26.70),   -- 3 fatias Bolo de Chocolate
(5, 7, 6, 6.50, 39.00),   -- 6 Trufas de Chocolate
(5, 11, 2, 6.90, 13.80);  -- 2 Cappuccinos

-- 
-- ATUALIZAÇÃO DO ESTOQUE APÓS AS VENDAS
-- 
-- Reduzir quantidades vendidas do estoque
UPDATE tb_estoque SET quantidade = quantidade - 5, data_ultima_movimentacao = NOW() WHERE id_produto = 1;  -- Bolo Chocolate: 25-5=20
UPDATE tb_estoque SET quantidade = quantidade - 3, data_ultima_movimentacao = NOW() WHERE id_produto = 2;  -- Bolo Cenoura: 20-3=17
UPDATE tb_estoque SET quantidade = quantidade - 4, data_ultima_movimentacao = NOW() WHERE id_produto = 3;  -- Torta Morango: 15-4=11
UPDATE tb_estoque SET quantidade = quantidade - 3, data_ultima_movimentacao = NOW() WHERE id_produto = 4;  -- Coxinha: 50-3=47
UPDATE tb_estoque SET quantidade = quantidade - 4, data_ultima_movimentacao = NOW() WHERE id_produto = 5;  -- Pão Açúcar: 40-4=36
UPDATE tb_estoque SET quantidade = quantidade - 3, data_ultima_movimentacao = NOW() WHERE id_produto = 6;  -- Empada: 30-3=27
UPDATE tb_estoque SET quantidade = quantidade - 11, data_ultima_movimentacao = NOW() WHERE id_produto = 7; -- Trufa: 80-11=69
UPDATE tb_estoque SET quantidade = quantidade - 8, data_ultima_movimentacao = NOW() WHERE id_produto = 8;  -- Brigadeiro: 100-8=92
UPDATE tb_estoque SET quantidade = quantidade - 2, data_ultima_movimentacao = NOW() WHERE id_produto = 9;  -- Bombom: 60-2=58
-- Cafés são preparados na hora (quantidade 0)
UPDATE tb_estoque SET quantidade = quantidade - 1, data_ultima_movimentacao = NOW() WHERE id_produto = 12; -- Suco: 20-1=19
UPDATE tb_estoque SET quantidade = quantidade - 2, data_ultima_movimentacao = NOW() WHERE id_produto = 13; -- Cupcake: 35-2=33
UPDATE tb_estoque SET quantidade = quantidade - 2, data_ultima_movimentacao = NOW() WHERE id_produto = 14; -- Torta Salgada: 18-2=16
UPDATE tb_estoque SET quantidade = quantidade - 4, data_ultima_movimentacao = NOW() WHERE id_produto = 15; -- Mousse: 25-4=21