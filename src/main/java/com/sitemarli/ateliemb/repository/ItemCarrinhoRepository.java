package com.sitemarli.ateliemb.repository;

import com.sitemarli.ateliemb.entity.ItemCarrinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {

    /**
     * Busca todos os itens de um carrinho
     */
    List<ItemCarrinho> findByCarrinhoCelular(String celular);

    /**
     * Busca itens por tipo de produto
     */
    List<ItemCarrinho> findByCarrinhoCelularAndTipoProduto(String celular, String tipoProduto);

    /**
     * Conta quantos itens tem no carrinho
     */
    @Query("SELECT COUNT(i) FROM ItemCarrinho i WHERE i.carrinho.celular = ?1")
    Long contarItensPorCelular(String celular);

    /**
     * Deleta todos os itens de um carrinho
     */
    void deleteByCarrinhoCelular(String celular);

    /**
     * Busca dados básicos dos itens sem carregar o carrinho completo
     */
    @Query("SELECT i.id, i.carrinho.celular, i.tipoProduto, i.nomeProduto, i.precoUnitario, i.quantidade, i.subtotal, i.categoria FROM ItemCarrinho i")
    List<Object[]> findItensSemCarrinho();
}