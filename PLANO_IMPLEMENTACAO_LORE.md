# Arena — Plano de Implementação da Lore

## Regra principal
Implementar em partes pequenas, isoladas e verificáveis. Nenhuma alteração narrativa deve exigir refatoração ampla do jogo.

## Protocolo de segurança
1. Antes de cada etapa: criar backup/branch do estado funcional.
2. Alterar somente os arquivos necessários à etapa.
3. Fazer commit com mensagem específica.
4. Validar carregamento da página, menus e gameplay existente.
5. Testar a funcionalidade nova isoladamente.
6. Só iniciar a próxima etapa depois de confirmar que a anterior não introduziu regressões.
7. Não misturar alterações de XP/ranking, sprites, combate ou sistemas não relacionados com uma etapa narrativa, salvo necessidade técnica comprovada.

## Fase 0 — Fundação narrativa
- [x] Lore salva em `LORE_ARENA_O_CISMA_DO_SOBERANO.md`.
- [x] Plano salvo em `PLANO_IMPLEMENTACAO_LORE.md`.
- [x] Definir um ponto de restauração antes de começar a implementação (`backup/pre-lore-fase-1-2026-09-23`).
- [x] Não alterar gameplay nesta fase.

## Fase 1 — Estrutura técnica de narrativa
Objetivo: criar uma camada de dados sem espalhar textos pelo código.
- [x] Criar estrutura central para capítulos/mapas em `arena-narrative.js`.
- [x] Separar IDs de diálogos da lógica de gameplay em `arena-narrative.js`.
- [x] Definir IDs estáveis para NPCs, eventos, falas, pistas e revelações.
- [x] Criar estado de progressão narrativa.
- [x] Persistir o estado narrativo isoladamente em `localStorage` (`arena_narrative_v1`).
- [x] Integrar a camada narrativa exclusivamente ao `arena.html` (Arena normal).
- [x] Remover a integração indevida do `arena-sobreviva.html`.
- [x] Não alterar combate/movimento.

## Fase 2 — Elementos visuais globais
- [x] Identidade visual da campanha.
- [x] Brasão/Sol Partido.
- [x] Fragmentos dourados.
- [x] Elementos de Kaelen.
- [x] Indicadores visuais de corrupção.
- [x] Elementos reutilizáveis para estátuas, portões, correntes e símbolos.
- [x] Validar cada asset individualmente antes de integrar.

## Fase 3 — NPCs
### Kaelen
- [x] Entrada inicial.
- [x] Aparições controladas.
- [x] Falas por mapa.
- [x] Mudança gradual de comportamento — base narrativa preparada por mapa.
- [x] Eventos de frustração/agressividade — fala do Covil dos Dragões preparada.
- [x] Preparação para revelação final — estrutura de diálogo separada do gameplay.

### Vara
- [x] NPC não hostil.
- [x] Sistema de diálogo.
- [x] Falas enigmáticas.
- [x] Reação de Kaelen — fala de desqualificação preparada.

### Elias
- [x] NPC do Deserto.
- [x] Diálogos condicionais.
- [x] Falas que apontam para a verdade sem revelá-la diretamente.

## Fase 4 — Mapa 1: Floresta Sombria
- [x] Atmosfera de sofrimento.
- [x] Estátuas voltadas para fora.
- [x] Lagos/reflexos.
- [x] Ausência da sombra de Kaelen.
- [x] Entrada de Kaelen.
- [x] Diálogos iniciais.
- [x] Chefe com comportamento defensivo.
- [x] Frase "Meu Rei..." — preparada como próximo evento do chefe; não antecipar a revelação.
- [x] Fragmento dourado.
- [x] Abertura das raízes.
- [x] Validar mapa inteiro antes de prosseguir.

## Fase 5 — Mapa 2: Acampamento Orc
- [x] Arquitetura defensiva.
- [x] Formações/táticas dos Orcs.
- [x] Estandartes do Sol Partido.
- [x] Portão colossal.
- [x] Vara.
- [x] Diálogo "duas sombras".
- [x] Reação de Kaelen.
- [x] Chefe ajoelhando diante do portão.
- [x] "Perdoe-nos, Majestade."
- [x] Transição para o Deserto.
- [x] Camada isolada em arena-orcs.js / arena-orcs.css.
- [x] Integrada somente ao arena.html.
- [x] Sem alteração em arena-sobreviva.html.
- [x] Sem substituição do renderer/combat/progressão existentes.

