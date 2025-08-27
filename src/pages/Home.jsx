import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("programming"); // default search
  const [uiPage, setUiPage] = useState(1); // page for UI (20 per page)
  const [apiPage, setApiPage] = useState(1); // page for API (100 per request)
  const [totalCount, setTotalCount] = useState(0);

  const booksPerPage = 20; // UI page size
  const apiPageSize = 100; // API returns up to 100

  // 🔹 Fetch one API page (100 results)
  const fetchBooks = async (searchQuery = query, pageNum = apiPage) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${searchQuery}&page=${pageNum}`
      );
      const data = await res.json();

      setBooks(data.docs); // keep the whole 100
      setTotalCount(data.numFound); // total results count
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle new search
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setUiPage(1);
    setApiPage(1);
    fetchBooks(newQuery, 1);
  };

  // 🔹 Refetch when apiPage changes
  useEffect(() => {
    fetchBooks(query, apiPage);
  }, [apiPage]);

  // 🔹 Calculate slices for UI pagination
  const totalUiPages = Math.ceil(totalCount / booksPerPage);
  const startIndex = ((uiPage - 1) % (apiPageSize / booksPerPage)) * booksPerPage;
  const currentBooks = books.slice(startIndex, startIndex + booksPerPage);

  // 🔹 Change UI page (also adjust API page if needed)
  const goToPage = (newPage) => {
    setUiPage(newPage);

    // If newPage falls into a different API page, load that
    const neededApiPage = Math.floor((newPage - 1) / (apiPageSize / booksPerPage)) + 1;
    if (neededApiPage !== apiPage) {
      setApiPage(neededApiPage);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="p-6">
      <SearchBar onSearch={handleSearch} />

      {totalCount > 0 && (
        <p className="text-center mt-4">
          Found <strong>{totalCount}</strong> books
        </p>
      )}

      {loading && <p className="text-center mt-4">🔄 Loading...</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {currentBooks.map((book, idx) => (
          <BookCard key={idx} book={book} />
        ))}
      </div>

      {/* 🔹 Pagination Controls */}
      {totalUiPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => goToPage(uiPage - 1)}
            disabled={uiPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span>
            Page {uiPage} of {totalUiPages}
          </span>
          <button
            onClick={() => goToPage(uiPage + 1)}
            disabled={uiPage === totalUiPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}
    </main>
  );
}

export default Home;
