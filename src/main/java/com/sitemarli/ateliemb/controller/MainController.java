package com.sitemarli.ateliemb.controller;

import com.sitemarli.ateliemb.dto.AdicionarItemDTO;
import com.sitemarli.ateliemb.dto.FinalizarPedidoDTO;
import com.sitemarli.ateliemb.dto.InfoauxDTO;
import com.sitemarli.ateliemb.entity.CarrinhoCompras;
import com.sitemarli.ateliemb.entity.ItemCarrinho;
import com.sitemarli.ateliemb.service.CarrinhoComprasService;
import com.sitemarli.ateliemb.service.DataBaseService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller principal unificado para gerenciar todas as requisições da aplicação.
 * 
 * Combina funcionalidades de páginas web (Thymeleaf) e APIs REST em um único controller,
 * simplificando a arquitetura e mantendo todas as rotas em um local centralizado.
 * 
 * @author Bruno Silva
 * @version 2.0 
 * @since 2025-10-14
 */
@Controller
@Slf4j
@CrossOrigin(origins = "*")
public class MainController {

    @Autowired
    private CarrinhoComprasService carrinhoService;
    
    @Autowired
    private DataBaseService dataBaseService;

    @Value("${spring.profiles.active:default}")
    private String environment;

    @Value("${spring.datasource.url}")
    private String dataSourceUrl;

    // ==================== PÁGINAS WEB ====================

    /**
     * Página principal - Produtos (nova home).
     * 
     * Renderiza o catálogo completo de produtos organizados por categoria
     * (bolos, doces, tortas e produtos especiais) com preços e descrições.
     * 
     * @param model Model para passar dados para a view
     * @return nome do template Thymeleaf
     */
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("titulo", "Ateliê M&B - Produtos");
        model.addAttribute("subtitulo", "Bolos para festas e Doces Artesanais");
        model.addAttribute("totalCategorias", 4);
        model.addAttribute("totalProdutos", 20);
        model.addAttribute("horarioFuncionamento", "Segunda a Sábado: 8h às 19h | Domingo: 9h às 15h");
        model.addAttribute("taxaEntrega", "R$ 8,00");
        
