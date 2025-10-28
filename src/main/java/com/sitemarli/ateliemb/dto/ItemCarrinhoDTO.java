package com.sitemarli.ateliemb.dto;

import java.math.BigDecimal;

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