import { useRef } from 'react';
import { translations } from "../translations";

export default function LettersPanel ( {guessedLetters, allLettersProposed, language = 'fr'} ) {
    const tableRef = useRef(null);
    const buttonDebugRef = useRef(null);

    const handleClickDebug = (e) => {
        e.preventDefault();
        
        if(tableRef.current.style.display === "none") {
            tableRef.current.style.display = "flex";
            buttonDebugRef.current.style.display = "none";
        } else {
            tableRef.current.style.display = "none";
            buttonDebugRef.current.style.display = "block";
        }
    }
    
    return (
        <div className="debug">
            <button 
                ref={buttonDebugRef}
                onClick={handleClickDebug} 
                className="debug-button">
                {translations[language].showAttempts}
            </button>
            <div ref={tableRef} className="table-letters">
                <button onClick={handleClickDebug} className="close">
                    {translations[language].close}
                </button>
                <div className="table-letters__content">
                    <p>{translations[language].guessedLetters} <br />
                        {guessedLetters.map((letter, index) => (
                        <span key={index}>{letter}</span>
                        ))}
                    </p> <br />
                    <p>{translations[language].allLetters} <br />
                        {allLettersProposed.map((letter, index) => (
                        <span key={index}>{letter}</span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    )
}