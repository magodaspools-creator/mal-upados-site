# PLANO DE POLIMENTO FINAL — ARENA: O CISMA DO SOBERANO

> Objetivo: fazer uma última revisão controlada depois das 13 fases da campanha.
>
> Regra principal: executar **uma etapa por vez**, validar o resultado e só então avançar.
> Nenhuma etapa deve alterar `arena-sobreviva.html`, renderer de sprites, XP, ranking ou movimentação.

## Etapa 1 — Auditoria da progressão entre mapas

- [ ] Mapear exatamente como o jogo atual libera a passagem entre os 5 mapas.
- [ ] Verificar se a passagem atualmente exige ou não a derrota do boss.
- [ ] Identificar quais eventos/bandeiras realmente controlam cada transição.
- [ ] Comparar esse fluxo com a intenção narrativa da lore.
- [ ] Decidir, com base no código atual, se a derrota do boss deve ser:
  - [ ] requisito real para avançar;
  - [ ] apenas requisito narrativo;
  - [ ] ou permanecer opcional.
- [ ] **Não alterar nada nesta etapa antes de concluir a auditoria.**
- [ ] Registrar o resultado antes de qualquer implementação.

## Etapa 2 — Auditoria visual geral

Objetivo: avaliar a campanha inteira como experiência visual, não apenas verificar se os elementos existem.

- [ ] Revisar Floresta Sombria.
- [ ] Revisar Acampamento Orc.
- [ ] Revisar Deserto Perdido.
- [ ] Revisar Covil dos Dragões.
- [ ] Revisar Abismo Demoníaco.
- [ ] Revisar Grande Revelação.
- [ ] Revisar Mirror Match.
- [ ] Revisar Segundo Impacto.
- [ ] Identificar elementos visualmente fracos, genéricos ou pouco integrados.
- [ ] Identificar excesso de caixas, bordas, textos ou elementos de interface.
- [ ] Identificar oportunidades de iluminação, partículas, profundidade, contraste, camadas e ambientação.
- [ ] Separar melhorias de alto impacto das melhorias cosméticas.
- [ ] **Nesta etapa apenas diagnosticar; não sair alterando vários arquivos.**

## Etapa 3 — Polimento visual por região

Depois da auditoria da Etapa 2, corrigir uma região por vez.

Ordem:

1. [ ] Floresta Sombria
2. [ ] Acampamento Orc
3. [ ] Deserto Perdido
4. [ ] Covil dos Dragões
5. [ ] Abismo Demoníaco
6. [ ] Grande Revelação
7. [ ] Mirror Match
8. [ ] Segundo Impacto

Para cada região:

- [ ] Melhorar composição visual.
- [ ] Melhorar hierarquia dos elementos.
- [ ] Melhorar ambientação.
- [ ] Melhorar transições/animações quando fizer sentido.
- [ ] Evitar adicionar dependências externas desnecessárias.
- [ ] Validar a região antes de passar para a próxima.

## Etapa 4 — Foreshadowing mínimo

- [ ] Revisar as pistas de Kaelen.
- [ ] Revisar as correntes e símbolos.
- [ ] Revisar elementos do Abismo.
- [ ] Verificar se existem pistas suficientes antes da revelação.
- [ ] Garantir que nenhuma pista entregue explicitamente o twist.
- [ ] Adicionar somente pistas de alto valor narrativo.
- [ ] Validar primeira jogada e rejogabilidade.

## Etapa 5 — Grande Revelação

- [ ] Revisar a cena do cadáver.
- [ ] Verificar se o rosto do jogador recebe atenção visual suficiente.
- [ ] Verificar entrada de Kaelen.
- [ ] Verificar remoção do capacete.
- [ ] Verificar comparação visual entre os dois rostos.
- [ ] Avaliar a quantidade de elementos da interface durante a revelação.
- [ ] **Não reduzir a interface automaticamente:** primeiro avaliar se ela realmente está excessiva.
- [ ] Se houver excesso, criar apenas uma redução temporária e controlada.
- [ ] Validar a cena completa antes de avançar.

## Etapa 6 — Mirror Match

- [ ] Verificar se Kaelen realmente parece um espelho do jogador.
- [ ] Melhorar sinais visuais de ações equivalentes.
- [ ] Avaliar timing das ações espelhadas.
- [ ] Reforçar a identidade visual de Kaelen sem criar outro sistema de combate.
- [ ] Garantir que o combate continue usando o sistema existente.
- [ ] Validar vitória, derrota e absorção.

## Etapa 7 — Segundo Impacto

