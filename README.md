# Marcador

App para registrar sessões de estudo e a leitura de cada dia: cronômetro, regressivo, matérias, calendário, estatísticas, livros com busca no Google Books e na Open Library, metas e backup em planilha.

- Funciona como app no iPhone (Safari → Compartilhar → Adicionar à Tela de Início) e no computador (Chrome/Edge → Instalar).
- Os dados ficam no aparelho e sincronizam pela conta (Supabase) quando você entra em Ajustes.
- A chave em `index.html` é a chave pública do Supabase; o acesso aos dados é protegido por login e regras de linha (cada conta só vê os próprios dados).
