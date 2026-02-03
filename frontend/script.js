let flashcardsData = [];

// Load flashcards from JSON file
async function loadFlashcards() {
  const res = await fetch("flashcards.json");
  const data = await res.json();
  flashcardsData = data;
}

// Show roles in the selection panel
function showRoles() {
  const panel = document.getElementById("selection_panel");
  const panelTitle = document.getElementById("panel_title");
  const panelOptions = document.getElementById("panel_options");
  // Make sure the panel is visible
  panel.classList.remove("hidden");
  panelTitle.textContent = "Select a Role";
  panelOptions.innerHTML = "";
  // Render each role
  flashcardsData.forEach(roleObject => {
    const roleItem = document.createElement("div");
    roleItem.className = "option_item";
    roleItem.textContent = roleObject.role;

    panelOptions.appendChild(roleItem);
  });
}

// Run when page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadFlashcards();
  const selectRoleButton = document.querySelector(".role_button");
  // Click handler to show roles
  selectRoleButton.addEventListener("click", showRoles);
});
