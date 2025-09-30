package com.sitemarli.ateliemb.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

/**
 * Configuração do banco de dados para a Confeitaria MB
 * 
 * Esta classe fornece configurações personalizadas para conexão com o banco MySQL
 * e configurações específicas para o ambiente de desenvolvimento.
 * 
 * @author Bruno Silva
 * @version 1.0
 * @since 2025-09-30
 */
@Configuration
public class ConfigDataBase {

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    /**
     * Configuração personalizada do DataSource para MySQL
     * 
     * @return DataSource configurado para MySQL
     */
    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        
        dataSource.setUrl(databaseUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName(driverClassName);
        
        return dataSource;
    }

    /**
     * Método para validar se a conexão com o banco está disponível
     * 
     * @return boolean indicando se a conexão está ativa
     */
    public boolean isDatabaseConnected() {
        try {
            DataSource ds = dataSource();
            return ds.getConnection().isValid(5);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Retorna informações sobre a configuração do banco
     * 
     * @return String com informações da configuração
     */
    public String getDatabaseInfo() {
        return String.format(
            "Database Configuration:%n" +
            "URL: %s%n" +
            "Username: %s%n" +
            "Driver: %s",
            databaseUrl.replaceAll("password=[^&]*", "password=****"),
            username,
            driverClassName
        );
    }
}
