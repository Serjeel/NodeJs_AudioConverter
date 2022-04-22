let [milliseconds, seconds, minutes] = [0, 0, 0];
let timerRef = document.querySelector('.timerDisplay');
let int = null;

document.getElementById('startRecord').addEventListener('click', () => {
    if (int !== null) {
        clearInterval(int);
    }
    int = setInterval(displayTimer, 10);
});

document.getElementById('stopRecord').addEventListener('click', () => {
    clearInterval(int);
    [milliseconds, seconds, minutes] = [0, 0, 0];
    timerRef.innerHTML = '00 : 00 : 00';
});

function displayTimer() {
    milliseconds += 1;
    if (milliseconds == 100) {
        milliseconds = 0;
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }
    }

    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "0" + milliseconds : milliseconds < 100 ? milliseconds : milliseconds;

    timerRef.innerHTML = `${m} : ${s} : ${ms}`;
}