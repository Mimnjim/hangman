import { useEffect, useState, useRef } from "react";
import { getNewWord } from "./use_api"
import Hangman from "./components/Hangman";
import Keyboard from "./components/Keyboard";
import LettersPanel from "./components/LettersPanel";
import Hint from "./components/Hint";

import './styles/App.css';
import './styles/Keyboard.css';
import './styles/Hangman.css';
import './styles/LettersPanel.css';
import './styles/Hint.css';

export function App() {

  // ==== VARIABLES D'ÉTAT ====
  const [ word, setWord ] = useState(null); 
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [allLettersProposed, setAllLettersProposed] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(6);

  // ==== REF POUR STOCKER L'ÉTAT ACTUEL ====
  const gameStateRef = useRef(null);

  useEffect(() => {
    // On récupère un mot depuis l'API
    getNewWord()
      .then(data => {
        setWord(data.word)
      });
  }, [])

  // ==== LOGIQUE DE JEU ====
  const checkWin = () => {
    if(!word) return false;
    const cleanWord = word.toLowerCase().replaceAll("-", "");
    return cleanWord.split("").every(letter => guessedLetters.includes(letter.toUpperCase()));
  }

  const isLost = wrongAttempts <= 0;
  const isWon = checkWin();
  const gameOver = isLost || isWon;

  // Mettre à jour le ref avec l'état actuel (sans causer de re-render)
  useEffect(() => {
    gameStateRef.current = {
      word: word,
      guessedLetters: guessedLetters,
      allLettersProposed: allLettersProposed,
      wrongAttempts: wrongAttempts
    };
  }, [word, guessedLetters, allLettersProposed, wrongAttempts]);

  // ==== GESTION DE LA SAISIE AU CLAVIER ====
  useEffect(() => {
    if (gameOver) return; // Ne pas écouter les touches si le jeu est terminé

    const handleKeyPress = (event) => {
      // On vérifie que c'est bien une lettre (A-Z ou a-z)
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        const letter = event.key.toUpperCase();

        // On utilise le ref pour accéder à l'état actuel sans re-render
        const state = gameStateRef.current;

        // On vérifie que la lettre n'a pas déjà été proposée
        if (state.allLettersProposed.includes(letter)) {
          return;
        }

        // On vérifie si c'est une bonne lettre
        if (state.word && state.word.toLowerCase().includes(letter.toLowerCase())) {
          setGuessedLetters([...state.guessedLetters, letter]);
        } else {
          setWrongAttempts(state.wrongAttempts - 1);
        }
        setAllLettersProposed([...state.allLettersProposed, letter]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameOver]); // Dépend UNIQUEMENT de l'état gameOver

  const handleRestart = () => {
    setWord(null);
    setGuessedLetters([]);
    setAllLettersProposed([]);
    setWrongAttempts(6);
    getNewWord().then(data => {
      setWord(data.word);
    });
  }

  // ==== AFFICHAGE ====

  // Écran de victoire
  if (isWon) {
    return (
      <main className="page-game">
        <h1 className="title-game">Hangman Game</h1>
        <div className="game-results-container won">
          <h2>Bravo, <br /> tu as gagné !</h2>
          <p className="word-reveal">Le mot était :
            <div className="word-reveal-content"><strong>{word}</strong></div>
          </p>
          <button className="restart-button" onClick={handleRestart}>Recommencer</button>
        </div>
      </main>
    );
  }

  // Écran de défaite
  if (isLost) {
    return (
      <main className="page-game">
        <h1 className="title-game">Hangman Game</h1>
        <div className="game-results-container lost">
          <h2>Game Over, <br /> tu as perdu !</h2>
          <p className="word-reveal">Le mot était :
            <div className="word-reveal-content"><strong>{word}</strong></div>
          </p>
          <button className="restart-button" onClick={handleRestart}>Recommencer</button>
        </div>
      </main>
    );
  }

  // Écran de jeu (par défaut)
  return (
    <main className="page-game">
      <h1 className="title-game">Hangman Game</h1>

      <Keyboard
        word={word}
        guessedLetters={guessedLetters}
        setGuessedLetters={setGuessedLetters}
        wrongAttempts={wrongAttempts}
        setWrongAttempts={setWrongAttempts}
        allLettersProposed={allLettersProposed}
        setAllLettersProposed={setAllLettersProposed}
      />

      <Hangman
        word={word}
        wrongAttempts={wrongAttempts}
        guessedLetters={guessedLetters}
        allLettersProposed={allLettersProposed}
      />

      <LettersPanel 
        guessedLetters={guessedLetters} 
        allLettersProposed={allLettersProposed}
      />

      <Hint 
        word={word} 
        guessedLetters={guessedLetters} 
        setGuessedLetters={setGuessedLetters} 
        setWrongAttempts={setWrongAttempts}
      />

    </main>
  );
}