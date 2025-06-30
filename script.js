let form = document.getElementById("task-form");
let allTasks = [];
let deletedTasks = [];
let manualEntry = false;

form.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});

// START Timer Functions
let hour = 0o0;
let minute = 0o0;
let second = 0o0;
let count = 0o0;

function stopWatch() {
  if (timer) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      hour++;
      second = 0;
      minute = 0;
    }
    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    if (hour < 10) {
      hrString = "0" + hrString;
    }

    if (minute < 10) {
      minString = "0" + minString;
    }

    if (second < 10) {
      secString = "0" + secString;
    }

    if (count < 10) {
      countString = "0" + countString;
    }

    document.getElementById("hr").innerHTML = hrString;
    document.getElementById("min").innerHTML = minString;
    document.getElementById("sec").innerHTML = secString;
    document.getElementById("count").innerHTML = countString;
    setTimeout(stopWatch, 10);
  }
}
// END Timer Functions

// BEGIN form inputs
let taskNameInput = document.getElementById("task-name");
let taskDescInput = document.getElementById("task-desc");
let taskDepartmentInput = document.getElementById("task-department");
let selectedCategoryInput = document.getElementById("task-category");
let otherInput = document.getElementById("other-input");
let otherInputLabel = document.getElementById("other-input-label");
let startBtn = document.getElementById("start-btn");
let stopButton = document.getElementById("stop-task");
let clearButton = document.getElementById("delete-tasks");
let exportBtn = document.getElementById("export-tasks");
let manualBtn = document.getElementById("manual-entry-button");
let manualDate = document.getElementById("manual-date");
let manualTime = document.getElementById("manual-time");
let manualTimeSpent = document.getElementById("manual-time-spent");
let manualDateLabel = document.getElementById("manual-date-label");
let manualTimeLabel = document.getElementById("manual-time-label");
let manualTimeSpentLabel = document.getElementById("manual-time-spent-label");
let manualSubmitBtn = document.getElementById("manual-submit");
let clearFormBtn = document.getElementById("reset-form");
let taskNameFilter = document.getElementById("task-name-filter");
// END inputs

// BEGIN grab elements
let activeTaskContainer = document.getElementById("active-task");
let activeTaskElement = document.getElementById("active-task-name");
let taskLog = document.getElementById("task-log");
let taskLogTitle = document.getElementById("task-log-title");
let elapsedTime = document.getElementById("task-time");
let logCover = document.getElementById("log-cover");
// END grab elements

// BEGIN custom request function
function customInputShow() {
  console.log(selectedCategoryInput.value);
  if (selectedCategoryInput.value === "Other") {
    otherInput.style.display = "flex";
    otherInputLabel.style.display = "flex";
  } else {
    otherInput.style.display = "none";
    otherInputLabel.style.display = "none";
  }
}
// END custom request function

// BEGIN 'Submit' Start Task Button
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (e.submitter && e.submitter.id === "manual-submit") {
    manualSubmission();
    return;
  }

  if (
    taskDepartmentInput.value === "default" ||
    selectedCategoryInput.value === "default"
  ) {
    alert("Department and/or Category cannot be empty. Please try again.");
    return;
  }
  if (selectedCategoryInput.value === "Other") {
    if (otherInput.value.trim() === "") {
      alert("Other category cannot be empty. Please try again.");
      return;
    }
  }
  clearFormBtn.style.display = "none";
  manualBtn.style.display = "none";
  form.style.display = "none";
  activeTaskContainer.classList.remove("hidden");
  activeTaskElement.textContent = taskNameInput.value.toUpperCase().trim();
  startBtn.classList.add("hidden");
  timer = true;
  stopWatch();
});
// END 'Submit' Start Task Button

