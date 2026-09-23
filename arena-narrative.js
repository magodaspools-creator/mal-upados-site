// Arena — camada central de narrativa.
// Fase 1: somente dados, estado e API. Não altera combate, renderer ou UI por conta própria.
(()=> {
  const STORAGE_KEY='arena_narrative_v1';
  const VERSION=1;

  const chapters={
    map1:{
      id:'map1', name:'Floresta Sombria', order:1,
      npcs:['kaelen'],
      events:['map1_intro','map1_boss_defeat','map1_fragment'],
      clues:['map1_statues_outward','map1_water_shadow','map1_kaelen_shadow_absent','map1_first_fragment']
    },
    map2:{
      id:'map2', name:'Acampamento Orc', order:2,
      npcs:['kaelen','vara'],
      events:['map2_kaelen_warning','map2_boss_defeat','map2_gate_open'],
      clues:['map2_broken_sun','map2_orc_defense','map2_two_shadows']
    },
    map3:{
      id:'map3', name:'Deserto Perdido', order:3,
      npcs:['kaelen','elias'],
      events:['map3_elias_encounter','map3_boss_defeat','map3_flashback'],
      clues:['map3_destruction_inside_out','map3_no_invasion_marks','map3_key_in_mind']
    },
    map4:{
      id:'map4', name:'Covil dos Dragões', order:4,
      npcs:['kaelen'],
      events:['map4_chains_reveal','map4_kaelen_break','map4_boss_defeat','map4_descent'],
      clues:['map4_dragon_turbines','map4_kaelen_crest','map4_exploitation']
    },
    map5:{
      id:'map5', name:'Abismo Demoníaco', order:5,
      npcs:['kaelen'],
      events:['map5_cathedral','map5_throne_room','map5_corpse_reveal'],
      clues:['map5_mourning_guard','map5_perfect_architecture']
    },
    finale:{
      id:'finale', name:'O Cisma do Soberano', order:6,
      npcs:['kaelen'],
      events:['finale_kaelen_reveal','finale_mirror_match','finale_absorption','finale_second_impact'],
      clues:['finale_same_face','finale_two_halves','finale_world_parasite']
    }
  };

  const npcs={
    kaelen:{id:'kaelen',name:'Kaelen',role:'guia',maps:['map1','map2','map3','map4','map5','finale']},
    vara:{id:'vara',name:'Vara',role:'xama',maps:['map2']},
    elias:{id:'elias',name:'Elias',role:'arquivista',maps:['map3']}
  };

  const dialogueIds={
    kaelen:[
      'kaelen.map1.crown',
      'kaelen.map2.dismiss_vara',
      'kaelen.map3.abyss',
      'kaelen.map4.kill_beasts',
      'kaelen.finale.excellent_sword'
    ],
    vara:['vara.map2.two_shadows'],
    elias:['elias.map3.poison_water','elias.map3.key_in_mind']
  };

  function freshState(){
    return {
      version:VERSION,
      chapter:null,
      flags:{},
      events:{},
      clues:{},
      dialogues:{},
      fragments:0,
      updatedAt:null
    };
  }

  function load(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw)return freshState();
      const parsed=JSON.parse(raw);
      if(!parsed||parsed.version!==VERSION)return freshState();
      return {
        ...freshState(),
        ...parsed,
        flags:{...(parsed.flags||{})},
        events:{...(parsed.events||{})},
        clues:{...(parsed.clues||{})},
        dialogues:{...(parsed.dialogues||{})}
      };
    }catch(error){
      console.warn('[Arena Narrative] estado inválido; usando estado limpo.',error);
      return freshState();
    }
  }

  let state=load();

  function persist(){
    state.updatedAt=new Date().toISOString();
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
    catch(error){console.warn('[Arena Narrative] não foi possível persistir o estado.',error);}
    return snapshot();
  }

  function snapshot(){
    return JSON.parse(JSON.stringify(state));
  }

  function setChapter(id){
    if(!chapters[id])return false;
    state.chapter=id;
    persist();
    return true;
  }

  function setFlag(id,value=true){
    if(!id)return false;
    state.flags[String(id)]=Boolean(value);
    persist();
    return state.flags[String(id)];
  }

  function hasFlag(id){
    return Boolean(state.flags[String(id)]);
  }

  function completeEvent(id,data=null){
    if(!id)return false;
    state.events[String(id)]={completed:true,data:data??null};
    persist();
    return true;
  }

  function hasEvent(id){
    return Boolean(state.events[String(id)]?.completed);
  }

  function discoverClue(id,data=null){
    if(!id)return false;
    state.clues[String(id)]={discovered:true,data:data??null};
    persist();
    return true;
  }

  function hasClue(id){
    return Boolean(state.clues[String(id)]?.discovered);
  }

  function registerDialogue(id,data=null){
    if(!id)return false;
    state.dialogues[String(id)]={seen:true,data:data??null};
    persist();
    return true;
  }

  function hasDialogue(id){
    return Boolean(state.dialogues[String(id)]?.seen);
  }

  function addFragment(count=1){
    const n=Math.max(0,Number(count)||0);
    state.fragments+=n;
    persist();
    return state.fragments;
  }

  function reset(){
    state=freshState();
    persist();
    return snapshot();
  }

  function getChapter(id){return chapters[id]||null;}
  function getNpc(id){return npcs[id]||null;}

  window.ArenaNarrative={
    VERSION,
    STORAGE_KEY,
    chapters,
    npcs,
    dialogueIds,
    get state(){return snapshot();},
    setChapter,
    getChapter,
    getNpc,
    setFlag,
    hasFlag,
    completeEvent,
    hasEvent,
    discoverClue,
    hasClue,
    registerDialogue,
    hasDialogue,
    addFragment,
    reset,
    save:persist
  };
})();