        return "produtos";
    }

    /**
     * Página de produtos (mesmo conteúdo da home).
     * 
     * @param model Model para passar dados para a view
     * @return nome do template Thymeleaf
     */
    @GetMapping("/produtos")
    public String produtos(Model model) {
        return home(model); // Redireciona para o mesmo método da home
    }

    /**
     * Página de login/sistema (área administrativa).
     * 
     * Por enquanto apenas uma página em branco para desenvolvimento futuro.
     * 
     * @param model Model para passar dados para a view
     * @return nome do template Thymeleaf
     */
    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("titulo", "Ateliê M&B - Sistema");
        model.addAttribute("mensagem", "Área administrativa - Em desenvolvimento");
        
        return "login";
    }

    // ==================== APIs REST - CARRINHO ====================

    /**
     * Adiciona um item ao carrinho
     * POST /api/carrinho/adicionar
     */
    @PostMapping("/api/carrinho/adicionar")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> adicionarItem(@RequestBody AdicionarItemDTO dto) {
        try {
            log.info("Adicionando item ao carrinho: {}", dto);
            CarrinhoCompras carrinho = carrinhoService.adicionarItem(
                    dto.celular(),
                    dto.tipoProduto(),
                    dto.nomeProduto(),
                    dto.preco(),
                    dto.quantidade(),
                    dto.categoria()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("mensagem", "Item adicionado ao carrinho");
            response.put("totalItens", carrinho.getItens().size());
            response.put("valorTotal", carrinho.getValorTotal());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao adicionar item ao carrinho", e);
            Map<String, Object> error = new HashMap<>();
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao adicionar item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Busca carrinho por celular
     * GET /api/carrinho/{celular}
     */
    @GetMapping("/api/carrinho/{celular}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> buscarCarrinho(@PathVariable String celular) {
        try {
            log.info("Buscando carrinho para celular: {}", celular);
            Optional<CarrinhoCompras> carrinhoOpt = carrinhoService.buscarCarrinhoPorCelular(celular);
            
            Map<String, Object> response = new HashMap<>();
            if (carrinhoOpt.isPresent()) {
                CarrinhoCompras carrinho = carrinhoOpt.get();
                response.put("existe", true);
                response.put("sucesso", true);
                response.put("celular", carrinho.getCelular());
                response.put("nomeCliente", carrinho.getNomeCliente());
                response.put("valorTotal", carrinho.getValorTotal());
                response.put("status", carrinho.getStatus());
                response.put("itens", carrinho.getItens());
                response.put("totalItens", carrinho.getItens().size());
            } else {
                response.put("existe", false);
                response.put("sucesso", true);
                response.put("mensagem", "Carrinho não encontrado");
                response.put("itens", List.of());
                response.put("totalItens", 0);
                response.put("valorTotal", 0);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao buscar carrinho", e);
            Map<String, Object> error = new HashMap<>();
            error.put("existe", false);
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao buscar carrinho: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Remove um item do carrinho
     * DELETE /api/carrinho/{celular}/item/{itemId}
     */
    @DeleteMapping("/api/carrinho/{celular}/item/{itemId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> removerItem(
            @PathVariable String celular,
            @PathVariable Long itemId) {
        try {
            log.info("Removendo item {} do carrinho {}", itemId, celular);
            CarrinhoCompras carrinho = carrinhoService.removerItem(celular, itemId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("mensagem", "Item removido do carrinho");
            response.put("totalItens", carrinho.getItens().size());
            response.put("valorTotal", carrinho.getValorTotal());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao remover item do carrinho", e);
            Map<String, Object> error = new HashMap<>();
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao remover item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Atualiza quantidade de um item
     * PUT /api/carrinho/{celular}/item/{itemId}/quantidade
     */
    @PutMapping("/api/carrinho/{celular}/item/{itemId}/quantidade")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> atualizarQuantidade(
            @PathVariable String celular,
            @PathVariable Long itemId,
            @RequestParam Integer quantidade) {
        try {
            log.info("Atualizando quantidade do item {} para {} no carrinho {}", itemId, quantidade, celular);
            CarrinhoCompras carrinho = carrinhoService.atualizarQuantidadeItem(celular, itemId, quantidade);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("mensagem", "Quantidade atualizada");
            response.put("valorTotal", carrinho.getValorTotal());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao atualizar quantidade", e);
            Map<String, Object> error = new HashMap<>();
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao atualizar quantidade: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Limpa todo o carrinho
     * DELETE /api/carrinho/{celular}/limpar
     */
    @DeleteMapping("/api/carrinho/{celular}/limpar")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> limparCarrinho(@PathVariable String celular) {
        try {
            log.info("Limpando carrinho para celular: {}", celular);
            carrinhoService.limparCarrinho(celular);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("mensagem", "Carrinho limpo com sucesso");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao limpar carrinho", e);
            Map<String, Object> error = new HashMap<>();
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao limpar carrinho: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Finaliza o pedido
     * POST /api/carrinho/{celular}/finalizar
     */
    @PostMapping("/api/carrinho/{celular}/finalizar")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> finalizarPedido(
            @PathVariable String celular,
            @RequestBody FinalizarPedidoDTO dto) {
        try {
            log.info("Finalizando pedido para celular: {} com cliente: {}", celular, dto.nomeCliente());
            CarrinhoCompras carrinho = carrinhoService.finalizarPedido(celular, dto.nomeCliente());
            String mensagem = carrinhoService.gerarMensagemPedido(celular);

            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("mensagem", "Pedido finalizado com sucesso");
            response.put("valorTotal", carrinho.getValorTotal());
            response.put("mensagemPedido", mensagem);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao finalizar pedido", e);
            Map<String, Object> error = new HashMap<>();
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao finalizar pedido: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Conta itens no carrinho
     * GET /api/carrinho/{celular}/contar
     */
    @GetMapping("/api/carrinho/{celular}/contar")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> contarItens(@PathVariable String celular) {
        try {
            log.info("Contando itens do carrinho para celular: {}", celular);
            Long totalItens = carrinhoService.contarItens(celular);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("totalItens", totalItens);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao contar itens", e);
            Map<String, Object> error = new HashMap<>();
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao contar itens: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Lista todos os carrinhos (para admin)
     * GET /api/carrinho/listar
     */
    @GetMapping("/api/carrinho/listar")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> listarCarrinhos() {
        try {
            log.info("Listando todos os carrinhos");
            List<CarrinhoCompras> carrinhos = carrinhoService.listarTodosCarrinhos();
            
            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("carrinhos", carrinhos);
            response.put("totalCarrinhos", carrinhos.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao listar carrinhos", e);
            Map<String, Object> error = new HashMap<>();
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao listar carrinhos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Lista itens de um carrinho específico
     * GET /api/carrinho/{celular}/itens
     */
    @GetMapping("/api/carrinho/{celular}/itens")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> listarItens(@PathVariable String celular) {
        try {
            log.info("Listando itens do carrinho para celular: {}", celular);
            List<ItemCarrinho> itens = carrinhoService.listarItens(celular);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("itens", itens);
            response.put("totalItens", itens.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao listar itens", e);
            Map<String, Object> error = new HashMap<>();
            error.put("sucesso", false);
            error.put("mensagem", "Erro ao listar itens: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ==================== APIs REST - SISTEMA ====================

    /**
     * Endpoint para obter informações auxiliares do ambiente e da fonte de dados.
     * GET /infoaux
     */
    @GetMapping("/infoaux")
    @ResponseBody
    public ResponseEntity<InfoauxDTO> getInfoAux() {
        log.info("Obtendo informações auxiliares do sistema");
        return ResponseEntity.ok(new InfoauxDTO(environment, dataSourceUrl));
    }

    /**
     * Endpoint para testar a conexão com a base de dados.
     * GET /getDataBase
     */
    @GetMapping("/getDataBase")
    @ResponseBody
    public String getDataBase() {
        log.info("Testando conexão com banco de dados");
        return dataBaseService.testConnection() ? "Database conectada!" : "DataBase conexao falhou!";
    }
}