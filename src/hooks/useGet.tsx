import { useCallback, useEffect, useState } from "react";

export const useGet = <T,>(dbFetch: Promise<T>) => {
  const [data, setData] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    dbFetch
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
};
