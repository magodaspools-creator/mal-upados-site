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

## Resultado da Etapa 1 — Auditoria da progressão entre mapas

**Auditoria concluída sem alteração de gameplay.**

### Fluxo atual encontrado

- O desbloqueio das 5 áreas em `arena.js` é controlado **exclusivamente pelo Arena Level**:
  - Floresta: Level 1
  - Acampamento Orc: Level 10
  - Deserto Perdido: Level 20
  - Covil dos Dragões: Level 35
  - Abismo Demoníaco: Level 50
- O jogador pode selecionar diretamente qualquer área cujo requisito de nível já tenha sido alcançado.
- A vitória de uma batalha comum não força a mudança para a próxima área.
- O Boss elemental é um encontro separado e opcional dentro da área. `arena-bosses.js` só exige nível mínimo + amuleto elemental para iniciar o Boss; não existe bloqueio de área baseado em vitória do Boss.
- Portanto, **atualmente não existe uma progressão "matar Boss → liberar próximo mapa"** no sistema de gameplay.

### Relação com a lore

A camada narrativa criou eventos de derrota dos chefes:

- Mapa 1 → `map1_boss_defeat`
- Mapa 2 → `map2_boss_defeat`
- Mapa 3 → `map3_boss_defeat`
- Mapa 4 → `map4_boss_defeat`

Essas vitórias também alimentam os fragmentos narrativos. Logo:

**o mapa pode ser desbloqueado pelo nível mesmo que o jogador nunca derrote o Boss**, mas algumas partes da lore ficam sem conclusão.

Isso é diferente de um bug de progressão: é uma **decisão de design que precisa ser definida**.

### Opções para a próxima decisão

**Opção A — Manter o sistema atual**
- Mapas continuam sendo liberados por nível.
- Bosses continuam opcionais.
- A lore funciona como conteúdo narrativo opcional ligado às vitórias.
- Não exige mudança no sistema de progressão.

**Opção B — Tornar Boss obrigatório para a progressão narrativa**
- O nível continua liberando o acesso técnico à área.
- A história só considera o capítulo concluído depois da vitória do Boss.
- Pode existir bloqueio narrativo antes de avançar para a próxima região, sem necessariamente alterar o sistema global de níveis.

**Opção C — Tornar Boss obrigatório para liberar o próximo mapa**
- Mudança real no gameplay/progressão.
- Exigiria alterar a regra atual de desbloqueio das áreas.
- É a opção de maior impacto e, por isso, não deve ser aplicada automaticamente.

### Decisão

**Nenhuma opção foi aplicada nesta etapa.**

A auditoria confirma que a afirmação "é preciso matar o Boss para passar de mapa" **não corresponde ao funcionamento atual**. Antes de qualquer mudança, precisamos decidir se a lore deve apenas acompanhar o gameplay existente ou se a progressão narrativa deve passar a exigir os chefes.

---

## Resultado da Etapa 1 — Decisão e implementação

A decisão foi aplicar **progressão por Boss + Lore**.

### Regra final

- Cada nova área exige:
  1. requisito de Arena Level;
  2. derrota do Boss da área anterior;
  3. conclusão do evento narrativo que abre a passagem.
- O Boss continua sendo o encontro necessário para concluir o capítulo, mas **o amuleto elemental não é mais obrigatório para iniciar o combate**.
- O amuleto agora funciona como proteção: equipado, reduz o risco do combate; sem ele, o jogador enfrenta a dificuldade integral.
- O Abismo também exige a derrota da Guarda Real antes da interação com o cadáver e da Grande Revelação.

### Fluxo

- Floresta → Boss + `map1_fragment` → Acampamento Orc
- Orcs → Boss + `map2_gate_open` → Deserto Perdido
- Deserto → Boss + `map3_flashback` → Covil dos Dragões
- Dragões → Boss + `map4_descent` → Abismo Demoníaco
- Abismo → Boss + `map5_throne_room` → cadáver/revelação

### Implementado

- Bloqueio real das áreas em `arena.js`.
- Mensagem de bloqueio indicando Boss + Lore.
- Bosses não exigem mais amuleto para serem enfrentados.
- Interface do Boss diferencia proteção equipada de combate sem proteção.
- Guarda Real registra `map5_boss_defeat`.
- Cadáver não pode mais iniciar a revelação antes da derrota da Guarda Real.
- Evento do Boss do Abismo foi registrado no capítulo narrativo.

### Validação pendente

A lógica foi aplicada no código, mas ainda falta o **teste jogável completo no navegador** para confirmar cada transição e estado persistido. Isso fica para a Etapa 12.

---

## Etapa 2 — Auditoria visual geral

Objetivo: avaliar a campanha inteira como experiência visual, não apenas verificar se os elementos existem.

- [x] Revisar Floresta Sombria.
- [x] Revisar Acampamento Orc.
- [x] Revisar Deserto Perdido.
- [x] Revisar Covil dos Dragões.
- [x] Revisar Abismo Demoníaco.
- [x] Revisar Grande Revelação.
- [x] Revisar Mirror Match.
- [x] Revisar Segundo Impacto.
- [x] Identificar elementos visualmente fracos, genéricos ou pouco integrados.
- [x] Identificar excesso de caixas, bordas, textos ou elementos de interface.
- [x] Identificar oportunidades de iluminação, partículas, profundidade, contraste, camadas e ambientação.
- [x] Separar melhorias de alto impacto das melhorias cosméticas.
- [x] **Nesta etapa apenas diagnosticar; não sair alterando vários arquivos.**

## Resultado da Etapa 2 — Auditoria visual geral

