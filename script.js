
let form = document.getElementById('task-form');
let allTasks = [];
let deletedTasks = [];
let manualEntry = false;

form.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});

// START Timer Functions
let hour = 0o0;
let minute = 0o0;
let second = 0o0;
let count = 0o0;

function stopWatch(){
    if (timer){
        count++;

        if (count == 100){
            second++;
            count = 0;
        }

        if (second == 60){
            minute++;
            second = 0;
        }

        if (minute == 60){
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

        document.getElementById('hr').innerHTML = hrString;
        document.getElementById('min').innerHTML = minString;
        document.getElementById('sec').innerHTML = secString;
        document.getElementById('count').innerHTML = countString;
        setTimeout(stopWatch, 10);

    }
}
// END Timer Functions

// BEGIN form inputs
let taskNameInput = document.getElementById('task-name');
let taskDescInput = document.getElementById('task-desc');
let taskDepartmentInput = document.getElementById('task-department');
let selectedCategoryInput = document.getElementById('task-category');
let otherInput = document.getElementById('other-input');
let startBtn = document.getElementById('start-btn');
let stopButton = document.getElementById('stop-task');
let clearButton = document.getElementById('delete-tasks');
let exportBtn = document.getElementById('export-tasks');
let manualBtn = document.getElementById('manual-entry');
let manualDate = document.getElementById('manual-date');
let manualTime = document.getElementById('manual-time');
let manualTimeSpent = document.getElementById('manual-time-spent');
let manualDateLabel = document.getElementById('manual-date-label');
let manualTimeLabel = document.getElementById('manual-time-label');
let manualTimeSpentLabel = document.getElementById('manual-time-spent-label');
let manualSubmitBtn = document.getElementById('manual-submit');
// END inputs

// BEGIN grab elements
let activeTaskContainer = document.getElementById('active-task');
let activeTaskElement = document.getElementById('active-task-name');
let taskLog = document.getElementById('task-log');
let taskLogTitle = document.getElementById('task-log-title');
let elapsedTime = document.getElementById('task-time');
let logCover = document.getElementById('log-cover');
// END grab elements

// BEGIN custom request function
function customInputShow(){
console.log(selectedCategoryInput.value);
if (selectedCategoryInput.value === "Other"){
otherInput.style.display = 'flex';
} else {
    otherInput.style.display = 'none';
}
}
// END custom request function

// BEGIN 'Submit' Start Task Button
form.addEventListener('submit', function (e) {
    e.preventDefault();

     if (e.submitter && e.submitter.id === 'manual-submit') {
        manualSubmission();
        return;
    }

    if (taskDepartmentInput.value === "default" || selectedCategoryInput.value === "default"){
    alert("Department and/or Category cannot be empty. Please try again.");
    return;
}
    if (selectedCategoryInput.value === "Other"){
         if (otherInput.value.trim() === ""){
        alert("Other category cannot be empty. Please try again.");
        return;
    }
    }
    
    form.style.display = 'none';
    activeTaskContainer.classList.remove('hidden');
    activeTaskElement.textContent = taskNameInput.value.trim();
    startBtn.classList.add('hidden');
    timer = true;
    stopWatch();
});
// END 'Submit' Start Task Button

// BEGIN 'Stop' Stop Task Button
stopButton.addEventListener('click', function () {
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
        time: currentTime
    };

    var newTask = document.createElement('li');
    newTask.classList.add('task-item');

   if (taskCategory === "Other" && otherOption.length > 0) {
        newTask.innerHTML = 
            "<div class='date-time'><span>" + currentDate + "</span>" + '|' + "<span>" + currentTime + "</span></div><div>" + refreshBtn + "<hr>" +
            "<div class='top-line'><span class='listTitle'> Task: </span><span class='listVar'>" + taskName + "</span>" +
            "<span class='listTitle'> Description: </span><span class='listVar'>" + taskDesc + "</span></div>" +
            "<div class='bot-line'><span class='listTitle'> Department: </span><span class='listVar'>" + taskDepartment + "</span>" +
            "<span class='listTitle'> Category (Other): </span><span class='listVar'>" + otherOption + " </span></div>" +
            "<div class='time-spent'><span class='listTitle'>Time Spent: </span><span class='listVar'>" + taskLength + "</span></div>";
    } else {
        newTask.innerHTML = 
             "<div class='date-time'><span>" + currentDate + "</span>" + '|' + "<span>" + currentTime + "</span></div><div>" + refreshBtn + "<hr>" +
            "<div class='top-line'><span class='listTitle'> Task: </span><span class='listVar'>" + taskName + "</span>" +
            "<span class='listTitle'> Description: </span><span class='listVar'>" + taskDesc + "</span></div>" +
            "<div class='bot-line'><span class='listTitle'> Department: </span><span class='listVar'>" + taskDepartment + "</span>" +
            "<span class='listTitle'> Category: </span><span class='listVar'>" + taskCategory + " </span></div>" +
            "<div class='time-spent'><span class='listTitle'>Time Spent: </span><span class='listVar'>" + taskLength + "</span></div>";
    }
    // Reset Stopwatch
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    // Reset Elapsed time 
    document.getElementById('hr').innerHTML = '00';
    document.getElementById('min').innerHTML = '00';
    document.getElementById('sec').innerHTML = '00';
    document.getElementById('count').innerHTML = '00';

    taskNameInput.value = "";
    taskDescInput.value = "";
    taskDepartmentInput.selectedIndex = 0;
    selectedCategoryInput.selectedIndex = 0;
    otherInput.value = "";

    taskLog.prepend(newTask);
    allTasks.push(taskData);
    saveAllTasks();
    
    form.style.display = '';
    otherInput.style.display = 'none';
    activeTaskContainer.classList.add('hidden');
    startBtn.classList.remove('hidden');
    hideLogElements();
});
// END 'Stop' Stop Task Button

