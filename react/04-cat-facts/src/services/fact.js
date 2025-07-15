const CAT_FACT_SERVICE_URL = "https://catfact.ninja/fact";

export const getFact = async () => {
  try {
    const res = await fetch(CAT_FACT_SERVICE_URL);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    console.log("Response status:", res.status);
    const data = await res.json();
    return data.fact;
  } catch (error) {
    console.error("Error fetching cat fact:", error);
  }
};