**Auditoria concluída sem alteração de gameplay ou da arquitetura visual nesta etapa.**

### Diagnóstico geral

A campanha já possui identidade visual própria, mas a apresentação ainda está mais próxima de uma **interface narrativa estilizada** do que de uma experiência visual de RPG. O principal problema não é falta de elementos: é **falta de profundidade, escala e integração entre ambientação, combate e narrativa**.

O padrão se repete em quase todas as regiões: painel escuro + borda + pequenos cards de texto + uma ilustração CSS central. Isso deixa as áreas legíveis, mas visualmente parecidas entre si.

### Pontos fortes encontrados

- Identidade consistente de Cinzel + Inter, tons escuros e dourados.
- Cada capítulo possui nomenclatura e marca visual própria.
- Floresta, Orcs, Deserto, Dragões e Abismo já possuem composição específica.
- Grande Revelação e Segundo Impacto possuem linguagem visual mais cinematográfica que as primeiras áreas.
- Não foi identificado, nesta leitura, necessidade de trocar a arquitetura existente ou adicionar dependências externas.
- As cenas estão isoladas em arquivos próprios, permitindo polimento regional sem mexer no núcleo de combate.

### Problemas prioritários

#### P1 — Ambientação ainda muito abstrata

As principais cenas são construídas quase exclusivamente com CSS: silhuetas, gradientes, bordas, formas geométricas e pequenos elementos animados.

Isso funciona como conceito visual, mas não transmite a escala de um mundo de RPG com a força esperada para uma campanha que culmina em uma revelação grande.

**Impacto:** alto.

#### P1 — As cinco regiões não parecem suficientemente diferentes

Apesar de existirem diferenças de cor e conteúdo, a estrutura visual se repete:

- cabeçalho do capítulo;
- selo lateral;
- bloco visual;
- 3 ou 4 cards;
- texto complementar;
- bloco de boss.

A sensação é de cinco variações do mesmo componente.

**Impacto:** alto.

#### P1 — Lore e combate ainda parecem dois sistemas separados

A narrativa é inserida acima do battleArea, enquanto o combate continua com a interface tradicional da Arena.

O jogador lê uma cena narrativa e logo abaixo encontra uma UI de combate bastante convencional. Falta uma transição visual forte entre os dois estados.

**Impacto:** alto.

#### P1 — Bosses ainda têm pouca presença cinematográfica

Os rótulos narrativos dos bosses são pequenos e ficam dentro da interface de batalha.

Como a nova regra tornou o Boss obrigatório para a progressão, ele passou a ser também um marco narrativo. Visualmente, porém, ainda não recebe peso proporcional a essa função.

**Impacto:** alto.

#### P2 — Tipografia narrativa está pequena demais em vários pontos

Grande parte dos textos de ambientação usa tamanhos próximos de .5rem a .7rem.

Isso mantém a interface compacta, mas reduz a sensação de cena e dificulta a leitura de frases importantes.

**Impacto:** médio.

#### P2 — Excesso de caixas e bordas

Há muitas divisões por border, pequenos painéis e cards. A estrutura fica organizada, porém o olhar encontra poucos elementos realmente dominantes.

**Impacto:** médio.

#### P2 — Grande Revelação é conceitualmente forte, mas visualmente simples

A cena já possui a comparação entre jogador e Kaelen, porém os rostos são formas geométricas em CSS.

Para o twist central da campanha, o rosto é o elemento que deveria receber maior atenção visual.

**Impacto:** alto.

#### P2 — Mirror Match ainda não entrega visualmente o conceito de espelho

A camada atual comunica Kaelen por cor, brilho e texto. O próprio arquivo descreve o espelhamento, mas a composição visual ainda não mostra claramente que ele é uma duplicação do jogador.

**Impacto:** alto.

#### P2 — Segundo Impacto é a cena visualmente mais ambiciosa, mas ainda abstrata

A composição com Titãs, tubos, Arena, correntes e controles já é melhor integrada.

Mesmo assim, tudo é representado por formas geométricas CSS. A ideia é clara, mas ainda falta sensação de escala e de acontecimento.

**Impacto:** médio/alto.

### O que NÃO será feito automaticamente

Nesta etapa não serão feitas mudanças indiscriminadas em todos os arquivos CSS.

O diagnóstico indica que o próximo ganho relevante virá de **polimento por região**, exatamente como previsto na Etapa 3.

A ordem recomendada permanece:

1. Floresta Sombria — criar profundidade e sensação de floresta viva/morta.
2. Acampamento Orc — reforçar escala defensiva, portão e identidade dos defensores.
3. Deserto Perdido — reforçar calor, ruína, vidro e profundidade vertical.
4. Covil dos Dragões — reforçar escala dos dragões, correntes e maquinaria.
5. Abismo Demoníaco — transformar a catedral e o trono em uma cena de maior peso.
6. Grande Revelação — dar prioridade visual aos dois rostos e à entrada de Kaelen.
7. Mirror Match — tornar o espelhamento visível, não apenas textual.
8. Segundo Impacto — aumentar sensação de escala sem perder a ambiguidade.

### Decisão da Etapa 2

A principal conclusão é:

> **Não precisamos de mais elementos. Precisamos de elementos mais fortes.**

Portanto, a Etapa 3 deve priorizar **composição, escala, iluminação, profundidade, contraste e hierarquia visual**, reduzindo a dependência de pequenos cards e textos como mecanismo principal de ambientação.

Não foi alterado nesta etapa:

- combate;
- progressão;
- XP;
- ranking;
- renderer de sprites;
- arena-sobreviva.html;
- movimentação;
- arquitetura geral da Arena.
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