## Fase 6 — Mapa 3: Deserto Perdido
- [x] Cidade invertida.
- [x] Vidro/areia.
- [x] Ruínas destruídas de dentro para fora.
- [x] Elias.
- [x] Diálogos do Arquivista.
- [x] Chefe General da Magia.
- [x] Terceiro fragmento.
- [x] Flashback.
- [x] Transição para o núcleo vulcânico.
- [x] Camada isolada em arena-deserto.js / arena-deserto.css.
- [x] Integrada somente ao arena.html.
- [x] Sem alteração em arena-sobreviva.html.
- [x] Sem substituição do renderer/combat/progressão existentes.

## Fase 7 — Mapa 4: Covil dos Dragões
- [ ] Magma.
- [ ] Correntes.
- [ ] Turbinas.
- [ ] Dragões como fonte de energia.
- [ ] Brasão das correntes igual ao de Kaelen.
- [ ] Mudança de comportamento de Kaelen.
- [ ] General das Feras + Dragão Ancião.
- [ ] Revelação de que a superfície explorava os níveis inferiores.
- [ ] Queda para o Abismo.

## Fase 8 — Mapa 5: Abismo Demoníaco
- [x] Catedral de cristal negro.
- [x] Atmosfera silenciosa.
- [x] Demônios/guarda real.
- [x] Animações com comportamento melancólico.
- [x] Arquitetura perfeita.
- [x] Sala do Trono.
- [x] Corpo do Soberano.
- [x] Preparar a revelação sem explicá-la antes da hora.
- [x] Camada isolada em `arena-abismo.js` / `arena-abismo.css`.
- [x] Integrada somente ao `arena.html`.
- [x] Sem alteração em `arena-sobreviva.html`.
- [x] Sem substituição do renderer/combat/progressão existentes.

## Fase 9 — Grande revelação
- [ ] Interação com o cadáver.
- [ ] Rosto do jogador.
- [ ] Materialização física de Kaelen.
- [ ] Remoção do capacete.
- [ ] Mesmo rosto, envelhecido.
- [ ] Exposição da verdade sobre as duas metades.
- [ ] Preparar arena do Mirror Match.

## Fase 10 — Mirror Match
- [ ] Kaelen usar habilidades equivalentes às do jogador.
- [ ] Reutilizar sistemas existentes sempre que possível.
- [ ] Evitar criar um segundo sistema de combate.
- [ ] Energia sombria como camada visual.
- [ ] Derrota de Kaelen.
- [ ] Cena sem explosão clichê.
- [ ] Absorção da metade sombria.

## Fase 11 — Segundo Impacto
- [ ] Trono.
- [ ] Recuperação das memórias.
- [ ] Câmera em primeira pessoa.
- [ ] Afrescos.
- [ ] Revelação das dimensões drenadas.
- [ ] Controles do trono.
- [ ] Duas opções internas não clicáveis.
- [ ] Som de correntes/engrenagens.
- [ ] Final ambíguo e trágico.

## Fase 12 — Rejogabilidade narrativa
Depois de toda a campanha funcional:
- [ ] Adicionar pequenas pistas retroativas.
- [ ] Ajustar diálogos já existentes.
- [ ] Adicionar detalhes que só fazem sentido após o final.
- [ ] Não alterar a leitura inicial de forma que entregue o twist.

## Fase 13 — Polimento
- [ ] Revisão de todos os textos.
- [ ] Consistência de nomes.
- [ ] Consistência dos termos: Soberano, Cisma, Kaelen, Inocência, Abismo, Generais, Trono.
- [ ] Revisão de timing das falas.
- [ ] Revisão de transições.
- [ ] Revisão de sons/música.
- [ ] Teste completo do início ao final.

## Regra de ouro
A implementação deve preservar o jogo que já funciona. Se uma mudança narrativa puder ser feita por dados, eventos ou componentes isolados, não mexer no renderer, combate, XP, ranking, movimentação ou sistemas existentes.

## Ordem recomendada
Fundação → dados narrativos → visuais globais → NPCs → Floresta → Orcs → Deserto → Dragões → Abismo → revelação → Mirror Match → Segundo Impacto → rejogabilidade → polimento.
