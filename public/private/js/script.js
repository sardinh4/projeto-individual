let roomsInterval = null;

const sections = document.querySelectorAll(
  ".main_section, #transition_section"
);

window.onload = () => {
  hideAllSections(sections);
  document.getElementById("home_section").style.display = "grid";

  bootButtons();
};

function bootButtons() {
  document.getElementById("username").innerText = `${JSON.parse(
    sessionStorage.username
  )}`;
  
  // HOME
  document.getElementById("home_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "home_section", "30px");
  });

  // NEW ROON
  document.querySelectorAll(".btn_new_roon").forEach((button) => {
    button.addEventListener("click", () => {
      configureScreenExibition(sections, "play_section", 0);
    });
  });

  // PLAY/LIST ROON
  document.querySelectorAll("#play_btn, #btn_list_rooms").forEach((button) => {
    button.addEventListener("click", () => {
      configureScreenExibition(sections, "rooms_section", "30px");
    });
  });

  // DRAW
  document.getElementById("draw_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "draw_section", "30px");
  });

  // MY GALERY
  document.getElementById("my_galery_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "my_galery_section", 0);
  });

  // MY PROGREES
  document.getElementById("my_progrees_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "my_progress_section", 0);
  });

  // CONFIGURATION
  document.getElementById("configuration_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "configuration_section", 0);
  });

  // OUT
  document.getElementById("out_btn").addEventListener("click", () => {
    window.location = "../../auth/auth.html";
  });
}

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
