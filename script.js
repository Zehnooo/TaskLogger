
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
let customRequest = document.getElementById('custom-request');
let taskNameInput = document.getElementById('task-name');
let taskDescInput = document.getElementById('task-desc');
let taskDepartmentInput = document.getElementById('task-department');
let selectedCategoryInput = document.getElementById('task-category');
let customRequestInput = document.getElementById('custom-request');
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
if (selectedCategoryInput.value === "Custom Request"){
customRequest.style.display = 'flex';
} else {
    customRequest.style.display = 'none';
}
}
// END custom request function

// BEGIN 'Submit' Start Task Button
form.addEventListener('submit', function (e) {
    e.preventDefault();
    activeTaskContainer.classList.remove('hidden');

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
    let taskCustomRequest = customRequestInput.value.trim();
    const now = new Date();
    console.log(now);

    let taskData = {
        name: taskName,
        desc: taskDesc,
        department: taskDepartment,
        category: taskCategory,
        customRequest: taskCustomRequest,
        length: taskLength
    };

    var newTask = document.createElement('li');
    newTask.classList.add('task-item');

    if (taskCustomRequest) {
        newTask.innerHTML = 
            "<span class='listTitle'> Task: </span><span class='listVar'>" + taskName + "</span>" +
            "<span class='listTitle'> Desc: </span><span class='listVar'>" + taskDesc + "</span>" +
            "<span class='listTitle'> Dept: </span><span class='listVar'>" + taskDepartment + "</span>" +
            "<span class='listTitle'> Category: </span><span class='listVar'>" + taskCustomRequest + "</span><span class='listTitle'>Time Spent</span><span class='listVar'>" + taskLength;
    } else {
        newTask.innerHTML = 
            "<span class='listTitle'> Task: </span><span class='listVar'>" + taskName + "</span>" +
            "<span class='listTitle'> Desc: </span><span class='listVar'>" + taskDesc + "</span>" +
            "<span class='listTitle'> Dept: </span><span class='listVar'>" + taskDepartment + "</span>" +
            "<span class='listTitle'> Category: </span><span class='listVar'>" + taskCategory + "</span></span><span class='listTitle'>Time Spent</span><span class='listVar'>"+ taskLength;
    }
    
    document.getElementById('hr').innerHTML = '00';
    document.getElementById('min').innerHTML = '00';
    document.getElementById('sec').innerHTML = '00';
    document.getElementById('count').innerHTML = '00';

    taskLog.appendChild(newTask);
    allTasks.push(taskData);
    saveAllTasks();
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

            if (taskData.customRequest) {
                newTask.innerHTML = 
                    "<span class='listTitle'>Task:</span> <span class='listVar'>" + taskData.name + "</span>" +
                    " <span class='listTitle'>Desc:</span> <span class='listVar'>" + taskData.desc + "</span>" +
                    " <span class='listTitle'>Dept:</span> <span class='listVar'>" + taskData.department + "</span>" +
                    " <span class='listTitle'>Category:</span> <span class='listVar'>" + taskData.customRequest + "</span><span class='listTitle'>Time Spent</span><span class='listVar'>" + taskData.length;
            } else {
                newTask.innerHTML = 
                    "<span class='listTitle'>Task:</span> <span class='listVar'>" + taskData.name + "</span>" +
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
