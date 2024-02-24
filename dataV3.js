var json = JSON.parse(
    document.getElementById("module_notes")
        .children[3]
        .innerHTML
        .replaceAll("\n", "")
        .replace(/.*?(var jsonArrayreleveEleve = )/m, "")
        .replace(/(;var dataSourcereleveEleve = ).*/m, "")
);

var notes = json.results.filter(x => x.codeMatiere !== null);
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
    // theWorse: "color: red;font-weight: bolder;",
    // bad: "color: red;",
    theWorse: "color: rgb(255 218 106);",
    bad: "color: rgb(255 218 106);",

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
    var mat = "<tr class='nohover'><div><td colspan='2' style='border-bottom: black solid 1px;width:50%;'>" +
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
            "<td style='padding-left: 15px;'>"+dvr.titreDevoir+"</td>" +
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
