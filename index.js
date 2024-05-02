//#region DATA
let kortek = [];
let palyaind;
let aktind;
const palyak = [palya1, palya2, palya3];
const palyanevek = ["Könnyű","Haladó","Extrém"];
let actpalya;
let time = 0;
let timeractive = false;
let aktname = "";
let isuncorrect = false;
let kesz = false;
let eredmenyek = [];
let mentesek = [];
//#endregion

//#region DOM
const ter = document.querySelector("#jatekter");
const jatekdiv = document.querySelector("#jatek");
const nyert = document.querySelector("#nyeroszoveg");
const leiras = document.querySelector("#lileiras");
const leirszoveg = document.querySelector("#leiras");
const ujra = document.querySelector("#ujra");
const kivalaszto = document.querySelector("#palyakiv");
const palyakdiv = document.querySelector("#palyak");
const nameinput = document.querySelector("#name");
const eredUl = document.querySelector("#eredmenyek");
const eredli = document.querySelector("#korabbi");
const mentett = document.querySelector("#mentett");
const mentesli = document.querySelector("#folytat");
const playername = document.querySelector("#playerName");
const nameli = document.querySelector("#nameli");
const megszakit = document.querySelector("#megszakit");

palyakdiv.innerHTML =  palyakGen();

//#endregion

//#region EVENTS

window.addEventListener('load',e =>{
    if(localStorage.getItem('eredmenyek') !== null){
        eredmenyek = JSON.parse(localStorage.getItem('eredmenyek'));
        eredUl.innerHTML = genEred();
    }
});

palyakdiv.addEventListener('click', e =>{
    const kivalto = e.target;
    if(kivalto.matches('td') || kivalto.matches('tr')){
        ter.style.display = "block";
        playername.style.display = "block";
        megszakit.style.display = "inline-block";

        if(mentesek.length != 0 && !kesz && timeractive){
            mentesek[aktind].korte = JSON.parse(JSON.stringify(kortek));
            mentesek[aktind].palya = JSON.parse(JSON.stringify(actpalya));
            mentesek[aktind].palyaindex = palyaind;
            mentesek[aktind].name = aktname;
            mentesek[aktind].time = time;
            mentett.innerHTML = mentesGen();
        }
        
        aktind = mentesek.length;

        nameli.style.display = "inline-block";

        const kivtable = kivalto.closest('table');
        palyaind = [...kivtable.parentElement.children].indexOf(kivtable);
        actpalya = JSON.parse(JSON.stringify(palyak[palyaind]));

        console.log(aktind + "palyakiv");

        aktname = "";
        mentesek.push({ palya: JSON.parse(JSON.stringify(actpalya)), time: time, palyaindex: palyaind, name: aktname, korte: JSON.parse(JSON.stringify(kortek))});
        mentett.innerHTML = mentesGen();
        
        if(!timeractive){
            timeractive = true;
            timeUpdate();
        }
        
        newGame();
    }
});

mentett.addEventListener('click', e=>{
    const kivalto = e.target;
    if(kivalto.matches('td')){
        let ind = [...kivalto.closest('table').parentElement.children].indexOf(kivalto.closest('table'));
        if(ind != aktind){
            ter.style.display = "block";
            nameli.style.display = "inline-block";
            playername.style.display = "block";
            megszakit.style.display = "inline-block";

            if(!kesz && timeractive){
                mentesek[aktind].korte = JSON.parse(JSON.stringify(kortek));
                mentesek[aktind].palya = JSON.parse(JSON.stringify(actpalya));
                mentesek[aktind].palyaindex = palyaind;
                mentesek[aktind].name = aktname;
                mentesek[aktind].time = time;
                mentett.innerHTML = mentesGen();        
            }else{
                ter.addEventListener('click',terClickEventHandler);
            }
            loadGame(ind);

            if(!timeractive){
                timeractive = true;
                timeUpdate();
            }

            console.log(aktind);

            mentett.innerHTML = mentesGen();
            
        }

    }
});

ujra.addEventListener('click', e=>{
    aktind = mentesek.length;   
    actpalya = JSON.parse(JSON.stringify(palyak[palyaind]));

    mentesek.push({ palya: JSON.parse(JSON.stringify(actpalya)), time: time, palyaindex: palyaind, name: aktname, korte: JSON.parse(JSON.stringify(kortek))});
    mentett.innerHTML = mentesGen();

    if(!timeractive){
        timeractive = true;
        timeUpdate();
    }
    newGame();
});

