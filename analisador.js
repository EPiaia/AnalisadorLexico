const dictionary = [];
const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
const rules = [];
var terminalRule;
var firstRule;
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

/*
Regra {
- Descrição
- Lista de LetraxRegra
}

LetraxRegra {
- Letra
- Regra
}
*/
function createRule(word) {
    if (isNull(firstRule)) {
        firstRule = {
            description: "q0",
            possibleRules: []
        }
        rules.push(firstRule);
    }

    const letters = word.split('');
    var lastRule = firstRule;
    for (let i = 0; i < letters.length; i++) {
        var letter = letters[i];
        while (hasLetter(lastRule)) {
            lastRule = getLetterRule(lastRule, letter);
        }

        if (i === (letters.length - 1)) {
            if (isNull(terminalRule)) {
                var description = "q" + rules.length + "*";
                var newRule = {
                    description: description,
                    possibleRules: []
                }
                terminalRule = newRule;
                rules.push(terminalRule);
            }
            var newLetterRule = {
                letter: letter,
                rule: terminalRule
            }
            lastRule.possibleRules.push(newLetterRule);
            lastRule = newRule;
        } else {
            var description = "q" + rules.length;
            var newRule = {
                description: description,
                possibleRules: []
            }
            var newLetterRule = {
                letter: letter,
                rule: newRule
            }
            lastRule.possibleRules.push(newLetterRule);
            lastRule = newRule;
            rules.push(lastRule);
        }
    }


    // pegar primeira letra, ver se ja existe regra apontando para proxima letra, se nao existe, se sim usa este, passa para proxima letra até não ter mais letras, onde retorna a regra final (qX* com tudo -)
}

function isNull(rule) {
    return typeof (rule) === 'undefined' || rule === null;
}

function hasLetter(rule, letter) {
    for (let i = 0; i < rule.possibleRules.length; i++) {
        if (rule.possibleRules[i].letter === letter) {
            return true;
        }
    }
    return false;
}

function getLetterRule(rule, letter) {
    for (let i = 0; i < rule.possibleRules.length; i++) {
        if (rule.possibleRules[i].letter === letter) {
            return rule.possibleRules[i].rule;
        }
    }
    return null;
}

function ruleDescription(rule, letter) {
    for (let i = 0; i < rule.possibleRules.length; i++) {
        if (rule.possibleRules[i].letter === letter) {
            return rule.possibleRules[i].rule.description;
        }
    }
    return "-";
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
            if (a < 0) {
                cell = document.createElement("th");
                var cellText = document.createTextNode(rule.description);
            } else {
                var ruleDesc = ruleDescription(rule, alphabet[a]);
                var cellText = document.createTextNode(ruleDesc);
            }
            cell.appendChild(cellText);
            bodyRow.append(cell);
        }
        tbody.appendChild(bodyRow);
    }
    table.appendChild(tbody);
}