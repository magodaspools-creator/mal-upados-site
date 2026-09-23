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

1. [x] Floresta Sombria
2. [x] Acampamento Orc
3. [x] Deserto Perdido
4. [x] Covil dos Dragões
5. [x] Abismo Demoníaco
6. [x] Grande Revelação
7. [x] Mirror Match
8. [x] Segundo Impacto

Para cada região:

- [ ] Melhorar composição visual.
- [ ] Melhorar hierarquia dos elementos.
- [ ] Melhorar ambientação.
- [ ] Melhorar transições/animações quando fizer sentido.
- [ ] Evitar adicionar dependências externas desnecessárias.
- [ ] Validar a região antes de passar para a próxima.

## Resultado da Etapa 3 — Polimento visual por região

**Polimento aplicado de forma controlada nas oito regiões/cenas previstas.**

### Alterações realizadas

- **Floresta Sombria:** maior profundidade de fundo, iluminação ambiental, partículas discretas, hierarquia tipográfica e cartões menos planos.
- **Acampamento Orc:** reforço de escala do cenário, textura visual do acampamento/portão, contraste e presença das estruturas defensivas.
- **Deserto Perdido:** aumento da área visual da cidade/ruínas, iluminação quente e maior profundidade no cenário.
- **Covil dos Dragões:** aumento da escala da fornalha/covil, atmosfera de maquinaria e contraste das estruturas.
- **Abismo Demoníaco:** aumento da escala da catedral e da sala do trono, iluminação central e maior sensação de profundidade.
- **Grande Revelação:** maior destaque para a cena central e para os rostos do jogador e de Kaelen.
- **Mirror Match:** maior identidade visual de espelho e reforço do contraste do combatente de Kaelen.
- **Segundo Impacto:** aumento de escala da memória/fresco, Titãs e elementos centrais do impacto.

### Validação estrutural

O backup criado antes das alterações é `backup/pre-etapa-3-visual-2026-09-23`.

O diff desde esse backup contém somente oito arquivos CSS da camada narrativa:

- `arena-floresta.css`
- `arena-orcs.css`
- `arena-deserto.css`
- `arena-dragoes.css`
- `arena-abismo.css`
- `arena-revelacao.css`
- `arena-mirror.css`
- `arena-segundo-impacto.css`

Nenhum arquivo de combate, progressão, XP, ranking, renderer ou Sobreviva foi alterado.

### Limitação da validação

A validação desta etapa foi estrutural via GitHub. Ainda não houve teste visual real no navegador nesta etapa. O teste jogável completo permanece programado para a Etapa 12.
## Etapa 4 — Foreshadowing mínimo

- [x] Revisar as pistas de Kaelen.
- [x] Revisar as correntes e símbolos.
- [x] Revisar elementos do Abismo.
- [x] Verificar se existem pistas suficientes antes da revelação.
- [x] Garantir que nenhuma pista entregue explicitamente o twist.
- [x] Adicionar somente pistas de alto valor narrativo.
- [ ] Validar primeira jogada e rejogabilidade.

### Resultado da Etapa 4 — Foreshadowing mínimo

**Auditoria e implementação concluídas.**

A campanha já possuía pistas fortes antes da revelação — especialmente a ausência da sombra de Kaelen, os dois lados do Sol Partido, as correntes dos dragões, a marca de Kaelen e o luto do Abismo. Em vez de aumentar a quantidade de texto, foi criada uma única linha de foreshadowing recorrente: **um símbolo de coroa/selo atravessado pela mesma rachadura**, reaparecendo discretamente nos quatro primeiros domínios.

### Pistas adicionadas

- **Floresta:** selo quase apagado entre as raízes; o jogador ainda não reconhece o símbolo.
- **Orcs:** a mesma rachadura aparece em uma pedra junto ao portão.
- **Deserto:** fragmento de selo preservado sob a areia.
- **Dragões:** a mesma marca aparece na âncora de uma corrente.
- **Abismo:** nenhuma nova pista explícita foi adicionada; a arquitetura perfeita e a Guarda Real já cumprem a função de preparar a revelação sem entregar a identidade do corpo.

### Regra narrativa preservada

A pista recorrente **não diz que o jogador é o Soberano, não identifica Kaelen como a outra metade e não revela o rosto do cadáver**.

