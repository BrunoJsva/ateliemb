# Confeitaria MB

Uma aplicação web desenvolvida com Spring Boot para gerenciamento de confeitaria.

## 📋 Descrição

Este projeto é uma aplicação web desenvolvida como parte de um projeto de extensão universitária, criada para auxiliar no gerenciamento e operações de uma confeitaria. A aplicação utiliza tecnologias modernas do ecossistema Spring para fornecer uma solução robusta e escalável.

## 🚀 Tecnologias Utilizadas

- **Java 21** - Linguagem de programação
- **Spring Boot 3.5.6** - Framework principal
- **Spring Security** - Autenticação e autorização 
- **Spring Data JPA** - Persistência de dados
- **Thymeleaf** - Engine de templates para frontend
- **Maven** - Gerenciador de dependências
- **Lombok** - Redução de boilerplate code
- **Spring Boot DevTools** - Ferramentas de desenvolvimento

## 📦 Estrutura do Projeto

```
ateliemb/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/sitemarli/ateliemb/
│   │   │       └── AteliembApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/          # Arquivos estáticos (CSS, JS, imagens)
│   │       └── templates/       # Templates Thymeleaf
│   └── test/
│       └── java/
│           └── com/sitemarli/ateliemb/
│               └── AteliembApplicationTests.java
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## 🛠️ Pré-requisitos

Antes de executar este projeto, certifique-se de ter instalado:

- **Java 21** ou superior
- **Maven 3.6+** (ou use o wrapper incluído)
- **IDE** de sua preferência (IntelliJ IDEA, Eclipse, VS Code)

## 🚀 Como Executar

### Usando Maven Wrapper (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/BrunoJsva/ateliemb.git
cd ateliemb
```

2. Execute a aplicação:
```bash
# No Windows
./mvnw.cmd spring-boot:run

# No Linux/Mac
./mvnw spring-boot:run
```

### Usando Maven Local

1. Clone o repositório:
```bash
git clone https://github.com/BrunoJsva/ateliemb.git
cd ateliemb
```

2. Execute a aplicação:
```bash
mvn spring-boot:run
```

### Executando via IDE

1. Importe o projeto como um projeto Maven
2. Execute a classe `AteliembApplication.java`

## 🌐 Acesso à Aplicação

Após executar a aplicação, ela estará disponível em:
- **URL:** http://localhost:8080
- **Porta padrão:** 8080

## 🧪 Executando Testes

Para executar os testes do projeto:

```bash
# Usando Maven Wrapper
./mvnw test

# Usando Maven local
mvn test
```

## 📁 Principais Diretórios

- **`src/main/java`** - Código fonte da aplicação
- **`src/main/resources/static`** - Arquivos estáticos (CSS, JavaScript, imagens)
- **`src/main/resources/templates`** - Templates Thymeleaf para as páginas web
- **`src/main/resources/database`** - Scripts SQL do banco de dados
- **`src/test/java`** - Testes unitários e de integração

## 🔧 Configuração

As configurações da aplicação estão localizadas em:
- **`src/main/resources/application.properties`** - Configurações principais da aplicação
- **`src/main/resources/database/schema.sql`** - Script de criação das tabelas
- **`src/main/resources/database/data.sql`** - Dados de exemplo para desenvolvimento

Atualmente, apenas o nome da aplicação está configurado:
```properties
spring.application.name=ateliemb
```

### 🗄️ Banco de Dados

O projeto utiliza um modelo relacional com as seguintes tabelas principais:

- **`tb_cliente`** - Cadastro de clientes (opcional para vendas no balcão)
- **`tb_fornecedor`** - Cadastro de fornecedores de ingredientes e produtos
- **`tb_produto`** - Catálogo de produtos da confeitaria
- **`tb_estoque`** - Controle de estoque por produto
- **`tb_venda`** - Cabeçalho das transações de venda
- **`tb_item_venda`** - Itens detalhados de cada venda

#### Scripts SQL Disponíveis:
```bash
# Localização dos scripts
src/main/resources/database/
├── schema.sql    # Criação das tabelas
└── data.sql      # Dados de exemplo
```

Para executar os scripts:
1. Conecte-se ao seu banco MySQL/MariaDB
2. Execute primeiro o `schema.sql` para criar as tabelas
3. Execute o `data.sql` para popular com dados de exemplo

## 🎯 Funcionalidades Planejadas

Este projeto está em desenvolvimento inicial. As funcionalidades a serem implementadas incluem:

- [ ] Sistema de autenticação e autorização
- [ ] Gerenciamento de produtos da confeitaria
- [ ] Controle de estoque de doces, salgados e bebidas
- [ ] Sistema de pedidos e encomendas
- [ ] Dashboard administrativo
- [ ] Relatórios de vendas e produtos mais vendidos
- [ ] Controle de validade dos produtos
- [ ] Sistema de receitas e ingredientes

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está em desenvolvimento como parte de um projeto de extensão universitária.

## 👨‍💻 Desenvolvedor

- **Bruno Silva** - [@BrunoJsva](https://github.com/BrunoJsva)

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor abra uma [issue](https://github.com/BrunoJsva/ateliemb/issues).

---

⭐ **Projeto de Extensão Universitária** - Desenvolvido com 💙 para auxiliar no gerenciamento de confeitarias.