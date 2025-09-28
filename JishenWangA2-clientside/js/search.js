const API_BASE_URL = 'http://localhost:3000';

// DOM元素
const searchForm = document.getElementById('search-form');
const resetBtn = document.getElementById('reset-btn');
const categorySelect = document.getElementById('categoryId');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('results-container');

// 初始化：加载分类选项 + 绑定表单事件
async function initSearchPage() {
  await loadCategories();
  searchForm.addEventListener('submit', handleSearch);
  resetBtn.addEventListener('click', resetForm);
}

// 加载所有分类到下拉框
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to load categories');
    }

    const categories = result.data;
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    alert('Error loading categories: ' + err.message);
  }
}

// 处理搜索提交
async function handleSearch(e) {
  e.preventDefault();

  // 获取表单输入值
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const location = document.getElementById('location').value.trim();
  const categoryId = categorySelect.value;

  // 验证日期
  if (startDate && endDate && startDate > endDate) {
    alert('Start date cannot be later than end date');
    return;
  }

  // 显示结果区域和加载提示
  resultsSection.style.display = 'block';
  resultsContainer.innerHTML = '<div style="text-align: center; width: 100%;">Searching events...</div>';

  try {
    // 构建查询参数
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (location) params.append('location', location);
    if (categoryId) params.append('categoryId', categoryId);

    // 调用搜索API
    const response = await fetch(`${API_BASE_URL}/api/events/search?${params.toString()}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to search events');
    }

    const events = result.data;
    renderSearchResults(events);
  } catch (err) {
    resultsContainer.innerHTML = `<div style="text-align: center; width: 100%; color: red;">Error: ${err.message}</div>`;
  }
}

// 渲染搜索结果
function renderSearchResults(events) {
  if (events.length === 0) {
    resultsContainer.innerHTML = '<p style="text-align: center; width: 100%;">No events match your search criteria.</p>';
    return;
  }

  resultsContainer.innerHTML = '';

  events.forEach(event => {
    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // 门票价格显示
    const ticketPrice = ticketPriceNum === 0 
      ? '<span style="color: #27ae60;">Free</span>' 
      : `$${ticketPriceNum.toFixed(2)}`;

    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.innerHTML = `
      <img src="${event.image_url}" alt="${event.title}">
      <div class="event-card-content">
        <span class="category">${event.category_name}</span>
        <h3>${event.title}</h3>
        <div class="details">
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Ticket:</strong> ${ticketPrice}</p>
        </div>
        <a href="event-detail.html?id=${event.id}" class="btn">View Details</a>
      </div>
    `;

    resultsContainer.appendChild(eventCard);
  });
}

// 清空表单
function resetForm() {
  searchForm.reset();
  resultsSection.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initSearchPage);
    