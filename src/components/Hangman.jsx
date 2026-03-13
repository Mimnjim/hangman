export default function Hangman( {word, wrongAttempts, guessedLetters, allLettersProposed} ) {
    return (
        <div className="hangman">
            <p>Vous avez : {wrongAttempts} tentatives</p>
            <h1>
                Mot à deviner : <br />
                {/* {word} */}
                <div className="all-letters">
                    {displayWord({word, guessedLetters})}
                </div>
            </h1>
        </div>
    )
}

export function renderAnswer( {word, guessedLetters} ) {
    let results = [];
    if(word) {
        word = word.replaceAll("-", " "); // Remplacer les tirets par des espaces
        let wordSplitted = word.split("");

        for(let i=0; i < word.length; i++) {
            if(wordSplitted[i] === " ") {
                results.push(<span class="no-letter" key={i}>&nbsp; &nbsp; </span>) // Afficher un espace réel pour séparation
            } else if(guessedLetters.includes(wordSplitted[i].toUpperCase())) {
                results.push(<span key={i}>{wordSplitted[i].toUpperCase()} </span>)
            } else {
                results.push(<span key={i}>_ </span>)
            }
        }
    }
    return results;
}


export function displayWord( {word, guessedLetters} ) {
    return renderAnswer({word, guessedLetters});
}

export function checkWin( {word, guessedLetters} ) {
    if(word) {
        let wordSplitted = word.split("");
        for(let i=0; i < word.length; i++) {
            if(wordSplitted[i] !== " " && !guessedLetters.includes(wordSplitted[i].toUpperCase())) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function checkLose( {wrongAttempts} ) {
    return wrongAttempts <= 0;
}
