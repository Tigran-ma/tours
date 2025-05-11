let score = 0;
let clickPower = 1;
let autoClickerPower = 0;
let autoClickerCost = 50;
let clickerCost = 10;
let autoClickerInterval = null;

function loadData() {
	const savedScore = localStorage.getItem("score");

	if (savedScore) score = parseInt(savedScore);

	document.getElementById("score").innerHTML = score;
}

function saveData() {
	localStorage.setItem("score", score);
}

let cl = document.getElementById("click");
cl.addEventListener("click", function () {
	score += clickPower;
	document.getElementById("score").innerHTML = score;

	const animtext = document.createElement("div");
	animtext.innerHTML = `+${clickPower}₿`;
	animtext.className = "animText";
	animtext.style.top = `${cl.clientHeight}px`;
	animtext.style.left = `${cl.clientWidth / 2}px`;
	cl.appendChild(animtext);
	setTimeout(() => animtext.remove(), 1000);
	saveData();
});

function upgradeClick() {
	if (score >= clickerCost) {
		score -= clickerCost;
		clickPower++;
		clickerCost *= 2;
		document.getElementById("score").innerHTML = score;
		document.getElementById("priseClick").innerHTML = clickerCost;
	}
	saveData();
}

function autoClick() {
	if (score >= autoClickerCost) {
		score -= autoClickerCost;
		autoClickerPower++;
		autoClickerCost *= 3;
		document.getElementById("score").innerHTML = score;
		document.getElementById("priseAuto").innerHTML = autoClickerCost;
		autoClickerInterval = setInterval(function () {
			score += autoClickerPower;
			document.getElementById("score").innerHTML = score;
		}, 1000);
	}
	saveData();
}

loadData();
