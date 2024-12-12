const asyncLocalStorage = {
  getItem: (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      return Promise.resolve(localStorage.getItem(key));
    }

    return Promise.resolve(null);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      return Promise.resolve(localStorage.setItem(key, value));
    }

    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      return Promise.resolve(localStorage.removeItem(key));
    }

    return Promise.resolve();
  }
};

export default asyncLocalStorage;
