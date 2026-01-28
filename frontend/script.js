// load flashcards from JSON file and log to console
async function loadFlashcards() {
  const res = await fetch("flashcards.json");
  const data = await res.json();
  console.log(data);
}

loadFlashcards();