Ela só estabelece, em retrospecto, que os cinco domínios compartilham uma autoridade antiga e que existe uma conexão entre a coroa, o Cisma e as estruturas encontradas ao longo da campanha.

Isso mantém a revelação dependente da cena do trono, em vez de transformar o foreshadowing em spoiler.

### Escopo

Alterados somente:
- `arena-floresta.js`
- `arena-orcs.js`
- `arena-deserto.js`
- `arena-dragoes.js`
- `arena-narrative.js`

Não alterados:
- combate;
- progressão;
- XP;
- ranking;
- renderer;
- `arena-sobreviva.html`;
- Mirror Match;
- Segundo Impacto.

### Validação pendente

A estrutura foi revisada via GitHub. Ainda falta observar a pista durante uma primeira jogada e, depois da revelação, verificar se ela ganha significado retrospectivo sem parecer óbvia demais. Isso permanece programado para as etapas de teste narrativo/rejogabilidade.
## Etapa 5 — Grande Revelação

- [x] Revisar a cena do cadáver.
- [x] Verificar se o rosto do jogador recebe atenção visual suficiente.
- [x] Verificar entrada de Kaelen.
- [x] Verificar remoção do capacete.
- [x] Verificar comparação visual entre os dois rostos.
- [x] Avaliar a quantidade de elementos da interface durante a revelação.
- [x] **Não reduzir a interface automaticamente:** primeiro avaliar se ela realmente está excessiva.
- [x] Se houver excesso, criar apenas uma redução temporária e controlada.
- [x] Validar a cena estruturalmente antes de avançar.

### Resultado da Etapa 5 — Grande Revelação

**Polimento aplicado sem alterar a lógica do combate ou da progressão.**

A cena já possuía os elementos narrativos corretos: cadáver, rosto do jogador, Kaelen, remoção do capacete e explicação do Cisma. O problema principal era a apresentação: a revelação acontecia de forma imediata e os dois rostos não tinham peso visual proporcional à importância do twist.

### Alterações realizadas

- A revelação agora entra em uma composição mais cinematográfica, com maior escala e espaço visual.
- O rosto do jogador e o rosto de Kaelen recebem mais destaque e contraste.
- A composição ganhou uma separação central sutil para reforçar visualmente a ideia de duas metades.
- O capacete de Kaelen recebe uma camada visual própria antes do rosto aparecer.
- A cena utiliza uma entrada controlada: os elementos começam discretamente afastados/escurecidos e entram em foco.
- O texto explicativo permanece presente, mas abaixo da cena principal, evitando que a explicação roube o impacto visual.
- A interface geral **não foi removida**; apenas a própria cena recebeu hierarquia visual maior.
- O layout mobile existente foi preservado.

### Regra narrativa preservada

A revelação continua dependendo de:
1. entrada no Abismo;
2. sala do trono;
3. derrota da Guarda Real;
4. interação com o cadáver.

O conteúdo da revelação não foi alterado. Continuam sendo estabelecidos:
- o rosto do jogador no cadáver;
- Kaelen como o outro rosto;
- a alma do Soberano dividida em duas partes;
- Kaelen como Ambição e Culpa;
- o próximo confronto como espelho do jogador.

### Escopo

Alterados somente:
- `arena-revelacao.js`
- `arena-revelacao.css`

Não alterados:
- combate;
- progressão;
- XP;
- ranking;
- renderer;
- `arena-sobreviva.html`;
- Mirror Match;
- Segundo Impacto.

### Validação pendente

A estrutura e o diff foram revisados via GitHub. Ainda falta executar a cena no navegador para verificar o timing real da entrada, a leitura dos rostos e o comportamento em desktop/mobile. Isso permanece dentro da validação jogável das etapas posteriores.

## Etapa 6 — Mirror Match

- [ ] Verificar se Kaelen realmente parece um espelho do jogador.
- [ ] Melhorar sinais visuais de ações equivalentes.
- [ ] Avaliar timing das ações espelhadas.
- [ ] Reforçar a identidade visual de Kaelen sem criar outro sistema de combate.
- [ ] Garantir que o combate continue usando o sistema existente.
- [ ] Validar vitória, derrota e absorção.

## Resultado da Etapa 6 — Mirror Match

**Polimento aplicado mantendo o sistema de combate existente.**

### Alterações realizadas

