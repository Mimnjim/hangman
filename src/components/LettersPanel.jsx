export default function LettersPanel ( {guessedLetters, allLettersProposed } ) {
    const handleClickDebug = (e) => {
        e.preventDefault();
        const table = document.querySelector(".table-letters");
        const buttonDebug = document.querySelector(".debug-button");
        // alert("Debug : Affichage des lettres devinées et proposées");
        if(table.style.display == "none") {
            table.style.display = "flex";
            buttonDebug.style.display = "none";
        } else {
            table.style.display = "none";
            buttonDebug.style.display = "block";
        }
    }
    
    return (
        <div className="debug">
            <button onClick={handleClickDebug} className="debug-button">Afficher les infos sur vos tentatives</button>
            <div className="table-letters">
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