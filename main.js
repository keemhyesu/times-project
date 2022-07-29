let news = [];
let page = 1;
let totalPages = 0;
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

    url.searchParams.set("page", page);
    console.log("url은??", url);

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }

      news = data.articles;
      totalPages = data.totalPages;
      page = data.page;

      console.log(news);
      render();
      pagenation();
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

const pagenation = () => {
  let pagenationHTML = ``;
  // total page 수
  // 내가 보고있는 page

  // page group
  let pageGroup = Math.ceil(page / 5);
  // last page
  let last = pageGroup * 5;
  // first page
  let first = last - 4;

  // first~last page print
  pagenationHTML = ` <li class="page-item" onClick="moveToPage(1)">
  <a class="page-link" href="#" aria-label="Previous">
    <span aria-hidden="true">&lt;&lt;</span>
  </a>
</li><li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(${
    page - 1
  })">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onClick="moveToPage(${i})">${i}</a></li>`;
  }

  pagenationHTML += ` <li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>     <li class="page-item" onClick="moveToPage(${last})">
<a class="page-link" href="#" aria-label="Next">
  <span aria-hidden="true">&gt;&gt;</span>
</a>
</li>`;

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  //1. 이동하고싶은 페이지를 알아야한다.
  page = pageNum;

  //2. 이동하고싶은 페이지를 가지고 api를 다시 호출해야한다.
  getNews();
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
