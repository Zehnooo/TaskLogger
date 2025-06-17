
const form = document.getElementById('task-form');

// BEGIN form inputs
const customRequest = document.getElementById('custom-request');
const taskNameInput = document.getElementById('task-name');
const taskDescInput = document.getElementById('task-desc');
const taskDepartmentInput = document.getElementById('task-department');
const selectedCategoryInput = document.getElementById('task-category');
// END inputs

// BEGIN grab elements
const activeTask = document.getElementById('active-task');

// BEGIN custom request function
function customInputShow(){
console.log(selectedCategoryInput.value);
if (selectedCategoryInput.value === "Custom Request"){
customRequest.style.display = 'flex';
} else {
    customRequest.style.display = 'none';
}
}
// End custom request function

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskName = taskNameInput.value.trim();
    const taskDesc = taskDescInput.value.trim();
    const taskDepartment = taskDepartmentInput.value.trim();
    const taskCategory = selectedCategoryInput.value.trim();
    console.log("Task Name is: ", taskName);
    console.log("Task Description is: ", taskDesc);
    console.log("Task Department is: ", taskDepartment);
    console.log("Task Category is: ", taskCategory);
    activeTask.classList.remove('hidden');
});