megszakit.addEventListener('click', e=>{
    if(mentesek.length != 0 && !kesz){
        mentesek[aktind].korte = JSON.parse(JSON.stringify(kortek));
        mentesek[aktind].palya = JSON.parse(JSON.stringify(actpalya));
        mentesek[aktind].palyaindex = palyaind;
        mentesek[aktind].name = aktname;
        mentesek[aktind].time = time;
        mentett.innerHTML = mentesGen();

        aktind = -1;
        timeractive = false;

        ter.style.display = "none";
        nameli.style.display = "none";
        playername.style.display = "none";
        megszakit.style.display = "none";
    }
});

leiras.addEventListener('click', e =>{
    leirszoveg.classList.toggle("hidden");
    leiras.classList.toggle('menuselected');
});

mentesli.addEventListener('click', e=>{
    if(mentett.style.display == "flex"){
        mentett.style.display = "none";
    }else{
        mentett.style.display = "flex";
    }
    mentesli.classList.toggle('menuselected');
});

nameinput.addEventListener('input', e=>{
    aktname = nameinput.value;
    if(aktname != ""){
        playername.innerHTML = aktname + " - Time: " + time;
    }else{
        playername.innerHTML = "Time: " + time;
    }
    
});

eredli.addEventListener('click', e=>{
    eredUl.classList.toggle('hidden');
    eredli.classList.toggle('menuselected');
});

kivalaszto.addEventListener('click', e=>{
    if(palyakdiv.style.display == "flex"){
        palyakdiv.style.display = "none";
    
    }else{
        palyakdiv.style.display = "flex";
    }
    kivalaszto.classList.toggle('menuselected');
});

//#endregion

//#region FUNCTIONS

function timeUpdate(){
    if(aktname != ""){
        playername.innerHTML = aktname + " - Time: " + time;
    }else{
        playername.innerHTML = "Time: " + time;
    }
    time++;
    if(timeractive) setTimeout(timeUpdate,1000);
}

function loadGame(ind){
    nyert.style.display = "none";
    ujra.style.display = "none";
    kesz = false;
    kortek = mentesek[ind].korte;
    actpalya = mentesek[ind].palya;
    aktname = mentesek[ind].name;
    palyaind = mentesek[ind].palyaindex;
    aktind = ind;
    time = mentesek[ind].time;
    kortek.forEach(e => vilagit(e.s,e.o));
    ter.innerHTML = terGen(actpalya);
    nameinput.value = aktname;

    if(aktname != ""){
        playername.innerHTML = aktname + " - Time: " + time;
    }else{
        playername.innerHTML = "Time: " + time;
    }
}

function gameWon(){
    timeractive = false;
    console.log(aktind + "gamewon");
    kesz = true;
    nyert.innerHTML = `Gratulálok ${aktname}, sikeresen megoldotta!`;
    nyert.style.display = "inline";
    ujra.style.display = "inline";
    
    eredmenyek.push({name: aktname, time: time, gametable: palyaind});
    localStorage.clear();
    localStorage.setItem('eredmenyek',JSON.stringify(eredmenyek));

    eredUl.innerHTML = genEred();
    mentesek.splice(aktind, 1);
    aktind = -1;
    mentett.innerHTML = mentesGen();
    ter.removeEventListener('click',terClickEventHandler);
    
}

function newGame(){
    nyert.style.display = "none";
    ujra.style.display = "none";

    
    actpalya = JSON.parse(JSON.stringify(palyak[palyaind]));
    ter.innerHTML = terGen(actpalya);

    kesz = false;
    kortek = [];
    time = 0;
    nameinput.value = "";
    
    if(aktname != ""){
        playername.innerHTML = aktname + " - Time: " + time;
    }else{
        playername.innerHTML = "Time: " + time;
    }

    ter.addEventListener('click',terClickEventHandler);
}

function terClickEventHandler(e){
    const kivalto = e.target;
    if(kivalto.matches('td') && !isuncorrect){

       let x = kivalto.cellIndex;
       let y = kivalto.parentElement.sectionRowIndex;

       if(actpalya[y][x].text == "💡"){
            felvesz(x,y);
            ter.innerHTML = terGen(actpalya);
       }else{
            lerak(x,y);
       }   
    }
}

