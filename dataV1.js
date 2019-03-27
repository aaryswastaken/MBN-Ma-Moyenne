function getAvg(className) {
    var getNotes = document.getElementsByClassName(className);
    var sum = 0;
    var n=0;
    var data = 0;

    for(var index=0;index<(getNotes.length);index++) {
        data = parseFloat(getNotes[index].innerText);
        if(!isNaN(data)) {
            sum += data;
            n += 1;
        }
    }
    return sum/n;
}

var para = document.createElement("p");
var node = document.createTextNode("Moyenne Général : "+getAvg("bulletin-note-eleve").toFixed(2)+"/20.00");
para.appendChild(node);

var element = document.getElementById("fil_ariane");
element.appendChild(para);