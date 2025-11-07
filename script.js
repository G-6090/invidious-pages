document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    // Redirect to a public Invidious instance with the search query
    window.location.href = `https://yewtu.be/search?q=${encodeURIComponent(query)}`;
});
