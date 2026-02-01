let flashcardsData = [];

// load flashcards from JSON file
async function loadFlashcards() {
  const res = await fetch("flashcards.json");
  const data = await res.json();
  flashcardsData = data;
}

// Show roles on the page
function showRoles() {
  const roleList = document.getElementById("role_list");
  roleList.innerHTML = "";

  flashcardsData.forEach(roleObject => {
    const roleItem = document.createElement("div");
    roleItem.textContent = roleObject.role;
    roleList.appendChild(roleItem);
  });
}

// run when page has loaded
document.addEventListener("DOMContentLoaded", () => {
  loadFlashcards();
  const selectRoleButton = document.querySelector(".role_button");
  // Click handler to show roles
  selectRoleButton.addEventListener("click", showRoles);
});