// BEGIN 'Stop' Stop Task Button
stopButton.addEventListener("click", function () {
  timer = false;
  let taskLength = elapsedTime.textContent;
  let taskName = taskNameInput.value.trim();
  let taskDesc = taskDescInput.value.trim();
  let taskDepartment = taskDepartmentInput.value.trim();
  let taskCategory = selectedCategoryInput.value.trim();
  let otherOption = otherInput.value.trim();

  const now = new Date();
  const currentDate = now.toLocaleDateString();
  const currentTime = now.toLocaleTimeString();

  let taskData = {
    id: crypto.randomUUID(),
    name: taskName,
    desc: taskDesc,
    department: taskDepartment,
    category: taskCategory,
    other: otherOption,
    length: taskLength,
    date: currentDate,
    time: currentTime,
  };

  const newTask = createTaskElement(taskData);
  taskLog.prepend(newTask);
  allTasks.push(taskData);
  saveAllTasks();

  // Reset Stopwatch
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  // Reset Elapsed time
  document.getElementById("hr").innerHTML = "00";
  document.getElementById("min").innerHTML = "00";
  document.getElementById("sec").innerHTML = "00";
  document.getElementById("count").innerHTML = "00";

  taskNameInput.value = "";
  taskDescInput.value = "";
  taskDepartmentInput.selectedIndex = 0;
  selectedCategoryInput.selectedIndex = 0;
  otherInput.value = "";

  clearFormBtn.style.display = "";
  manualBtn.style.display = "";

  form.style.display = "";
  otherInput.style.display = "none";
  activeTaskContainer.classList.add("hidden");
  startBtn.classList.remove("hidden");
  hideLogElements();
});
// END 'Stop' Stop Task Button

// BEGIN Save Tasks
function saveAllTasks() {
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  localStorage.setItem("deleted-tasks", JSON.stringify(deletedTasks));
}
// END Save Tasks

// BEGIN Load Tasks
function loadAllTasks() {
  allTasks = [];

  const stored = localStorage.getItem("tasks");
  if (stored) {
    allTasks = JSON.parse(stored);
    allTasks.forEach((taskData) => {
      const taskElement = createTaskElement(taskData);
      taskLog.prepend(taskElement);
    });
  }
  hideLogElements();
}

loadAllTasks();
// END Load Tasks

// BEGIN Delete Tasks
function deleteTasks() {
  allTasks = [];
  localStorage.removeItem("tasks");
  taskLog.innerHTML = "";
}

clearButton.addEventListener("click", function () {
  const confirmed = confirm("Are you sure you want to delete all tasks?");
  if (confirmed) {
    deleteTasks();
    loadAllTasks();
    hideLogElements();
  }
});
// END Delete Tasks

// BEGIN Hide Elements
function hideLogElements() {
  if (allTasks.length === 0) {
    exportBtn.style.display = "none";
    clearButton.style.display = "none";
    taskLogTitle.style.display = "none";
  } else {
    exportBtn.style.display = "";
    clearButton.style.display = "";
    taskLogTitle.style.display = "";
  }
}
// END Hide ELements

