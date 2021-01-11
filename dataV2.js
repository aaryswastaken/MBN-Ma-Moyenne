var json = JSON.parse(
    document.getElementById("module_notes")
        .children[3]
        .innerHTML
        .replaceAll("\n", "")
        .replace(/.*?(var jsonArrayreleveEleve = )/m, "")
        .replace(/(;var dataSourcereleveEleve = ).*/m, "")
);

var username = document.getElementsByClassName("user")[0].children[0].innerText;

var notes = json.results;
console.log(notes)

// --------------------- COLORED AVERAGES ---------------------
// var has = [];
// 1 : Worse
// 2 : Bad
// 3 : The Average
// 4 : average
// 5 : Best
// 6 : good
var id = 0;
notes.forEach( element => {
    var moy = parseFloat(element.moyenneClasse).toFixed(2);
    var min = parseFloat(element.moyenneClasseMin).toFixed(2);
    var max = parseFloat(element.moyenneClasseMax).toFixed(2);
    var user = parseFloat(element.moyenneEleve).toFixed(2);

    var minmoyFrontier = parseFloat((moy - min) * 0.333) + parseFloat(min);
    var moymaxFrontier = parseFloat((max - moy) * 0.333) + parseFloat(moy);

    console.log("minmoy : "+minmoyFrontier+" | moymax : "+moymaxFrontier);

    var actual = 0;

    if(! isNaN(user)) {
        if (user == moy) { // The Average
            actual = 3;
        } else {
            if (user < moy) { // Can be either : The worse, bad and average
                if (user == min) { // The worse
                    actual = 1;
                } else {
                    if (user < minmoyFrontier) { // bad
                        actual = 2;
                    } else { // the average
                        actual = 4;
                    }
                }
            } else {
                if (user == max) { // The best
                    actual = 5;
                } else {
                    if (user > moymaxFrontier) { // Good
                        actual = 6;
                    } else { // average
                        actual = 4;
                    }
                }
            }
        }
        var target = document.getElementById("releve-eleve").children[1].children[3].children[id].children[1];

        switch (actual) {
            case 1:
                target.style.backgroundColor = "red";
                break;
            case 2:
                target.style.color = "red";
                break;
            case 3:
                target.style.backgroundColor = "#ebe88f";
                break;
            case 4:
                target.style.color = "rgb(255 218 106)";
                break;
            case 5:
                target.style.backgroundColor = "green";
                break;
            case 6:
                target.style.color = "green";
                break;
        }
    }

    id += 1;
})


// --------------------- AVERAGE ---------------------

// get average
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

        console.log(element.moyenneEleve.toString()+" : "+sum);
    }
});

var avg = (sum / leng).toFixed(2);
var best = (bestSum / leng).toFixed(2);
var worse = (worseSum / leng).toFixed(2);
var average = (averageSum / leng).toFixed(2);

// PRINT THE AVERAGE

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