//#endregion

//#region GENERATORS

function mentesGen(){
    let str = "";
    mentesek.forEach((m,i) =>{
        
        if(i == aktind) str += '<table class="felben selected">';
        else str += '<table class="felben">';
        str += `<caption> ${m.name} </caption>`;
        str += palyaGen(m.palya);
        str += "</table>";

    });
    return str;
}

function palyakGen(){
    let str ="";
    palyak.forEach(p => {
        str +='<table>';
        str += palyaGen(p);
        str+="</table>";
    });
    return str;
}

function palyaGen(p){
    let str = "";
    p.forEach(s => {
        str += "<tr>";
        s.forEach(e => {
            str += `<td style="background-color: ${e.color}" class="kicsi"> ${e.text} </td>`;
        });
        str += "</tr>";
    });
    return str;
}

function terGen(palya){
    let str = "";
    let i = 0;
    let count = true;
    palya.forEach(s => {
        str += "<tr>";
        s.forEach(e => {
            if(e.color == "#000000" && e.text != ""){
                if(parseInt(e.text) != e.count){
                    count = false;
                    str += `<td style="background-color: ${e.color}"> ${e.text} </td>`;
                }else{
                    str += `<td style="background-color: ${e.color}; color: #66ff59"> ${e.text} </td>`;
                }
            }else{
                str += `<td style="background-color: ${e.color}"> ${e.text} </td>`;
            }
            
            if(e.color == "#000000" || e.color == "#ffe79b") i++;
            
        });
        str += "</tr>";
    });
    if(i == palya.length * palya.length && count && !kesz){
        gameWon();
    }
    return str;
}

function genEred(){
    console.log(aktind + "genered");
    let str = "";
    eredmenyek.forEach(e =>str += `<li> Játékos neve: ${e.name == "" ? "Anonym" : e.name}, idő: ${e.time}, pálya: ${palyanevek[e.gametable]} </li>`);
    return str;
}

//#endregion

//#region MODEL

function lerak(x,y){
    if(actpalya[y][x].color != "#000000"){
        if(!keresztez(x,y) && countright(x,y)){
            actpalya[y][x].text = "💡";
            actpalya[y][x].color = "#ffe79b";
            terjed(x,y,1,true,true,true,true);
            addcount(x,y);
            kortek.push({s: x, o: y});
            
        }else{
            let prevcolor = actpalya[y][x].color;
            actpalya[y][x].text = "💡";
            actpalya[y][x].color = "#ff6347";
            ter.innerHTML = terGen(actpalya);
            isuncorrect = true;
            setTimeout(function(){
                actpalya[y][x].text = "";
                actpalya[y][x].color = prevcolor;
                kortek.forEach(e => vilagit(e.s,e.o));
                ter.innerHTML = terGen(actpalya);
                isuncorrect = false;
            },1000);
        }
    }
   
}

function felvesz(x,y){
    if(actpalya[y][x].text = "💡"){
        actpalya[y][x].text = "";
        remcount(x,y);
        let ind = kortek.findIndex(e => e.s == x && e.o == y);
        kortek.splice(ind,1);
        wipe(actpalya);
        kortek.forEach(e => vilagit(e.s,e.o));
    }
}

function wipe(palya){
    for(let i = 0; i < palya.length; i++){
        for(let j = 0; j < palya.length; j++){
            if(palya[i][j].color != "#000000"){
                palya[i][j].color = "#ffffff";
            }
        }
    }
}

function terjed(x,y,i,u,d,l,r){
    
    if(actpalya[y][x].text == "💡"){
        if(r && !((x + i) < actpalya.length && actpalya[y][x + i].color != "#000000")) r = false;
        if(l && !((x - i) >= 0 && actpalya[y][x - i].color != "#000000")) l = false;
        if(d && !((y + i) < actpalya.length && actpalya[y + i][x].color != "#000000")) d = false;
        if(u && !((y - i) >= 0 && actpalya[y - i][x].color != "#000000")) u = false;
    
        if(r) actpalya[y][x + i].color = "#ffe79b";
        if(l) actpalya[y][x - i].color = "#ffe79b";
        if(d) actpalya[y + i][x].color = "#ffe79b";
        if(u) actpalya[y - i][x].color = "#ffe79b";
    
        ter.innerHTML = terGen(actpalya);
        
        if(r || l || d || u){
            i++;
            setTimeout(terjed,300,x,y,i,u,d,l,r);
        }
    }
    
}

