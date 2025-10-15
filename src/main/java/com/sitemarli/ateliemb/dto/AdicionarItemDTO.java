package com.sitemarli.ateliemb.dto;

import lombok.Builder;
import lombok.With;

import java.math.BigDecimal;

@Builder
@With
public record AdicionarItemDTO(
        String celular,
        String tipoProduto,
        String nomeProduto,
        BigDecimal preco,
        Integer quantidade,
        String categoria
) {
    public AdicionarItemDTO {
        // Validação e valores padrão
        if (quantidade == null) {
            quantidade = 1;
        }
    }
}