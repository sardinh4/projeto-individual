// let socket;
// let roomId = null; // ID da sala
// let currentCanvasState = null; // Estado atual do canvas

// // Cria a nova sala
// document.querySelectorAll(".btn_new_roon").forEach((button) => {
//   button.addEventListener("click", () => {
//     if (!socket || socket.disconnected) {
//       socket = io(); // Conectar ao servidor Socket.IO
//     }
//     // Criar a sala no servidor
//     createRoom();
//   });
// });

// // Desconectar ao clicar em qualquer botão do menu
// document.querySelectorAll(".menu_nav_btn").forEach((button) => {
//   button.addEventListener("click", () => {
//     if (socket && socket.connected) {
//       socket.disconnect();
//     }
//   });
// });

// // Função para conectar e entrar na sala
// function connectAndJoinRoom(roomId) {
//   socket = io(); // Conecta ao servidor Socket.IO

//   socket.on("connect", () => {
//     console.log("Conectado ao servidor");

//     socket.emit("join_room", roomId, (response) => {
//       if (response.success) {
//         socket.roomId = roomId; // Atribui a sala ao socket
//         console.log(`Entrou na sala ${roomId}`);
//       } else {
//         console.log(response.message);
        
//       }
//     });

//     // Atualiza o canvas com os dados recebidos
//     socket.on("canvas_update", (dataURL) => {
//       const img = new Image();
//       img.src = dataURL;
//       img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
//         ctx.drawImage(img, 0, 0); // Desenha a imagem recebida
//       };
//     });

//     // Recebe o estado inicial do canvas
//     socket.on("initial_canvas_state", (dataURL) => {
//       const img = new Image();
//       img.src = dataURL;
//       img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
//         ctx.drawImage(img, 0, 0); // Desenha o estado inicial
//       };
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("Desconectado do servidor!");
//   });
// }

// // Criar a sala
// function createRoom() {
//   socket.emit("create_room", (response) => {
//     if (response.success) {
//       roomId = response.roomId;
//       console.log(`Sala criada com sucesso: ${roomId}`);
//       socket.emit("join_room", roomId, (response) => {
//         if (response.success) {
//           socket.roomId = roomId; // Atribui a sala ao socket
//           console.log(`Entrou na sala ${roomId}`);
//         } else {
//           console.log(response.message);
//         }

//       });

//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       emitCanvasData(); // Atualiza os dados do canvas

//       // Atualiza o canvas com os dados recebidos
//       socket.on("canvas_update", (dataURL) => {
//         const img = new Image();
//         img.src = dataURL;
//         img.onload = () => {
//           ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
//           ctx.drawImage(img, 0, 0); // Desenha a imagem recebida
//         };
//       });

//       // Recebe o estado inicial do canvas
//       socket.on("initial_canvas_state", (dataURL) => {
//         const img = new Image();
//         img.src = dataURL;
//         img.onload = () => {
//           ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
//           ctx.drawImage(img, 0, 0); // Desenha o estado inicial
//         };
//       });
//     } else {
//       console.log(response.message);
//     }
//   });
// }

// function registerRommHistoryBD(codRoom) {
  

//   fetch("/history/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       userNameServer: sessionStorage.username,
//       codRoomServer: codRoom,
//     }),
//   })
//     .then(function (resposta) {
//       console.log("resposta: ", resposta);

//       if (resposta.ok) {
//         console.log("registerRommHistoryBD() realizado com sucesso! .");

//         return true;
//       } else {
//         throw "Houve um erro ao tentar realizar o registerRommHistoryBD()!";
//       }
//     })
//     .catch(function (resposta) {
//       console.log(`#ERRO: ${resposta}`);
//     });

//   return false;
// }