function vilagit(x,y){
    let i = x + 1;
    while(i < actpalya.length && actpalya[y][i].color != "#000000"){
        actpalya[y][i].color = "#ffe79b";
        i++;
    }
    i = x - 1;
    while(i >= 0 && actpalya[y][i].color != "#000000"){
        actpalya[y][i].color = "#ffe79b";
        i--;
    }
    i = y + 1;
    while(i < actpalya.length && actpalya[i][x].color != "#000000"){
        actpalya[i][x].color = "#ffe79b";
        i++;
    }
    i = y - 1;
    while(i >= 0 && actpalya[i][x].color != "#000000"){
        actpalya[i][x].color = "#ffe79b";
        i--;
    }
    actpalya[y][x].color = "#ffe79b";
}

function keresztez(x,y){
    let i = x + 1;
    while(i < actpalya.length && actpalya[y][i].color != "#000000"){
        if(actpalya[y][i].text == "💡") return true;
        i++;
    }
    i = x - 1;
    while(i >= 0 && actpalya[y][i].color != "#000000"){
        if(actpalya[y][i].text == "💡") return true;
        i--;
    }
    i = y + 1;
    while(i < actpalya.length && actpalya[i][x].color != "#000000"){
        if(actpalya[i][x].text == "💡") return true;
        i++;
    }
    i = y - 1;
    while(i >= 0 && actpalya[i][x].color != "#000000"){
        if(actpalya[i][x].text == "💡") return true;
        i--;
    }
    return false;
}

function countright(y,x){
    if(x > 0){
        if(actpalya[x-1][y].text != "" && actpalya[x-1][y].color == "#000000" && parseInt(actpalya[x-1][y].text) <= actpalya[x-1][y].count){
            return false;
        }
    }
    if(x < actpalya.length - 1){
        if(actpalya[x+1][y].text != "" && actpalya[x+1][y].color == "#000000" && parseInt(actpalya[x+1][y].text) <= actpalya[x+1][y].count){
            return false;
        } 
    }
    if(y > 0){
        if(actpalya[x][y-1].text != "" && actpalya[x][y-1].color == "#000000" && parseInt(actpalya[x][y-1].text) <= actpalya[x][y-1].count){
            return false;
        } 
    }
    if(y < actpalya.length - 1){
        if(actpalya[x][y+1].text != "" && actpalya[x][y+1].color == "#000000" && parseInt(actpalya[x][y+1].text) <= actpalya[x][y+1].count){
            return false;
        }
    }
    return true;
}

function addcount(y,x){
    if(x > 0){
        if(actpalya[x-1][y].text != "" && actpalya[x-1][y].color == "#000000"){
            actpalya[x-1][y].count++;
        }
    }
    if(x < actpalya.length - 1){
        if(actpalya[x+1][y].text != "" && actpalya[x+1][y].color == "#000000"){
            actpalya[x+1][y].count++;
        }
    }
    if(y > 0){
        if(actpalya[x][y-1].text != "" && actpalya[x][y-1].color == "#000000"){
            actpalya[x][y-1].count++;
        }
    }
    if(y < actpalya.length - 1){
        if(actpalya[x][y+1].text != "" && actpalya[x][y+1].color == "#000000"){
            actpalya[x][y+1].count++;
        }
    }
}

function remcount(y,x){
    if(x > 0){
        if(actpalya[x-1][y].text != "" && actpalya[x-1][y].color == "#000000"){
            actpalya[x-1][y].count--;
        }
    }
    if(x < actpalya.length - 1){
        if(actpalya[x+1][y].text != "" && actpalya[x+1][y].color == "#000000"){
            actpalya[x+1][y].count--;
        }
    }
    if(y > 0){
        if(actpalya[x][y-1].text != "" && actpalya[x][y-1].color == "#000000"){
            actpalya[x][y-1].count--;
        }
    }
    if(y < actpalya.length - 1){
        if(actpalya[x][y+1].text != "" && actpalya[x][y+1].color == "#000000"){
            actpalya[x][y+1].count--;
        }
    }
}

//#endregion