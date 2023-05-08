import { useEffect, useState } from "react";

export const useGet = <T,>(dbFetch: Promise<T>) => {
  const [data, setData] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    dbFetch
      .then((res) => {
        setData(res);
      })
      .catch((err) => setError(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch };
};
