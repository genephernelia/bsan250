const assignments = [
  { name: 'Regression analysis report', course: 'Business Analytics', due: '2025-10-16', hours: 3.5, status: 'todo', color: 'blue' },
  { name: 'Interview protocol', course: 'Consumer Behavior', due: '2025-10-17', hours: 1.5, status: 'todo', color: 'coral' },
  { name: 'Operations case study', course: 'Operations Management', due: '2025-10-18', hours: 4, status: 'todo', color: 'green' },
  { name: 'Chapter 7 reading notes', course: 'Marketing Strategy', due: '2025-10-19', hours: 1, status: 'todo', color: 'yellow' },
  { name: 'Dashboard peer review', course: 'Business Analytics', due: '2025-10-13', hours: 1.5, status: 'done', color: 'blue' },
  { name: 'Quiz 4: Segmentation', course: 'Consumer Behavior', due: '2025-10-14', hours: 0.5, status: 'done', color: 'coral' },
  { name: 'Process map exercise', course: 'Operations Management', due: '2025-10-21', hours: 2, status: 'todo', color: 'green' }
];
const weekStart = new Date('2025-10-13T12:00:00');
const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const dayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const dateKey = date => date.toISOString().slice(0, 10);
const parseDate = value => new Date(`${value}T12:00:00`);
const addDays = (date, amount) => { const next = new Date(date); next.setDate(next.getDate() + amount); return next; };

function renderCalendar() {
  const calendar = document.querySelector('#calendarDays');
  calendar.innerHTML = '';
  for (let index = 0; index < 7; index += 1) {
    const date = addDays(weekStart, index);
    const day = document.createElement('div');
    day.className = `day ${index === 3 ? 'today' : ''}`;
    day.dataset.date = dateKey(date);
    day.innerHTML = `<div class="day-head">${dayFmt.format(date)} <strong>${date.getDate()}</strong></div>`;
    calendar.appendChild(day);
  }
  assignments.forEach((assignment, index) => {
    const due = parseDate(assignment.due);
    const dueIndex = Math.round((due - weekStart) / 86400000);
    const dayIndex = Math.max(0, dueIndex - Math.ceil(assignment.hours / 2));
    if (dueIndex < 0 || dueIndex > 6) return;
    const event = document.createElement('div');
    event.className = `event ${assignment.status === 'todo' && dueIndex < 5 ? 'due' : ''}`;
    event.style.top = `${48 + (index % 3) * 68}px`;
    event.style.height = `${Math.max(37, Math.min(65, assignment.hours * 14 + 25))}px`;
    event.innerHTML = `<strong>${assignment.status === 'todo' && dueIndex < 5 ? 'DUE · ' : 'STUDY · '}${assignment.name}</strong><small>${assignment.hours} hr planned</small>`;
    calendar.children[dayIndex].appendChild(event);
  });
}

function renderAssignments() {
  const list = document.querySelector('#assignmentList');
  const sorted = [...assignments].sort((a, b) => a.due.localeCompare(b.due));
  list.innerHTML = sorted.map(assignment => `<div class="assignment-row"><span class="row-dot ${assignment.color}"></span><span class="assignment-name">${assignment.name}</span><span class="assignment-course">${assignment.course}</span><span class="assignment-due"><strong>${fmt.format(parseDate(assignment.due))}</strong>${assignment.status === 'done' ? 'Completed' : 'Due date'}</span><span class="assignment-hours">${assignment.hours} hr</span><span class="status ${assignment.status}">${assignment.status === 'done' ? 'DONE' : 'TO DO'}</span></div>`).join('');
  document.querySelector('#allCount').textContent = assignments.length;
  document.querySelector('#navCount').textContent = assignments.filter(item => item.status === 'todo').length;
}

const modal = document.querySelector('#modal');
document.querySelector('#openModal').addEventListener('click', () => { modal.hidden = false; document.querySelector('[name="name"]').focus(); });
document.querySelector('#closeModal').addEventListener('click', () => { modal.hidden = true; });
modal.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });
document.querySelector('#assignmentForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const courseColors = { 'Business Analytics': 'blue', 'Consumer Behavior': 'coral', 'Operations Management': 'green', 'Marketing Strategy': 'yellow' };
  assignments.push({ name: data.get('name'), course: data.get('course'), due: data.get('due'), hours: Number(data.get('hours')), status: 'todo', color: courseColors[data.get('course')] });
  renderAssignments(); renderCalendar(); modal.hidden = true; event.target.reset();
});
document.querySelector('#todayButton').addEventListener('click', () => document.querySelector('#calendar').scrollIntoView({ behavior: 'smooth' }));
renderAssignments();
renderCalendar();