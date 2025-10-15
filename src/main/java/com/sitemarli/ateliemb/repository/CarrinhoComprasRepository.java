package com.sitemarli.ateliemb.repository;

import com.sitemarli.ateliemb.entity.CarrinhoCompras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarrinhoComprasRepository extends JpaRepository<CarrinhoCompras, String> {

    /**
     * Busca carrinho por celular e status
     */
    Optional<CarrinhoCompras> findByCelularAndStatus(String celular, String status);

    /**
     * Busca carrinho por celular e status com itens carregados
     */
    @Query("SELECT c FROM CarrinhoCompras c LEFT JOIN FETCH c.itens WHERE c.celular = ?1 AND c.status = ?2")
    Optional<CarrinhoCompras> findByCelularAndStatusWithItens(String celular, String status);

    /**
     * Busca todos os carrinhos abertos
     */
    List<CarrinhoCompras> findByStatus(String status);

    /**
     * Busca carrinhos por nome do cliente
     */
    List<CarrinhoCompras> findByNomeClienteContainingIgnoreCase(String nomeCliente);

    /**
     * Verifica se existe um carrinho aberto para o celular
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM CarrinhoCompras c WHERE c.celular = ?1 AND c.status = 'ABERTO'")
    boolean existeCarrinhoAberto(String celular);

    /**
     * Deleta carrinhos antigos com status específico
     */
    void deleteByStatus(String status);

    /**
     * Busca dados básicos dos carrinhos sem carregar itens
     */
    @Query("SELECT c.celular, c.nomeCliente, c.status, c.valorTotal, c.dataCriacao FROM CarrinhoCompras c")
    List<Object[]> findCarrinhosSemItens();
}