package com.sitemarli.ateliemb.dto;

import com.sitemarli.ateliemb.entity.ItemCarrinho;
import lombok.Builder;
import lombok.With;

import java.math.BigDecimal;

@Builder
@With
public record ItemCarrinhoResponseDTO(
        Long id,
        String tipoProduto,
        String nomeProduto,
        BigDecimal preco,
        Integer quantidade,
        String categoria,
        BigDecimal subtotal
) {
    public ItemCarrinhoResponseDTO(ItemCarrinho item) {
        this(
                item.getId(),
                item.getTipoProduto(),
                item.getNomeProduto(),
                item.getPrecoUnitario(),
                item.getQuantidade(),
                item.getCategoria(),
                item.getSubtotal()
        );
    }
}