import { useRef } from 'react';

export default function LettersPanel ( {guessedLetters, allLettersProposed } ) {
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
                Afficher les infos sur vos tentatives
            </button>
            <div ref={tableRef} className="table-letters">
                <button onClick={handleClickDebug} className="close">Fermer</button>
                <div className="table-letters__content">
                    <p>Lettres devinées : <br />
                        {guessedLetters.map((letter, index) => (
                        <span key={index}>{letter}</span>
                        ))}
                    </p> <br />
                    <p>Toutes les lettres : <br />
                        {allLettersProposed.map((letter, index) => (
                        <span key={index}>{letter}</span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    )
}