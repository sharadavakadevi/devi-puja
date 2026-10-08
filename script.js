// durga_pooja modular navigation
function openPage(path) { window.open(path, "_blank"); }
function setJsonAndOpen(jsonFile, page) {
    localStorage.setItem("jsonFile", jsonFile);
    openPage(page);
}
function sankalpam(){ openPage("../common/sankalpam.html"); }
function shodashopachara(){ openPage("../common/shodashopachara.html"); }
function lalithaSahasranama(){ openPage("../common/lalitha.html"); }
function ashtottharaShatnama(){ openPage("../devi/ashtottara.html"); }
function deviKhadgamaal(){ openPage("../common/khadgamala.html"); }
function mantraPushpam(){ openPage("../common/mantrapushpam.html"); }

function selectDevi(devi){
    localStorage.setItem("selectedDevi", devi);
    localStorage.setItem("alankaram", devi);
    window.location.href = "menu.html";
}

function suktas(){ openPage("../sukta/suktas.html"); }
function vedas(){ openPage("../veda/vedas.html"); }
function itihasas(){ openPage("../itihasa/itihasas.html"); }
function purushaSuktam(){ setJsonAndOpen("json/purushaSuktam.json","purusha.html"); }
function sriSuktam(){ setJsonAndOpen("json/sriSuktam.json","sri.html"); }
function bhuSuktam(){ setJsonAndOpen("json/bhuSuktam.json","bhu.html"); }
function manyuSuktam(){ setJsonAndOpen("json/manyuSuktam.json","manyu.html"); }
function durgaSuktam(){ setJsonAndOpen("json/durgaSuktam.json","durga.html"); }
function rigvedam(){ setJsonAndOpen("json/rigveda.json","rig.html"); }
function samavedam(){ setJsonAndOpen("json/samaveda.json","sam.html"); }
function yajurvedam(){ setJsonAndOpen("json/yajurveda.json","yajur.html"); }
function atharvavedam(){ setJsonAndOpen("json/atharvaveda.json","atharva.html"); }
function ramayanam(){ setJsonAndOpen("json/ramayanam.json","ramayanam.html"); }
function mahabharatam(){ setJsonAndOpen("json/mahabharatam.json","mahabharatam.html"); }
function bhagavatam(){ setJsonAndOpen("json/bhagavatam.json","bhagavatam.html"); }
function bhagavadgita(){ setJsonAndOpen("json/bhagavadgita.json","bhagavadgita.html"); }
function sundrakanda(){ setJsonAndOpen("json/sundrakanda.json","sundrakanda.html"); }

