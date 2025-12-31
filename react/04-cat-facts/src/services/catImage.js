export const catImage = async (word) => {
  try {
    const res = await fetch(`https://cataas.com/cat/gif/says/${word}`);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error("Error fetching cat image:", error);
  }
};
