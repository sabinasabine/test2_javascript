let isChatStarted = false;
let numArr = [];
let isPreviousCommandNumber = false;
let API_KEY = "353083474bf14150b9a67c0a445ba6b4";
let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=Moscow&country=RU&days=2&key=${API_KEY}`;

function addNewMessage(e) {
  e.preventDefault();
  let answer = "";
  let inputValue = input.value.trim();
  createMessage(inputValue, "user");
  document.getElementById("input-text").value = "";

  if (isChatStarted) {
    if (inputValue.startsWith("/name")) {
      let name = inputValue.replace(/\s/g, "").slice(6);
      answer = `Привет ${name}, приятно познакомится. Я умею считать, введи числа которые надо посчитать`;
    } else if (inputValue.startsWith("/number")) {
      numArr = inputValue
        .replace(/\s/g, "")
        .slice(8)
        .split(",");
      if (isFinite(numArr[0]) && isFinite(numArr[1])) {
        answer = "-, +, *, /";
        isPreviousCommandNumber = true;
      } else {
        answer = "Введите числа";
      }
    } else if (isPreviousCommandNumber & "-+*/".includes(inputValue)) {
      answer =
        inputValue === "-"
          ? `${numArr[0] - numArr[1]}`
          : inputValue === "+"
          ? `${parseFloat(numArr[0]) + parseFloat(numArr[1])}`
          : inputValue === "*"
          ? `${numArr[0] * numArr[1]}`
          : inputValue === "/"
          ? `${numArr[0] / numArr[1]}`
          : `Введите другой знак`;
      isPreviousCommandNumber = false;
    } else if (inputValue.startsWith("/weather")) {
      fetchWeather();
    } else if (inputValue === "/stop") {
      answer = "Всего доброго, если хочешь поговорить пиши /start";
    } else {
      answer = "Я не понимаю, введите другую команду!";
    }
  } else if (inputValue === "/start") {
    isChatStarted = true;
    answer = "Привет, меня зовут Чат-бот, а как зовут тебя?";
  } else {
    answer = "Введите команду /start, для начала общения";
  }
  createMessage(answer, "bot");
}

function createMessage(inputValue, classMessage) {
  if (inputValue !== "") {
    let div = document.createElement("div");
    let divAvatar = document.createElement("div");
    divAvatar.className = "avatar";
    let divText = document.createElement("div");
    divText.className = "text-message";
    let t = document.createTextNode(inputValue);
    div.append(divAvatar);
    divText.append(t);
    div.append(divText);
    div.className += classMessage + " message";
    document.getElementById("chat-message").append(div);
  }
}

function fetchWeather() {
  fetch(url)
    .then(response => response.json())
    .then(result => {
      const results = result.data[1].temp;
      let answer = `Завтра в Москве: ${results}`;
      createMessage(answer, "bot");
    });
}

let btn = document.getElementById("btn");
btn.addEventListener("click", addNewMessage);

let input = document.getElementById("input-text");
let dotsWrap = document.querySelector(".dots-wrap");
input.addEventListener("focus", function() {
  dotsWrap.style.display = "flex";
});
input.addEventListener("blur", function() {
  dotsWrap.style.display = "none";
});

let svgBtn = document.querySelector(".svgBtn");
input.addEventListener("input", function() {
  let inputValue = input.value;
  if (inputValue.length === 0) {
    svgBtn.querySelector(".svgPath").style.fill = "#929292";
  } else {
    svgBtn.querySelector(".svgPath").style.fill = "#F9C35B";
  }
});
