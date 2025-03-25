// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const characterName = document.getElementById("name");
    const characterImage = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const votesInput = document.getElementById("votes");
    const resetButton = document.getElementById("reset-btn");
  
    function fetchCharacters() {
      fetch(baseURL)
        .then((response) => response.json())
        .then((characters) => {
          characters.forEach((character) => renderCharacter(character));
          displayCharacterDetails(characters[0]); // Display first character by default
        });
    }
  
    function renderCharacter(character) {
      const span = document.createElement("span");
      span.textContent = character.name;
      span.addEventListener("click", () => displayCharacterDetails(character));
      characterBar.appendChild(span);
    }
  
    function displayCharacterDetails(character) {
      characterName.textContent = character.name;
      characterImage.src = character.image;
      characterImage.alt = character.name;
      voteCount.textContent = character.votes;
      detailedInfo.dataset.id = character.id;
    }
  
    votesForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newVotes = parseInt(votesInput.value) || 0;
      const currentVotes = parseInt(voteCount.textContent);
      const updatedVotes = currentVotes + newVotes;
      voteCount.textContent = updatedVotes;
      updateVotesOnServer(detailedInfo.dataset.id, updatedVotes);
      votesForm.reset();
    });
  
    function updateVotesOnServer(id, votes) {
      fetch(`${baseURL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes }),
      });
    }
  
    resetButton.addEventListener("click", () => {
      voteCount.textContent = 0;
      updateVotesOnServer(detailedInfo.dataset.id, 0);
    });
  
    // Bonus: Add new character
    const characterForm = document.getElementById("character-form");
    if (characterForm) {
      characterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newName = document.getElementById("name").value;
        const newImage = document.getElementById("image-url").value;
        const newCharacter = {
          name: newName,
          image: newImage,
          votes: 0,
        };
        
        fetch(baseURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCharacter),
        })
          .then((response) => response.json())
          .then((character) => {
            renderCharacter(character);
            displayCharacterDetails(character);
            characterForm.reset();
          });
      });
    }
  
    fetchCharacters();
  });
  