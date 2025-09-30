package com.sitemarli.ateliemb.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entidade JPA destinada a testar a conexão com o banco de dados. 🔩
 * <p>
 * Esta classe é mapeada para a tabela {@code PING} e não representa uma
 * entidade de negócio
 * real. Seu principal objetivo é ser utilizada em endpoints de diagnóstico ou
 * <i>health checks</i>
 * para realizar uma consulta simples e verificar se a comunicação com o banco
 * de dados
 * está ativa e funcional.
 * </p>
 *
 * @author bruno.silva
 * @version 1.0
 * @since 2025-09-30
 */
@Entity
@Table(name = "CONEXAO-TESTE-DATASE")
public class DataBaseEntity {

    /**
     * Chave primária da tabela PING.
     */
    @Id
    private Long id;

    /**
     * Construtor padrão sem argumentos, exigido pelo framework de persistência
     * (JPA).
     */
    public DataBaseEntity() {
        // Construtor padrão exigido pelo JPA
    }

    /**
     * Retorna o identificador único da entidade.
     *
     * @return O valor do ID.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o identificador único da entidade.
     *
     * @param id O novo valor do ID.
     */
    public void setId(Long id) {
        this.id = id;
    }
}