// JavaScript específico para a página de produtos

document.addEventListener('DOMContentLoaded', function() {
    
    // Sistema de filtros de produtos
    const botoesFiltro = document.querySelectorAll('.botao-filtro');
    const categoriasProdutos = document.querySelectorAll('.categoria-produtos');
    
    // Função para filtrar produtos por categoria
    function filtrarProdutos(categoriaEscolhida) {
        categoriasProdutos.forEach(categoria => {
            const categoriaNome = categoria.getAttribute('data-categoria');
            
            if (categoriaEscolhida === 'todos' || categoriaNome === categoriaEscolhida) {
                categoria.style.display = 'block';
                categoria.classList.remove('oculto');
                
                // Animar entrada dos produtos
                const produtos = categoria.querySelectorAll('.cartao-produto-catalogo');
                produtos.forEach((produto, index) => {
                    setTimeout(() => {
                        produto.style.opacity = '1';
                        produto.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            } else {
                categoria.style.display = 'none';
                categoria.classList.add('oculto');
            }
        });
    }
    
    // Event listeners para os botões de filtro
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            // Remover classe ativo de todos os botões
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            
            // Adicionar classe ativo ao botão clicado
            botao.classList.add('ativo');
            
            // Filtrar produtos
            const categoria = botao.getAttribute('data-categoria');
            filtrarProdutos(categoria);
            
            // Scroll suave para o catálogo
            document.querySelector('.secao-catalogo').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Sistema de encomenda de produtos - redireciona para Linktree
    const botoesAdicionar = document.querySelectorAll('.botao-adicionar');
    
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', function() {
            // Redirecionar para o Linktree da confeitaria
            window.open('https://linktr.ee/marliconfeitariaME?fbclid=PAb21jcANRRphleHRuA2FlbQIxMQABp9hJHJABei7o7Woan34n-a_Zi6oTP92U0lWMZ47_sro7uDK8h8qW3UsSg40N_aem_IPTEs8e1EYUOaJq-hfTQdA', '_blank');
        });
    });
    
    // Função para mostrar notificações
    function mostrarNotificacao(mensagem) {
        // Criar elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-encomenda';
        notificacao.innerHTML = `
            <div class="conteudo-notificacao">
                <span class="icone-notificacao">🎉</span>
                <span class="texto-notificacao">${mensagem}</span>
                <button class="fechar-notificacao" onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
        `;
        
        // Adicionar estilos inline (pode ser movido para CSS)
        notificacao.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #6b8e23;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 350px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(notificacao);
        
        // Remover automaticamente após 4 segundos
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    notificacao.remove();
                }, 300);
            }
        }, 4000);
    }
    
    // Adicionar animações CSS dinamicamente
    const estilosAnimacao = document.createElement('style');
    estilosAnimacao.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .conteudo-notificacao {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .fechar-notificacao {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
            margin-left: auto;
        }
        
        .fechar-notificacao:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(estilosAnimacao);
    
    // Animação de entrada inicial dos produtos
    const observadorProdutos = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar todos os produtos para animação de entrada
    document.querySelectorAll('.cartao-produto-catalogo').forEach(produto => {
        produto.style.opacity = '0';
        produto.style.transform = 'translateY(20px)';
        produto.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observadorProdutos.observe(produto);
    });
    
    // Efeito de hover nos preços
    document.querySelectorAll('.preco-atual').forEach(preco => {
        preco.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        preco.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Contador de produtos por categoria (opcional)
    function contarProdutosPorCategoria() {
        const contadores = {};
        
        categoriasProdutos.forEach(categoria => {
            const nome = categoria.getAttribute('data-categoria');
            const quantidade = categoria.querySelectorAll('.cartao-produto-catalogo').length;
            contadores[nome] = quantidade;
        });
        
        console.log('Produtos por categoria:', contadores);
        return contadores;
    }
    
    // Executar contagem inicial
    contarProdutosPorCategoria();
    
    console.log('🍰 JavaScript da página de produtos carregado com sucesso!');
});