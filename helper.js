import { AsyncStorage } from 'react-native'

export function saveDataToStorage(key, value) {
    try {
        AsyncStorage.setItem(key, value);
    } catch (error) {
        
    }
}

export async function getDataFromLocal(key) {
    const data = await AsyncStorage.getItem(key);
    return data
}
