let news = []; //articles 뽑아내기 위한 배열
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
};

getNews();