// BEGIN Save Tasks
function saveAllTasks(){
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}
// END Save Tasks

// BEGIN Load Tasks
function loadAllTasks() {
    allTasks = [];
    const stored = localStorage.getItem("tasks");
    if (stored) {
        allTasks = JSON.parse(stored); 
        allTasks.forEach(taskData => {
            
            var newTask = document.createElement('li');
            newTask.classList.add('task-item');
            newTask.setAttribute('data-task-id', taskData.id);

            if (taskData.other) {
                newTask.innerHTML = 
                    "<div class='date-time'><span>" + taskData.date + "</span>" + '|' + "<span>" + taskData.time +  "</span>" + refreshBtn + "</div><hr><div class='top-line'><span class='listTitle'> Task: </span><span class='listVar'>" + taskData.name + "</span>" +
                    "<span class='listTitle'> Description: </span><span class='listVar'>" + taskData.desc + "</span></div>" +
                    "<div class='bot-line'><span class='listTitle'> Department: </span><span class='listVar'>" + taskData.department + "</span>" +
                    "</span><span class='listTitle'> Category (Other): </span><span class='listVar'>" + taskData.other + " </span></div><div class='time-spent'><span class='listTitle'>Time Spent: </span><span class='listVar'>" + taskData.length + "</span></div>";
            } else {
                newTask.innerHTML = 
                   "<div class='date-time'><span>" + taskData.date + "</span>" + '|' + "<span>" + taskData.time +  "</span></div><hr><div class='top-line'><span class='listTitle'> Task: </span><span class='listVar'>" + taskData.name + "</span>" +
                    "<span class='listTitle'> Description: </span><span class='listVar'>" + taskData.desc + "</span></div>" +
                    "<div class='bot-line'><span class='listTitle'> Department: </span><span class='listVar'>" + taskData.department + "</span>" +
                    "</span><span class='listTitle'> Category: </span><span class='listVar'>" + taskData.category + " </span></div><div class='time-spent'><span class='listTitle'>Time Spent: </span><span class='listVar'>" + taskData.length + "</span></div>";
            }

            taskLog.prepend(newTask);
        });
    }
    hideLogElements();
}

loadAllTasks();
// END Load Tasks

// BEGIN Delete Tasks
function deleteTasks(){
    allTasks = [];
    localStorage.removeItem("tasks");
    taskLog.innerHTML = "";
}

clearButton.addEventListener('click', function(){
    const confirmed = confirm("Are you sure you want to delete all tasks?");
    if (confirmed){
        deleteTasks();
        loadAllTasks();
        hideLogElements();
    }
});
// END Delete Tasks

// BEGIN Hide Elements
function hideLogElements(){
if (allTasks.length === 0 ){
    exportBtn.style.display = 'none';
    clearButton.style.display = 'none';
    taskLogTitle.style.display = 'none';
} else {
    exportBtn.style.display = ''; 
    clearButton.style.display = '';
    taskLogTitle.style.display = '';
}
}
// END Hide ELements

