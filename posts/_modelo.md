---
title: Título do seu post
date: 2026-10-13
summary: Uma frase curta que aparece no card do blog.
tags: [QA, Automação]
cover: assets/blog/minha-imagem.jpg
draft: true
---

Arquivos que começam com "_" não são publicados. Para criar um post:

1. Copie este arquivo e renomeie, ex.: `posts/meu-novo-post.md` (o nome vira o link: `#/blog/meu-novo-post`).
2. Preencha o cabeçalho acima e apague a linha `draft: true` (ou mude para `false`).
3. Escreva o texto em Markdown abaixo e faça commit/push. O GitHub Action atualiza a lista sozinho.

## Exemplo de subtítulo

Texto normal, **negrito**, *itálico*, [link](https://github.com) e `código`.

> Uma citação em destaque.

```js
cy.get('[data-test=login]').click();
```

- item de lista
- outro item

![descrição da imagem](assets/blog/minha-imagem.jpg)
