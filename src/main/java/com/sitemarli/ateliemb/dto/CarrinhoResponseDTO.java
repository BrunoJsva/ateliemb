package com.sitemarli.ateliemb.dto;

import com.sitemarli.ateliemb.entity.CarrinhoCompras;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record CarrinhoResponseDTO(
        String celular,
        String nomeCliente,
        LocalDateTime dataCriacao,
        LocalDateTime dataAtualizacao,
        BigDecimal valorTotal,
        String status,
        Integer totalItens,
        List<ItemCarrinhoResponseDTO> itens
) {
    public CarrinhoResponseDTO(CarrinhoCompras carrinho) {
        this(
                carrinho.getCelular(),
                carrinho.getNomeCliente(),
                carrinho.getDataCriacao(),
                carrinho.getDataAtualizacao(),
                carrinho.getValorTotal(),
                carrinho.getStatus(),
                carrinho.getItens().size(),
                carrinho.getItens().stream()
                        .map(ItemCarrinhoResponseDTO::new)
                        .collect(Collectors.toList())
        );
    }
}