const dictionary = [];
const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
const rules = [];
const rulesTableId = "rulesTable";

document.addEventListener("DOMContentLoaded", function () {
    writeRules();
});

function addWord() {
    var input = document.getElementById("add-word");
    var word = input.value;
    if (word === '') {
        return;
    }

    input.value = "";

    if (dictionary.includes(word)) {
        return;
    }

    dictionary.push(word);
    writeDictionary();

    createRule(word);
    writeRules();
}

function createRule(word) {
    var rule = {
        description: "q0",
        possibleRule: "",
        letterPossibleRule: ""
    };
    rules.push(rule);

    const letters = word.split('');
    /*for (let i = 0; i < letters.length; i++) {
        var description = "q" + i;
        var possibleRule;
        var letterPossibleRule;
        if (i < letters.length - 1) {
            possibleRule = rules[rules.length - 1];
            letterPossibleRule = letters[i + 1];
        }
        var rule = {
            description: description,
            possibleRule: possibleRule,
            letterPossibleRule: letterPossibleRule
        };
        rules.push(rule);
    }*/
}

function writeDictionary() {
    var wordsToPrint = "";
    dictionary.forEach(function (item, index) {
        wordsToPrint += item;
        if (index < dictionary.length - 1) {
            wordsToPrint += " - ";
        }
    });
    var htmlDictionary = document.getElementById("dictionary");
    htmlDictionary.innerHTML = wordsToPrint;
}

function writeRules() {
    var rulesDiv = document.getElementById("rules");

    var existingTable = document.getElementById(rulesTableId);
    if (typeof (existingTable) != 'undefined' && existingTable != null) {
        existingTable.remove();
    }

    var table = document.createElement("table");
    table.className = "table";
    table.id = rulesTableId;
    var thead = document.createElement("thead");
    thead.className = "thead-dark";
    var row = document.createElement("tr");

    for (let i = -1; i < alphabet.length; i++) {
        var cell = document.createElement("th");
        cell.scope = "col";
        if (i < 0) {
            var cellText = document.createTextNode("δ");
        } else {
            var cellText = document.createTextNode(alphabet[i].toUpperCase());
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
    }
    thead.appendChild(row);
    table.appendChild(thead);
    rulesDiv.appendChild(table);

    var tbody = document.createElement("tbody");
    for (let i = 0; i < rules.length; i++) {
        var bodyRow = document.createElement("tr");
        for (let a = -1; a < alphabet.length; a++) {
            var rule = rules[i];
            var cell = document.createElement("td");
            var cellText = document.createTextNode("-");
            if (a < 0) {
                cell = document.createElement("th");
                cellText = document.createTextNode(rule.description);
            }
            cell.appendChild(cellText);
            bodyRow.append(cell);
        }
        tbody.appendChild(bodyRow);
    }
    table.appendChild(tbody);
}