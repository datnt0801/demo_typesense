// Định nghĩa hàm search

async function search() {
  // Lấy giá trị từ ô nhập
  const query = document.getElementById("searchInput").value;
  const apiUrl = `http://localhost:8108/collections/books/documents/search?q=${query}&query_by=title,authors&sort_by=ratings_count:desc`;
  const apiKey = 'xyz';

  // let searchParameters = {
  //   'q': `${query}`,
  //   'query_by': 'title',
  //   'sort_by': 'ratings_count:desc'
  // }

  // Gửi yêu cầu tìm kiếm đến Typesense API
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-TYPESENSE-API-KEY': apiKey
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // const response = await typesenseClient.collections('books')
    //   .documents()
    //   .search(searchParameters)
    //   .then(function (searchResults) {
    //     console.log(searchResults)
    //   })
    // if (!response) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    const data = await response.json();

    // Hiển thị kết quả tìm kiếm
    displayResults(data.hits);
  } catch (error) {
    console.error('Error searching:', error);
  }
}

// Hàm hiển thị kết quả tìm kiếm
function displayResults(results) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  // Duyệt qua các kết quả và hiển thị
  results.forEach(result => {
    const resultElement = document.createElement("div");
    resultElement.classList.add("result");
    resultElement.innerHTML = `
      <h2>${result.document.title}</h2>
      <p>Authors: ${result.document.authors.join(", ")}</p>
      <p>Publication Year: ${result.document.publication_year}</p>
      <p>Ratings Count: ${result.document.ratings_count}</p>
      <p>Average Rating: ${result.document.average_rating}</p>
    `;
    resultsContainer.appendChild(resultElement);
  });
}


