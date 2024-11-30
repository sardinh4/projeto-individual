let socket;

document.getElementById('btn_random_game').addEventListener('click', () => {
    if (!socket || socket.disconnected) {
        socket = io(); // Conectar ao servidor Socket.IO
        
        // Escutar eventos do canvas
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
