import { articles } from './data.js';

console.log('✅ main.js loaded');
console.log(`📰 Found ${articles.length} articles`);

const categoryContainer = document.getElementById('categoryContainer');
const newsGrid = document.getElementById('newsGridContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const resetAllBtn = document.getElementById('resetAllBtn');
const liveDateSpan = document.getElementById('liveDate');

let activeCategory = 'All';
let searchQuery = '';

// ✅ IMPROVED SORT: Newest added shows FIRST
// Sorts by date first, then by ID (newest ID = newest addition)
function sortByNewest(articlesArray) {
  return [...articlesArray].sort((a, b) => {
    const dateCompare = new Date(b.date) - new Date(a.date);
    if (dateCompare !== 0) return dateCompare;
    // If same date, newer ID (recently added) shows first
    return b.id - a.id;
  });
}

// Custom category order
function getCategories() {
  const cats = [...new Set(articles.map(a => a.category))];
  const customOrder = ['All', 'News'];
  const sorted = [
    ...customOrder.filter(c => cats.includes(c) || c === 'All'),
    ...cats.filter(c => !customOrder.includes(c)).sort()
  ];
  return [...new Set(sorted)];
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function renderCategories() {
  const categories = getCategories();
  categoryContainer.innerHTML = '';
  
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `cat-btn ${activeCategory === cat ? 'active' : ''}`;
    
    let icon = '';
    switch(cat) {
      case 'All': icon = '🌐 '; break;
      case 'News': icon = '📰 '; break;
      case 'Technology': icon = '💻 '; break;
      case 'Business': icon = '📈 '; break;
      case 'Health': icon = '❤️ '; break;
      case 'Sports': icon = '⚽ '; break;
      case 'World': icon = '🌍 '; break;
      default: icon = '📁 ';
    }
    
    btn.innerHTML = `${icon}${cat}`;
    
    btn.addEventListener('click', () => {
      activeCategory = cat;
      renderCategories();
      renderNews();
    });
    categoryContainer.appendChild(btn);
  });
}

function getFilteredArticles() {
  let filtered = [...articles];
  
  if (activeCategory !== 'All') {
    filtered = filtered.filter(a => a.category === activeCategory);
  }
  
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.description.toLowerCase().includes(q)
    );
  }
  
  // ✅ Apply sort - newest first
  filtered = sortByNewest(filtered);
  
  return filtered;
}

function renderNews() {
  const filtered = getFilteredArticles();
  
  console.log(`📊 Displaying ${filtered.length} articles (newest first)`);
  
  if (filtered.length === 0) {
    newsGrid.innerHTML = `<div class="no-results">📭 No matching articles found</div>`;
    return;
  }
  
  newsGrid.innerHTML = filtered.map(article => `
    <div class="news-card">
      <div class="card-img">
        <img src="${article.imageUrl}" alt="${article.alt || 'news image'}" loading="lazy" onerror="this.src='https://picsum.photos/id/1/400/240'">
      </div>
      <div class="card-content">
        <span class="meta-cat">📁 ${article.category}</span>
        <h3 class="news-title">${escapeHtml(article.title)}</h3>
        <p class="news-desc">${escapeHtml(article.description.substring(0, 150))}${article.description.length > 150 ? '...' : ''}</p>
        <div class="card-footer">
          <div class="date-info">📅 ${formatDate(article.date)}</div>
          <button class="read-btn" data-id="${article.id}" data-title="${escapeHtml(article.title)}">Read more →</button>
        </div>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      alert(`📰 "${title}"\n\nFull article coming soon!`);
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function updateSearch() {
  searchQuery = searchInput.value.trim();
  renderNews();
}

function fullReset() {
  activeCategory = 'All';
  searchInput.value = '';
  searchQuery = '';
  renderCategories();
  renderNews();
}

function setLiveDate() {
  const now = new Date();
  liveDateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> ${now.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;
}

searchInput.addEventListener('input', updateSearch);
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  updateSearch();
});
resetAllBtn.addEventListener('click', fullReset);

setLiveDate();
renderCategories();
renderNews();

console.log('✅ NewsFlash ready! Newest added articles show FIRST');
