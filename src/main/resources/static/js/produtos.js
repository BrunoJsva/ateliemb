/* ===== PRODUTOS.JS - FUNCIONALIDADES DA PÁGINA DE PRODUTOS ===== */

// Variáveis globais
let carrinho = [];
let carrinhoVisible = false;

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadCartFromStorage();
    addAnimationsOnScroll();
    setupEventListeners();
});

// ===== INICIALIZAÇÃO =====
function initializePage() {
    // Adiciona animações aos elementos
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // Inicializa tooltips se estiver usando Bootstrap
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// ===== GERENCIAMENTO DO CARRINHO =====
function addToCart(produtoId, nome, preco, imagem) {
    // Validação dos parâmetros
    if (!produtoId || !nome || !preco) {
        showNotification('Erro: Dados do produto inválidos', 'error');
        return;
    }
    
    // Procura se o produto já existe no carrinho
    const existingItem = carrinho.find(item => item.id === produtoId);
    
    if (existingItem) {
        existingItem.quantidade += 1;
        showNotification(`Quantidade de "${nome}" aumentada para ${existingItem.quantidade}`, 'success');
    } else {
        const newItem = {
            id: produtoId,
            nome: nome,
            preco: parseFloat(preco),
            imagem: imagem || '/images/default-product.jpg',
            quantidade: 1
        };
        carrinho.push(newItem);
        showNotification(`"${nome}" adicionado ao carrinho!`, 'success');
    }
    
    updateCartUI();
    saveCartToStorage();
    animateCartIcon();
}

function removeFromCart(produtoId) {
    const index = carrinho.findIndex(item => item.id === produtoId);
    if (index !== -1) {
        const removedItem = carrinho.splice(index, 1)[0];
        showNotification(`"${removedItem.nome}" removido do carrinho`, 'warning');
        updateCartUI();
        saveCartToStorage();
    }
}

function updateQuantity(produtoId, newQuantity) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(produtoId);
        } else {
            item.quantidade = parseInt(newQuantity);
            updateCartUI();
            saveCartToStorage();
        }
    }
}

function clearCart() {
    carrinho = [];
    updateCartUI();
    saveCartToStorage();
    showNotification('Carrinho limpo!', 'info');
}

// ===== INTERFACE DO CARRINHO =====
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Atualiza o valor total se existir elemento na página
    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
        const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
}

function toggleCartView() {
    // Esta função pode ser expandida para mostrar/ocultar um modal do carrinho
    console.log('Carrinho atual:', carrinho);
    showCartModal();
}

function showCartModal() {
    // Cria modal do carrinho dinamicamente
    const modalHtml = `
        <div class="modal fade" id="cartModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-shopping-cart me-2"></i>Meu Carrinho
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${getCartHTML()}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-danger" onclick="clearCart()">Limpar Carrinho</button>
                        <button type="button" class="btn btn-primary" onclick="finalizarPedido()">Finalizar Pedido</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove modal existente se houver
    const existingModal = document.getElementById('cartModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adiciona novo modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostra o modal
    if (typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        modal.show();
    }
}

function getCartHTML() {
    if (carrinho.length === 0) {
        return `
            <div class="text-center py-4">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5>Seu carrinho está vazio</h5>
                <p class="text-muted">Adicione produtos para continuar</p>
            </div>
        `;
    }
    
    let html = '<div class="cart-items">';
    let total = 0;
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        html += `
            <div class="cart-item d-flex align-items-center mb-3 p-3 border rounded">
                <img src="${item.imagem}" alt="${item.nome}" class="me-3" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.nome}</h6>
                    <small class="text-muted">R$ ${item.preco.toFixed(2)} cada</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantidade - 1})">-</button>
                    <span class="mx-3 fw-bold">${item.quantidade}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantidade + 1})">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-3" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="ms-3 fw-bold">
                    R$ ${subtotal.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    html += `</div>
        <div class="cart-total-section border-top pt-3 mt-3">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Total:</h5>
                <h4 class="mb-0 text-primary">R$ ${total.toFixed(2)}</h4>
            </div>
        </div>
    `;
    
    return html;
}

// ===== ARMAZENAMENTO LOCAL =====
function saveCartToStorage() {
    try {
        localStorage.setItem('ateliemb_carrinho', JSON.stringify(carrinho));
    } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
    }
}

function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem('ateliemb_carrinho');
        if (stored) {
            carrinho = JSON.parse(stored);
            updateCartUI();
        }
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        carrinho = [];
    }
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    // Remove notificações existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Mostra a notificação
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove após 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===== ANIMAÇÕES =====
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-float');
    if (cartIcon) {
        cartIcon.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            cartIcon.style.animation = '';
        }, 500);
    }
}

function addAnimationsOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => observer.observe(card));
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Listener para o carrinho flutuante
    const cartFloat = document.querySelector('.cart-float');
    if (cartFloat) {
        cartFloat.addEventListener('click', toggleCartView);
    }
    
    // Listeners para botões de adicionar ao carrinho
    const addButtons = document.querySelectorAll('.btn-add-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Adiciona estado de loading
            this.classList.add('btn-loading');
            
            // Remove loading após 500ms
            setTimeout(() => {
                this.classList.remove('btn-loading');
            }, 500);
        });
    });
}

// ===== FINALIZAÇÃO DE PEDIDO =====
function finalizarPedido() {
    if (carrinho.length === 0) {
        showNotification('Carrinho vazio! Adicione produtos antes de finalizar.', 'warning');
        return;
    }
    
    // Aqui você pode integrar com o backend ou redirecionar para página de checkout
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    // Simula processamento
    showNotification('Processando pedido...', 'info');
    
    setTimeout(() => {
        // Integração com WhatsApp ou sistema de pedidos
        const mensagem = criarMensagemWhatsApp();
        const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
        
        showNotification('Pedido enviado! Você será redirecionado para o WhatsApp.', 'success');
    }, 1500);
}

function criarMensagemWhatsApp() {
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    let mensagem = '*Novo Pedido - Ateliê MB*\n\n';
    
    carrinho.forEach(item => {
        mensagem += `• ${item.nome}\n`;
        mensagem += `  Quantidade: ${item.quantidade}\n`;
        mensagem += `  Valor unitário: R$ ${item.preco.toFixed(2)}\n`;
        mensagem += `  Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
    });
    
    mensagem += `*Total: R$ ${total.toFixed(2)}*\n\n`;
    mensagem += 'Aguardo confirmação e formas de pagamento/entrega.';
    
    return mensagem;
}

// ===== UTILITÁRIOS =====
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exporta funções para uso global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.finalizarPedido = finalizarPedido;
window.toggleCartView = toggleCartView;

console.log('🍰 JavaScript da página de produtos carregado com sucesso!');