- [ ] Revisar a entrada no Trono.
- [ ] Melhorar sensação de primeira pessoa.
- [ ] Melhorar a apresentação das memórias.
- [ ] Reforçar visualmente Arena + Titãs + drenagem dimensional.
- [ ] Revisar correntes e engrenagens.
- [ ] Avaliar as duas opções finais.
- [ ] Manter as opções não clicáveis.
- [ ] Preservar a ambiguidade do final.
- [ ] Criar uma pequena sensação de encerramento após a apresentação das opções.

## Etapa 8 — Transições e ritmo

- [ ] Revisar passagem entre cada capítulo.
- [ ] Verificar se existem saltos bruscos de uma região para outra.
- [ ] Adicionar transições somente onde realmente melhorarem o ritmo.
- [ ] Evitar telas de carregamento ou bloqueios artificiais.
- [ ] Garantir que o gameplay continue fluido.

## Etapa 9 — Fragmentos e progressão narrativa

- [ ] Revisar apresentação dos quatro fragmentos.
- [ ] Verificar sequência Floresta → Orcs → Deserto → Dragões.
- [ ] Avaliar se o jogador entende que está reunindo partes de uma memória.
- [ ] Melhorar feedback visual quando um fragmento é absorvido.
- [ ] Não transformar isso em um sistema invasivo de HUD.

## Etapa 10 — Auditoria de consistência textual

- [ ] Procurar termos antigos que contradigam a lore.
- [ ] Procurar referências incompatíveis com a identidade do protagonista.
- [ ] Revisar uso de Soberano, Cisma, Kaelen, Inocência, Ambição, Culpa, Abismo, Trono e Generais.
- [ ] Procurar textos duplicados ou contraditórios.
- [ ] Procurar mensagens de debug esquecidas.
- [ ] Procurar textos provisórios.
- [ ] Revisar pontuação e acentuação.
- [ ] Não alterar textos narrativos sem validar o contexto.

## Etapa 11 — Auditoria técnica de integração

- [ ] Verificar listeners duplicados.
- [ ] Verificar MutationObservers duplicados.
- [ ] Verificar intervals/timers que possam ser registrados várias vezes.
- [ ] Verificar eventos narrativos duplicados.
- [ ] Verificar chamadas de renderização desnecessárias.
- [ ] Verificar dependências entre arquivos.
- [ ] Verificar se cada camada é carregada somente onde precisa.
- [ ] Verificar se nenhuma etapa interfere no Sobreviva.

## Etapa 12 — Teste narrativo completo

Executar a campanha do início ao fim:

- [ ] Mapa 1 → Mapa 2
- [ ] Mapa 2 → Mapa 3
- [ ] Mapa 3 → Mapa 4
- [ ] Mapa 4 → Mapa 5
- [ ] Cadáver → Revelação
- [ ] Revelação → Mirror Match
- [ ] Mirror Match → Absorção
- [ ] Absorção → Segundo Impacto
- [ ] Segundo Impacto → Rejogabilidade

Durante o teste:

- [ ] Verificar diálogos.
- [ ] Verificar eventos.
- [ ] Verificar fragmentos.
- [ ] Verificar transições.
- [ ] Verificar visuais.
- [ ] Verificar ausência de erros visíveis.
- [ ] Verificar que não existe bloqueio acidental de progressão.

## Etapa 13 — Rejogabilidade

- [ ] Confirmar que as pistas retroativas só aparecem depois do final.
- [ ] Revisar as cinco regiões novamente após a revelação.
- [ ] Verificar se as novas interpretações enriquecem a campanha sem reescrevê-la.
- [ ] Confirmar que a primeira jogada continua preservada.

## Etapa 14 — Fechamento

- [ ] Criar backup final antes de qualquer última alteração.
- [ ] Revisar diff completo.
- [ ] Confirmar que arquivos fora do escopo não foram alterados.
- [ ] Confirmar que `arena-sobreviva.html` permanece intacto.
- [ ] Confirmar que renderer, XP, ranking e movimentação permanecem intactos.
- [ ] Validar GitHub Actions / Pages.
- [ ] Fazer teste final no navegador.
- [ ] Se tudo estiver estável: **congelar a lore.**

---

## Regra operacional

**Nunca executar duas etapas de polimento grandes simultaneamente.**

Fluxo obrigatório:

**Auditar → alterar → validar → registrar → próxima etapa.**

Se uma etapa revelar um problema estrutural maior, parar nela e corrigir antes de continuar.

## Prioridade

1. Progressão real entre mapas.
2. Qualidade visual geral.
3. Revelação.
4. Mirror Match.
5. Segundo Impacto.
6. Transições/ritmo.
7. Consistência textual.
8. Auditoria técnica.
9. Teste completo.
10. Congelamento.

## Fora do escopo

- `arena-sobreviva.html`
- Renderer de sprites
- Mage/outfits
- XP
- Ranking
- Movimentação
- Criação de um novo sistema de combate
- Refatoração grande da arquitetura