- O duelo agora usa uma composição visual explicitamente espelhada: jogador e Kaelen em painéis simétricos com um eixo central VS.
- Os dois combatentes recebem identidades visuais opostas, mantendo a leitura de que são duas metades do mesmo ser.
- Os ícones dos dois lados usam transformação horizontal para reforçar a linguagem de reflexo.
- O lado do jogador recebe a marca **VOCÊ** e o lado de Kaelen recebe **SEU ESPELHO**.
- O golpe agora possui um pulso visual sincronizado: primeiro o jogador reage e, em seguida, Kaelen responde visualmente, acompanhando o ritmo do combate já existente.
- O combate continua sem fuga e continua usando `ArenaCombat.startMirror()`, `attack()`, `winMirrorBattle()` e `loseMirrorBattle()`.
- O HP e ATK continuam derivados dos mesmos valores do jogador; nenhuma nova regra de dano foi criada.
- O layout mobile foi preservado com uma versão compacta da composição espelhada.

### Regra narrativa preservada

O objetivo é mostrar visualmente que Kaelen não é apenas um chefe com poderes parecidos: ele é o reflexo do protagonista.

Não foram adicionados poderes, fases, cooldowns ou sistemas paralelos. A mudança é de apresentação e sincronização visual.

### Escopo

Alterados somente:
- `arena-mirror.js`
- `arena-mirror.css`
- `arena.js`

O `arena.js` recebeu apenas o disparo do pulso visual após a resolução normal de um ataque no Mirror Match.

Não alterados:
- progressão;
- XP;
- ranking;
- renderer de sprites;
- `arena-sobreviva.html`;
- sistema de combate geral;
- Segundo Impacto.

### Backup

Criado antes da etapa:
- `backup/pre-etapa-6-mirror-2026-09-23`

### Validação pendente

A estrutura foi revisada via GitHub. Ainda falta testar no navegador:
- entrada no Mirror Match;
- composição dos dois lados;
- animação do golpe e resposta espelhada;
- vitória;
- derrota;
- retry;
- absorção de Kaelen;
- comportamento em mobile.

Isso permanece dentro da validação jogável das etapas posteriores.

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

## Resultado da Etapa 7 — Segundo Impacto

**Polimento aplicado sem alterar a escolha final nem criar interação adicional.**

### Alterações realizadas

- A entrada em primeira pessoa recebeu maior sensação de profundidade, com iluminação central e vinheta preservando o foco no campo de memória.
- O afresco foi ampliado visualmente para dar mais peso à relação **Arena → Titãs → drenagem de energia**.
- Titãs, tubos, fluxos de energia e o núcleo da Arena receberam mais contraste e escala.
- A representação do mundo ganhou um segundo anel interno sutil, reforçando a ideia de uma estrutura artificial sustentada por energia externa.
- A memória agora aparece em uma sequência visual: afresco → explicação da memória → controles/correntes → opções → frase de encerramento.
- As correntes e o eixo central continuam pulsando, mas agora funcionam como parte da composição final em vez de simples decoração.
- As duas opções continuam explicitamente **não clicáveis**.
- A ambiguidade permanece: o jogo apresenta as duas consequências sem selecionar uma delas pelo jogador.
- A frase final recebeu uma separação visual própria para funcionar como fechamento da cena.

### Regra narrativa preservada

O Segundo Impacto continua revelando que:
- a Arena é sustentada pela drenagem de energia de Titãs de outras dimensões;
- Kaelen conhecia essa verdade;
- o protagonista precisa encarar duas consequências incompatíveis;
- nenhuma escolha é registrada como decisão do jogador;
- o final permanece ambíguo e trágico.

Não foi criado sistema de escolha, final alternativo, pontuação ou nova mecânica.

### Escopo

Alterados somente:
- `arena-segundo-impacto.js`
- `arena-segundo-impacto.css`
- `PLANO_POLIMENTO_FINAL_LORE.md`

Não alterados:
- combate;
- progressão;
- XP;
- ranking;
- renderer;
- `arena-sobreviva.html`;
- Mirror Match;
- regras da escolha final.

### Backup

Criado antes da etapa:
- `backup/pre-etapa-7-segundo-impacto-2026-09-23`

### Validação pendente

A estrutura foi revisada via GitHub. Ainda falta testar no navegador:
- entrada no Trono;
- sequência visual das memórias;
- leitura dos Titãs e da drenagem;
- correntes/engrenagens;
- apresentação das duas opções;
- fechamento da cena;
- comportamento em mobile.

