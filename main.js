let news = [];
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("searchButton");
let url;

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "kea8lyj_sWmvtQq7540wXqaR7QmGH3j7qTJ5PO5mrz8",
    });

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      news = data.articles;
      console.log(news);
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  //1. 검색 키워드 읽어오기
  //2. url에 검색 키워드 붙이기
  //3. 헤더 준비
  //4. url 부르기
  //5. 데이터 가져오기
  //6. 데이터 보여주기

  let keyword = document.getElementById("searchInput").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img
        class="newsImgSize"
        src="${item.media}"
      />
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      <div>${item.rights} * ${item.published_date}</div>
    </div>
  </div>
`;
    })
    .join(" ");

  console.log(newsHTML);
  document.getElementById("newsBoard").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("newsBoard").innerHTML = errorHTML;
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
