import { useEffect, useState, type DependencyList } from 'react';

/** Carrega dados da API; `data` é null enquanto carrega ou se falhar (`erro` descreve a falha). */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let vivo = true;
    setLoading(true);
    fn()
      .then((d) => vivo && (setData(d), setErro(null)))
      .catch((e: Error) => vivo && (setData(null), setErro(e.message)))
      .finally(() => vivo && setLoading(false));
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, erro, loading };
}
