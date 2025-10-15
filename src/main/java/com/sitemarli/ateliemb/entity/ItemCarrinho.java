package com.sitemarli.ateliemb.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "item_carrinho")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "carrinho")
public class ItemCarrinho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "celular_carrinho", nullable = false)
    private CarrinhoCompras carrinho;

    @Column(name = "tipo_produto", length = 50, nullable = false)
    private String tipoProduto;

    @Column(name = "nome_produto", length = 100, nullable = false)
    private String nomeProduto;

    @Column(name = "preco_unitario", precision = 10, scale = 2, nullable = false)
    private BigDecimal precoUnitario;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @Column(name = "categoria", length = 50)
    private String categoria;

    @Column(name = "observacao", length = 500)
    private String observacao;

    public ItemCarrinho() {
        this.quantidade = 1;
    }

    public ItemCarrinho(String tipoProduto, String nomeProduto, BigDecimal precoUnitario) {
        this();
        this.tipoProduto = tipoProduto;
        this.nomeProduto = nomeProduto;
        this.precoUnitario = precoUnitario;
        calcularSubtotal();
    }

    public ItemCarrinho(String tipoProduto, String nomeProduto, BigDecimal precoUnitario, Integer quantidade) {
        this.tipoProduto = tipoProduto;
        this.nomeProduto = nomeProduto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
        calcularSubtotal();
    }

    public ItemCarrinho(String tipoProduto, String nomeProduto, BigDecimal precoUnitario, String categoria) {
        this();
        this.tipoProduto = tipoProduto;
        this.nomeProduto = nomeProduto;
        this.precoUnitario = precoUnitario;
        this.categoria = categoria;
        calcularSubtotal();
    }

    public void calcularSubtotal() {
        if (precoUnitario != null && quantidade != null) {
            this.subtotal = precoUnitario.multiply(BigDecimal.valueOf(quantidade));
        } else {
            this.subtotal = BigDecimal.ZERO;
        }
    }

    public void incrementarQuantidade() {
        this.quantidade++;
        calcularSubtotal();
    }

    public void decrementarQuantidade() {
        if (this.quantidade > 1) {
            this.quantidade--;
            calcularSubtotal();
        }
    }

    // Setter customizado para precoUnitario que recalcula o subtotal
    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
        calcularSubtotal();
    }

    // Setter customizado para quantidade que recalcula o subtotal
    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
        calcularSubtotal();
    }
}
