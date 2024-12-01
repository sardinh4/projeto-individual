var sections = document.querySelectorAll(
    ".main_section, #transition_section"
  );

function configureScreenExibition(sections, idSection, padding) {
    hideAllSections(sections);
    showSection(idSection, padding);
  
    if (idSection === "rooms_section" && !roomsInterval) {
      showRooms();
      roomsInterval = setInterval(() => {
        showRooms();
      }, 1000); 
    } else if (idSection !== "rooms_section" && roomsInterval) {
      clearInterval(roomsInterval); // Para a atualização se não estiver na seção de salas
      roomsInterval = null;
    }
  }
  
  function showSection(idSection, padding) {
    document.getElementById(`${idSection}`).style.display = `grid`;
    document.getElementById("main").style.padding = padding;
  }
  
  function hideAllSections(sections) {
    sections.forEach((section) => {
      section.style.display = "none";
    });
  }