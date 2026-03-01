let timerInterval;
let totalSeconds = 0;
let totalSteps = 0;
let isGameStarted = false;

const timeDisplay = document.getElementById("time");
const startBtn = document.querySelector(".start-btn button");
const playingSection = document.querySelector(".playing-section");

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function shuffleSquares() {
  let squares = Array.from(
    document.querySelectorAll(".playing-section div:not(.square-12)"),
  );

  for (let i = 0; i < 100; i++) {
    const rand1 = Math.floor(Math.random() * squares.length);
    const rand2 = Math.floor(Math.random() * squares.length);
    [squares[rand1], squares[rand2]] = [squares[rand2], squares[rand1]];
  }

  squares.forEach((sq) => playingSection.appendChild(sq));
  playingSection.appendChild(document.querySelector(".square-12"));
}

function startTimer() {
  clearInterval(timerInterval);
  totalSeconds = 0;
  timeDisplay.innerText = "00:00";
  timerInterval = setInterval(() => {
    totalSeconds++;
    timeDisplay.innerText = formatTime(totalSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function addHistory() {
  const tbody = document.querySelector(".history table tbody");
  if (!tbody) return;

  const newRow = tbody.insertRow();
  newRow.insertCell(0).innerText = tbody.rows.length;
  newRow.insertCell(1).innerText = totalSteps;
  newRow.insertCell(2).innerText = timeDisplay.innerText;
}

function checkWin() {
  const allSquares = Array.from(
    document.querySelectorAll(".playing-section div"),
  );
  let isWin = true;

  for (let i = 0; i < 11; i++) {
    if (parseInt(allSquares[i].innerText) !== i + 1) {
      isWin = false;
      break;
    }
  }

  if (isWin && isGameStarted) {
    stopTimer();
    addHistory();
    isGameStarted = false;
    startBtn.innerText = "Bắt đầu";
    setTimeout(() => alert("YOU WIN!"), 100);
  }
}

function swapSquares(idx1, idx2, allSquares) {
  const sq1 = allSquares[idx1];
  const sq2 = allSquares[idx2];

  const temp = document.createElement("div");
  sq1.parentNode.insertBefore(temp, sq1);
  sq2.parentNode.insertBefore(sq1, sq2);
  temp.parentNode.insertBefore(sq2, temp);
  temp.parentNode.removeChild(temp);
}

startBtn.addEventListener("click", () => {
  if (startBtn.innerText === "Bắt đầu") {
    startBtn.innerText = "Kết thúc";
    isGameStarted = true;
    totalSteps = 0;
    shuffleSquares();
    startTimer();
  } else {
    startBtn.innerText = "Bắt đầu";
    isGameStarted = false;
    stopTimer();
  }
});

window.addEventListener("keydown", (e) => {
  if (!isGameStarted) return;

  const allSquares = Array.from(
    document.querySelectorAll(".playing-section div"),
  );
  const blackSq = document.querySelector(".square-12");
  const blackIdx = allSquares.indexOf(blackSq);
  let targetIdx = -1;
  const key = e.key.toLowerCase();

  if (key === "w" || key === "arrowup") {
    if (blackIdx >= 4) targetIdx = blackIdx - 4;
  } else if (key === "s" || key === "arrowdown") {
    if (blackIdx <= 7) targetIdx = blackIdx + 4;
  } else if (key === "a" || key === "arrowleft") {
    if (blackIdx % 4 !== 0) targetIdx = blackIdx - 1;
  } else if (key === "d" || key === "arrowright") {
    if (blackIdx % 4 !== 3) targetIdx = blackIdx + 1;
  }

  if (targetIdx !== -1) {
    swapSquares(blackIdx, targetIdx, allSquares);
    totalSteps++;
    checkWin();
  }
});
