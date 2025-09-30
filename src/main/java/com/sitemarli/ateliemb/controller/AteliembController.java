package com.sitemarli.ateliemb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sitemarli.ateliemb.dto.InfoauxDTO;
import com.sitemarli.ateliemb.service.DataBaseService;

/**
 * Controlador REST para fornecer endpoints de informações auxiliares
 * e verificação de conexão com o banco de dados. 🌐
 *
 * @version 1.0
 * @since 2025-09-30
 * @author bruno.silva
 */
@RestController
public class AteliembController {

    @Value("${spring.active.profiles}")
    private String environment;

    @Value("${spring.datasource.url}")
    private String dataSourceUrl;

    @Autowired
    private DataBaseService dataBaseService;
    
    /**
     * Endpoint para obter informações auxiliares do ambiente e da fonte de dados.
     * @return {@link ResponseEntity} contendo um objeto {@link InfoauxDTO} com
     * detalhes do ambiente e da fonte de dados.
     * @author bruno.silva
     */
    @GetMapping("/infoaux")
    public ResponseEntity<InfoauxDTO> getInfoAux() {
        return ResponseEntity.ok(new InfoauxDTO(environment, dataSourceUrl));
    }

    /**
     * Endpoint para testar a conexão com a base de dados.
     * @return uma mensagem indicando o status da conexão com o banco de dados.
     * Retorna "Database conectada!" se a conexão for bem-sucedida, e 
     * "DataBase conexao falhou!" em caso de falha.
     * @author bruno.silva
     */
    @GetMapping("/getDataBase")
    public String getDataBase() {
        return dataBaseService.testConnection() ? "Database conectada!" : "DataBase conexao falhou!";
    }
}