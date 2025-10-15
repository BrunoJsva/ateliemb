// Debug do Sistema de Carrinho - Versão Simplificada
console.log('🔧 Iniciando debug do carrinho...');

// Variáveis globais para debug
window.debugCarrinho = {
    inicializado: false,
    erros: [],
    logs: []
};

function log(mensagem) {
    console.log(`[CARRINHO DEBUG] ${mensagem}`);
    window.debugCarrinho.logs.push(`${new Date().toLocaleTimeString()}: ${mensagem}`);
}

function erro(mensagem, errorObj = null) {
    console.error(`[CARRINHO ERRO] ${mensagem}`, errorObj);
    window.debugCarrinho.erros.push(`${new Date().toLocaleTimeString()}: ${mensagem}`);
}

// Classe CarrinhoDebug
class CarrinhoDebug {
    constructor() {
        log('Construtor do CarrinhoDebug iniciado');
        this.apiUrl = 'http://localhost:8080/api/carrinho';
        this.celular = null;
        this.inicializado = false;
        
        try {
            this.inicializar();
            this.inicializado = true;
            window.debugCarrinho.inicializado = true;
            log('CarrinhoDebug inicializado com sucesso');
        } catch (e) {
            erro('Erro no construtor do CarrinhoDebug', e);
        }
    }

    inicializar() {
        log('Método inicializar() chamado');
        // Verificar se já tem celular salvo
        this.celular = sessionStorage.getItem('celularCliente');
        if (this.celular) {
            log(`Celular encontrado no sessionStorage: ${this.celular}`);
        } else {
            log('Nenhum celular encontrado no sessionStorage');
        }
    }

    async obterCelular() {
        log('obterCelular() chamado');
        
        if (!this.celular) {
            log('Solicitando celular ao usuário');
            this.celular = prompt('📱 Digite seu número de celular (com DDD):\n\nExemplo: 11999999999');
            
            if (!this.celular || this.celular.trim() === '') {
                erro('Usuário não informou celular');
                alert('❌ É necessário informar o celular para continuar!');
                return null;
            }
            
            // Limpar o celular
            this.celular = this.celular.replace(/\D/g, '');
            
            if (this.celular.length < 10) {
                erro('Celular inválido (muito curto)');
                alert('❌ Celular inválido! Digite apenas números com DDD.');
                this.celular = null;
                return null;
            }
            
            // Salvar no sessionStorage
            sessionStorage.setItem('celularCliente', this.celular);
            log(`Celular salvo: ${this.celular}`);
        }
        
        return this.celular;
    }

    async adicionarItem(tipoProduto, nomeProduto, preco, quantidade = 1, categoria = null) {
        log(`adicionarItem chamado: ${tipoProduto}, ${nomeProduto}, ${preco}`);
        
        try {
            const celular = await this.obterCelular();
            if (!celular) {
                erro('Celular não obtido');
                return;
            }

            log('Enviando requisição para API...');
            
            const response = await fetch(`${this.apiUrl}/adicionar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    celular: celular,
                    tipoProduto: tipoProduto,
                    nomeProduto: nomeProduto,
                    preco: preco,
                    quantidade: quantidade,
                    categoria: categoria
                })
            });

            log(`Resposta da API: status ${response.status}`);
            
            if (!response.ok) {
                erro(`Erro HTTP: ${response.status}`);
                throw new Error(`HTTP ${response.status}`);
            }

            const resultado = await response.json();
            log(`Resultado da API: ${JSON.stringify(resultado)}`);
            
            if (resultado.sucesso) {
                alert(`✅ "${nomeProduto}" adicionado ao carrinho!\nTotal: R$ ${resultado.valorTotal}\nItens: ${resultado.totalItens}`);
                log('Item adicionado com sucesso');
            } else {
                erro(`API retornou erro: ${resultado.mensagem}`);
                alert(`❌ Erro: ${resultado.mensagem}`);
            }
        } catch (error) {
            erro('Erro ao adicionar item', error);
            alert(`❌ Erro ao adicionar item: ${error.message}`);
        }
    }
}

// Função global para adicionar ao carrinho
async function adicionarAoCarrinho(tipo, nome, preco) {
    log(`adicionarAoCarrinho global chamada: ${tipo}, ${nome}, ${preco}`);
    
    try {
        if (!window.carrinhoDebug) {
            log('Criando nova instância do CarrinhoDebug');
            window.carrinhoDebug = new CarrinhoDebug();
        }
        
        await window.carrinhoDebug.adicionarItem(tipo, nome, preco);
    } catch (error) {
        erro('Erro na função global adicionarAoCarrinho', error);
        alert(`❌ Erro crítico: ${error.message}`);
    }
}

// Função para mostrar debug
function mostrarDebug() {
    console.log('=== DEBUG DO CARRINHO ===');
    console.log('Inicializado:', window.debugCarrinho.inicializado);
    console.log('Erros:', window.debugCarrinho.erros);
    console.log('Logs:', window.debugCarrinho.logs);
    console.log('Instância do carrinho:', window.carrinhoDebug);
}

// Disponibilizar função debug globalmente
window.mostrarDebug = mostrarDebug;

// Inicialização
try {
    log('Iniciando CarrinhoDebug...');
    window.carrinhoDebug = new CarrinhoDebug();
    log('CarrinhoDebug criado na window');
} catch (error) {
    erro('Erro fatal na inicialização', error);
}

log('Script carregado completamente');