package com.sitemarli.ateliemb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sitemarli.ateliemb.repository.DataBaseRepository;

/**
 * Serviço para testar a conexão com o banco de dados. 🔧
 * <p>
 * Esta classe utiliza o {@link DataBaseRepository} para executar uma consulta
 * simples que verifica se a conexão com o banco de dados está ativa.
 * </p>
 * <p>
 * O método {@link #testConnection()} retorna um booleano indicando o status da
 * conexão,
 * facilitando a integração com endpoints de health check ou monitoramento.
 * </p>
 *
 * @see DataBaseRepository
 * @author bruno.silva
 * @version 1.0
 * @since 2025-09-30
 */
@Service
public class DataBaseService {

    @Autowired
    private DataBaseRepository dataBaseRepository;

    /**
     * Testa a conexão com o banco de dados executando uma consulta simples.
     * <p>
     * Este método chama o repositório para executar uma consulta "SELECT 1", que é
     * leve e eficiente.
     * Se a consulta for bem-sucedida, significa que a conexão com o banco está
     * ativa.
     * </p>
     *
     * @return {@code true} se a conexão com o banco de dados estiver ativa,
     *         {@code false} caso contrário.
     * @author bruno.silva
     */
    public boolean testConnection() {
        return dataBaseRepository.testConnection() != null;
    }
}
