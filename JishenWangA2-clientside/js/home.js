const API_BASE_URL = 'http://localhost:3000';

// DOM元素
const eventsContainer = document.getElementById('events-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

// 初始化：加载首页事件
async function initHomePage() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/home`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to load events');
    }

    const events = result.data;
    if (events.length === 0) {
      eventsContainer.innerHTML = '<p style="text-align: center; width: 100%;">No upcoming events found.</p>';
      return;
    }

    renderEvents(events);
  } catch (err) {
    loadingElement.style.display = 'none';
    errorElement.style.display = 'block';
    errorElement.textContent = 'Error: ' + err.message;
  }
}

// 渲染事件卡片到页面
function renderEvents(events) {
  loadingElement.style.display = 'none';
  eventsContainer.innerHTML = '';

  events.forEach(event => {

    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

 
    const ticketPriceNum = event.ticket_price !== null ? Number(event.ticket_price) : 0;
    
    // 门票价格显示
    const ticketPrice = ticketPriceNum === 0 
      ? '<span style="color: #27ae60;">Free</span>' 
      : `$${ticketPriceNum.toFixed(2)}`;

    // 创建事件卡片
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

    eventsContainer.appendChild(eventCard);
  });
}


document.addEventListener('DOMContentLoaded', initHomePage);
    