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
- [x] Remover a integração indevida do `arena-sobreviva.html`).
- [x] Não alterar combate/movimento.

## Fase 2 — Elementos visuais globais
- [ ] Identidade visual da campanha.
- [ ] Brasão/Sol Partido.
- [ ] Fragmentos dourados.
- [ ] Elementos de Kaelen.
- [ ] Indicadores visuais de corrupção.
- [ ] Elementos reutilizáveis para estátuas, portões, correntes e símbolos.
- [ ] Validar cada asset individualmente antes de integrar.

## Fase 3 — NPCs
### Kaelen
- [ ] Entrada inicial.
- [ ] Aparições controladas.
- [ ] Falas por mapa.
- [ ] Mudança gradual de comportamento.
- [ ] Eventos de frustração/agressividade.
- [ ] Preparação para revelação final.

### Vara
- [ ] NPC não hostil.
- [ ] Sistema de diálogo.
- [ ] Falas enigmáticas.
- [ ] Reação de Kaelen.

### Elias
- [ ] NPC do Deserto.
- [ ] Diálogos condicionais.
- [ ] Falas que apontam para a verdade sem revelá-la diretamente.

## Fase 4 — Mapa 1: Floresta Sombria
- [ ] Atmosfera de sofrimento.
- [ ] Estátuas voltadas para fora.
- [ ] Lagos/reflexos.
- [ ] Ausência da sombra de Kaelen.
- [ ] Entrada de Kaelen.
- [ ] Diálogos iniciais.
- [ ] Chefe com comportamento defensivo.
- [ ] Frase "Meu Rei...".
- [ ] Fragmento dourado.
- [ ] Abertura das raízes.
- [ ] Validar mapa inteiro antes de prosseguir.

## Fase 5 — Mapa 2: Acampamento Orc
- [ ] Arquitetura defensiva.
- [ ] Formações/táticas dos Orcs.
- [ ] Estandartes do Sol Partido.
- [ ] Portão colossal.
- [ ] Vara.
- [ ] Diálogo "duas sombras".
- [ ] Reação de Kaelen.
- [ ] Chefe ajoelhando diante do portão.
- [ ] "Perdoe-nos, Majestade."
- [ ] Transição para o Deserto.

## Fase 6 — Mapa 3: Deserto Perdido
- [ ] Cidade invertida.
- [ ] Vidro/areia.
- [ ] Ruínas destruídas de dentro para fora.
- [ ] Elias.
- [ ] Diálogos do Arquivista.
- [ ] Chefe General da Magia.
- [ ] Terceiro fragmento.
- [ ] Flashback.
- [ ] Transição para o núcleo vulcânico.

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
- [ ] Catedral de cristal negro.
- [ ] Atmosfera silenciosa.
- [ ] Demônios/guarda real.
- [ ] Animações com comportamento melancólico.
- [ ] Arquitetura perfeita.
- [ ] Sala do Trono.
- [ ] Corpo do Soberano.
- [ ] Preparar a revelação sem explicá-la antes da hora.

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
