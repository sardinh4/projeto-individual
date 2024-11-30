let socket;

// Conecta ao servidor quando o botão 'btn_random_game' for clicado
document.getElementById('btn_random_game').addEventListener('click', () => {
    if (!socket || socket.disconnected) {
        socket = io(); // Conectar ao servidor Socket.IO
        
        // Escutar o evento 'initial_canvas_state' para receber o estado inicial do canvas
        socket.on('initial_canvas_state', (data) => {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = data; // A imagem em base64 recebida
            img.onload = () => {
                ctx.drawImage(img, 0, 0); // Desenha a imagem recebida no canvas
            };
        });

        // Escutar eventos do canvas para atualizações de outros usuários
        socket.on('draw_data', (data) => {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = data;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
        });
    }
});

// Desconectar ao clicar em qualquer botão do menu
document.querySelectorAll('.menu_nav_btn').forEach((button) => {
    button.addEventListener('click', () => {
        if (socket && socket.connected) {
            socket.disconnect();
        }
    });
});
