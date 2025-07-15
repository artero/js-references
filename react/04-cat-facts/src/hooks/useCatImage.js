import { use, useEffect, useState } from "react";
import { catImage } from "../services/catImage";

export default function useCatImage({ fact }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [error, setError] = useState("asdfa");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fact) return;

    setLoading(true);

    catImage(fact.split(" ")[0])
      .then((imageUrl) => {
        setImgUrl(imageUrl);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching cat image:", error);
        setError("Failed to fetch cat image");
      });
  }, [fact]);

  return {
    imgUrl,
    errorImage: error,
    loading,
  };
}
