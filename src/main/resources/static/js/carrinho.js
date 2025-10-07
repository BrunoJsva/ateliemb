// Sistema de Carrinho de Compras - Marli Confeitaria
// Gerencia a construção personalizada de bolos

class CarrinhoConfeitaria {
    constructor() {
        this.carrinho = this.carregarCarrinho();
        this.inicializar();
    }

    // Carregar carrinho do localStorage
    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinhoMarliConfeitaria');
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : {
            boloBase: null,
            massaEspecial: null,
            recheioEspecial: null,
            decoracoes: [],
            complementos: [],
            caixaTransporte: null,
            observacoes: '',
            total: 0
        };
    }

    // Salvar carrinho no localStorage
    salvarCarrinho() {
        localStorage.setItem('carrinhoMarliConfeitaria', JSON.stringify(this.carrinho));
        this.atualizarInterface();
        this.calcularTotal();
    }

    // Inicializar eventos
    inicializar() {
        this.atualizarInterface();
        this.calcularTotal();
        console.log('🛒 Sistema de carrinho inicializado!');
    }

    // Adicionar bolo base
    adicionarBoloBase(tipo, preco) {
        this.carrinho.boloBase = { tipo, preco };
        this.salvarCarrinho();
        this.mostrarNotificacao(`Bolo base "${tipo}" adicionado!`, 'sucesso');
    }

    // Adicionar massa especial
    adicionarMassaEspecial(nome, preco) {
        this.carrinho.massaEspecial = { nome, preco };
        this.salvarCarrinho();
        this.mostrarNotificacao(`Massa especial "${nome}" adicionada!`, 'sucesso');
    }

    // Adicionar recheio especial
    adicionarRecheioEspecial(nome, preco) {
        this.carrinho.recheioEspecial = { nome, preco };
        this.salvarCarrinho();
        this.mostrarNotificacao(`Recheio "${nome}" adicionado!`, 'sucesso');
    }

    // Adicionar decoração
    adicionarDecoracao(nome, preco, tipo) {
        const decoracaoExistente = this.carrinho.decoracoes.find(d => d.nome === nome);
        
        if (decoracaoExistente) {
            this.mostrarNotificacao(`"${nome}" já está no carrinho!`, 'aviso');
            return;
        }

        this.carrinho.decoracoes.push({ nome, preco, tipo });
        this.salvarCarrinho();
        this.mostrarNotificacao(`Decoração "${nome}" adicionada!`, 'sucesso');
    }

    // Remover decoração
    removerDecoracao(nome) {
        this.carrinho.decoracoes = this.carrinho.decoracoes.filter(d => d.nome !== nome);
        this.salvarCarrinho();
        this.mostrarNotificacao(`"${nome}" removido!`, 'info');
    }

    // Adicionar complemento
    adicionarComplemento(nome, precoUnitario, quantidade = 1) {
        const complementoExistente = this.carrinho.complementos.find(c => c.nome === nome);
        
        if (complementoExistente) {
            complementoExistente.quantidade += quantidade;
        } else {
            this.carrinho.complementos.push({ nome, precoUnitario, quantidade });
        }
        
        this.salvarCarrinho();
        this.mostrarNotificacao(`${quantidade}x ${nome} adicionado(s)!`, 'sucesso');
    }

    // Atualizar quantidade de complemento
    atualizarQuantidadeComplemento(nome, quantidade) {
        const complemento = this.carrinho.complementos.find(c => c.nome === nome);
        
        if (complemento) {
            if (quantidade <= 0) {
                this.removerComplemento(nome);
            } else {
                complemento.quantidade = quantidade;
                this.salvarCarrinho();
            }
        }
    }

    // Remover complemento
    removerComplemento(nome) {
        this.carrinho.complementos = this.carrinho.complementos.filter(c => c.nome !== nome);
        this.salvarCarrinho();
        this.mostrarNotificacao(`"${nome}" removido!`, 'info');
    }

    // Adicionar caixa de transporte
    adicionarCaixaTransporte(tamanho, preco) {
        this.carrinho.caixaTransporte = { tamanho, preco };
        this.salvarCarrinho();
        this.mostrarNotificacao(`Caixa tamanho "${tamanho}" adicionada!`, 'sucesso');
    }

    // Adicionar observações
    adicionarObservacoes(texto) {
        this.carrinho.observacoes = texto;
        this.salvarCarrinho();
    }

    // Calcular total
    calcularTotal() {
        let total = 0;

        // Bolo base
        if (this.carrinho.boloBase) {
            total += this.carrinho.boloBase.preco;
        }

        // Massa especial
        if (this.carrinho.massaEspecial) {
            total += this.carrinho.massaEspecial.preco;
        }

        // Recheio especial
        if (this.carrinho.recheioEspecial) {
            total += this.carrinho.recheioEspecial.preco;
        }

        // Decorações
        this.carrinho.decoracoes.forEach(dec => {
            total += dec.preco;
        });

        // Complementos
        this.carrinho.complementos.forEach(comp => {
            total += comp.precoUnitario * comp.quantidade;
        });

        // Caixa de transporte
        if (this.carrinho.caixaTransporte) {
            total += this.carrinho.caixaTransporte.preco;
        }

        this.carrinho.total = total;
        this.salvarCarrinho();
        return total;
    }

    // Limpar carrinho
    limparCarrinho() {
        if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
            this.carrinho = {
                boloBase: null,
                massaEspecial: null,
                recheioEspecial: null,
                decoracoes: [],
                complementos: [],
                caixaTransporte: null,
                observacoes: '',
                total: 0
            };
            this.salvarCarrinho();
            this.mostrarNotificacao('Carrinho limpo!', 'info');
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
            let itens = 0;
            if (this.carrinho.boloBase) itens++;
            if (this.carrinho.massaEspecial) itens++;
            if (this.carrinho.recheioEspecial) itens++;
            itens += this.carrinho.decoracoes.length;
            itens += this.carrinho.complementos.length;
            if (this.carrinho.caixaTransporte) itens++;

            contador.textContent = itens;
            contador.style.display = itens > 0 ? 'flex' : 'none';
        }
    }

    // Atualizar resumo do carrinho
    atualizarResumoCarrinho() {
        const resumo = document.getElementById('resumo-carrinho');
        if (!resumo) return;

        const total = this.calcularTotal();
        
        let html = '<div class="conteudo-resumo-carrinho">';
        html += '<h3>🛒 Seu Pedido</h3>';

        // Verificar se há itens
        const temItens = this.carrinho.boloBase || 
                        this.carrinho.massaEspecial || 
                        this.carrinho.recheioEspecial || 
                        this.carrinho.decoracoes.length > 0 || 
                        this.carrinho.complementos.length > 0 || 
                        this.carrinho.caixaTransporte;

        if (!temItens) {
            html += '<p class="carrinho-vazio">Seu carrinho está vazio. Comece escolhendo um bolo base!</p>';
        } else {
            html += '<div class="lista-itens-carrinho">';

            // Bolo Base
            if (this.carrinho.boloBase) {
                html += `
                    <div class="item-carrinho">
                        <span class="nome-item">🎂 ${this.carrinho.boloBase.tipo}</span>
                        <span class="preco-item">R$ ${this.carrinho.boloBase.preco.toFixed(2)}</span>
                    </div>
                `;
            }

            // Massa Especial
            if (this.carrinho.massaEspecial) {
                html += `
                    <div class="item-carrinho">
                        <span class="nome-item">🎨 ${this.carrinho.massaEspecial.nome}</span>
                        <span class="preco-item">+ R$ ${this.carrinho.massaEspecial.preco.toFixed(2)}</span>
                    </div>
                `;
            }

            // Recheio Especial
            if (this.carrinho.recheioEspecial) {
                html += `
                    <div class="item-carrinho">
                        <span class="nome-item">🍫 ${this.carrinho.recheioEspecial.nome}</span>
                        <span class="preco-item">+ R$ ${this.carrinho.recheioEspecial.preco.toFixed(2)}</span>
                    </div>
                `;
            }

            // Decorações
            this.carrinho.decoracoes.forEach(dec => {
                html += `
                    <div class="item-carrinho">
                        <span class="nome-item">✨ ${dec.nome}</span>
                        <div class="acoes-item">
                            <span class="preco-item">R$ ${dec.preco.toFixed(2)}</span>
                            <button onclick="carrinho.removerDecoracao('${dec.nome}')" class="btn-remover-mini">×</button>
                        </div>
                    </div>
                `;
            });

            // Complementos
            this.carrinho.complementos.forEach(comp => {
                const subtotal = comp.precoUnitario * comp.quantidade;
                html += `
                    <div class="item-carrinho">
                        <span class="nome-item">🍬 ${comp.nome} (${comp.quantidade}x)</span>
                        <div class="acoes-item">
                            <span class="preco-item">R$ ${subtotal.toFixed(2)}</span>
                            <button onclick="carrinho.removerComplemento('${comp.nome}')" class="btn-remover-mini">×</button>
                        </div>
                    </div>
                `;
            });

            // Caixa de Transporte
            if (this.carrinho.caixaTransporte) {
                html += `
                    <div class="item-carrinho">
                        <span class="nome-item">📦 Caixa ${this.carrinho.caixaTransporte.tamanho}</span>
                        <span class="preco-item">R$ ${this.carrinho.caixaTransporte.preco.toFixed(2)}</span>
                    </div>
                `;
            }

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

// Funções wrapper para garantir que o carrinho existe
function adicionarAoCarrinho(tipo, ...args) {
    if (!carrinho) {
        console.error('Carrinho ainda não foi inicializado!');
        alert('Por favor, aguarde o carregamento da página...');
        return;
    }
    
    try {
        switch(tipo) {
            case 'boloBase':
                carrinho.adicionarBoloBase(...args);
                break;
            case 'massaEspecial':
                carrinho.adicionarMassaEspecial(...args);
                break;
            case 'recheioEspecial':
                carrinho.adicionarRecheioEspecial(...args);
                break;
            case 'decoracao':
                carrinho.adicionarDecoracao(...args);
                break;
            case 'complemento':
                carrinho.adicionarComplemento(...args);
                break;
            case 'caixaTransporte':
                carrinho.adicionarCaixaTransporte(...args);
                break;
            default:
                console.error('Tipo de produto desconhecido:', tipo);
        }
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        alert('Erro ao adicionar item. Por favor, tente novamente.');
    }
}

// Inicializar carrinho globalmente para acesso imediato
let carrinho;

// Inicializar assim que o script carregar
(function() {
    if (typeof carrinho === 'undefined') {
        carrinho = new CarrinhoConfeitaria();
        console.log('🎂 Carrinho da Confeitaria carregado!');
    }
})();

// Garantir que está pronto quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    if (!carrinho) {
        carrinho = new CarrinhoConfeitaria();
        console.log('🎂 Carrinho da Confeitaria carregado via DOMContentLoaded!');
    } else {
        carrinho.atualizarInterface();
        console.log('🎂 Carrinho já estava carregado, interface atualizada!');
    }
});
