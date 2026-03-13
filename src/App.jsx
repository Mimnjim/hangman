import { useEffect, useState } from "react";
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
    // On crée une variable qui contiendra le mot à deviner / Changera l'état du mot à deviner
  const [ word, setWord ] = useState(null); 

    // On crée une variable qui contiendra les lettres déjà proposées par l'utilisateur / Changera l'état des lettres déjà proposées
  const [guessedLetters, setGuessedLetters] = useState([]);

    // On crée une variable qui contiendra toutes les lettres proposées par l'utilisateur / Changera l'état de toutes les lettres proposées
  const [allLettersProposed, setAllLettersProposed] = useState([]);

    // On crée une variable qui contiendra le nombre de tentatives restantes / Changera l'état du nombre de tentatives restantes
  const [wrongAttempts, setWrongAttempts] = useState(6);



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

  // ==== GESTION DE LA SAISIE AU CLAVIER ====
  const handleKeyboardInput = (letter) => {
    // Vérifier que la lettre n'a pas déjà été proposée
    if (allLettersProposed.includes(letter)) {
      return;
    }

    // Vérifier si c'est une bonne lettre
    if (word && word.toLowerCase().includes(letter.toLowerCase())) {
      setGuessedLetters([...guessedLetters, letter]);
    } else {
      setWrongAttempts(wrongAttempts - 1);
    }
    setAllLettersProposed([...allLettersProposed, letter]);
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Vérifier que c'est une lettre (A-Z ou a-z)
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        const letter = event.key.toUpperCase();
        handleKeyboardInput(letter);
      }
    };

    // Ajouter l'écouteur quand le jeu est en cours
    if (!gameOver) {
      window.addEventListener('keydown', handleKeyPress);
    }

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [word, guessedLetters, allLettersProposed, wrongAttempts, gameOver])

  const handleRestart = () => {
    setWord(null);
    setGuessedLetters([]);
    setAllLettersProposed([]);
    setWrongAttempts(6);
    getNewWord().then(data => {
      setWord(data.word);
    });
  }

  // ==== AFFICHAGE


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