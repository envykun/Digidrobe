import { useEffect, useState } from "react";

export const useGetQuote = (url: string) => {
  const [quote, setQuote] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState();
  const fallbackQuote = "If I get sad, I stop being sad and be awesome instead. - Barney Stinson";

  const fetchURL = (url: string) => {
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setQuote(data[0].q + " - " + data[0].a))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchURL(url);
  }, [url]);

  return { quote: error ? fallbackQuote : quote, isLoading };
};
