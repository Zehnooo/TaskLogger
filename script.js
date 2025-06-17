
const form = document.getElementById('task-form');
const customRequest = document.getElementById('custom-request');

// inputs
const taskNameInput = document.getElementById('task-name');
const taskDescInput = document.getElementById('task-desc');
const taskDepartmentInput = document.getElementById('task-department');
const selectedCategory = document.getElementById('task-category');


function customInputShow(){
console.log(selectedCategory.value);
if (selectedCategory.value === "Custom Request"){
customRequest.style.display = 'flex';
} else {
    customRequest.style.display = 'none';
}
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskName = taskNameInput.value.trim();
    console.log("Task Name is: ", taskName);
});