rkn = new RKN('0123456789abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя');
rkn.ban(`Роскомнадзор запретил букву`);


function RKN(alphabet) {
    this.alphabet = alphabet;

    this.ban = function (phrase) {
        for (var i = 0; i < this.alphabet.length; i++) {
            var letter = this.alphabet[i];

            if (phrase.search(letter) !== -1) {
                phrase = rmLetter(letter, phrase);
                console.log(phrase + ' ' + letter.toUpperCase());
            }

        }
    };

    function rmLetter(letter, haystack) {
        var regexp = new RegExp(letter, "ig");
        return haystack.replace(regexp, '').trim();
    }
}