Isso permanece dentro da validação jogável das etapas posteriores.

## Etapa 8 — Transições e ritmo

- [x] Revisar passagem entre cada capítulo.
- [x] Verificar se existem saltos bruscos de uma região para outra.
- [x] Adicionar transições somente onde realmente melhorarem o ritmo.
- [x] Evitar telas de carregamento ou bloqueios artificiais.
- [x] Garantir que o gameplay continue fluido.

### Resultado da Etapa 8 — Transições e ritmo

**Transições leves aplicadas somente na troca real de capítulo/área.**

### O que entrou

- Ao trocar de área, a Arena agora apresenta uma identificação curta de capítulo e nome da região.
- A transição usa uma camada visual sobre o painel da aventura, sem navegação, carregamento ou espera artificial.
- O conteúdo de batalha recebe uma entrada curta para suavizar a troca do cenário.
- A transição é disparada somente quando a área anterior e a nova área são diferentes; a carga inicial da Arena não recebe a animação.
- A camada possui pointer-events: none, portanto não intercepta cliques nem bloqueia o gameplay.
- Existe tratamento para prefers-reduced-motion.
- O cache dos dois assets globais foi atualizado no arena.html.

### Escopo

Alterados somente:
- arena.js
- arena-lore-visuals.js
- arena-lore-visuals.css
- arena.html
- PLANO_POLIMENTO_FINAL_LORE.md

Não alterados:
- combate;
- progressão;
- XP;
- ranking;
- renderer de sprites;
- arena-sobreviva.html;
- regras do Mirror Match;
- Segundo Impacto.

### Validação estrutural

Foi criado o backup:
- backup/pre-etapa-8-transicoes-2026-09-23

A validação final de timing e aparência no navegador permanece pendente para a Etapa 12.

## Etapa 9 — Fragmentos e progressão narrativa

- [x] Revisar apresentação dos quatro fragmentos.
- [x] Verificar sequência Floresta → Orcs → Deserto → Dragões.
- [x] Avaliar se o jogador entende que está reunindo partes de uma memória.
- [x] Melhorar feedback visual quando um fragmento é absorvido.
- [x] Não transformar isso em um sistema invasivo de HUD.

### Resultado da Etapa 9 — Fragmentos e progressão narrativa

**Os quatro fragmentos agora possuem uma sequência narrativa explícita e um feedback visual discreto.**

### Sequência consolidada

1. **Floresta — primeiro fragmento:** map1_fragment
2. **Orcs — segundo fragmento:** map2_fragment
3. **Deserto — terceiro fragmento:** map3_fragment
4. **Dragões — quarto fragmento:** map4_fragment

Cada fragmento continua sendo concedido pela derrota do Boss correspondente. A progressão dos mapas permanece baseada nos eventos de lore já existentes; nenhum requisito de nível, XP ou combate foi alterado.

### Feedback visual

- Foi criado um indicador discreto **MEMÓRIA · X / 4**.
- O indicador mostra quatro fragmentos como pequenos selos visuais, sem ocupar a interface principal.
- Quando um fragmento é absorvido, o indicador recebe um pulso curto para comunicar a conquista.
- Ao completar os quatro fragmentos, o indicador assume um estado visual de conclusão.
- O indicador não captura cliques e não interfere no gameplay.
- O sistema respeita prefers-reduced-motion.

### Estado narrativo

Foram registrados eventos e pistas específicos para os quatro fragmentos:
- map1_fragment / map1_first_fragment
- map2_fragment / map2_second_fragment
- map3_fragment / map3_third_fragment
- map4_fragment / map4_fourth_fragment

A contagem continua centralizada em ArenaNarrative.fragments, evitando um segundo contador paralelo.

### Escopo

Alterados somente:
- arena-narrative.js
- arena-orcs.js
- arena-deserto.js
- arena-dragoes.js
- arena-lore-visuals.js
- arena-lore-visuals.css
- arena.html
- PLANO_POLIMENTO_FINAL_LORE.md

Não alterados:
- arena-floresta.js;
- combate;
- XP;
- ranking;
- renderer de sprites;
- arena-sobreviva.html;
- Mirror Match;
- Segundo Impacto.

### Backup

