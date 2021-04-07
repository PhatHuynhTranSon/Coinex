const STORAGE_KEY = "coinex_preference"

export const getCoinPreferences = () => {
    let preferences = localStorage.getItem(STORAGE_KEY);

    if (!preferences) {
        return [];
    }

    return JSON.parse(preferences);
}

export const addCoinToPreferences = (symbol) => {
    let preferences = getCoinPreferences();
    preferences.push(symbol);
    preferences = JSON.stringify(preferences);
    
    localStorage.setItem(STORAGE_KEY, preferences);
}

export const removeCoinFromPreferences = (symbol) => {
    let preferences = getCoinPreferences();
    preferences = preferences.filter(coin => coin !== symbol);
    preferences = JSON.stringify(preferences);

    localStorage.setItem(STORAGE_KEY, preferences);
}