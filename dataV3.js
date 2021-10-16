var json = JSON.parse(
    document.getElementById("module_notes")
        .children[3]
        .innerHTML
        .replaceAll("\n", "")
        .replace(/.*?(var jsonArrayreleveEleve = )/m, "")
        .replace(/(;var dataSourcereleveEleve = ).*/m, "")
);

var notes = json.results.filter(x => x.codeMatiere !== null);
// console.log({notes});

var username = document.getElementsByClassName("user")[0].children[0].innerText;

var StringYUISorter, NumericYUISorter;

var json2 = eval(
    document.getElementById("module_notes")
        .children[3]
        .innerHTML
        .replaceAll("\n", "")
        .replace(/.*?(var columnDefreleveEleve = )/m, "")
        .replace(/(;var jsonArrayreleveEleve = ).*/m, "")
        // .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
);

// --------------------- OLD THING  ---------------------
var sum = 0.0;
var averageSum = 0.0;
var bestSum = 0.0;
var worseSum = 0.0;
var leng = 0;
notes.forEach(element => {
    if(element.moyenneEleve !== null) {
        leng += 1;
        sum = parseFloat(sum)+parseFloat(element.moyenneEleve.replaceAll(",", "."));
        averageSum = parseFloat(averageSum)+parseFloat(element.moyenneClasse.replaceAll(",", "."));
        bestSum = parseFloat(bestSum)+parseFloat(element.moyenneClasseMax.replaceAll(",", "."));
        worseSum = parseFloat(worseSum)+parseFloat(element.moyenneClasseMin.replaceAll(",", "."));

        // console.log(element.moyenneEleve.toString()+" : "+sum);
    }
});

var avg = (sum / leng).toFixed(2);
var best = (bestSum / leng).toFixed(2);
var worse = (worseSum / leng).toFixed(2);
var average = (averageSum / leng).toFixed(2);

// PRINT THE AVERAGE

/*
var tr = document.createElement("tr");

var td1 = "<td headers=\"yui-dt0-th-matiere \" class=\"yui-dt0-col-matiere yui-dt-col-matiere yui-dt-sortable yui-dt-first\" style=\"width: 150px;\"><div class=\"yui-dt-liner\"><div class=\"bulletin-matiere-ligne\">" +
    "<div class=\"bulletin-matiere-libelle ellipse fw-700\" title=\"MOYENNE GENERALE\">Moyenne Générale</div>" +
    "<div class=\"releve-matiere-professeur f-left c-both ellipse\" title=\""+username+"\">"+username +
    "</div></div></div></td>";

var td2 = "<td headers=\"yui-dt0-th-yui-dt-col1 yui-dt0-th-moyenneEleve \" class=\"yui-dt0-col-moyenneEleve yui-dt-col-moyenneEleve yui-dt-sortable\" style=\"width: 30px;\">" +
    "<div class=\"yui-dt-liner bulletin-note bulletin-note-eleve\">"+avg.toString()+"</div></td>";

var td3 = "<td headers=\"yui-dt0-th-yui-dt-col1 yui-dt0-th-nombreDevoirComptabilises \" class=\"yui-dt0-col-nombreDevoirComptabilises yui-dt-col-nombreDevoirComptabilises yui-dt-sortable\" style=\"width: 30px;\">" +
    "<div class=\"yui-dt-liner bulletin-note\"><div class=\"txt-center\">"+leng+"</div></div></td>";

var td4 = "<td headers=\"yui-dt0-th-yui-dt-col4 yui-dt0-th-moyenneClasse \" class=\"yui-dt0-col-moyenneClasse yui-dt-col-moyenneClasse\" style=\"width: 30px;\">" +
    "<div class=\"yui-dt-liner bulletin-note\">"+average+"</div></td>";

var td5 = "<td headers=\"yui-dt0-th-yui-dt-col4 yui-dt0-th-moyenneClasseMin \" class=\"yui-dt0-col-moyenneClasseMin yui-dt-col-moyenneClasseMin\" style=\"width: 30px;\">" +
    "<div class=\"yui-dt-liner bulletin-note\">"+worse+"</div></td>";

var td6 = "<td headers=\"yui-dt0-th-yui-dt-col4 yui-dt0-th-moyenneClasseMax \" class=\"yui-dt0-col-moyenneClasseMax yui-dt-col-moyenneClasseMax\" style=\"width: 30px;\">" +
    "<div class=\"yui-dt-liner bulletin-note\">"+best+"</div></td>";

tr.innerHTML=td1+td2+td3+td3+td5+td6;

document.getElementById("releve-eleve").children[1].children[3].appendChild(tr);
*/

