package com.sitemarli.ateliemb.dto;

import lombok.Builder;
import lombok.With;

@Builder
@With
public record FinalizarPedidoDTO(String nomeCliente) {
}