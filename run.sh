#!/bin/bash
# Script para executar a aplicação Spring Boot com Java 21

# Define o JAVA_HOME para Java 21
export JAVA_HOME="/c/Program Files/Java/jdk-21.0.8"

# Executa a aplicação
cd "$(dirname "$0")"
./mvnw.cmd spring-boot:run