// --------------------- NEW SYSTEM ---------------------

var noteArray = {};

json2[3].metas.devoirs.forEach( (e) => {
    noteArray[e.idDevoir] = e
});

function f(n) {
    return (n==null ? "NR":n)
}

function g(n) {
    return (n==null ? null:parseFloat(n.toString().replaceAll(",", ".")))
}

const definitions = {
    // theWorse: "background-color: red;",
    theWorse: "color: red;font-weight: bolder;",
    bad: "color: red;",

    // theAverage: "background-color: #ebe88f;",
    theAverage: "color: rgb(255 218 106);font-weight: bolder;",
    average:"color: rgb(255 218 106);",

    // theBest: "background-color: green;",
    theBest: "color: green;font-weight: bolder;",
    good: "color: green;",

    unknown: ""
}

function style(user, max, moy, min) {
    user = g(user);
    max = g(max);
    moy = g(moy);
    min = g(min);
    var minmoyFrontier = parseFloat((g(moy) - g(min)) * 0.1) + g(min);
    var moymaxFrontier = parseFloat((g(max) - g(moy)) * 0.1) + g(moy);

    // console.log({user: user, max: max, moy: moy, min: min, front: moymaxFrontier});

    if(isNaN(user) || user == null) {
        return definitions.unknown;
    }

    if (user == moy) { // The Average
        return definitions.theAverage;
    } else {
        if (user < moy) { // Can be either : The worse, bad and average
            if (user == min) { // The worse
                return definitions.theWorse;
            } else {
                if (user < minmoyFrontier) { // bad
                    return definitions.bad;
                } else { // the average
                    return definitions.average
                }
            }
        } else {
            if (user == max) { // The best
                return definitions.theBest;
            } else {
                if (user > moymaxFrontier) { // Good
                    return definitions.good
                } else { // average
                    return definitions.average;
                }
            }
        }
    }
}

// console.log({json});
// console.log({json2});

var old = document.getElementById("releve-eleve").innerHTML;
document.getElementById("releve-eleve").innerHTML = "";

var div = document.createElement("table");
div.style.width = "90%";
div.style.marginLeft = "2%";

var isFirst = false;
var total = ""

average = 0;
var totalAverage = 0;
var maxAverage = 0;
var minAverage = 0;
var cntAVG = 0;
var cntAvg = 0;
var cntMax = 0;
var cntMin = 0;

notes.forEach( (e) => {
    average += g(e.moyenneEleve==null ? 0:e.moyenneEleve);
    cntAVG += (e.moyenneEleve == null ? 0:1);
    totalAverage += g(e.moyenneClasse==null ? 0:e.moyenneClasse);
    cntAvg += (e.moyenneClasse==null ? 0:1);
    maxAverage += g(e.moyenneClasseMax==null ? 0:e.moyenneClasseMax);
    cntMax += (e.moyenneClasseMax==null ? 0:1);
    minAverage += g(e.moyenneClasseMin==null ? 0:e.moyenneClasseMin);
    cntMin += (e.moyenneClasseMin==null ? 0:1);
});

average = average / cntAVG;
average = average.toFixed(2);
totalAverage = totalAverage / cntAvg;
totalAverage = totalAverage.toFixed(2);
maxAverage = maxAverage / cntMax;
maxAverage = maxAverage.toFixed(2);
minAverage = minAverage / cntMin;
minAverage = minAverage.toFixed(2);

var moyenneObject = {
    matiere: "Moyenne Générale",
    enseignants: username,
    moyenneClasseMax: maxAverage,
    moyenneClasseMin: minAverage,
    moyenneClasse: totalAverage,
    moyenneEleve: average,
    notesEleve: []
};

// console.log(moyenneObject);

notes.push(moyenneObject);

// console.log("BLLELELLELELELLEBELEBLEBELBLEB")

