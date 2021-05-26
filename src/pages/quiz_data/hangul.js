const hangul = [
    ['ㄱ', 'g, k'],
    ['ㄴ', 'n'],
    ['ㄷ', 'd, t'],
    ['ㄹ', 'r, l'],
    ['ㅁ', 'm'],
    ['ㅂ', 'b, p'],
    ['ㅅ', 's'],
    ['ㅇ', 'ng (silent in initial position)'],
    ['ㅈ', 'j'],
    ['ㅊ', 'ch'],
    ['ㅋ', 'k'],
    ['ㅌ', 't'],
    ['ㅍ', 'p'],
    ['ㅎ', 'h'],
    ['ㄲ', 'kk'],
    ['ㄸ', 'tt'],
    ['ㅃ', 'pp'],
    ['ㅆ', 'ss'],
    ['ㅉ', 'jj'],
    ['ㅏ', 'a (as in "father")'],
    ['ㅑ', 'ya'],
    ['ㅓ', 'aw (as in "saw")'],
    ['ㅕ', 'yaw'],
    ['ㅗ', 'o (as in "home)'],
    ['ㅛ', 'yo'],
    ['ㅜ', 'oo (as in "moon")'],
    ['ㅠ', 'yu'],
    ['ㅡ', 'u (as in "put")'],
    ['ㅣ', 'ee (as in "meet")'],
    ['ㅐ', 'a (as in "hand")'],
    ['ㅒ', 'yae'],
    ['ㅔ', 'e (as in "set")'],
    ['ㅖ', 'ye'],
    ['ㅘ', 'wa'],
    ['ㅙ', 'wae'],
    ['ㅚ', 'we (as in "wet")'],
    ['ㅝ', "wo"],
    ['ㅞ', "we"],
    ['ㅟ', "wi"],
    ['ㅢ', "ui"]
]

exports.title = "Hangul";
exports.data = hangul.map(x => { 
    return {
        Korean: x[0], 
        Pronounciation: x[1]
    }
})
exports.default_qa = [0,1];