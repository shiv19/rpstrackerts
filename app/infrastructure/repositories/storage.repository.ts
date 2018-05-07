import { clear, getString, remove, setString } from 'application-settings';
import { PtStorageRepository } from '~/core/contracts/repositories';

export class StorageRepository implements PtStorageRepository {
  public setItem<T>(key: string, value: T): void {
    const valueStr = JSON.stringify(value);
    setString(key, valueStr);
  }

  public getItem<T>(key: string): T {
    const valueStr = getString(key);
    if (valueStr) {
      return JSON.parse(valueStr);
    } else {
      return undefined;
    }
  }

  public removeItem(key: string): void {
    remove(key);
  }

  public clearAll(): void {
    clear();
  }
}
