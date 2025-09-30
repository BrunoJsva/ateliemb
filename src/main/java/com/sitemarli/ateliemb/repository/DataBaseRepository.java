package com.sitemarli.ateliemb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sitemarli.ateliemb.entity.DataBaseEntity;

/**
 * Repositório Spring Data JPA para verificar a conexão com o banco de dados. 📡
 * <p>
 * Este repositório
 * gerencia a entidade {@link DataBaseEntity} e tem como principal finalidade
 * fornecer um método para testar a conectividade com a base de dados.
 * </p>
 * <p>
 * Ele estende {@link JpaRepository}, herdando métodos CRUD padrão para a
 * entidade
 * de teste, mas seu uso principal é através do método customizado
 * {@link #testConnection()}.
 * </p>
 *
 * @see DataBaseEntity
 * @author bruno.silva
 * @version 1.0
 * @since 2025-09-30
 */
@Repository
public interface DataBaseRepository extends JpaRepository<DataBaseEntity, Long> {

    /**
     * Executa uma consulta simples ("SELECT 1") para verificar se a conexão com o
     * banco de dados está ativa.
     * <p>
     * Este é um método leve e eficiente para ser usado em endpoints de <i>health
     * check</i>,
     * pois não depende de nenhuma tabela específica e tem um custo de execução
     * mínimo.
     * </p>
     *
     * @return Retorna o inteiro 1 se a consulta for executada com sucesso.
     * @throws org.springframework.dao.DataAccessException em caso de falha na
     *                                                     comunicação com o banco.
     * @author bruno.silva
     */
    @Query("SELECT 1")
    Integer testConnection();
}