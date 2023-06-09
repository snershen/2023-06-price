const url = "https://hexschool.github.io/js-filter-data/data.json";

const showList = document.querySelector(".showList");
const select = document.querySelector("#js-select");
const filterBtn = document.querySelector(".button-group");
const searchBtn = document.querySelector(".search");
const crop = document.querySelector("#crop");
const searchResult = document.querySelector("#js-crop-name");
let tempData = [];
let inputResult = tempData;

axios
  .get(url)
  .then((res) => {
    let apiData = res.data;
    tempData = apiData;
    //渲染出所有 item
    loading(apiData);
    return apiData;
  })
  .then((apiData) => {
    // console.log(apiData);
    filterBtn.addEventListener("click", (e) => {
      // console.log(filterBtn.children);
      searchResult.textContent = "";
      if (e.target.nodeName === "BUTTON") {
        //類別按鈕樣式切換
        Array.from(filterBtn.children).forEach((childBtn) => {
          childBtn.classList.remove("btn-type-active");
        });
        e.target.classList.add("btn-type-active");
        //篩選出符合類別的資料
        if (e.target.dataset.type === "all") {
          loading(apiData);
          tempData = apiData;
        } else {
          categoryFilter(apiData, e.target.dataset.type);
          if (tempData.length > 0) {
            loading(tempData);
          }
        }
      }
    });
    select.addEventListener("change", (e) => {
      if (inputResult.length != 0) {
        sortUpPrice(inputResult, e.target.value);
        loading(inputResult);
        // console.log(tempData, inputResult);
      } else {
        sortUpPrice(apiData, e.target.value);
        loading(apiData);
      }
    });
    searchBtn.addEventListener("click", (e) => {
      if (crop.value != "") {
        searchResult.textContent = `查看「${crop.value}」的比價結果`;
        inputResult = inputFilter(tempData, crop.value);
        // console.log(inputResult);
        if (inputResult.length > 0) {
          // console.log(inputResult);
          loading(inputResult);
        } else {
          tempData = apiData;
          showList.innerHTML = `<td colspan="7" class="text-center p-3">查詢不到當日的交易資訊QQ</td>`;
        }
        // console.log(true, tempData.length);
      } else {
        searchResult.textContent = "";
        alert("請輸入欲搜尋的作物名稱");
        // console.log(false);
        crop.textContent = "";
      }
      crop.value = "";
    });
  });

//頁面渲染
function renderData(data) {
  let str = "";
  data.forEach((item) => {
    str += `<tr>
    <td width="15%">${item["作物名稱"]}</td>
    <td width="15%">${item["市場名稱"]}</td>
    <td width="14%">
      <div class="inline-flex sort-advanced">
      ${item["上價"]}
        <span>
          <i data-price="上價" data-sort="up" class="fas fa-caret-up"></i>

          <i data-price="上價" data-sort="down" class="fas fa-caret-down"></i>
        </span>
      </div>
    </td>
    <td width="14%">
      <div class="inline-flex sort-advanced">
      ${item["中價"]}
        <span>
          <i data-price="中價" data-sort="up" class="fas fa-caret-up"></i>

          <i data-price="中價" data-sort="down" class="fas fa-caret-down"></i>
        </span>
      </div>
    </td>
    <td width="14%">
      <div class="inline-flex sort-advanced">
      ${item["下價"]}
        <span>
          <i data-price="下價" data-sort="up" class="fas fa-caret-up"></i>

          <i data-price="下價" data-sort="down" class="fas fa-caret-down"></i>
        </span>
      </div>
    </td>
    <td width="14%">
      <div class="inline-flex sort-advanced">
      ${item["平均價"]}
        <span>
          <i data-price="平均價" data-sort="up" class="fas fa-caret-up"></i>

          <i data-price="平均價" data-sort="down" class="fas fa-caret-down"></i>
        </span>
      </div>
    </td>
    <td width="14%">
      <div class="inline-flex sort-advanced">
      ${item["交易量"]}
        <span>
          <i data-price="交易量" data-sort="up" class="fas fa-caret-up"></i>

          <i data-price="交易量" data-sort="down" class="fas fa-caret-down"></i>
        </span>
      </div>
    </td>
  </tr>`;
  });
  showList.innerHTML = str;
  return str;
}

function categoryFilter(data, target) {
  tempData = data.filter((item) => {
    return target === item["種類代碼"];
  });
}

function sortUpPrice(data, price) {
  tempData = data.sort((a, b) => {
    return b[price] - a[price];
  });
}

function inputFilter(data, input) {
  //只會篩選出一模一樣的內容
  // tempData = data.filter((item) => {
  //   return item["作物名稱"] === input;
  // });
  //部分文字符合即可
  const searchResult = data.filter((item) => {
    if (item["作物名稱"]) {
      return item["作物名稱"].indexOf(input) > -1;
    }
  });
  return searchResult;
}

function loading(data) {
  showList.innerHTML = `<td colspan="7" class="text-center p-3">資料查詢中...</td>`;
  setTimeout(() => {
    renderData(data);
  }, 250);
}
