const events = [
  {
    id: 1,
    title: "Campus Hackathon",
    category: "Technical",
    date: "18 Oct 2026",
    time: "10:00 AM",
    venue: "CSED Block",
    price: "Free entry",
    description: "Team up, build a useful idea and present your project.",
    art: "technical",
    symbol: "</>"
  },
  {
    id: 2,
    title: "Jamming Session",
    category: "Cultural",
    date: "21 Oct 2026",
    time: "5:30 PM",
    venue: "Skywalk stairs",
    price: "Free entry",
    description: "An evening for music and new talent.",
    art: "cultural",
    symbol: "♫"
  },
  {
    id: 3,
    title: "Inter-Hostel Badminton",
    category: "Sports",
    date: "24 Oct 2026",
    time: "9:00 AM",
    venue: "Indoor Sports Complex",
    price: "Free entry",
    description: "Join the draw, meet other players and compete for your hostel.",
    art: "sports",
    symbol: "↗"
  },
  {
    id: 4,
    title: "Web Development 101",
    category: "Technical",
    date: "27 Oct 2026",
    time: "2:00 PM",
    venue: "LT101",
    price: "Free entry",
    description: "A beginner-friendly session on building your first website.",
    art: "workshop",
    symbol: "{ }"
  },
  {
    id: 5,
    title: "Autumn Cultural Fest",
    category: "Cultural",
    date: "30 Oct 2026",
    time: "4:00 PM",
    venue: "OAT",
    price: "Free entry",
    description: "Performances, student stalls and activities throughout the evening.",
    art: "cultural",
    symbol: "✦"
  },
  {
    id: 6,
    title: "Football Friendly",
    category: "Sports",
    date: "2 Nov 2026",
    time: "4:30 PM",
    venue: "College Football Ground",
    price: "Free entry",
    description: "Bring your team or come along to support your friends.",
    art: "sports",
    symbol: "⚽"
  }
];

const eventGrid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const eventCount = document.getElementById("eventCount");
const emptyState = document.getElementById("emptyState");
const modal = document.getElementById("registrationModal");
const registrationForm = document.getElementById("registrationForm");
const selectedEventId = document.getElementById("selectedEventId");
const modalEventName = document.getElementById("modalEventName");
const formMessage = document.getElementById("formMessage");
const toast = document.getElementById("toast");

let selectedCategory = "All";

function getRegistrations() {
  return JSON.parse(localStorage.getItem("campusConnectRegistrations") || "[]");
}

function saveRegistrations(registrations) {
  localStorage.setItem("campusConnectRegistrations", JSON.stringify(registrations));
}

function renderEvents() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch = `${event.title} ${event.description} ${event.venue}`
      .toLowerCase()
      .includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  eventGrid.innerHTML = filteredEvents.map((event) => `
    <article class="event-card">
      <div class="event-art art-${event.art}">
        <span class="art-symbol">${event.symbol}</span>
      </div>
      <div class="event-body">
        <div class="event-topline">
          <span class="category-tag">${event.category}</span>
          <span class="event-date">${event.date}</span>
        </div>
        <h3>${event.title}</h3>
        <p class="event-description">${event.description}</p>
        <p class="event-meta"><span>◷</span> ${event.time}</p>
        <p class="event-meta"><span>⌖</span> ${event.venue}</p>
        <div class="event-footer">
          <span class="event-price">${event.price}</span>
          <button class="register-btn" data-event-id="${event.id}">Register →</button>
        </div>
      </div>
    </article>
  `).join("");

  eventCount.textContent = `${filteredEvents.length} event${filteredEvents.length === 1 ? "" : "s"} found`;
  emptyState.classList.toggle("hidden", filteredEvents.length !== 0);
}

function openRegistration(eventId) {
  const event = events.find((item) => item.id === Number(eventId));
  if (!event) return;

  selectedEventId.value = event.id;
  modalEventName.textContent = `${event.title} · ${event.date}`;
  formMessage.textContent = "";
  registrationForm.reset();
  selectedEventId.value = event.id;
  modal.classList.remove("hidden");
  document.getElementById("studentName").focus();
}

function closeRegistration() {
  modal.classList.add("hidden");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.setTimeout(() => toast.classList.add("hidden"), 2600);
}

eventGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".register-btn");
  if (button) openRegistration(button.dataset.eventId);
});

searchInput.addEventListener("input", renderEvents);

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  selectedCategory = button.dataset.category;
  document.querySelectorAll(".filter-btn").forEach((filterButton) => {
    filterButton.classList.toggle("active", filterButton === button);
  });
  renderEvents();
});

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const eventId = Number(selectedEventId.value);
  const chosenEvent = events.find((item) => item.id === eventId);

  if (!name || !email || !chosenEvent) {
    formMessage.textContent = "Please fill in all fields.";
    return;
  }

  const registrations = getRegistrations();
  const alreadyRegistered = registrations.some(
    (registration) => registration.eventId === eventId &&
      registration.email.toLowerCase() === email.toLowerCase()
  );

  if (alreadyRegistered) {
    formMessage.textContent = "This email is already registered for this event.";
    return;
  }

  registrations.push({
    eventId,
    eventTitle: chosenEvent.title,
    name,
    email,
    registeredAt: new Date().toISOString()
  });

  saveRegistrations(registrations);
  closeRegistration();
  showToast(`You're registered for ${chosenEvent.title}!`);
});

document.getElementById("closeModal").addEventListener("click", closeRegistration);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeRegistration();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeRegistration();
});

document.getElementById("myEventsBtn").addEventListener("click", () => {
  const registrations = getRegistrations();

  if (registrations.length === 0) {
    showToast("You haven't registered for any events yet.");
    return;
  }

  const eventList = registrations
    .map((registration) => `• ${registration.eventTitle} — ${registration.name}`)
    .join("\n");

  window.alert(`Your registrations\n\n${eventList}`);
});

renderEvents();
