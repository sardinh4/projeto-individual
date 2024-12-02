// No modelo dashModel.js

var database = require("../database/config");

async function showHistory(username) {
  try {
    const totalPointsLastWeekQuery = `
      SELECT SUM(uh.points) AS totalPointsLastWeek
      FROM userHistory uh
      JOIN room r ON uh.fkRoom = r.idRoom
      JOIN user u ON uh.fkUser = u.idUser
      WHERE uh.date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND u.username = '${username}';
    `;

    const highestPointsQuery = `
      SELECT MAX(uh.points) AS highestPoints
      FROM userHistory uh
      JOIN user u ON uh.fkUser = u.idUser
      WHERE u.username = '${username}';
    `;

    const totalPointsQuery = `
      SELECT r.codRoom, SUM(uh.points) AS totalPoints
      FROM userHistory uh
      JOIN room r ON uh.fkRoom = r.idRoom
      JOIN user u ON uh.fkUser = u.idUser
      WHERE u.username = '${username}'
      GROUP BY uh.fkRoom
      ORDER BY totalPoints DESC
      LIMIT 1;
    `;

    const totalPointsByRoomQuery = `
      SELECT r.codRoom AS roomCode, 
       SUM(uh.points) AS totalPoints
FROM userHistory uh
JOIN room r ON uh.fkRoom = r.idRoom
JOIN user u ON uh.fkUser = u.idUser
WHERE u.username = '${username}'
GROUP BY r.codRoom, r.criationDate  -- Adicionando r.criationDate ao GROUP BY
ORDER BY r.criationDate;
    `;

    const [
      totalPointsLastWeekResult,
      highestPointsResult,
      totalPointsResult,
      totalPointsByRoomResult
    ] = await Promise.all([
      database.executar(totalPointsLastWeekQuery),
      database.executar(highestPointsQuery),
      database.executar(totalPointsQuery),
      database.executar(totalPointsByRoomQuery)
    ]);

    return {
      totalPointsLastWeek: totalPointsLastWeekResult,
      highestPoints: highestPointsResult,
      totalPointsByRoomTop: totalPointsResult,
      totalPointsByRoom: totalPointsByRoomResult
    };

  } catch (error) {
    console.error("Erro ao executar as consultas:", error);
    throw error; // Re-lança o erro para ser tratado na camada superior
  }
}

module.exports = {
  showHistory,
};
