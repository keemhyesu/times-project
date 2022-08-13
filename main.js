let news = []; //articles 뽑아내기 위한 배열
let page = 1;
let total_pages = 0;

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
  try {
    let header = new Headers({
      "x-api-key": "2_bme4VNvXUDBs3HXySsHJcE_KN42OI-6TW0pyubmZk",
    });

    url.searchParams.set("page", page); // page query 더함

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    console.log("data뭐임", data);
    //에러 발생하면 response.status에 에러코드, data.message로 에러 확인 가능함.
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(news);
      render();
      pagination();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
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

//에러 HTML 보여주는 함수
const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-warning text-center" role="alert">
 ${message}
</div>`;
  document.getElementById("newsBoard").innerHTML = errorHTML;
};

//페이지네이션=> duplicate()의 render 함수 이후에 불러줌
const pagination = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > total_pages) {
    last = total_pages;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;

  if (first >= 6) {
    paginationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
    page - 1
  })">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>     <li class="page-item">
<a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
  <span aria-hidden="true">&lt&lt;</span>
</a>
</li>`;
  }

  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${
      page === i ? "active" : ""
    }"><a class="page-link" href="#" id='page-${i}' onclick="moveToPage(${i})">${i}</a></li>
    `;
  }
  if (last < total_pages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
  <a  class="page-link" href='#'>&gt;</a>
 </li> <li class="page-item" onclick="moveToPage(${total_pages})">
 <a  class="page-link" href='#'>&gt&gt;</a>
</li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  duplicate();
};

searchButton.addEventListener("click", getNewsByKeyword);
getNews();
