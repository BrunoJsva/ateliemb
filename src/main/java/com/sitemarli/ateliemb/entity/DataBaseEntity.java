package com.sitemarli.ateliemb.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

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
@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class DataBaseEntity {

    /**
     * Chave primária da tabela PING.
     */
    @Id
    @EqualsAndHashCode.Include
    private Long id;

    // Lombok gera automaticamente:
    // - Construtor padrão (@NoArgsConstructor)
    // - Getters e setters (@Data)
    // - equals() e hashCode() baseados no ID (@EqualsAndHashCode)
    // - toString() (@Data)
}