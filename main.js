let news = []; //articles 뽑아내기 위한 배열
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let sideMenuList = document.querySelectorAll(".sideMenuList button");
sideMenuList.forEach((list) =>
  list.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("searchButton");

let url;

const duplicate = async () => {
  let header = new Headers({
    "x-api-key": "kea8lyj_sWmvtQq7540wXqaR7QmGH3j7qTJ5PO5mrz8",
  });
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;

  render();
};

const getNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`
  );
  duplicate();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  duplicate();
};

const getNewsByKeyword = async () => {
  let searchInput = document.getElementById("searchInput").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${searchInput}&from='2022/08/09'&countries=KR&page_size=10`
  );
  duplicate();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img
        class="newsImgSize"
        src="${
          item.media == null || ""
            ? "https://images.assetsdelivery.com/compings_v2/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016.jpg"
            : item.media
        }"
      / alt="image">
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>${
        item.summary == null || item.summary == ""
          ? "내용없음"
          : item.summary.length > 200
          ? item.summary.substring(0, 350) + "..."
          : item.summary
      }</p>
      <div>${moment(item.published_date).fromNow()} * ${item.rights}</div>
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

searchButton.addEventListener("click", getNewsByKeyword);
getNews();