Criado antes da etapa:
- backup/pre-etapa-9-fragmentos-2026-09-23

### Validação estrutural

O diff da etapa será comparado com o backup antes de considerar a etapa fechada. A validação visual/jogável completa permanece programada para a Etapa 12.

## Etapa 10 — Auditoria de consistência textual

- [x] Procurar termos antigos que contradigam a lore.
- [x] Procurar referências incompatíveis com a identidade do protagonista.
- [x] Revisar uso de Soberano, Cisma, Kaelen, Inocência, Ambição, Culpa, Abismo, Trono e Generais.
- [x] Procurar textos duplicados ou contraditórios.
- [x] Procurar mensagens de debug esquecidas.
- [x] Procurar textos provisórios.
- [x] Revisar pontuação e acentuação.
- [x] Não alterar textos narrativos sem validar o contexto.

### Resultado da Etapa 10 — Auditoria de consistência textual

**Auditoria concluída com correções pontuais, sem alterar a estrutura narrativa.**

### Correções aplicadas

- **General da Vida:** corrigido o uso indevido do plural na Floresta; o domínio possui um General da Vida.
- **Inocência / Ambição / Culpa:** a Grande Revelação agora descreve explicitamente a alma como duas metades, evitando a construção ambígua “a Ambição e a Culpa”.
- **Kaelen:** removida do documento de lore a descrição de sua existência como “projeção esquizofrênica”; a formulação foi alinhada à ideia de uma manifestação ligada à própria alma.
- **Segundo Impacto:** o documento deixou de afirmar um desfecho já escolhido pelo jogador. A implementação atual apresenta duas consequências e mantém ambas não clicáveis, portanto o texto de referência agora preserva essa ambiguidade.
- **Soberano:** a descrição inicial foi ajustada para distinguir a percepção histórica de benevolência da verdade revelada posteriormente.
- **Elias:** a formulação sobre sua condição foi suavizada e alinhada ao papel de testemunha perturbada da verdade, sem transformar saúde mental em explicação narrativa.

### Termos consolidados

A terminologia central permanece:

- **Soberano**
- **O Cisma**
- **Kaelen**
- **Inocência**
- **Ambição**
- **Culpa**
- **Abismo**
- **Trono**
- **Generais**
- **Guarda Real**

### Regra preservada

A auditoria não reescreveu a campanha nem alterou eventos, combate, progressão ou interpretação do twist. Foram corrigidas somente inconsistências textuais objetivas e formulações que contradiziam o estado atual da implementação.

### Escopo

Alterados somente:
- `arena-floresta.js`
- `arena-revelacao.js`
- `LORE_ARENA_O_CISMA_DO_SOBERANO.md`
- `PLANO_POLIMENTO_FINAL_LORE.md`

Backup criado antes da etapa:
- `backup/pre-etapa-10-consistencia-2026-09-23`

### Validação estrutural

O conteúdo foi revisado diretamente nos arquivos atuais do repositório e as correções foram limitadas aos trechos identificados na auditoria. A validação visual/jogável continua pendente para a Etapa 12.
## Etapa 11 — Auditoria técnica de integração

- [x] Verificar listeners duplicados.
- [x] Verificar MutationObservers duplicados.
- [x] Verificar intervals/timers que possam ser registrados várias vezes.
- [x] Verificar eventos narrativos duplicados.
- [x] Verificar chamadas de renderização desnecessárias.
- [x] Verificar dependências entre arquivos.
- [x] Verificar se cada camada é carregada somente onde precisa.
- [x] Verificar se nenhuma etapa interfere no Sobreviva.

### Resultado da Etapa 11 — Auditoria técnica de integração

**Auditoria concluída com uma correção funcional pontual.**

### Achado corrigido

O evento `arena:fragment-earned` é emitido pelo `arena-narrative.js` em `window`, mas o feedback visual dos fragmentos estava escutando esse evento em `document`. Como o evento não fazia bubbling de `window` para `document`, o contador podia atualizar, mas o pulso visual de fragmento não era garantido.

Correção aplicada:
- `arena-lore-visuals.js` agora usa `window.addEventListener('arena:fragment-earned', ...)`.

### Auditoria das camadas

