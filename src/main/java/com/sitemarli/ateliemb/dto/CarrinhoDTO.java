package com.sitemarli.ateliemb.dto;

import lombok.Builder;
import lombok.With;

import java.math.BigDecimal;
import java.util.List;

@Builder
@With
public record CarrinhoDTO(
        String celular,
        String nomeCliente,
        BigDecimal valorTotal,
        String status,
        List<ItemCarrinhoDTO> itens
) {
}