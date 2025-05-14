const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem("agendaEventos")) || [];

const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");
const eventDetails = document.getElementById("eventDetails");
const titleInput = document.getElementById("eventTitle");
const descInput = document.getElementById("eventDescription");
const typeSelect = document.getElementById("eventType");
const saveBtn = document.getElementById("saveEvent");
const editBtn = document.getElementById("editEvent");

function renderCalendar() {
  monthLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  calendar.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  weekdays.forEach(day => {
    const dayHeader = document.createElement("div");
    dayHeader.textContent = day;
    dayHeader.classList.add("weekday");
    calendar.appendChild(dayHeader);
  });

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let i = 1; i <= lastDate; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const dayCell = document.createElement("div");
    dayCell.textContent = i;

    const event = events.find(e => new Date(e.date).toDateString() === date.toDateString());
    if (event) {
      dayCell.classList.add(event.type || 'outro');
    }

    dayCell.addEventListener("click", () => selectDate(i));
    calendar.appendChild(dayCell);
  }
}

function selectDate(day) {
  selectedDate = new Date(currentYear, currentMonth, day);
  titleInput.value = "";
  descInput.value = "";
  typeSelect.value = "";

  const existingEvent = events.find(e => new Date(e.date).toDateString() === selectedDate.toDateString());

  if (existingEvent) {
    titleInput.value = existingEvent.title;
    descInput.value = existingEvent.description;
    typeSelect.value = existingEvent.type;
    saveBtn.style.display = "none";
    editBtn.style.display = "inline-block";
  } else {
    saveBtn.style.display = "inline-block";
    editBtn.style.display = "none";
  }

  document.querySelectorAll(".calendar div").forEach(cell => {
    if (parseInt(cell.textContent) === day) {
      cell.classList.add("selected");
    } else {
      cell.classList.remove("selected");
    }
  });

  eventDetails.style.display = "flex";
}

saveBtn.addEventListener("click", () => {
  const event = {
    title: titleInput.value,
    description: descInput.value,
    type: typeSelect.value,
    date: selectedDate
  };

  events.push(event);
  localStorage.setItem("agendaEventos", JSON.stringify(events));
  alert("Compromisso salvo!");
  eventDetails.style.display = "none";
  renderCalendar();
});

editBtn.addEventListener("click", () => {
  events = events.map(e => {
    if (new Date(e.date).toDateString() === selectedDate.toDateString()) {
      return {
        title: titleInput.value,
        description: descInput.value,
        type: typeSelect.value,
        date: selectedDate
      };
    }
    return e;
  });

  localStorage.setItem("agendaEventos", JSON.stringify(events));
  alert("Compromisso editado!");
  eventDetails.style.display = "none";
  renderCalendar();
});

document.getElementById("cancelEvent").addEventListener("click", () => {
  eventDetails.style.display = "none";
});

document.getElementById("prevMonth").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

renderCalendar();