notes.forEach( (e) => {
    var mat = "<tr><div><td colspan='2' style='border-bottom: black solid 1px;width:50%;'>" +
        "<div style='float: right;margin-top: 1.5%;margin-right: 4%;"+(isFirst ? "" : "padding-top:20px;")+"'><div style='font-size: 1.5em;display: inline-block;"+style(e.moyenneEleve, e.moyenneClasseMax, e.moyenneClasse, e.moyenneClasseMin)+"'>"+f(e.moyenneEleve)+"</div><div style='font-size: 1em;display: inline-block;margin-left:5px;'>/20</div></div> " +
        "<div style='font-size: 2em;"+(isFirst ? "" : "padding-top:20px;")+"'>"+e.matiere+"</div>" +
        "<div style='font-size: 1em;display:inline-block;margin-left: 10px'>"+e.enseignants+"</div></td>" +
        "<td style='text-align: left;"+(isFirst ? "" : "padding-top:20px;")+"'> Max : "+f(e.moyenneClasseMax)+"</td>" +
        "<td style='text-align: left;"+(isFirst ? "" : "padding-top:20px;")+"'> Moy : "+f(e.moyenneClasse)+"</td>" +
        "<td style='text-align: left;"+(isFirst ? "" : "padding-top:20px;")+"'> Med : -- </td>" +
        "<td style='text-align: left;"+(isFirst ? "" : "padding-top:20px;")+"'> Min : "+f(e.moyenneClasseMin)+"</td>" +
        "</td></div></tr>"

    var note = "";
    e.notesEleve.forEach( (_note) => {
        let dvr = noteArray[_note.idDevoir];
        note += `<tr style='margin-left: 30px' class='new-devoir' id='dev-id-${_note.idDevoir}'>` +
            "<td>"+dvr.titreDevoir+"</td>" +
            "<td>"+dvr.dateDevoir+"</td>"+
            "<td style='text-align: left;'>"+f(dvr.max)+"</td>"+
            "<td style='text-align: left;'>"+f(dvr.moyenne)+"</td>"+
            "<td style='text-align: left;'>"+f(dvr.mediane)+"</td>"+
            "<td style='text-align: left;'>"+f(dvr.min)+"</td>"+
            "<td style='display: inline-block;width:100%'><div style='font-size: 1.5em;" +
            style(dvr.note, dvr.max, dvr.moyenne, dvr.min)+"'>"+f(dvr.note)+"</div><div>/"+dvr.bareme+"</div></td>" +
            "<td>(coef "+dvr.coefficient+")</td>" +
            "</tr>";
    });
    isFirst = false;

    total += mat+note
});

div.innerHTML = div.innerHTML+total;

document.getElementById("releve-eleve").appendChild(div);
var newPrint = document.getElementById("releve-eleve").innerHTML;

// Listeners definitions

function applyListeners(className, idFunc) {
    Array.from(document.getElementsByClassName(className)).forEach(note => {
        let id = note.id;
        let idDevoir = Number.parseInt(idFunc(id));
        let paramsRAW = json2[3].metas.devoirs.filter(dev => dev.idDevoir === idDevoir)[0];
        let params = {
            actionDownload: "TELECHARGER_PJ_ELEVE",
            idDatagrid: "releveEleve",
            jsonColumnName: "notesEleve",
            proc: "CONSULTER_RELEVE",
            resultatCompetences: [],
            uid: null,
            valeur: paramsRAW.note,
            commentaireEnseignant: paramsRAW.commentaireEnseignant,
            facultatif: paramsRAW.facultatif,
            idDevoir: idDevoir,
            libelleCompetence: paramsRAW.libelleCompetence,
            libelleMotifNonNotation: paramsRAW.libelleMotifNonNotation
        }

        // console.log({params});
        note.onclick = () => {
            // onClickafficherPopinReleveNote({}, params);
            location.href = `javascript:afficherPopinReleveNote({}, ${JSON.stringify(params)})`
        }
    })
}

// afficherPopinReleveNote(ev, params)
function setupOldListeners() {
    applyListeners("bloc-note-releve", id => id.replaceAll(/resultat-devoir-/gm, ""))
}

function setupNewListeners() {
    applyListeners("new-devoir", id => id.replaceAll(/dev-id-/gm, ""));
}

setupNewListeners();  // Apply for actual

// Go to the old table
var li = document.createElement("li");
li.classList = ["tabs__item"];

var inner = document.createElement("a");
inner.innerHTML = "<span>Changer d'affichage</span>"
var isNewTheActual = true;
inner.onclick = () => {
    if(isNewTheActual) {
        document.getElementById("releve-eleve").innerHTML = old;
        setupOldListeners()
    } else {
        document.getElementById("releve-eleve").innerHTML = newPrint;
        setupNewListeners() // Doesn't refer (for now) to a new listener but rather to the listener of the new print
    }
    isNewTheActual = !isNewTheActual;
}
inner.classList = ["tabs__link"];

li.appendChild(inner)

document.getElementsByClassName("tabs__list list--inlined tabs--lg")[0].appendChild(li);
