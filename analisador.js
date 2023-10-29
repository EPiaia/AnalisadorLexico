const dictionary = [];
const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
const rules = [];
var terminalRule;
var firstRule;
const rulesTableId = "rulesTable";

document.addEventListener("DOMContentLoaded", function () {
    writeRules(null, null, null);
});

window.addEventListener("load", (event) => {
    document.getElementById("analyser-input").addEventListener("keyup", (eventKeyup) => {
        analyseLetter(eventKeyup);
    });
});

function analyseLetter(event) {
    writeRules(null, false, null);
    var input = document.getElementById("analyser-input");
    var span = document.getElementById("analysis-status");
    var inputValue = input.value;
    if (inputValue === '' || inputValue === 'undefined') {
        span.innerText = '';
        return;
    }

    const words = inputValue.split(' ');
    for (let w = 0; w < words.length; w++) {
        var word = words[w];
        const letters = word.split('');
        var currentRule = firstRule;
        var lastRule = null;
        for (let l = 0; l < letters.length; l++) {
            var letter = letters[l];
            if (!hasLetter(currentRule, letter)) {
                span.innerText = "Inválido";
                span.className = "invalid";
                writeRules(currentRule, false, letter);
                return;
            }
            lastRule = currentRule;
            currentRule = getLetterRule(currentRule, letter);
        }
        if (event.which === 32 && currentRule.description != terminalRule.description && word != 'undefined' && word != '') {
            span.innerText = "Inválido";
            span.className = "invalid";
            var lastWord = words[words.length - 1];
            var lastLetter = letters[letters.length - 1];
            writeRules(currentRule, false, lastLetter);
            return;
        }
    }
    span.innerText = "Válido";
    span.className = "valid";
    var lastWord = words[words.length - 1];
    var letters = lastWord.split('');
    var lastLetter = letters[letters.length - 1];
    writeRules(lastRule, true, lastLetter);
}

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
    writeRules(null, null, null);
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
    loop1:
    for (let i = 0; i < letters.length; i++) {
        var letter = letters[i];
        loop2:
        // Verifica se possui uma regra para a próxima letra com base na regra atual
        // Ver para futuramente alterar para verificar as outras letras disponíveis na regra e bater com a atual, a fim de encaixar as regras corretamente
        while (hasLetter(lastRule, letter)) {
            lastRule = getLetterRule(lastRule, letter);
            continue loop1;
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

function letterNumber(letter) {
    for (let i = 0; i < alphabet.length; i++) {
        if (letter === alphabet[i]) {
            return i;
        }
    }
    return null;
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

function writeRules(currentRule, valid, currentLetter) {
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
                if (currentRule != null) {
                    var letterNum = letterNumber(currentLetter);
                    if (rule.description === currentRule.description && letterNum === a) {
                        if (valid) {
                            cell.className = "valid-cell";
                        } else {
                            cell.className = "invalid-cell";
                        }
                    } else if (rule.description === currentRule.description || letterNum === a) {
                        if (valid) {
                            cell.className = "light-valid-cell";
                        } else {
                            cell.className = "light-invalid-cell";
                        }
                    }
                }
            }
            cell.appendChild(cellText);
            bodyRow.append(cell);
        }
        tbody.appendChild(bodyRow);
    }
    table.appendChild(tbody);
}