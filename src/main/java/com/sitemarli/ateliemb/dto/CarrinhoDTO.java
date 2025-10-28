package com.sitemarli.ateliemb.dto;

import java.math.BigDecimal;
import java.util.List;

public record CarrinhoDTO(
        String celular,
        String nomeCliente,
        BigDecimal valorTotal,
        String status,
        List<ItemCarrinhoDTO> itens
) {
}