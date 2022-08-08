let news = []; //articles 뽑아내기 위한 배열
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

const getNews = async () => {
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`
  );
  let header = new Headers({
    "x-api-key": "kea8lyj_sWmvtQq7540wXqaR7QmGH3j7qTJ5PO5mrz8",
  });
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles; // 우리가 보여주려는 데이터는 articles에 있음
  console.log("뉴스", news);
  render();
};

const getNewsByTopic = async (event) => {
  console.log("클릭됨", event.target.textContent);

  let topic = event.target.textContent.toLowerCase();
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  let header = new Headers({
    "x-api-key": "kea8lyj_sWmvtQq7540wXqaR7QmGH3j7qTJ5PO5mrz8",
  });
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;
  console.log("data", news);
  render();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news //news array
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img
        class="newsImgSize"
        src="${
          item.media ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1280px-No_image_3x4.svg.png"
        }"
      / alt="image">
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>${
        item.summary == null || item.summary == ""
          ? "내용없음"
          : item.summary.length > 200
          ? item.summary.substring(0, 200) + "..."
          : item.summary
      }</p>
      <div>${moment(item.published_date).fromNow()} * ${
        item.rights || "no source"
      }</div>
    </div>
  </div>
`;
    })
    .join("");

  document.getElementById("newsBoard").innerHTML = newsHTML;
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

const openSearchBox = () => {
  let inputArea = document.getElementById("inputArea");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

getNews();
