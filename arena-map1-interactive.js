(()=> {
if(window.__arenaMap1Interactive)return;
window.__arenaMap1Interactive=true;
const IMAGE="https://raw.githubusercontent.com/magodaspools-creator/mal-upados-site/main/MAPA%201.jpeg";
const KEY="arena_map1_interactive_v1";
const H=[
{id:"book",label:"Diário",x:15,y:80,w:10,h:10,title:"Diário do Último Vigia",text:"As últimas anotações falam de uma defesa desesperada. Os portões foram fechados para impedir que alguma coisa saísse.",clue:"map1_book_last_watch"},
{id:"box",label:"Caixa",x:18,y:78,w:5,h:5,title:"Caixa de Insígnias",text:"Dentro há um anel metálico marcado com um símbolo partido.",clue:"map1_rune_ring"},
{id:"basket",label:"Cesto",x:25,y:50,w:7,h:9,title:"Cesto de Confinamento",text:"As cordas indicam que prisioneiros eram mantidos aqui.",clue:"map1_prison_basket"},
{id:"fire",label:"Cinzas",x:35,y:65,w:11,h:9,title:"Cinzas Frias",text:"Entre as cinzas existe um fragmento de metal com uma marca de coroa partida.",clue:"map1_melted_fragment"},
{id:"skeleton",label:"Esqueleto",x:50,y:85,w:14,h:12,title:"O Soldado Caído",text:"Entre os ossos há um pingente quebrado. O símbolo não pertence ao clã do acampamento.",clue:"map1_fallen_soldier"},
{id:"altar",label:"Altar",x:50,y:45,w:11,h:11,title:"Altar da Coroa Partida",text:"O encaixe central tem o formato do anel encontrado na mesa.",clue:"map1_altar"},
{id:"door",label:"Porta",x:70,y:55,w:11,h:16,title:"Porta de Pedra",text:"A porta está selada. Existe uma ranhura em forma de símbolo no mecanismo.",clue:"map1_stone_door"},
{id:"chest",label:"Baú",x:78,y:63,w:8,h:8,title:"Baú sob a Lona",text:"O baú está parcialmente escondido pela barraca. A fechadura não cede.",clue:"map1_hidden_chest"},
{id:"tent",label:"Barraca",x:75,y:65,w:17,h:13,title:"Barraca do Comandante",text:"Restos de mapas e suprimentos foram abandonados às pressas.",clue:"map1_commander_tent"},
{id:"totem",label:"Totem",x:90,y:70,w:9,h:13,title:"Totem Rúnico",text:"As runas dizem: O portão não responde à força. Responde à memória.",clue:"map1_rune_totem"},
{id:"banner",label:"Estandarte",x:90,y:40,w:9,h:16,title:"Estandarte do Clã",text:"O símbolo do clã foi riscado sobre outro símbolo muito mais antigo.",clue:"map1_banner"},
{id:"siege",label:"Trabuco",x:85,y:35,w:11,h:11,title:"Arma de Cerco",text:"A máquina foi destruída de dentro para fora.",clue:"map1_siege_weapon"},
{id:"gates",label:"Portões",x:70,y:20,w:17,h:16,title:"Os Portões da Fortaleza",text:"O mecanismo exige uma sequência de símbolos, não uma simples chave.",clue:"map1_fortress_gate"}
];
function get(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
function seen(id){return !!get()[id]}
function mark(h){const s=get();s[h.clue]=true;localStorage.setItem(KEY,JSON.stringify(s));if(window.ArenaNarrative)window.ArenaNarrative.discoverClue(h.clue)}
function open(h){
mark(h);
const m=document.createElement("div");m.className="arena-map1-modal";
let extra="";
if(h.id==="door")extra='<div class="arena-map1-clue">O mecanismo não reage. Talvez o anel encontrado no acampamento tenha alguma utilidade.</div>';
if(h.id==="gates")extra='<div class="arena-map1-clue">O portão exige que você compreenda o ritual antes de tentar abri-lo.</div>';
m.innerHTML='<div class="arena-map1-dialog"><div class="arena-map1-kicker">EXPLORAÇÃO · MAPA 1</div><h3>'+h.title+'</h3><p>'+h.text+'</p>'+extra+'<button id="map1Close">CONTINUAR</button></div>';
document.body.appendChild(m);
const close=()=>m.remove();m.querySelector("#map1Close").onclick=close;m.onclick=e=>{if(e.target===m)close()};
}
function progress(){
const e=document.getElementById("arenaMap1Progress");if(!e)return;
e.textContent=H.filter(x=>seen(x.clue)).length+"/"+H.length+" descobertos";
}
function render(){
const map=document.getElementById("map");
if(!map||!map.querySelector('.zone.selected[data-zone="0"]'))return;
if(document.getElementById("arenaMap1Explorer"))return;
const battle=document.getElementById("battleArea");if(!battle)return;
const box=document.createElement("section");box.id="arenaMap1Explorer";box.className="arena-map1-explorer";
box.innerHTML='<div class="arena-map1-head"><div><div class="eyebrow">Floresta Sombria · Exploração</div><h3>O Acampamento Esquecido</h3><p>Investigue o cenário. Nem tudo o que importa aparece no caminho principal.</p></div><strong id="arenaMap1Progress"></strong></div><div class="arena-map1-stage"><img src="'+IMAGE+'" alt="Cenário interativo do Mapa 1"><div class="arena-map1-hotspots"></div></div><div class="arena-map1-hint">Passe o cursor pelos elementos do cenário e clique para investigar.</div>';
battle.parentNode.insertBefore(box,battle);
const layer=box.querySelector(".arena-map1-hotspots");
H.forEach(h=>{const b=document.createElement("button");b.type="button";b.className="arena-map1-hotspot"+(seen(h.clue)?" found":"");b.style.left=h.x+"%";b.style.top=h.y+"%";b.style.width=h.w+"%";b.style.height=h.h+"%";b.title=h.label;b.setAttribute("aria-label",h.label);b.onclick=()=>{open(h);b.classList.add("found");progress()};layer.appendChild(b)});
progress();
}
function refresh(){
const map=document.getElementById("map");const active=!!map?.querySelector('.zone.selected[data-zone="0"]');const box=document.getElementById("arenaMap1Explorer");
if(active&&!box)render();if(!active)box?.remove();if(box)progress();
}
function boot(){refresh();const map=document.getElementById("map");if(map)new MutationObserver(()=>setTimeout(refresh,20)).observe(map,{subtree:true,childList:true,attributes:true,attributeFilter:["class","data-zone"]});setInterval(refresh,500)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else setTimeout(boot,300);
window.ArenaMap1Interactive={render,refresh,hotspots:H};
})();