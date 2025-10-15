package com.sitemarli.ateliemb.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carrinho_compras")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "itens")
public class CarrinhoCompras {

    @Id
    @Column(name = "celular", length = 20, nullable = false)
    @EqualsAndHashCode.Include
    private String celular;

    @Column(name = "nome_cliente", length = 100)
    private String nomeCliente;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Column(name = "valor_total", precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "status", length = 20)
    private String status; // ABERTO, FINALIZADO, CANCELADO

    @OneToMany(mappedBy = "carrinho", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCarrinho> itens = new ArrayList<>();

    // Construtores
    public CarrinhoCompras() {
        this.dataCriacao = LocalDateTime.now();
        this.status = "ABERTO";
        this.valorTotal = BigDecimal.ZERO;
    }

    public CarrinhoCompras(String celular) {
        this();
        this.celular = celular;
    }

    // Métodos auxiliares
    public void adicionarItem(ItemCarrinho item) {
        itens.add(item);
        item.setCarrinho(this);
        calcularTotal();
    }

    public void removerItem(ItemCarrinho item) {
        itens.remove(item);
        item.setCarrinho(null);
        calcularTotal();
    }

    public void calcularTotal() {
        this.valorTotal = itens.stream()
                .map(ItemCarrinho::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.dataAtualizacao = LocalDateTime.now();
    }

    public void limpar() {
        itens.clear();
        this.valorTotal = BigDecimal.ZERO;
        this.dataAtualizacao = LocalDateTime.now();
    }

}
