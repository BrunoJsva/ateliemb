package com.sitemarli.ateliemb.service;

import com.sitemarli.ateliemb.entity.CarrinhoCompras;
import com.sitemarli.ateliemb.entity.ItemCarrinho;
import com.sitemarli.ateliemb.repository.CarrinhoComprasRepository;
import com.sitemarli.ateliemb.repository.ItemCarrinhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CarrinhoComprasService {

    @Autowired
    private CarrinhoComprasRepository carrinhoRepository;

    @Autowired
    private ItemCarrinhoRepository itemRepository;

    /**
     * Busca ou cria um carrinho para o celular informado
     */
    public CarrinhoCompras buscarOuCriarCarrinho(String celular) {
        // Usa a query que força o reload dos itens do banco para evitar cache de itens deletados
        Optional<CarrinhoCompras> carrinhoExistente = carrinhoRepository
                .findByCelularAndStatusWithItens(celular, "ABERTO");

        if (carrinhoExistente.isPresent()) {
            return carrinhoExistente.get();
        }

        CarrinhoCompras novoCarrinho = new CarrinhoCompras(celular);
        return carrinhoRepository.save(novoCarrinho);
    }

    /**
     * Busca carrinho por celular
     */
    public Optional<CarrinhoCompras> buscarCarrinhoPorCelular(String celular) {
        return carrinhoRepository.findByCelularAndStatusWithItens(celular, "ABERTO");
    }

    /**
     * Adiciona um item ao carrinho
     */
    public CarrinhoCompras adicionarItem(String celular, String tipoProduto, String nomeProduto, 
                                         BigDecimal preco, Integer quantidade, String categoria) {
        CarrinhoCompras carrinho = buscarOuCriarCarrinho(celular);

        ItemCarrinho item;
        if (categoria != null && !categoria.isEmpty()) {
            item = new ItemCarrinho(tipoProduto, nomeProduto, preco, categoria);
        } else {
            item = new ItemCarrinho(tipoProduto, nomeProduto, preco, quantidade);
        }

        carrinho.adicionarItem(item);
        return carrinhoRepository.save(carrinho);
    }

    /**
     * Remove um item do carrinho
     */
    public CarrinhoCompras removerItem(String celular, Long itemId) {
        Optional<CarrinhoCompras> carrinhoOpt = buscarCarrinhoPorCelular(celular);
        if (carrinhoOpt.isEmpty()) {
            throw new RuntimeException("Carrinho não encontrado");
        }

        CarrinhoCompras carrinho = carrinhoOpt.get();
        ItemCarrinho item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        carrinho.removerItem(item);
        itemRepository.delete(item);
        
        return carrinhoRepository.save(carrinho);
    }

    /**
     * Atualiza a quantidade de um item
     */
    public CarrinhoCompras atualizarQuantidadeItem(String celular, Long itemId, Integer novaQuantidade) {
        Optional<CarrinhoCompras> carrinhoOpt = buscarCarrinhoPorCelular(celular);
        if (carrinhoOpt.isEmpty()) {
            throw new RuntimeException("Carrinho não encontrado");
        }

        ItemCarrinho item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        item.setQuantidade(novaQuantidade);
        itemRepository.save(item);

        CarrinhoCompras carrinho = carrinhoOpt.get();
        carrinho.calcularTotal();
        
        return carrinhoRepository.save(carrinho);
    }

    /**
     * Lista todos os itens do carrinho
     */
    public List<ItemCarrinho> listarItens(String celular) {
        return itemRepository.findByCarrinhoCelular(celular);
    }

    /**
     * Limpa todos os itens do carrinho
     */
    public void limparCarrinho(String celular) {
        Optional<CarrinhoCompras> carrinhoOpt = buscarCarrinhoPorCelular(celular);
        if (carrinhoOpt.isPresent()) {
            CarrinhoCompras carrinho = carrinhoOpt.get();
            // Primeiro limpa a lista em memória
            carrinho.getItens().clear();
            // Remove todos os itens do banco
            itemRepository.deleteByCarrinhoCelular(celular);
            // Atualiza o carrinho
            carrinho.setValorTotal(BigDecimal.ZERO);
            carrinho.setDataAtualizacao(java.time.LocalDateTime.now());
            carrinhoRepository.save(carrinho);
        }
    }

    /**
     * Finaliza o pedido
     */
    public CarrinhoCompras finalizarPedido(String celular, String nomeCliente) {
        Optional<CarrinhoCompras> carrinhoOpt = buscarCarrinhoPorCelular(celular);
        if (carrinhoOpt.isEmpty()) {
            throw new RuntimeException("Carrinho não encontrado");
        }

        CarrinhoCompras carrinho = carrinhoOpt.get();
        if (carrinho.getItens().isEmpty()) {
            throw new RuntimeException("Carrinho está vazio");
        }

        carrinho.setNomeCliente(nomeCliente);
        carrinho.setStatus("FINALIZADO");
        carrinho.setDataAtualizacao(LocalDateTime.now());

        return carrinhoRepository.save(carrinho);
    }

    /**
     * Gera mensagem do pedido formatada
     */
    public String gerarMensagemPedido(String celular) {
        Optional<CarrinhoCompras> carrinhoOpt = buscarCarrinhoPorCelular(celular);
        if (carrinhoOpt.isEmpty()) {
            throw new RuntimeException("Carrinho não encontrado");
        }

        CarrinhoCompras carrinho = carrinhoOpt.get();
        List<ItemCarrinho> itens = carrinho.getItens();

        if (itens.isEmpty()) {
            return "Carrinho vazio";
        }

        StringBuilder mensagem = new StringBuilder();
        mensagem.append("🎂 *PEDIDO - MARLI CONFEITARIA* 🎂\n\n");
        
        if (carrinho.getNomeCliente() != null) {
            mensagem.append("👤 *Cliente:* ").append(carrinho.getNomeCliente()).append("\n");
        }
        mensagem.append("📱 *Celular:* ").append(celular).append("\n\n");
        mensagem.append("📋 *ITENS DO PEDIDO:*\n");
        mensagem.append("━━━━━━━━━━━━━━━━━━━━\n\n");

        for (ItemCarrinho item : itens) {
            mensagem.append("▪️ *").append(item.getNomeProduto()).append("*\n");
            mensagem.append("   Tipo: ").append(formatarTipo(item.getTipoProduto())).append("\n");
            if (item.getCategoria() != null) {
                mensagem.append("   Categoria: ").append(item.getCategoria()).append("\n");
            }
            mensagem.append("   Qtd: ").append(item.getQuantidade());
            mensagem.append(" x R$ ").append(String.format("%.2f", item.getPrecoUnitario()));
            mensagem.append(" = R$ ").append(String.format("%.2f", item.getSubtotal())).append("\n\n");
        }

        mensagem.append("━━━━━━━━━━━━━━━━━━━━\n");
        mensagem.append("💰 *TOTAL: R$ ").append(String.format("%.2f", carrinho.getValorTotal())).append("*\n\n");
        mensagem.append("Obrigado pela preferência! 💕");

        return mensagem.toString();
    }

    private String formatarTipo(String tipo) {
        switch (tipo) {
            case "boloBase": return "Bolo Base";
            case "massaEspecial": return "Massa Especial";
            case "recheioEspecial": return "Recheio Premium";
            case "decoracao": return "Decoração";
            case "complemento": return "Complemento";
            case "caixaTransporte": return "Caixa de Transporte";
            default: return tipo;
        }
    }

    /**
     * Conta total de itens no carrinho
     */
    public Long contarItens(String celular) {
        return itemRepository.contarItensPorCelular(celular);
    }

    /**
     * Verifica se existe carrinho aberto
     */
    public boolean existeCarrinhoAberto(String celular) {
        return carrinhoRepository.existeCarrinhoAberto(celular);
    }

    /**
     * Lista todos os carrinhos (para admin/debug)
     */
    public List<CarrinhoCompras> listarTodosCarrinhos() {
        return carrinhoRepository.findAll();
    }

    /**
     * Lista todos os itens de todos os carrinhos (para admin/debug)
     */
    public List<ItemCarrinho> listarTodosItens() {
        return itemRepository.findAll();
    }
}