// Sistema de Carrinho de Compras - Marli Confeitaria
// Integrado com Backend REST API

class CarrinhoConfeitaria {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api/carrinho';
        this.celular = null;
        this.carrinho = {
            itens: [],
            valorTotal: 0,
            totalItens: 0
        };
        this.inicializar();
    }

    // Obter celular do cliente
    async obterCelular() {
        if (!this.celular) {
            // Verificar se já está salvo no sessionStorage
            this.celular = sessionStorage.getItem('celularCliente');
            
            if (!this.celular) {
                // Solicitar celular ao cliente
                this.celular = prompt('📱 Digite seu número de celular (com DDD):\n\nExemplo: 11999999999');
                
                if (!this.celular || this.celular.trim() === '') {
                    alert('❌ É necessário informar o celular para continuar!');
                    return null;
                }
                
                // Limpar e validar o celular
                this.celular = this.celular.replace(/\D/g, '');
                
                if (this.celular.length < 10 || this.celular.length > 11) {
                    alert('❌ Número de celular inválido! Digite apenas números (10 ou 11 dígitos).');
                    this.celular = null;
                    return null;
                }
                
                // Salvar no sessionStorage
                sessionStorage.setItem('celularCliente', this.celular);
                
                // Mostrar mensagem de boas-vindas
                alert(`✅ Olá! Seu carrinho foi vinculado ao celular: ${this.formatarCelular(this.celular)}\n\nAgora você pode adicionar produtos!`);
            }
        }
        return this.celular;
    }

    // Formatar celular para exibição
    formatarCelular(celular) {
        if (celular.length === 11) {
            return `(${celular.substr(0,2)}) ${celular.substr(2,5)}-${celular.substr(7,4)}`;
        } else if (celular.length === 10) {
            return `(${celular.substr(0,2)}) ${celular.substr(2,4)}-${celular.substr(6,4)}`;
        }
        return celular;
    }

    // Inicializar sistema
    async inicializar() {
        console.log('🛒 Inicializando sistema de carrinho...');
        
        // Tentar obter celular salvo
        this.celular = sessionStorage.getItem('celularCliente');
        
        if (this.celular) {
            console.log(`📱 Celular encontrado: ${this.celular}`);
            // Carregar carrinho existente do servidor em background
            this.carregarCarrinhoServidor().catch(error => {
                console.warn('Erro ao carregar carrinho do servidor:', error);
            });
        } else {
            console.log('📱 Nenhum celular salvo encontrado');
        }
        
        // Atualizar interface imediatamente
        this.atualizarInterface();
        console.log('✅ Sistema de carrinho inicializado!');
    }

    // Carregar carrinho do servidor
    async carregarCarrinhoServidor() {
        if (!this.celular) {
            console.warn('Tentativa de carregar carrinho sem celular');
            return;
        }
        
        try {
            console.log(`🔄 Carregando carrinho para ${this.celular}...`);
            const response = await fetch(`${this.apiUrl}/${this.celular}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const resultado = await response.json();
            console.log('📦 Resposta do servidor:', resultado);
            
            // Atualizar carrinho com dados do servidor
            if (resultado.itens) {
                this.carrinho = {
                    itens: resultado.itens || [],
                    valorTotal: resultado.valorTotal || 0,
                    totalItens: resultado.totalItens || resultado.itens.length || 0
                };
                console.log(`✅ Carrinho carregado: ${this.carrinho.totalItens} itens, R$ ${this.carrinho.valorTotal}`);
            } else if (resultado.existe === false) {
                // Carrinho vazio
                this.carrinho = {
                    itens: [],
                    valorTotal: 0,
                    totalItens: 0
                };
                console.log('📭 Carrinho vazio');
            }
            
            // Atualizar interface após carregar
            this.atualizarInterface();
            
        } catch (error) {
            console.error('❌ Erro ao carregar carrinho:', error);
            // Manter carrinho local em caso de erro
        }
    }

    // Adicionar item ao carrinho (método genérico)
    async adicionarItem(tipoProduto, nomeProduto, preco, quantidade = 1, categoria = null) {
        console.log(`🛒 Adicionando item: ${nomeProduto} (${tipoProduto}) - R$ ${preco}`);
        
        const celular = await this.obterCelular();
        if (!celular) {
            console.error('❌ Não foi possível obter celular');
            return;
        }

        try {
            console.log('📡 Enviando requisição para API...');
            const response = await fetch(`${this.apiUrl}/adicionar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
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

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log('📦 Resposta da API:', resultado);
            
            if (resultado.sucesso) {
                this.mostrarNotificacao(`✅ "${nomeProduto}" adicionado ao carrinho!`, 'sucesso');
                console.log(`✅ Item adicionado! Total: R$ ${resultado.valorTotal}, Itens: ${resultado.totalItens}`);
                
                // Carregar carrinho atualizado do servidor
                await this.carregarCarrinhoServidor();
            } else {
                console.error('❌ API retornou erro:', resultado.mensagem);
                this.mostrarNotificacao(`❌ Erro: ${resultado.mensagem}`, 'erro');
            }
        } catch (error) {
            console.error('❌ Erro ao adicionar item:', error);
            this.mostrarNotificacao(`❌ Erro ao adicionar item: ${error.message}`, 'erro');
        }
    }

    // Adicionar bolo base
    async adicionarBoloBase(tipo, preco) {
        await this.adicionarItem('boloBase', tipo, preco);
    }

    // Adicionar massa especial
    async adicionarMassaEspecial(nome, preco) {
        await this.adicionarItem('massaEspecial', nome, preco);
    }

    // Adicionar recheio especial
    async adicionarRecheioEspecial(nome, preco) {
        await this.adicionarItem('recheioEspecial', nome, preco);
    }

    // Adicionar decoração
    async adicionarDecoracao(nome, preco, categoria) {
        await this.adicionarItem('decoracao', nome, preco, 1, categoria);
    }

    // Adicionar complemento
    async adicionarComplemento(nome, preco, quantidade) {
        await this.adicionarItem('complemento', nome, preco, quantidade);
    }

    // Adicionar caixa de transporte
    async adicionarCaixaTransporte(tamanho, preco) {
        await this.adicionarItem('caixaTransporte', `Caixa ${tamanho}`, preco);
    }

    // Remover decoração
    async removerDecoracao(nome) {
        // TODO: Implementar remoção via API quando necessário
        this.mostrarNotificacao(`"${nome}" removido!`, 'info');
        await this.carregarCarrinhoServidor();
    }

    // Atualizar quantidade de complemento
    async atualizarQuantidadeComplemento(nome, quantidade) {
        // TODO: Implementar atualização de quantidade via API quando necessário
        if (quantidade <= 0) {
            await this.removerComplemento(nome);
        } else {
            console.log(`Atualizando quantidade de ${nome} para ${quantidade}`);
            await this.carregarCarrinhoServidor();
        }
    }

    // Remover complemento
    async removerComplemento(nome) {
        // TODO: Implementar remoção via API quando necessário
        this.mostrarNotificacao(`"${nome}" removido!`, 'info');
        await this.carregarCarrinhoServidor();
    }

    // Adicionar observações
    async adicionarObservacoes(texto) {
        // TODO: Implementar observações via API quando necessário
        console.log('Observações:', texto);
    }

    // Calcular total
    calcularTotal() {
        // Total agora vem do servidor via this.carrinho.valorTotal
        return this.carrinho.valorTotal || 0;
    }

    // Limpar carrinho
    async limparCarrinho() {
        if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
            try {
                const celular = await this.obterCelular();
                if (!celular) {
                    console.error('❌ Não foi possível obter celular');
                    return;
                }

                console.log('🗑️ Limpando carrinho no servidor...');
                const response = await fetch(`${this.apiUrl}/${celular}/limpar`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const resultado = await response.json();
                console.log('📦 Resposta da API:', resultado);

                if (resultado.sucesso) {
                    // Limpar carrinho local também
                    this.carrinho = {
                        itens: [],
                        valorTotal: 0,
                        totalItens: 0
                    };
                    this.mostrarNotificacao('✅ Carrinho limpo!', 'sucesso');
                    this.atualizarInterface();
                    console.log('✅ Carrinho limpo com sucesso!');
                } else {
                    this.mostrarNotificacao(`❌ Erro: ${resultado.mensagem}`, 'erro');
                }
            } catch (error) {
                console.error('❌ Erro ao limpar carrinho:', error);
                this.mostrarNotificacao(`❌ Erro ao limpar carrinho: ${error.message}`, 'erro');
            }
        }
    }

    // Atualizar interface do carrinho
    atualizarInterface() {
        this.atualizarContadorCarrinho();
        this.atualizarResumoCarrinho();
    }

    // Atualizar contador do carrinho
    atualizarContadorCarrinho() {
        const contador = document.getElementById('contador-carrinho');
        if (contador) {
            const totalItens = this.carrinho.totalItens || this.carrinho.itens?.length || 0;
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    }

    // Atualizar resumo do carrinho
    atualizarResumoCarrinho() {
        const resumo = document.getElementById('resumo-carrinho');
        if (!resumo) return;

        const total = this.calcularTotal();
        const itens = this.carrinho.itens || [];
        
        let html = '<div class="conteudo-resumo-carrinho">';
        html += '<h3>🛒 Seu Pedido</h3>';

        // Verificar se há itens
        if (itens.length === 0) {
            html += '<p class="carrinho-vazio">Seu carrinho está vazio. Comece escolhendo um produto!</p>';
        } else {
            html += '<div class="lista-itens-carrinho">';

            // Listar todos os itens do carrinho
            itens.forEach(item => {
                const preco = parseFloat(item.precoUnitario || item.preco || 0);
                const quantidade = item.quantidade || 1;
                const subtotal = parseFloat(item.subtotal || (preco * quantidade));
                
                // Ícone baseado no tipo de produto
                let icone = '🛒';
                switch(item.tipoProduto) {
                    case 'boloBase': icone = '🎂'; break;
                    case 'massaEspecial': icone = '🎨'; break;
                    case 'recheioEspecial': icone = '🍫'; break;
                    case 'decoracao': icone = '✨'; break;
                    case 'complemento': icone = '🍪'; break;
                    case 'caixaTransporte': icone = '📦'; break;
                }
                
                html += `
                    <div class="item-carrinho">
                        <span class="nome-item">${icone} ${item.nomeProduto}</span>
                        <span class="quantidade-item">${quantidade > 1 ? `${quantidade}x ` : ''}</span>
                        <span class="preco-item">R$ ${subtotal.toFixed(2)}</span>
                    </div>
                `;
            });

            html += '</div>'; // Fim lista-itens-carrinho

            // Total
            html += `
                <div class="total-carrinho">
                    <span class="label-total">Total:</span>
                    <span class="valor-total">R$ ${total.toFixed(2)}</span>
                </div>
            `;

            // Botões de ação
            html += `
                <div class="acoes-carrinho">
                    <button onclick="carrinho.limparCarrinho()" class="btn-limpar-carrinho">
                        🗑️ Limpar
                    </button>
                    <button onclick="carrinho.finalizarPedido()" class="btn-finalizar-pedido">
                        📞 Finalizar Pedido
                    </button>
                </div>
            `;
        }

        html += '</div>'; // Fim conteudo-resumo-carrinho
        resumo.innerHTML = html;
    }

    // Finalizar pedido
    finalizarPedido() {
        if (!this.carrinho.boloBase) {
            alert('Por favor, selecione pelo menos um bolo base para continuar!');
            return;
        }

        // Gerar mensagem para WhatsApp/Linktree
        let mensagem = '🎂 *Novo Pedido - Marli Confeitaria*\n\n';

        if (this.carrinho.boloBase) {
            mensagem += `🎂 *Bolo Base:* ${this.carrinho.boloBase.tipo} - R$ ${this.carrinho.boloBase.preco.toFixed(2)}\n`;
        }

        if (this.carrinho.massaEspecial) {
            mensagem += `🎨 *Massa Especial:* ${this.carrinho.massaEspecial.nome} - +R$ ${this.carrinho.massaEspecial.preco.toFixed(2)}\n`;
        }

        if (this.carrinho.recheioEspecial) {
            mensagem += `🍫 *Recheio Premium:* ${this.carrinho.recheioEspecial.nome} - +R$ ${this.carrinho.recheioEspecial.preco.toFixed(2)}\n`;
        }

        if (this.carrinho.decoracoes.length > 0) {
            mensagem += '\n✨ *Decorações:*\n';
            this.carrinho.decoracoes.forEach(dec => {
                mensagem += `  • ${dec.nome} - R$ ${dec.preco.toFixed(2)}\n`;
            });
        }

        if (this.carrinho.complementos.length > 0) {
            mensagem += '\n🍬 *Complementos:*\n';
            this.carrinho.complementos.forEach(comp => {
                mensagem += `  • ${comp.nome} (${comp.quantidade}x) - R$ ${(comp.precoUnitario * comp.quantidade).toFixed(2)}\n`;
            });
        }

        if (this.carrinho.caixaTransporte) {
            mensagem += `\n📦 *Caixa:* ${this.carrinho.caixaTransporte.tamanho} - R$ ${this.carrinho.caixaTransporte.preco.toFixed(2)}\n`;
        }

        if (this.carrinho.observacoes) {
            mensagem += `\n📝 *Observações:* ${this.carrinho.observacoes}\n`;
        }

        mensagem += `\n💰 *TOTAL: R$ ${this.carrinho.total.toFixed(2)}*`;

        // Salvar mensagem no localStorage para uso posterior
        localStorage.setItem('mensagemPedido', mensagem);

        // Redirecionar para Linktree
        window.open('https://linktr.ee/marliconfeitariaME?fbclid=PAb21jcANRRphleHRuA2FlbQIxMQABp9hJHJABei7o7Woan34n-a_Zi6oTP92U0lWMZ47_sro7uDK8h8qW3UsSg40N_aem_IPTEs8e1EYUOaJq-hfTQdA', '_blank');

        // Mostrar mensagem copiável
        this.mostrarMensagemPedido(mensagem);
    }

    // Mostrar mensagem do pedido
    mostrarMensagemPedido(mensagem) {
        const modal = document.createElement('div');
        modal.className = 'modal-pedido';
        modal.innerHTML = `
            <div class="conteudo-modal-pedido">
                <h3>📋 Resumo do Pedido</h3>
                <textarea readonly class="textarea-pedido">${mensagem}</textarea>
                <div class="acoes-modal-pedido">
                    <button onclick="copiarMensagemPedido()" class="btn-copiar-pedido">
                        📋 Copiar Mensagem
                    </button>
                    <button onclick="fecharModalPedido()" class="btn-fechar-modal">
                        Fechar
                    </button>
                </div>
                <p class="info-modal"><small>💡 Copie esta mensagem e envie através do nosso Linktree!</small></p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'sucesso') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao-carrinho notificacao-${tipo}`;
        
        const icones = {
            sucesso: '✅',
            aviso: '⚠️',
            info: 'ℹ️',
            erro: '❌'
        };

        notificacao.innerHTML = `
            <span class="icone-notificacao">${icones[tipo] || '✅'}</span>
            <span class="texto-notificacao">${mensagem}</span>
        `;

        document.body.appendChild(notificacao);

        setTimeout(() => {
            notificacao.classList.add('mostrar');
        }, 100);

        setTimeout(() => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => {
                notificacao.remove();
            }, 300);
        }, 3000);
    }

    // Obter resumo do carrinho
    obterResumo() {
        return {
            ...this.carrinho,
            total: this.calcularTotal()
        };
    }
}

