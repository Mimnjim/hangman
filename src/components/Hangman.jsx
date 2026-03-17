export default function Hangman( {word, wrongAttempts, guessedLetters} ) {
    return (
        <div className="hangman">
            <p>Vous avez : {wrongAttempts} tentatives</p>
            <h1>
                Mot à deviner : <br />
                {/* {word} */}
                <div className="all-letters">
                    {renderAnswer({word, guessedLetters})}
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
                results.push(<span className="no-letter" key={i}>&nbsp; &nbsp; </span>) // Afficher un espace réel pour séparation
            } else if(guessedLetters.includes(wordSplitted[i].toUpperCase())) {
                results.push(<span key={i}>{wordSplitted[i].toUpperCase()} </span>)
            } else {
                results.push(<span key={i}>_ </span>)
            }
        }
        console.log(results);
    }
    return results;
}
