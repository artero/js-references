import { use, useEffect, useMemo, useState } from "react";

import useCatImage from "./hooks/useCatImage";
import useCatFact from "./hooks/useCatFact";

export function App() {
  const { fact, errorFact, resetFact } = useCatFact();
  const { imgUrl, errorImage, loading } = useCatImage({ fact });

  const error = useMemo(() => {
    return errorFact || errorImage;
  }, [errorFact, errorImage]);

  return (
    <main>
      <h1>Cats App</h1>

      <section
        style={{
          marginTop: "20px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <div style={{ width: "250px" }}>
          {fact ? <p>{fact}</p> : <p>Loading...</p>}
        </div>
        {loading ? (
          <p>Loading image...</p>
        ) : (
          <img
            src={imgUrl}
            alt="Image of a cat generated with the first word of cat facts"
            style={{ width: "250px" }}
          />
        )}
      </section>

      {error && (
        <div
          style={{
            color: "red",
            border: "1px solid red",
            padding: "5px",
            background: "#ff002d1a",
            maxWidth: "350px",
            margin: "20px auto",
            display: "block",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <button onClick={() => resetFact()} style={{ marginTop: "20px" }}>
        Get New Cat Fact
      </button>
    </main>
  );
}
