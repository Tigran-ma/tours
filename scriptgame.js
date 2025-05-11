const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const livesCanvas = document.getElementById("livesCanvas");
const livescCtx = livesCanvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

livesCanvas.width = 800;
livesCanvas.height = 60;

//загрузка всех изображений
const bonusImg = new Image();
bonusImg.src = "биток.jpg";

const playerRightImg = new Image();
playerRightImg.src = "playerRight.png";

const playerLeftImg = new Image();
playerLeftImg.src = "playerLeft.png";

const enemyImg = new Image();
enemyImg.src = "кредитор.png";

const heartBrightImg = new Image();
heartBrightImg.src = "heartBright.png";

const heartDimmedImg = new Image();
heartDimmedImg.src = "heartDim.png";

//стартовые переменные
let bonuses = [];
const player = { x: 400, y: 300, direction: "right" };
let score = 0;
let enemies = [];
let game = true;
let lives = 1;
let countEnimies = 5;

function createEnemy() {
	enemies.push({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
		vx: Math.random() * 4 - 2,
		vy: Math.random() * 4 - 2,
	});
}

function createBonus() {
	bonuses.push({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
	});
}

function drawPlayer() {
	let image;
	if (player.direction === "right") image = playerRightImg;
	else image = playerLeftImg;
	ctx.drawImage(image, player.x, player.y, 40, 40);
}
canvas.addEventListener("mousemove", function (event) {
	const rect = canvas.getBoundingClientRect();
	const newX = event.clientX - rect.left - 20;

	if (newX > player.x) {
		player.direction = "right";
	} else if (newX < player.x) {
		player.direction = "left";
	}

	player.x = newX;
	player.y = event.clientY - rect.top - 20;
});

for (let i = 0; i < 5; i++) createEnemy();
function drawEnemies() {
	for (let i = 0; i < enemies.length; i++) {
		ctx.drawImage(enemyImg, enemies[i].x - 20, enemies[i].y - 20, 40, 40);
	}
}

for (let i = 0; i < 3; i++) createBonus();
function drawBonuses() {
	for (let i = 0; i < bonuses.length; i++) {
		ctx.drawImage(bonusImg, bonuses[i].x - 20, bonuses[i].y - 20, 40, 40);
	}
}

function updateEnemies() {
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].x += enemies[i].vx;
		enemies[i].y += enemies[i].vy;
		if (enemies[i].x < 0 || enemies[i].x > canvas.width) {
			enemies[i].vx *= -1; //меняем направление при выходе за экран
		}
		if (enemies[i].y < 0 || enemies[i].y > canvas.height) {
			enemies[i].vy *= -1; //меняем направление при выходе за экран
		}
		//проверка столкновения с врагом
		const dx = player.x + 20 - enemies[i].x; //разница между центрами персонажа и вра��а
		const dy = player.y + 20 - enemies[i].y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < 20) {
			if (lives > 1) {
				lives--;
				enemies.splice(i, 1); //удаляем вра��а из массива
				createEnemy();
			} else {
				alert("Игра окончена");
				game = false; //останавливаем игру
				document.location.reload();
			}
		}
	}
}

function collectBonuses() {
	for (let i = 0; i < bonuses.length; i++) {
		const dx = player.x + 20 - bonuses[i].x; //разница между центрами персонажа и монеты
		const dy = player.y + 20 - bonuses[i].y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < 20) {
			//если дистанция меньше 20, то монета попала в область игры
			bonuses.splice(i, 1); //удаляем монету из массива
			score += 10;
			createBonus();
		}
	}
}

function drawScore() {}

function increaseSpeed() {
	enemies.forEach(enemy => {
		enemy.vx *= 1.5;
		enemy.vy *= 1.5;
	});
}
setInterval(increaseSpeed, 30000);

function drawLives() {
	livescCtx.clearRect(0, 0, livesCanvas.width, livesCanvas.height);
	livescCtx.font = "20px Arial";
	livescCtx.fillStyle = "black";
	livescCtx.fillText("Счет: " + score, 10, 40);
	for (let i = 0; i < lives; i++) {
		livescCtx.drawImage(heartBrightImg, 200 + 50 * i, 20, 30, 30);
	}
	livescCtx.drawImage(heartDimmedImg, 250, 20, 30, 30);
	livescCtx.drawImage(enemyImg, 450, 20, 30, 30);
	livescCtx.fillText(" x " + countEnimies, 480, 42);
}

livesCanvas.addEventListener("click", event => {
	const rect = livesCanvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	if (x > 250 && x < 280 && y > 20 && y < 50 && score >= 50 && lives < 2) {
		lives++;
		score -= 50;
	} else if (x > 250 && x < 280 && y > 20 && y < 50 && score < 50) {
		alert("Недостаточно средств для покупки жизни!");
	} else if (x > 450 && x < 480 && y > 20 && y < 50 && score >= 50) {
		score -= 50;
		countEnimies--;
		enemies.splice(0, 1);
	} else if (x > 450 && x < 480 && y > 20 && y < 50 && score < 50) {
		alert("Недостаточно средств для отключения врага!");
	}
});

function gameLoop() {
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawPlayer();
	drawEnemies();
	drawBonuses();
	drawLives();

	updateEnemies();
	collectBonuses();
	if (game) requestAnimationFrame(gameLoop);
}

gameLoop();
