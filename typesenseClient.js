const Typesense = require('typesense');
const fs = require('fs/promises');

// Khởi tạo client Typesense với cấu hình
const typesenseClient = new Typesense.Client({
  // Định nghĩa các nút Typesense Server
  nodes: [
    {
      host: 'localhost', // Địa chỉ máy chủ
      port: '8108',      // Cổng mặc định
      protocol: 'http', // Giao thức
    },
  ],
  // Khóa API cho Typesense
  apiKey: 'xyz',
});

module.exports = typesenseClient;

console.log('Typesense client initialized successfully.');

let booksSchema = {
  'name': 'books',
  'fields': [
    { 'name': 'title', 'type': 'string' },
    { 'name': 'authors', 'type': 'string[]', 'facet': true },

    { 'name': 'publication_year', 'type': 'int32', 'facet': true },
    { 'name': 'ratings_count', 'type': 'int32' },
    { 'name': 'average_rating', 'type': 'float' }
  ],
  'default_sorting_field': 'ratings_count'
}

// Tạo collection mới trong Typesense
let create_collection = async () => {
  try {
    // Xóa collection "books" nếu nó đã tồn tại
    await typesenseClient.collections('books').delete();
    console.log('Deleted existing collection: books');
  } catch (error) {
    // Nếu collection không tồn tại, bắt lỗi và tiếp tục
    console.error('Failed to delete existing collection:',);
  }

  try {
    // Tạo collection mới với schema đã định nghĩa
    await typesenseClient.collections().create(booksSchema);

    console.log('Created collection: books');
  } catch (error) {
    console.error('Failed to create collection:',);
  }
}
create_collection();

(async () => {
  let booksInJsonl;
  try {
    // Đợi cho việc đọc dữ liệu từ tệp books.jsonl hoàn tất
    booksInJsonl = await fs.readFile("./tmp/books.jsonl");

    // Import dữ liệu vào máy chủ Typesense
    await typesenseClient.collections('books').documents().import(booksInJsonl);
    console.log("Data imported successfully.");
  } catch (error) {
    console.error("Failed to import data:", error);
  }
})();


// let searchParameters = {
//   'q': 'harry potter',
//   'query_by': 'title',
//   'sort_by': 'ratings_count:desc'
// }

// typesenseClient.collections('books')
//   .documents()
//   .search(searchParameters)
//   .then(function (searchResults) {
//     console.log(searchResults)
//   })


