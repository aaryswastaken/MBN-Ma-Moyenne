window.setTimeout(function () {
    console.log("KDEC LOL !")
    var notes = KDECOLE.releveEleve.dataSource.liveData.results;
    console.log(notes)

    // get average
    var sum = 0
    notes.forEach(element => {
        sum += parseInt(element.moyenneEleve);
    });
    var avg = sum / notes.length;

    var para = document.createElement("p");
    var node = document.createTextNode("Moyenne Général : "+avg.toFixed(2)+"/20.00");
    para.appendChild(node);

    var element = document.getElementById("fil_ariane");
    element.appendChild(para);
}, 1000);