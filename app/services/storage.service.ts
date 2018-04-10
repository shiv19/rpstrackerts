import { getString, setString, remove, clear } from 'application-settings';

export function setItem<T>(key: string, value: T): void {
    const valueStr = JSON.stringify(value);
    setString(key, valueStr);
}

export function getItem<T>(key: string): T {
    const valueStr = getString(key);
    if (valueStr) {
        return JSON.parse(valueStr);
    } else {
        return undefined;
    }
}

export function removeItem(key: string): void {
    remove(key);
}

export function clearAll(): void {
    clear();
}
