// Função para alternar o menu mobile
function alternarMenu() {
    const menuNavegacao = document.getElementById('menuNavegacao');
    menuNavegacao.classList.toggle('active');
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    
    // Fechar menu ao clicar em um link (mobile)
    document.querySelectorAll('.link-navegacao').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('menuNavegacao').classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Adicionar efeito de scroll na barra de navegação
    window.addEventListener('scroll', function() {
        const barraNavegacao = document.querySelector('.barra-navegacao');
        if (window.scrollY > 50) {
            barraNavegacao.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
        } else {
            barraNavegacao.style.backgroundColor = '#2c3e50';
        }
    });

    // Animação de entrada para cards de produtos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar cartões de produtos para animação
    document.querySelectorAll('.cartao-produto').forEach(cartao => {
        cartao.style.opacity = '0';
        cartao.style.transform = 'translateY(20px)';
        cartao.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(cartao);
    });

    // Fechar menu mobile ao clicar fora dele
    document.addEventListener('click', function(event) {
        const barraNavegacao = document.querySelector('.barra-navegacao');
        const menuNavegacao = document.getElementById('menuNavegacao');
        const botaoMenuMobile = document.querySelector('.botao-menu-mobile');
        
        if (!barraNavegacao.contains(event.target) && menuNavegacao.classList.contains('active')) {
            menuNavegacao.classList.remove('active');
        }
    });

    // Adicionar loading suave para transições de página
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hostname === window.location.hostname) {
                document.body.style.opacity = '0.8';
                document.body.style.transition = 'opacity 0.2s ease';
            }
        });
    });

    console.log('🎂 Confeitaria MB - JavaScript carregado com sucesso!');
});