import { useState, useEffect } from "react";
import { getFact } from "../services/fact";

export default function useCatFact() {
  const [fact, setFact] = useState();
  const [error, setError] = useState();

  const fetchFact = () => {
    getFact()
      .then((newFact) => {
        setFact(newFact);
      })
      .catch((error) => {
        console.error("Error fetching fact:", error);
        setError("Failed to fetch cat fact");
      });
  };

  useEffect(fetchFact, []);

  const resetFact = () => {
    setFact(fetchFact());
    setError(null);
  };

  return {
    fact,
    errorFact: error,
    resetFact,
  };
}
