
let form = document.getElementById('task-form');
let allTasks = [];
let deletedTasks = [];

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
// END inputs

// BEGIN grab elements
let activeTaskContainer = document.getElementById('active-task');
let activeTaskElement = document.getElementById('current-task-name');
let taskLog = document.getElementById('task-log');
let elapsedTime = document.getElementById('task-time');
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
    
    
    activeTaskContainer.classList.remove('hidden');
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
            "<span class='date-time'>" + currentDate + ' ' + currentTime + "</span><span class='listTitle'> Task: </span><span class='listVar'>" + taskName + "</span>" +
            "<span class='listTitle'> Desc: </span><span class='listVar'>" + taskDesc + "</span>" +
            "<span class='listTitle'> Dept: </span><span class='listVar'>" + taskDepartment + "</span>" +
            "<span class='listTitle'> Category (Other): </span><span class='listVar'>" + otherOption + "</span><span class='listTitle'>Time Spent</span><span class='listVar'>" + taskLength;
    } else {
        newTask.innerHTML = 
            "<span class='date-time'>" + currentDate + ' ' + currentTime + "</span><span class='listTitle'> Task: </span><span class='listVar'>" + taskName + "</span>" +
            "<span class='listTitle'> Desc: </span><span class='listVar'>" + taskDesc + "</span>" +
            "<span class='listTitle'> Dept: </span><span class='listVar'>" + taskDepartment + "</span>" +
            "<span class='listTitle'> Category: </span><span class='listVar'>" + taskCategory + "</span></span><span class='listTitle'>Time Spent</span><span class='listVar'>"+ taskLength;
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
    
    otherInput.style.display = 'none';
    activeTaskContainer.classList.add('hidden');
    startBtn.classList.remove('hidden');
});
// END 'Stop' Stop Task Button

// BEGIN Save Tasks
function saveAllTasks(){
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}
// END Save Tasks

// BEGIN Load Tasks
function loadAllTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
        allTasks = JSON.parse(stored); 
        allTasks.forEach(taskData => {
            
            var newTask = document.createElement('li');
            newTask.classList.add('task-item');

            if (taskData.other) {
                newTask.innerHTML = 
                    "<span class='date-time'>" + taskData.date + ' ' + taskData.time + "</span><span class='listTitle'>Task:</span> <span class='listVar'>" + taskData.name + "</span>" +
                    " <span class='listTitle'>Desc:</span> <span class='listVar'>" + taskData.desc + "</span>" +
                    " <span class='listTitle'>Dept:</span> <span class='listVar'>" + taskData.department + "</span>" +
                    " <span class='listTitle'>Category:</span> <span class='listVar'>" + taskData.other + "</span><span class='listTitle'>Time Spent</span><span class='listVar'>" + taskData.length;
            } else {
                newTask.innerHTML = 
                    "<span class='date-time'>" + taskData.date + ' ' + taskData.time + "</span><span class='listTitle'>Task:</span> <span class='listVar'>" + taskData.name + "</span>" +
                    " <span class='listTitle'>Desc:</span> <span class='listVar'>" + taskData.desc + "</span>" +
                    " <span class='listTitle'>Dept:</span> <span class='listVar'>" + taskData.department + "</span>" +
                    " <span class='listTitle'>Category:</span> <span class='listVar'>" + taskData.category + "</span><span class='listTitle'>Time Spent</span><span class='listVar'>" + taskData.length;
            }

            taskLog.appendChild(newTask);
        });
    }
}

loadAllTasks();
// END Load Tasks

// BEGIN Delete Tasks
function deleteTasks(){
    let allTasks = [];
    localStorage.removeItem("tasks");
    taskLog.innerHTML = "";
}
clearButton.addEventListener('click', function(){
deleteTasks();
loadAllTasks();
});
// END Delete Tasks