function bhaktiGeetham(){
    const alankaram = localStorage.getItem("alankaram");
    const map = {
      annapurna: "anapoorna.html",
      lalitha: "lingashtakam.html",
      mahalakshmi: "ashtalakshmi.html",
      mahishasuramardini: "mahishasuramardini.html"
    };
    openPage(map[alankaram] || "normal.html");
}
function applySankalpamDynamic(text){
    const tithiData = {
        "2026-10-11":"పాడ్యమి",
        "2026-10-12":"విదియ",
        "2026-10-13":"తదియ",
        "2026-10-14":"చవితి",
        "2026-10-15":"పంచమి",
        "2026-10-16":"షష్ఠి",
        "2026-10-17":"సప్తమి",
        "2026-10-18":"అష్టమి",
        "2026-10-19":"నవమి",
        "2026-10-20":"దశమి",
        "2026-10-21":"దశమి"
    };
    const varaData=[
        "భాను వాసరే",
        "ఇందూ వాసరే",
        "భౌమ వాసరే",
        "సౌమ్య వాసరే",
        "బృహస్పతి వాసరే",
        "భృగు వాసరే",
        "స్థిర వాసరే"
    ];
    const now=new Date();
    const date =
        now.getFullYear()+"-"+
        String(now.getMonth()+1).padStart(2,"0")+"-"+
        String(now.getDate()).padStart(2,"0");
    const tithi=tithiData[date] || "……";
    const vara=varaData[now.getDay()];
    text=text.replace("(*౬)", "");
    text=text.replace("(*౭)", "");
    text=text.replace("…… తిథౌ", tithi + " తిథౌ");
    text=text.replace("…… వాసరే", vara);
    return text;
}
async function loadJson(){
    const titleEl=document.getElementById("title");
    const contentEl=document.getElementById("content");
    if(!titleEl || !contentEl) return;
    const file=document.body.dataset.jsonFile || localStorage.getItem("jsonFile");
    if(!file){ contentEl.textContent="కంటెంట్ ఫైల్ అందుబాటులో లేదు."; return; }
    try{
        const response=await fetch(file);
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        const data=await response.json();
        titleEl.textContent=data.title || "";
        contentEl.replaceChildren();
        const content=filterMantrapushpamContent(data.content || [], file);
        content.forEach(line=>{
            let text=String(line);
            if(file.includes("Sankalpam")){
                text=applySankalpamDynamic(text);
            }
            const paragraph=document.createElement("p");
            paragraph.innerHTML=text.replace(/\n/g,"<br><br>");
            contentEl.appendChild(paragraph);
        });
    }catch(error){
        contentEl.textContent="కంటెంట్ లోడ్ కాలేదు: "+error.message;
        console.error(error);
    }
}
async function loadDeviDhyanam(){
    const devi = localStorage.getItem("selectedDevi");
    if(!devi) return;
    try{
        const response = await fetch(`../devi/json/stotras/${devi}.json`);
        const data = await response.json();
        const lines = data.content || [];
        let dhyanam = "";
        for(const line of lines){
            dhyanam += line+"\n";
            if(String(line).includes("ధ్యాయామి")){
                break;
            }
        }
        const contentEl = document.getElementById("content");
        if(contentEl){
            contentEl.innerHTML =
            contentEl.innerHTML.replace(
                "{ధ్యానశ్లోకాలు}",
                dhyanam.replace(/\n/g,"<br>")
            );
        }

    }catch(error){
        console.error("Dhyanam error:", error);
    }
}
function loadAshtottara(){
    const devi=localStorage.getItem("selectedDevi");
    const allowed=["bala","gaythri","annapurna","mahachandi","lalitha","saraswati","mahalakshmi","durga","mahishasuramardini","rajarajeswari"];
    const file=allowed.includes(devi) ? `json/${devi}.json` : null;
    if(document.body) document.body.dataset.jsonFile=file || "";
    loadJson();
}
function isEveningFlow(){ const h=new Date().getHours(); return h>=18 || h<6; }
function gateEveningNavigation(){
    document.querySelectorAll("[data-evening-only]").forEach(el=>{
        if(!isEveningFlow()) el.hidden=true;
    });
}
function filterMantrapushpamContent(content, file){
    if(!file.includes("mantrapushpam") || !isEveningFlow()){
        return content;
    }
    let skipLakshmi = false;
    let result = [];
    for(const line of content){
        if(String(line).includes("యః శుచి")){
            skipLakshmi = true;
        }
        if(String(line).includes("తన్నో॑ లక్ష్మీః")){
            skipLakshmi = false;
            continue;
        }
        if(!skipLakshmi){
            result.push(line);
        }
    }
    return result;
}
document.addEventListener("DOMContentLoaded",async()=>{
    gateEveningNavigation();
    if(document.body.dataset.ashtottara === "true") loadAshtottara();
    else loadJson();
    if(document.body.dataset.deviDhyanam === "true") loadDeviDhyanam();
});
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then(() => {
        console.log("Service Worker registered");
    })
    .catch(error => {
        console.error("Service Worker registration failed:", error);
    });
}
window.addEventListener("beforeinstallprompt", (event) => {

    console.log("Install prompt available");   // add this

    event.preventDefault();

    deferredPrompt = event;

    const installBtn = document.getElementById("installBtn");

    if (installBtn) {
        installBtn.style.display = "block";
    }
});