const API_URL = 'http://localhost:3333';

export async function getNewWord(language = 'fr') {
    let locale = 'fr-FR';
    
    if (language === 'fr') {
        locale = 'fr-FR';
    } else {
        locale = 'en-GB';
    }

    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `locale=${locale}`
    });

    if (!response.ok) {
        throw new Error('Erreur API');
    }

    const data = await response.json();
    return data;
}