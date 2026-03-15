// import { useState } from "react";

// export default function Hint({ word, guessedLetters, setGuessedLetters, setWrongAttempts }) {
//     const nbOfHints = 3;
//     const [hintUsed, setHintUsed] = useState(0);
//     const [showValidation, setShowValidation] = useState(false);

//     const handleClickHint = (e) => {
//         e.preventDefault();
//         setShowValidation(!showValidation);
//     }

//     const handleConfirmHint = () => {
//         if (hintUsed < nbOfHints && word) {
//             const cleanWord = word.toLowerCase().replaceAll("-", ""); 

//             const unguessedLetters = []; // Tableau pour stocker les lettres non devinées

//             for (const letter of cleanWord) {
//                 if(letter !== " " && !guessedLetters.includes(letter.toUpperCase()) && !unguessedLetters.includes(letter)) {
//                     unguessedLetters.push(letter);
//                 }
//             }
            
//             if (unguessedLetters.length > 0) {
//                 const randomLetter = unguessedLetters[
//                     Math.floor(Math.random() * unguessedLetters.length)
//                 ].toUpperCase();
//                 setGuessedLetters([...guessedLetters, randomLetter]);
//                 setWrongAttempts(attempts => attempts - 1);
//                 setHintUsed(hintUsed => hintUsed + 1);
//                 setShowValidation(false);
//             }
//         }
//     }

//     const handleCancelHint = () => {
//         setShowValidation(false);
//     }

//     return (
//         <div className="hint">
//             <div className={`hint-validation ${showValidation ? 'active' : ''}`}>
//                 <p>
//                     Êtes-vous sûr d'utiliser un indice ? <br />
//                     {hintUsed} / {nbOfHints} utilisés
//                 </p>
//                 <div className="hint-validation-buttons">
//                     <button onClick={handleCancelHint} className="refuse">Non</button>
//                     <button onClick={handleConfirmHint} className="accept">Oui</button>
//                 </div>
//             </div>    

//             <p>Bloquer ? Utilisez un indice <br/> (mais vous perdez une tentative)</p>
//             <button onClick={handleClickHint} disabled={hintUsed >= nbOfHints}>💡 Indice</button>
//         </div>
//     )
// }



import { useState, useRef } from "react";

export default function Hint({ word, guessedLetters, setGuessedLetters, setWrongAttempts }) {
    const nbOfHints = 3;
    const [hintUsed, setHintUsed] = useState(0);
    const [showValidation, setShowValidation] = useState(false);
    const isProcessingRef = useRef(false); // ← Protection contre double-clics

    const handleClickHint = (e) => {
        e.preventDefault();
        setShowValidation(!showValidation);
    }

    const handleConfirmHint = () => {
        if (isProcessingRef.current) return; // Sortir si déjà en traitement
        
        if (hintUsed >= nbOfHints || !word) return;

        isProcessingRef.current = true; // Bloquer les appels suivants

        const cleanWord = word.toLowerCase().replaceAll("-", ""); 
        const unguessedLetters = [];

        for (const letter of cleanWord) {
            if(letter !== " " && !guessedLetters.includes(letter.toUpperCase()) && !unguessedLetters.includes(letter)) {
                unguessedLetters.push(letter);
            }
        }
        
        if (unguessedLetters.length > 0) {
            const randomLetter = unguessedLetters[
                Math.floor(Math.random() * unguessedLetters.length)
            ].toUpperCase();
            
            setGuessedLetters([...guessedLetters, randomLetter]);
            setWrongAttempts(prev => prev - 1);
            setHintUsed(prev => prev + 1);
            setShowValidation(false);
        }

        isProcessingRef.current = false; // Débloquer
    }

    const handleCancelHint = () => {
        setShowValidation(false);
    }

    return (
        <div className="hint">
            <div className={`hint-validation ${showValidation ? 'active' : ''}`}>
                <p>
                    Êtes-vous sûr d'utiliser un indice ? <br />
                    {hintUsed} / {nbOfHints} utilisés
                </p>
                <div className="hint-validation-buttons">
                    <button onClick={handleCancelHint} className="refuse">Non</button>
                    <button onClick={handleConfirmHint} className="accept">Oui</button>
                </div>
            </div>    

            <p>Bloquer ? Utilisez un indice <br/> (mais vous perdez une tentative)</p>
            <button onClick={handleClickHint} disabled={hintUsed >= nbOfHints}>💡 Indice</button>
        </div>
    )
}