// Funções globais auxiliares
function copiarMensagemPedido() {
    const mensagem = localStorage.getItem('mensagemPedido');
    if (mensagem) {
        navigator.clipboard.writeText(mensagem).then(() => {
            alert('✅ Mensagem copiada! Cole no WhatsApp através do Linktree.');
        }).catch(() => {
            alert('❌ Erro ao copiar. Por favor, copie manualmente.');
        });
    }
}

function fecharModalPedido() {
    const modal = document.querySelector('.modal-pedido');
    if (modal) {
        modal.remove();
    }
}

// Função wrapper para adicionar ao carrinho (usada nos onclick dos botões)
async function adicionarAoCarrinho(tipo, ...args) {
    console.log('🛒 Tentando adicionar ao carrinho:', tipo, args);
    
    // Tentar inicializar o carrinho se não existir
    if (!window.carrinho && !carrinho) {
        console.log('⚠️ Carrinho não encontrado, inicializando...');
        if (!inicializarCarrinho()) {
            alert('❌ Erro ao inicializar carrinho. Recarregue a página.');
            return;
        }
        // Aguardar um pouco para a API estar pronta
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const carrinhoInstance = window.carrinho || carrinho;
    
    if (!carrinhoInstance) {
        alert('❌ Carrinho não disponível. Recarregue a página.');
        return;
    }
    
    try {
        switch(tipo) {
            case 'boloBase':
                await carrinhoInstance.adicionarBoloBase(...args);
                break;
            case 'massaEspecial':
                await carrinhoInstance.adicionarMassaEspecial(...args);
                break;
            case 'recheioEspecial':
                await carrinhoInstance.adicionarRecheioEspecial(...args);
                break;
            case 'decoracao':
                await carrinhoInstance.adicionarDecoracao(...args);
                break;
            case 'complemento':
                await carrinhoInstance.adicionarComplemento(...args);
                break;
            case 'caixaTransporte':
                await carrinhoInstance.adicionarCaixaTransporte(...args);
                break;
            default:
                console.error('Tipo de produto desconhecido:', tipo);
                alert('❌ Tipo de produto desconhecido: ' + tipo);
        }
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        alert('❌ Erro ao adicionar item: ' + error.message);
    }
}

// Inicializar carrinho globalmente
let carrinho;

// Função de inicialização robusta
function inicializarCarrinho() {
    try {
        if (!window.carrinho) {
            window.carrinho = new CarrinhoConfeitaria();
            console.log('🎂 Carrinho da Confeitaria inicializado!');
        }
        // Também manter referência global para compatibilidade
        carrinho = window.carrinho;
        return true;
    } catch (error) {
        console.error('Erro ao inicializar carrinho:', error);
        return false;
    }
}

// Tentar inicializar imediatamente
if (document.readyState === 'loading') {
    // DOM ainda carregando
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎂 DOM carregado, inicializando carrinho...');
        inicializarCarrinho();
    });
} else {
    // DOM já carregado
    console.log('🎂 DOM já carregado, inicializando carrinho imediatamente...');
    inicializarCarrinho();
}

// Backup: inicializar após um pequeno delay se necessário
setTimeout(function() {
    if (!window.carrinho) {
        console.log('🎂 Inicialização de backup do carrinho...');
        inicializarCarrinho();
    }
}, 1000);