- Os scripts narrativos aparecem uma única vez no `arena.html`; não foram encontrados carregamentos duplicados das camadas da lore.
- Os `MutationObserver` estão associados às respectivas camadas/zonas e não há registro duplicado dentro de uma mesma inicialização.
- Os `setInterval` existentes são usados como polling de integração porque o estado de combate/progressão é alterado por outras camadas. Eles permanecem isolados por arquivo e não criam novos intervalos a cada renderização.
- Os hooks de vitória relevantes possuem flags de instalação para evitar wrapping repetido de `winBattle`.
- Os eventos de lore principais permanecem centralizados em `ArenaNarrative`; a auditoria não encontrou um segundo contador independente de fragmentos.
- O Mirror Match e o Segundo Impacto usam eventos próprios para sincronizar as transições entre camadas.
- Não foi identificado carregamento da camada narrativa dentro de `arena-sobreviva.html`.

### Dependências confirmadas

Fluxo principal:

`ArenaNarrative` → cenas/zonas → Bosses → fragmentos → Grande Revelação → Mirror Match → Absorção → Segundo Impacto → Rejogabilidade.

As dependências continuam unidirecionais o suficiente para manter as camadas separadas, sem refatoração estrutural.

### Escopo

Alterados somente:
- `arena-lore-visuals.js`
- `PLANO_POLIMENTO_FINAL_LORE.md`

Backup criado antes da etapa:
- `backup/pre-etapa-11-integracao-2026-09-23`

### Limitação da validação

A auditoria foi estrutural via GitHub. Ainda não houve execução real no navegador nem inspeção do console em uma campanha completa. Isso permanece como objetivo da Etapa 12.
## Etapa 12 — Teste narrativo completo

### Resultado da Etapa 12 — Teste estrutural completo

**Teste estrutural concluído e fluxo narrativo auditado ponta a ponta via código e estado do repositório.**

### Fluxo validado

- [x] **Mapa 1 → Mapa 2:** `map1_fragment` é concedido pelo Boss da Floresta e é o requisito narrativo do Mapa 2.
- [x] **Mapa 2 → Mapa 3:** `map2_gate_open` é concedido pela derrota do Boss Orc e libera o Deserto.
- [x] **Mapa 3 → Mapa 4:** `map3_flashback` é concluído após a derrota do General da Magia e libera o Covil dos Dragões.
- [x] **Mapa 4 → Mapa 5:** `map4_descent` é concluído após a derrota do General das Feras e libera o Abismo.
- [x] **Cadáver → Revelação:** `map5_boss_defeat` + `map5_throne_room` são obrigatórios antes de `finale_kaelen_reveal`.
- [x] **Revelação → Mirror Match:** `finale_kaelen_reveal` libera o confronto com Kaelen.
- [x] **Mirror Match → Absorção:** `arena:mirror-defeated` libera a absorção; `finale_absorption` é registrado somente pelo botão de absorção.
- [x] **Absorção → Segundo Impacto:** `arena:mirror-absorbed` aciona a cena do Trono; `finale_second_impact` é concluído após a entrada na cena.
- [x] **Segundo Impacto → Rejogabilidade:** `finale_second_impact` é o gate único da camada de releitura.

### Verificações técnicas

- [x] Os cinco hooks de Boss verificam `battle.isBoss` e o `battle.zoneIndex` correto antes de registrar progresso narrativo.
- [x] Cada fragmento é concedido uma única vez pelo Boss correspondente.
- [x] A progressão de mapas continua exigindo nível mínimo **e** evento narrativo.
- [x] O amuleto elemental não bloqueia mais o Boss; quando presente, fornece apenas proteção.
- [x] A Grande Revelação não pode ser acionada antes da Guarda Real.
- [x] O Mirror Match não inicia antes da revelação.
- [x] As escolhas do Segundo Impacto continuam não interativas.
- [x] A camada de Rejogabilidade só aparece depois do final.

### Resultado dos deploys

O último deploy do `main` analisado corresponde ao commit `4d2151d615aee17365f26e8aab49a5edf8d99e2a`.

- GitHub Pages **build:** sucesso.
- GitHub Pages **deploy:** sucesso.
- **report-build-status:** sucesso.

### Limitação importante

A execução acima é uma validação estrutural ponta a ponta, não um playthrough real em navegador. O ambiente disponível nesta etapa não fornece automação de navegador/console para clicar pela campanha e observar cada transição visual em runtime.

