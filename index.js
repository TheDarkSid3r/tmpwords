$(() => {
    const resize = () => {
        var scale = Math.min(1, window.innerWidth / 512);
        $(".paper").css({ transform: "scale(" + scale + ")" });
        $(".paper-filler").css({ height: 512 * scale });
    };
    resize();
    $(window).on("resize", resize);

    $.get("wordlist.txt", (result) => {
        const wordlist = result.split("\n");

        $(".loader").hide();
        $(".content").show();

        var inputs = [];
        var inputValues = [];

        const createRow = () => {
            const createCell = () => {
                const cell = $("<td/>");
                inputs.push($("<input/>").attr({ type: "text", maxlength: 1, autocomplete: "off", autocorrect: "off", autocapitalize: "off", spellcheck: "false" }).appendTo(cell));
                return cell;
            };

            const row = $("<tr/>");
            for (var x = 0; x < 5; x++) createCell().appendTo(row);
            return row;
        };

        for (var y = 0; y < 5; y++) createRow().appendTo(".letter-grid");

        inputs.forEach((input, index) => {
            inputValues[index] = "";
            input.on("input", () => {
                var letter = input.val().trim().toLowerCase();
                if (letter && !/[a-z]/.test(letter)) {
                    input.val("");
                    return;
                }
                if (letter != inputValues[index]) {
                    inputValues[index] = letter;
                    if (letter) {
                        if (inputs[index + 1]) inputs[index + 1].select();
                        else input.blur();
                    }
                    calculateOutput();
                }
            }).on("keydown", (e) => {
                if (e.keyCode === 8 && !inputValues[index] && inputs[index - 1]) {
                    e.preventDefault();
                    inputs[index - 1].select();
                }
            });
        });
        inputs[0].focus();
        $(".reset-button").on("click", () => {
            inputs.forEach((input, index) => {
                input.val("");
                inputValues[index] = "";
            });
            calculateOutput();
        });

        const calculateOutput = () => {
            var bestWordElement = $(".best-word").empty();
            const letters = inputValues.filter((v) => v);
            if (!letters.length) return;
            const validWords = wordlist.filter((word) => {
                if (word.length > letters.length) return false;
                var remainingLetters = [].concat(letters);
                for (var x = 0; x < word.length; x++) {
                    var char = word.charAt(x);
                    var ind = remainingLetters.indexOf(char);
                    if (ind < 0) return false;
                    remainingLetters.splice(ind, 1);
                }
                return true;
            });
            const bestWord = validWords.sort((a, b) => a.length < b.length ? 1 : a.length > b.length ? -1 : 0)[0];
            if (bestWord) bestWordElement.text(bestWord.toUpperCase());
        };
    });
});

/*
    "rows":5,
    "cols":5,
    "numVowels":7,
    "minRequiredToLiveForChallenge":{
        0:5,
        1:7,
        2:8
    },
    "consonantVariance":{
        "B":2,
        "C":2,
        "D":2,
        "F":2,
        "G":3,
        "H":3,
        "J":1,
        "K":1,
        "L":4,
        "M":3,
        "N":3,
        "P":2,
        "Q":0,
        "R":4,
        "S":2,
        "T":4,
        "V":1,
        "W":1,
        "X":1,
        "Y":1,
        "Z":1
    },
    "vowelVariance":{
        "A":4,
        "E":4,
        "I":2,
        "O":2,
        "U":1
    },
    "pointsForWordPerLetter":100
*/