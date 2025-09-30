package com.sitemarli.ateliemb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configura as regras de segurança para o ambiente de desenvolvimento.
 *
 * Esta configuração libera os endpoints públicos usados no projeto
 * e desabilita autenticações padrão (form login e HTTP Basic),
 * evitando respostas 401 para os recursos liberados.
 * @author bruno.silva
 * @version 1.0 
 * @since 2025-09-30
 */
@Configuration
public class SecurityConfig {

    /**
     * Define a cadeia de filtros de segurança da aplicação.
     *
     * - Desabilita CSRF (útil em desenvolvimento e para testes com curl)
     * - Libera acesso aos endpoints públicos (/infoaux, /getDataBase, /api/**, /actuator/**)
     * - Desabilita formLogin e httpBasic para evitar prompts de autenticação
     *
     * @param http objeto HttpSecurity para configuração
     * @return SecurityFilterChain configurada
     * @throws Exception em caso de erro de configuração
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