// Stop commas from breaking csv
function escapeCSVField(field) {
  if (field == null) return "";
  // Convert to string and escape inner quotes
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}
// BEGIN CSV Export
exportBtn.addEventListener("click", exportTasks);
function exportTasks() {
  let csvContent = "data:text/csv;charset=utf-8,";

  csvContent += "Date,Time,Task,Description,Department,Category,Time Spent\n";

  allTasks.forEach((taskData) => {
    const row = [
      taskData.date,
      taskData.time,
      taskData.name,
      taskData.desc,
      taskData.department,
      taskData.category,
      taskData.length,
    ]
      .map(escapeCSVField)
      .join(",");

    csvContent += row + "\n";
  });
  const contentReady = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", contentReady);
  link.setAttribute("download", "tasklog.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// END CSV Export

// BEGIN Manual Entry
function manualEntryForm() {
  manualEntry = true;

  startBtn.classList.toggle("hidden");

  manualDate.classList.toggle("hidden");
  manualDateLabel.classList.toggle("hidden");

  manualTime.classList.toggle("hidden");
  manualTimeLabel.classList.toggle("hidden");

  manualTimeSpent.classList.toggle("hidden");
  manualTimeSpentLabel.classList.toggle("hidden");

  manualSubmitBtn.classList.toggle("hidden");

  manualDate.value = "";
  manualTime.value = "";
  manualTimeSpent.value = "";
}

function manualSubmission() {
  let taskLength = manualTimeSpent.value;
  let taskName = taskNameInput.value.trim();
  let taskDesc = taskDescInput.value.trim();
  let taskDepartment = taskDepartmentInput.value.trim();
  let taskCategory = selectedCategoryInput.value.trim();
  let otherOption = otherInput.value.trim();

  const [year, month, day] = manualDate.value.split("-");
  const currentDate = `${parseInt(month)}/${parseInt(day)}/${year.slice(2)}`;

  const [hours, minutes] = manualTime.value.split(":");
  const rawTime = new Date();
  rawTime.setHours(parseInt(hours));
  rawTime.setMinutes(parseInt(minutes));
  rawTime.setSeconds(0);

  const currentTime = rawTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  let taskData = {
    id: crypto.randomUUID(),
    name: taskName,
    desc: taskDesc,
    department: taskDepartment,
    category: taskCategory,
    other: otherOption,
    length: taskLength,
    date: currentDate,
    time: currentTime,
  };

  const newTask = createTaskElement(taskData);
  taskLog.prepend(newTask);
  allTasks.push(taskData);
  saveAllTasks();

  taskNameInput.value = "";
  taskDescInput.value = "";
  taskDepartmentInput.selectedIndex = 0;
  selectedCategoryInput.selectedIndex = 0;
  otherInput.value = "";
  manualDate.value = "";
  manualTime.value = "";
  manualTimeSpent.value = "";

  form.style.display = "";
  otherInput.style.display = "none";

  manualEntry = false;

  startBtn.classList.remove("hidden");

  manualDate.classList.add("hidden");
  manualDateLabel.classList.add("hidden");

  manualTime.classList.add("hidden");
  manualTimeLabel.classList.add("hidden");

  manualTimeSpent.classList.add("hidden");
  manualTimeSpentLabel.classList.add("hidden");

  manualSubmitBtn.classList.add("hidden");

  hideLogElements();
}

manualBtn.addEventListener("click", manualEntryForm);
manualSubmitBtn.addEventListener("click", manualSubmission);
// END Manual Entry

// BEGIN Reuse data
function createRefreshBtn(taskId) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "refresh-btn";
  btn.dataset.taskId = taskId;

  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M4.06 13c-.04-.33-.06-.66-.06-1
               0-4.42 3.58-8 8-8
               2.5 0 4.73 1.15 6.2 2.94
               M19.94 11c.04.33.06.66.06 1
               0 4.42-3.58 8-8 8
               -2.39 0-4.53-.95-6-2.71
               M9 17H6
               M18.2 4v3
               M6 20v-3"
            stroke="#fff" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  btn.addEventListener("click", () => refreshData(taskId));
  return btn;
}

function refreshData(id) {
  console.log(id);
  const task = allTasks.find((t) => t.id === id);

  if (!task || task === undefined) {
    console.log("No task found");
    return;
  }

  if (task.category === "Other") {
    taskNameInput.value = task.name;
    taskDescInput.value = task.desc;
    taskDepartmentInput.value = task.department;
    otherInput.value = task.other;
    selectedCategoryInput.selectedIndex = 6;
    customInputShow();
  } else {
    taskNameInput.value = task.name;
    taskDescInput.value = task.desc;
    taskDepartmentInput.value = task.department;
    selectedCategoryInput.value = task.category;
  }
}
// END Reuse data

// BEGIN reset form
clearFormBtn.addEventListener("click", function () {
  form.reset();
});
// END Reset form

// BEGIN create delete button
function createDeleteBtn(taskId) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "delete-btn";
  btn.dataset.taskId = taskId;

  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.5 6H3.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="M18.83 8.5L18.37 15.4C18.2 18.05 18.11 19.38 17.24 20.19C16.38 21 15.05 21 12.39 21H11.61C8.95 21 7.62 21 6.76 20.19C5.89 19.38 5.8 18.05 5.63 15.4L5.17 8.5"
        stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="M9.5 11L10 16" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="M14.5 11L14 16" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="M6.5 6C6.56 6 6.58 6 6.61 6C7.43 5.98 8.16 5.45 8.44 4.68L8.57 4.29C8.65 4.04 8.7 3.91 8.75 3.81C8.97 3.39 9.38 3.09 9.84 3.02C9.96 3 10.09 3 10.36 3H13.64C13.91 3 14.04 3 14.16 3.02C14.62 3.09 15.03 3.39 15.25 3.81C15.3 3.91 15.35 4.04 15.43 4.29L15.53 4.58C15.84 5.45 16.57 5.98 17.39 6C17.42 6 17.44 6 17.5 6"
        stroke="#fff" stroke-width="2" stroke-linecap="round"/>
</svg>`;

  btn.addEventListener("click", () => deleteTaskLine(taskId));
  return btn;
}
// END create delete button

// BEGIN Task delete by line
function deleteTaskLine(id) {
  const confirmed = confirm("Are you sure you want to delete this task?");

  if (confirmed) {
    const task = allTasks.find((t) => t.id === id);

    if (!task || task === undefined) {
      console.log("No task found");
      return;
    }

    allTasks = allTasks.filter((t) => t.id !== id);
    saveAllTasks();

    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
      taskElement.remove();
    }
    hideLogElements();
  } else {
    return;
  }
}
// END Task delete by line

// BEGIN Task filter
taskNameFilter.addEventListener("input", () => {
  const filter = taskNameFilter.value.trim();
  console.log(filter);

  if (filter.length > 0) {
    let filteredTasks = allTasks.filter((t) => {
      return t.name.toLowerCase().includes(filter.toLowerCase());
    });
    console.log(filteredTasks);
    taskLog.innerHTML = "";

    filteredTasks.forEach((taskData) => {
      const taskElement = createTaskElement(taskData);
      taskLog.prepend(taskElement);
    });

    if (filteredTasks.length === 0) {
      exportBtn.style.display = "none";
      clearButton.style.display = "none";
      taskLogTitle.style.display = "none";
      taskLog.style.display = "none";
    } else {
      exportBtn.style.display = "";
      clearButton.style.display = "";
      taskLogTitle.style.display = "";
      taskLog.style.display = "";
    }
  } else if (!filter) {
    taskLog.innerHTML = "";
    loadAllTasks();
  }
});

function createTaskElement(taskData) {
  const { name, desc, department, category, other, length, date, time, id } =
    taskData;

  const newTask = document.createElement("li");
  newTask.classList.add("task-item");
  newTask.setAttribute("data-task-id", taskData.id);

  if (category === "Other" && other.length > 0) {
    newTask.innerHTML =
      "<div class='date-time'><span>" +
      date +
      "</span>" +
      "<span>" +
      time +
      "</span></div><div class='task-content'>" +
      "<hr>" +
      "<div class='top-line'><span class='listTitle'> Task: </span><span class='listVar'>" +
      name +
      "</span>" +
      "<span class='listTitle'> Description: </span><span class='listVar'>" +
      desc +
      "</span></div>" +
      "<div class='bot-line'><span class='listTitle'> Department: </span><span class='listVar'>" +
      department +
      "</span>" +
      "<span class='listTitle'> Category (Other): </span><span class='listVar'>" +
      other +
      " </span></div>" +
      "<div class='time-spent'><span class='listTitle'>Time Spent: </span><span class='listVar'>" +
      length +
      "</span></div>";
  } else {
    newTask.innerHTML =
      "<div class='date-time'><span>" +
      date +
      "</span>" +
      "<span>" +
      time +
      "</span></div><div class='task-content'>" +
      "<hr>" +
      "<div class='top-line'><span class='listTitle'> Task: </span><span class='listVar'>" +
      name +
      "</span>" +
      "<span class='listTitle'> Description: </span><span class='listVar'>" +
      desc +
      "</span></div>" +
      "<div class='bot-line'><span class='listTitle'> Department: </span><span class='listVar'>" +
      department +
      "</span>" +
      "<span class='listTitle'> Category: </span><span class='listVar'>" +
      category +
      " </span></div>" +
      "<div class='time-spent'><span class='listTitle'>Time Spent: </span><span class='listVar'>" +
      length +
      "</span></div>";
  }

  newTask.querySelector(".date-time").appendChild(createRefreshBtn(id));

  newTask.querySelector(".date-time").appendChild(createDeleteBtn(id));

  return newTask;
}
