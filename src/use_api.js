const API_URL = 'http://localhost:3333';

export async function getNewWord() {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "locale=fr-FR"
    });

    if (!response.ok) {
        throw new Error('Erreur API');
    }

    const data = await response.json();
    // alert(data.word);
    return data;

}