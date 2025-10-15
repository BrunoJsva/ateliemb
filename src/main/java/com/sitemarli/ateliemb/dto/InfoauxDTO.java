package com.sitemarli.ateliemb.dto;

import lombok.Builder;
import lombok.With;

/**
 * DTO para transportar informações auxiliares sobre o ambiente
 * e a fonte de dados.
 *
 * <p>
 * Este record oferece uma forma imutável de encapsular dados,
 * garantindo consistência ao longo do ciclo de vida do objeto.
 *
 * @param environment O ambiente de execução da aplicação (por exemplo, LOCAL,
 *                    DEV, PROD).
 * @param database    A URL da fonte de dados utilizada pela aplicação.
 * @author bruno.silva
 * @version 1.0
 */
@Builder
@With
public record InfoauxDTO(String environment, String database) {
}