Portanto, ficam pendentes apenas:
- [ ] Playthrough manual no navegador.
- [ ] Conferência visual/console em desktop.
- [ ] Conferência visual/console em mobile.

Não foi feita alteração de gameplay durante esta etapa.

### Backup

Criado antes do teste:
- `backup/pre-etapa-12-teste-completo-2026-09-23`

### Escopo

Durante o teste, nenhum arquivo funcional da lore foi alterado. A única alteração desta etapa é o registro deste resultado no plano.

## Etapa 13 — Rejogabilidade

### Resultado da Etapa 13

A camada de rejogabilidade foi revisada para funcionar estritamente como uma **segunda leitura da campanha**, sem alterar a primeira jogada.

- [x] **Pistas retroativas só aparecem depois do final:** `finale_second_impact` continua sendo o gate único.
- [x] **Cinco regiões revisadas:** Floresta, Orcs, Deserto, Dragões e Abismo possuem uma leitura retroativa própria.
- [x] **Interpretação sem reescrita:** as pistas reinterpretam elementos já apresentados — estátuas, defesa Orc, Elias, correntes e Guarda Real — em vez de criar uma nova história paralela.
- [x] **Primeira jogada preservada:** antes de `finale_second_impact`, nenhum painel retroativo ou diálogo pós-memória é inserido.
- [x] **Proteção contra seleção inválida:** a camada agora ignora zonas inexistentes ou sem seleção válida, evitando associação acidental com a Floresta.
- [x] **Apresentação:** painel retroativo recebeu acabamento visual discreto e suporte a `prefers-reduced-motion`.

### Leituras retroativas confirmadas

1. **Floresta:** as estátuas e a sombra ausente passam a apontar para a divisão da alma.
2. **Acampamento Orc:** a linha defensiva e o Sol Partido passam a representar a divisão do Soberano.
3. **Deserto:** a destruição interna e as memórias de Elias passam a apontar para o crime oculto do próprio reino.
4. **Covil dos Dragões:** as correntes e o brasão de Kaelen passam a representar a manutenção brutal do mundo após o desaparecimento do Soberano.
5. **Abismo:** a Guarda Real e o silêncio da catedral passam a ser entendidos como espera pelo retorno do próprio Soberano.

### Validação

- Backup: `backup/pre-etapa-13-rejogabilidade-2026-09-23`
- Compare com o backup: **2 commits à frente, 0 atrás**.
- Arquivos alterados: somente `arena-rejogabilidade.js` e `arena-rejogabilidade.css`.
- Não houve alteração em combate, progressão, XP, ranking, movimentação, sprites ou `arena-sobreviva.html`.
- Validação estrutural concluída; playthrough visual manual continua reservado para a etapa de fechamento.

## Etapa 14 — Fechamento

### Resultado da Etapa 14

- [x] **Backup final criado:** `backup/pre-etapa-14-fechamento-2026-09-23`, a partir do commit `9708a3bbe3395d8a425f3351c8b393bed89d7ffa`.
- [x] **Diff completo revisado:** comparação entre `backup/pre-progressao-boss-2026-09-23` e `main` mostrou 58 commits e somente arquivos pertencentes à implementação/polimento da lore.
- [x] **Arquivos fora do escopo:** nenhum arquivo de `arena-sobreviva.html`, renderer de sprites, XP, ranking ou movimentação apareceu no diff completo.
- [x] **`arena-sobreviva.html` permanece intacto** dentro do período auditado.
- [x] **GitHub Actions / Pages:** run #1352, commit `9708a3bbe3395d8a425f3351c8b393bed89d7ffa`, terminou com sucesso. Build, deploy e report-build-status concluíram com sucesso.
- [ ] **Teste final no navegador:** permanece pendente. O ambiente atual não fornece automação de navegador/console para executar o playthrough completo em desktop e mobile.
- [ ] **Congelamento definitivo:** fica condicionado somente ao playthrough manual final.

### Estado de fechamento

A auditoria estrutural está concluída e o código da lore está estável no GitHub Pages. Não foi encontrado desvio de escopo no diff completo nem falha no pipeline de publicação.

A única pendência real é a validação visual/runtime manual: percorrer a campanha do primeiro mapa ao Segundo Impacto, conferindo console, transições e responsividade em desktop e mobile.

Até essa conferência, **não serão feitas novas alterações de lore** sem uma nova etapa explícita.

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