// Stop commas from breaking csv
function escapeCSVField(field) {
  if (field == null) return '';
  // Convert to string and escape inner quotes
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}
// BEGIN CSV Export
exportBtn.addEventListener("click", exportTasks);
function exportTasks(){
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "Date,Time,Task,Description,Department,Category,Time Spent\n";

    allTasks.forEach(taskData => {
        const row = [
            taskData.date,
            taskData.time,
            taskData.name,
            taskData.desc,
            taskData.department,
            taskData.category,
            taskData.length
        ].map(escapeCSVField).join(",");

        csvContent += row + "\n";
    });
    const contentReady = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", contentReady);
    link.setAttribute("download","tasklog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// END CSV Export

// BEGIN Manual Entry
function manualEntryForm(){
    
manualEntry =  true;

startBtn.classList.toggle('hidden');

manualDate.classList.toggle('hidden');
manualDateLabel.classList.toggle('hidden');

manualTime.classList.toggle('hidden');
manualTimeLabel.classList.toggle('hidden');

manualTimeSpent.classList.toggle('hidden');
manualTimeSpentLabel.classList.toggle('hidden');

manualSubmitBtn.classList.toggle('hidden');

manualDate.value = "";
manualTime.value = "";
manualTimeSpent.value = "";
}


function manualSubmission(){

let taskLength = manualTimeSpent.value;
let taskName = taskNameInput.value.trim();
let taskDesc = taskDescInput.value.trim();
let taskDepartment = taskDepartmentInput.value.trim();
let taskCategory = selectedCategoryInput.value.trim();
let otherOption = otherInput.value.trim();

const [year, month, day] = manualDate.value.split('-');
const currentDate = `${parseInt(month)}/${parseInt(day)}/${year.slice(2)}`;

const [hours, minutes] = manualTime.value.split(':');
const rawTime = new Date();
rawTime.setHours(parseInt(hours));
rawTime.setMinutes(parseInt(minutes));
rawTime.setSeconds(0);

const currentTime = rawTime.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
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
        time: currentTime
    };

var newTask = document.createElement('li');
newTask.setAttribute('data-task-id', taskData.id);
newTask.classList.add('task-item');

if (taskCategory === "Other" && otherOption.length > 0) {
        newTask.innerHTML = 
            "<div class='date-time'><span>" + currentDate + "</span>" + '|' + "<span>" + currentTime + "</span></div><hr>" +
            "<div class='top-line'><span class='listTitle'> Task: </span><span class='listVar'>" + taskName + "</span>" +
            "<span class='listTitle'> Description: </span><span class='listVar'>" + taskDesc + "</span></div>" +
            "<div class='bot-line'><span class='listTitle'> Department: </span><span class='listVar'>" + taskDepartment + "</span>" +
            "<span class='listTitle'> Category (Other): </span><span class='listVar'>" + otherOption + " </span></div>" +
            "<div class='time-spent'><span class='listTitle'>Time Spent: </span><span class='listVar'>" + taskLength + "</span></div>";
    } else {
        newTask.innerHTML = 
             "<div class='date-time'><span>" + currentDate + "</span>" + '|' + "<span>" + currentTime + "</span></div><hr>" +
            "<div class='top-line'><span class='listTitle'> Task: </span><span class='listVar'>" + taskName + "</span>" +
            "<span class='listTitle'> Description: </span><span class='listVar'>" + taskDesc + "</span></div>" +
            "<div class='bot-line'><span class='listTitle'> Department: </span><span class='listVar'>" + taskDepartment + "</span>" +
            "<span class='listTitle'> Category: </span><span class='listVar'>" + taskCategory + " </span></div>" +
            "<div class='time-spent'><span class='listTitle'>Time Spent: </span><span class='listVar'>" + taskLength + "</span></div>";
    }

taskNameInput.value = "";
taskDescInput.value = "";
taskDepartmentInput.selectedIndex = 0;
selectedCategoryInput.selectedIndex = 0;
otherInput.value = "";
manualDate.value = "";
manualTime.value = "";
manualTimeSpent.value = "";

taskLog.prepend(newTask);
allTasks.push(taskData);
saveAllTasks();
    
form.style.display = '';
otherInput.style.display = 'none';

manualEntry =  false;

startBtn.classList.remove('hidden');

manualDate.classList.add('hidden');
manualDateLabel.classList.add('hidden');

manualTime.classList.add('hidden');
manualTimeLabel.classList.add('hidden');

manualTimeSpent.classList.add('hidden');
manualTimeSpentLabel.classList.add('hidden');

manualSubmitBtn.classList.add('hidden');

hideLogElements();
}

manualBtn.addEventListener("click", manualEntryForm);
manualSubmitBtn.addEventListener("click", manualSubmission);
// END Manual Entry