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
