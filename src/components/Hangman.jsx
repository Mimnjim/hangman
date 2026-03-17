import { translations } from "../translations";
import { removeAccents } from "../normalize";

export default function Hangman( {word, wrongAttempts, guessedLetters, language} ) {
    return (
        <div className="hangman">
            <p>{translations[language].youHave} {wrongAttempts} {translations[language].attempts}</p>
            <h1>
                {/* Mot à deviner : <br />
                {word} */}
                {translations[language].wordWas} <strong>{word}</strong>
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
                results.push(<span className="no-letter" key={i}>&nbsp; &nbsp; </span>)
            } else if(guessedLetters.includes(removeAccents(wordSplitted[i].toUpperCase()))) {
                results.push(<span key={i}>{removeAccents(wordSplitted[i]).toUpperCase()} </span>)
            } else {
                results.push(<span key={i}>_ </span>)
            }
        }
        console.log(results);
    }
    return results;
}
