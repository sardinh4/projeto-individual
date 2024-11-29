let roonsInterval = null;

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
    configureScreenExibition(sections, "home_section", "grid");
  });

  //PLAY
  document.getElementById("play_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "roons_section", "grid");

    // Iniciar o setInterval para exibir as salas enquanto 'roons_section' estiver visível
    startRoonsInterval();
  });

  // DRAW
  document.getElementById("draw_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "draw_section", "grid");
  });

  // MY GALERY
  document.getElementById("my_galery_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "my_galery_section", "grid");
  });

  // MY PROGREES
  document.getElementById("my_progrees_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "my_progress_section", "grid");
  });

  // CONFIGURATION
  document.getElementById("configuration_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "configuration_section", "grid");
  });

  // OUT
  document.getElementById("out_btn").addEventListener("click", () => {
    window.location = "../../auth/auth.html";
  });

  // RANDOM ROON
  document.getElementById("btn_random_game").addEventListener("click", () => {
    configureScreenExibition(sections, "play_section", "grid");
  });

  // LIST ROON
  document.getElementById("btn_list_rooms").addEventListener("click", () => {
    configureScreenExibition(sections, "roons_section", "grid");

    // Iniciar o setInterval para exibir as salas enquanto 'roons_section' estiver visível
    startRoonsInterval();
  });

  // NEW ROON
  document.getElementById("btn_new_roon").addEventListener("click", () => {
    configureScreenExibition(sections, "play_section", "grid");

    // Limpar o setInterval quando mudar a seção
    stopRoonsInterval();
  });

  // RANDOM ROON
  document.getElementById("btn_random_roon").addEventListener("click", () => {
    configureScreenExibition(sections, "play_section", "grid");

    // Limpar o setInterval quando mudar a seção
    stopRoonsInterval();
  });
}

function configureScreenExibition(sections, idSection, display) {
  hideAllSections(sections);
  showSection(idSection, display);

  // Se a seção exibida for 'roons_section', iniciar o setInterval
  if (idSection === "roons_section" && display === "grid") {
    startRoonsInterval();
  } else {
    // Se não for 'roons_section', garantir que o setInterval seja limpo
    stopRoonsInterval();
  }
}

function showSection(idSection, display) {
  document.getElementById(`${idSection}`).style.display = `${display}`;
}

function hideAllSections(sections) {
  sections.forEach((section) => {
    section.style.display = "none";
  });
}

function startRoonsInterval() {
  if (!roonsInterval) {
    roonsInterval = setInterval(showRoons, 1000);
  }
}

function stopRoonsInterval() {
  if (roonsInterval) {
    clearInterval(roonsInterval);
    roonsInterval = null;
  }
}

function showRoons() {
  // Limpar o conteúdo da seção de salas, mas não apagar as salas já existentes
  const roonsContainer = document.getElementById("roons");

  // Faz a requisição para obter as salas mais recentes do banco
  listRoons()
    .then(() => {
      const roons = sessionStorage.roons
        ? JSON.parse(sessionStorage.roons)
        : [];
      const existingRoons = Array.from(
        roonsContainer.getElementsByClassName("roon")
      );

      // Adicionar novas salas
      roons.forEach((item) => {
        const roomExists = existingRoons.some(
          (existingRoom) => existingRoom.dataset.idRoon === item.idRoon
        );

        if (!roomExists) {
          const newRoom = document.createElement("div");
          newRoom.classList.add("roon");
          newRoom.dataset.idRoon = item.idRoon; // Definindo um identificador único para cada sala
          newRoom.innerHTML = `
            <span>Sala: ${item.idRoon}</span>
            <span>Jogadores: ${item.qtdUsers}</span>
          `;
          roonsContainer.appendChild(newRoom);
        }
      });

      // Remover salas que não estão mais no banco de dados
      existingRoons.forEach((existingRoom) => {
        const idRoon = existingRoom.dataset.idRoon;
        const roomInDb = roons.some((item) => item.idRoon === idRoon);

        if (!roomInDb) {
          roonsContainer.removeChild(existingRoom);
        }
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar as salas:", error);
      document.getElementById("roons").innerHTML = "Erro ao carregar as salas.";
    });
}

function listRoons() {
  return fetch("/roons/listRoons", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      console.log("Resposta da requisição:", resposta);

      if (resposta.ok) {
        console.log("Resposta OK!");

        return resposta.json().then((json) => {
          console.log("Dados recebidos:", json);

          // Verifique se o campo roons existe no JSON
          if (json.roons) {
            console.log("Salas recebidas:", json.roons);
            sessionStorage.roons = JSON.stringify(json.roons); // Armazenando dados no sessionStorage
            console.log(
              "Dados armazenados no sessionStorage:",
              sessionStorage.roons
            );
          } else {
            console.error("O campo 'roons' não foi encontrado na resposta");
          }
        });
      } else {
        console.log("Houve um erro ao tentar listar as salas!");

        return resposta.text().then((texto) => {
          console.error("Erro na resposta:", texto);
        });
      }
    })
    .catch(function (erro) {
      console.log("Erro na requisição:", erro);
    });
}
