const API_BASE_URL = 'http://localhost:3000';

const eventContainer = document.getElementById('event-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const modal = document.getElementById('register-modal');
const closeModalBtn = document.getElementById('close-modal');

async function initDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  if (!eventId) {
    showError('No event ID found. Please select an event from Home or Search page.');
    return;
  }

  await loadEventDetails(eventId);
  bindModalEvents();
}

async function loadEventDetails(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to load event details');
    }

    const event = result.data;
    renderEventDetails(event);
  } catch (err) {
    showError('Error: ' + err.message);
  }
}

function renderEventDetails(event) {
  loadingElement.style.display = 'none';

  // 格式化日期
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentAmount = event.current_amount !== null ? Number(event.current_amount) : 0;
  const goalAmount = event.goal_amount !== null ? Number(event.goal_amount) : 0;
  
  const progressPercent = goalAmount === 0 
    ? 0 
    : Math.min(Math.round((currentAmount / goalAmount) * 100), 100);

  const ticketPriceNum = event.ticket_price !== null ? Number(event.ticket_price) : 0;
  const ticketPrice = ticketPriceNum === 0 
    ? '<span style="color: #27ae60; font-size: 1.1rem;">Free</span>' 
    : `<span style="font-size: 1.1rem;">$${ticketPriceNum.toFixed(2)}</span>`;

  // 渲染详情HTML
  eventContainer.innerHTML = `
    <div class="event-detail-header">
      <h1>${event.title}</h1>
      <div class="meta">
        <p><strong>Category:</strong> ${event.category_name}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Location:</strong> ${event.location}</p>
      </div>
    </div>

    <img src="${event.image_url}" alt="${event.title}" class="event-detail-img">

    <div class="event-description">
      <h3>About This Event</h3>
      <p>${event.full_description}</p>
    </div>

    <div class="ticket-info">
      <h3>Ticket Information</h3>
      <p>Ticket Price: ${ticketPrice}</p>
      <button id="register-btn" class="btn btn-primary" style="margin-top: 1rem;">Register Now</button>
    </div>

    <div class="progress-section">
      <h3>Fundraising Progress</h3>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="progress-text">
        <span>Raised: $${currentAmount.toFixed(2)}</span>
        <span>Goal: $${goalAmount.toFixed(2)} (${progressPercent}%)</span>
      </div>
    </div>
  `;

  // 绑定注册按钮点击事件
  document.getElementById('register-btn').addEventListener('click', openModal);
}

// 显示错误信息
function showError(message) {
  loadingElement.style.display = 'none';
  errorElement.style.display = 'block';
  errorElement.textContent = message;
}

// 绑定模态框事件
function bindModalEvents() {
  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// 打开模态框
function openModal() {
  modal.style.display = 'flex';
}


function closeModal() {
  modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initDetailPage);
    