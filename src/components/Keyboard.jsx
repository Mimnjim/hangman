export default function Keyboard( {word, guessedLetters, setGuessedLetters, wrongAttempts, setWrongAttempts, allLettersProposed, setAllLettersProposed} ) {
    const handleClick = (e, letter) => {
        e.preventDefault();

        if(word && word.toLowerCase().includes(letter.toLowerCase())) {
            setGuessedLetters([...guessedLetters, letter]); // il faut créer un nouveau tableau pour que React détecte le changement d'état
        } else {
            setWrongAttempts(wrongAttempts - 1);
            // alert("Mauvaise lettre !");
        }
        setAllLettersProposed([...allLettersProposed, letter]);
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <div className="alphabets">
            {alphabet.map((letter, index) => {
                const isUsed = allLettersProposed.includes(letter);
                const isCorrect = guessedLetters.includes(letter);
                return (
                    <button 
                        key={index} 
                        className={`letter-button ${isUsed ? 'disabled' : ''} ${isCorrect ? 'correct' : ''}`}
                        onClick={(e) => handleClick(e, letter)}
                        disabled={isUsed}
                    >
                        {letter}
                    </button>
                )
            })}
        </div>
    )
}
