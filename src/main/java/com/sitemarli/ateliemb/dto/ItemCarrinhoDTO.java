package com.sitemarli.ateliemb.dto;

import lombok.Builder;
import lombok.With;

import java.math.BigDecimal;

@Builder
@With
public record ItemCarrinhoDTO(
        Long id,
        String tipoProduto,
        String nomeProduto,
        BigDecimal precoUnitario,
        Integer quantidade,
        BigDecimal subtotal,
        String categoria
) {
}