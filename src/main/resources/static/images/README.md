# 📸 Pasta de Imagens - Confeitaria MB

Esta pasta contém todas as imagens utilizadas no site da Confeitaria MB.

## 📁 Estrutura de Pastas

```
images/
├── produtos/           # Imagens dos produtos
│   ├── bolos/         # Fotos dos bolos
│   ├── doces/         # Fotos dos doces
│   ├── tortas/        # Fotos das tortas
│   └── especiais/     # Fotos dos produtos especiais
└── README.md          # Este arquivo
```

## 🎨 Diretrizes para Imagens de Produtos

### Formato e Qualidade
- **Formato recomendado**: JPG ou PNG
- **Dimensões ideais**: 800x800 pixels (quadrado)
- **Tamanho máximo**: 500KB por imagem
- **Qualidade**: Alta resolução, bem iluminadas

### Nomenclatura
Use nomes descritivos e sem espaços:
- ✅ `bolo-chocolate.jpg`
- ✅ `brigadeiro-gourmet.png`
- ✅ `torta-limao.jpg`
- ❌ `IMG_1234.jpg`
- ❌ `foto bolo.jpg` (evite espaços)

### Organização por Categoria

#### 🎂 Bolos (`produtos/bolos/`)
Exemplos:
- bolo-chocolate.jpg
- bolo-cenoura.jpg
- bolo-red-velvet.jpg
- bolo-limao.jpg
- bolo-coco.jpg

#### 🍬 Doces (`produtos/doces/`)
Exemplos:
- brigadeiro.jpg
- beijinho.jpg
- trufa.jpg
- pudim.jpg
- quindim.jpg

#### 🥧 Tortas (`produtos/tortas/`)
Exemplos:
- torta-maca.jpg
- torta-limao.jpg
- torta-chocolate.jpg
- torta-morango.jpg
- torta-nozes.jpg
- torta-banana.jpg

#### ✨ Especiais (`produtos/especiais/`)
Exemplos:
- bolo-personalizado.jpg
- doces-festa.jpg
- ovo-pascoa.jpg
- panetone.jpg

## 🔧 Como Usar no HTML

### Sintaxe Thymeleaf
```html
<img th:src="@{/images/produtos/bolos/bolo-chocolate.jpg}" 
     alt="Bolo de Chocolate" 
     class="imagem-produto">
```

### Sintaxe HTML Padrão
```html
<img src="/images/produtos/bolos/bolo-chocolate.jpg" 
     alt="Bolo de Chocolate" 
     class="imagem-produto">
```

## 📝 Notas Importantes

1. **Otimização**: Sempre otimize as imagens antes de fazer upload para reduzir o tempo de carregamento
2. **Backup**: Mantenha cópias de segurança das imagens originais em alta resolução
3. **Direitos**: Use apenas imagens com direitos autorais apropriados
4. **Consistência**: Mantenha o mesmo estilo visual em todas as fotos (iluminação, fundo, ângulo)

## 🎯 Dicas de Fotografia

- Use fundo branco ou neutro
- Iluminação natural sempre que possível
- Foto com ângulo de 45° ou de cima (flat lay)
- Capture detalhes e texturas
- Evite sombras fortes
- Mantenha o produto como foco principal

---

**Desenvolvido por**: Bruno Silva  
**Data**: Outubro 2025  
**Projeto**: Confeitaria MB
