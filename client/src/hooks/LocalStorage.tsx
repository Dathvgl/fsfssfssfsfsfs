function useLocalStorage<T>(name: string) {
  const getLocal = () => {
    const local = localStorage.getItem(name);
    if (!local) return undefined;
    return JSON.parse(local) as T;
  };

  const setLocal = (value: T) => {
    localStorage.setItem(name, JSON.stringify(value));
  };

  const removeLocal = () => localStorage.removeItem(name);

  return { getLocal, setLocal, removeLocal };
}

export default useLocalStorage;
