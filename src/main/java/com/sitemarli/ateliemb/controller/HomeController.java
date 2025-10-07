package com.sitemarli.ateliemb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller para páginas web da Confeitaria MB.
 * 
 * Responsável por renderizar as páginas principais da aplicação
 * usando templates Thymeleaf.
 * 
 * @author Bruno Silva
 * @version 1.0
 * @since 2025-09-30
 */
@Controller
public class HomeController {

    /**
     * Página inicial da Confeitaria MB.
     * 
     * Renderiza a página home com informações principais
     * da confeitaria e navegação para outras seções.
     * 
     * @param model Model para passar dados para a view
     * @return nome do template Thymeleaf
     */
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("titulo", "Ateliê M&B");
        model.addAttribute("subtitulo", "Bolos para festas e Doces Artesanais");
        model.addAttribute("mensagemBemVindo", "Bem-vindo à nossa confeitaria!");
        model.addAttribute("descricao", "Oferecemos os melhores doces, bolos e tortas da cidade com ingredientes frescos e muito carinho.");
        
        return "home";
    }

    /**
     * Página sobre a confeitaria.
     * 
     * Renderiza informações detalhadas sobre a história, missão,
     * valores e equipe da Confeitaria MB.
     * 
     * @param model Model para passar dados para a view
     * @return nome do template Thymeleaf
     */
    @GetMapping("/sobre")
    public String sobre(Model model) {
        model.addAttribute("titulo", "Sobre - Confeitaria MB");
        model.addAttribute("historia", "Nossa confeitaria nasceu do amor pela arte da confeitaria e o desejo de compartilhar sabores únicos com nossa comunidade.");
        model.addAttribute("fundacao", "2020");
        model.addAttribute("especialidade", "Doces artesanais e bolos personalizados");
        model.addAttribute("experiencia", "5 anos de tradição em confeitaria artesanal");
        
        return "sobre";
    }

    /**
     * Página de produtos da confeitaria.
     * 
     * Renderiza o catálogo completo de produtos organizados por categoria
     * (bolos, doces, tortas e produtos especiais) com preços e descrições.
     * 
     * @param model Model para passar dados para a view
     * @return nome do template Thymeleaf
     */
    @GetMapping("/produtos")
    public String produtos(Model model) {
        model.addAttribute("titulo", "Produtos - Confeitaria MB");
        model.addAttribute("totalCategorias", 4);
        model.addAttribute("totalProdutos", 20);
        model.addAttribute("horarioFuncionamento", "Segunda a Sábado: 8h às 19h | Domingo: 9h às 15h");
        model.addAttribute("taxaEntrega", "R$ 8,00");
        
        return "produtos";
    }

    /**
     * Página de contato.
     * 
     * @param model Model para passar dados para a view
     * @return nome do template Thymeleaf
     */
    @GetMapping("/contato")
    public String contato(Model model) {
        model.addAttribute("titulo", "Contato - Confeitaria MB");
        
        return "contato";
    }
}