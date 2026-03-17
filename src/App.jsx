import { useEffect, useState, useRef } from "react";

import { getNewWord } from "./use_api"
import { translations } from "./translations";
import { removeAccents } from "./normalize";

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

const [language, setLanguage] = useState(() => {
  const saved = localStorage.getItem('language');
  return saved || 'fr';
});

  // ==== REF POUR STOCKER L'ÉTAT ACTUEL ====
  const gameStateRef = useRef(null);

  // ==== LOGIQUE DE JEU ====
  const checkWin = () => {
    if(!word) return false;
    const cleanWord = word.toLowerCase().replaceAll("-", "");
    return cleanWord.split("").every(letter => guessedLetters.includes(removeAccents(letter.toUpperCase())));
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
      if (state.word && removeAccents(state.word.toLowerCase()).includes(removeAccents(letter.toLowerCase()))) {          setGuessedLetters([...state.guessedLetters, letter]);
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

    // ==== GESTION DE LA LANGUE & MOT ALEATOIRE ====
    useEffect(() => {
      // Quand la langue change, on récupère un nouveau mot
      setWord(null);
      setGuessedLetters([]);
      setAllLettersProposed([]);
      setWrongAttempts(6);
      getNewWord(language).then(data => {
        setWord(data.word);
      });
    }, [language]); // Dépend du changement de langue


    // Pour actualiesr le localStorage à chaque changement de langue
    useEffect(() => {
      localStorage.setItem('language', language);
    }, [language]);

  const handleRestart = () => {
    setWord(null);
    setGuessedLetters([]);
    setAllLettersProposed([]);
    setWrongAttempts(6);
    getNewWord(language).then(data => {
      setWord(data.word);
    });
  }

  // ==== AFFICHAGE ====

  // Écran de victoire
  if (isWon) {
    return (
      <main className="page-game">
        <h1 className="title-game">{translations[language].title}</h1>
        <div className="game-results-container won">
          <h2>{translations[language].won}</h2>
          <p className="word-reveal">{translations[language].wordWas} <div className="word-reveal-content"><strong>{word}</strong></div></p>
          <button className="restart-button" onClick={handleRestart}>{translations[language].restart}</button>
        </div>
      </main>
    );
  }

  // Écran de défaite
  if (isLost) {
    return (
      <main className="page-game">
        <h1 className="title-game">{translations[language].title}</h1>
        <div className="game-results-container lost">
          <h2>{translations[language].lost}</h2>
          <p className="word-reveal">{translations[language].wordWas} <div className="word-reveal-content"><strong>{word}</strong></div></p>
          <button className="restart-button" onClick={handleRestart}>{translations[language].restart}</button>
        </div>
      </main>
    );
  }

  // Écran de jeu (par défaut)
  return (
    <main className="page-game">
      <h1 className="title-game">{translations[language].title}</h1>

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
        language={language}
      />

      <div className="language-button-container">
        <button className="language-button" onClick={() => setLanguage('fr')}>
            🇫🇷-FR
        </button>
        <button className="language-button" onClick={() => setLanguage('en')}>
            en-GB
        </button>
      </div>

      <LettersPanel 
        guessedLetters={guessedLetters} 
        allLettersProposed={allLettersProposed}
        language={language}
      />

      <Hint 
        word={word} 
        guessedLetters={guessedLetters} 
        setGuessedLetters={setGuessedLetters} 
        setWrongAttempts={setWrongAttempts}
        language={language}
      />
    </main>
  );
}