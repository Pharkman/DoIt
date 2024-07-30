// script.js

document.addEventListener('DOMContentLoaded', function() {
  const displayMenuBtn = document.getElementById("side-menu-btn");
  const sideMenuTexts = document.querySelectorAll(".side-bar-text");
  const actionContainer = document.querySelectorAll(".actions-container");
  const closeModal = document.getElementById("close-modal-btn");
  const modal = document.getElementById("modal-overlay");
  const addTaskBtn = document.getElementById("add-task");
  const taskContainer = document.getElementById("tasks-container");
  const form = document.getElementById("form");
  const taskName = document.getElementById("task-name");
  const taskStartTime = document.getElementById("task-start-time");
  const taskEndTime = document.getElementById("task-end-time");
  const submitTaskBtn = document.getElementById("upload-task-btn");

  let taskDataStorage = [];

  function fullMenu() {
    sideMenuTexts.forEach(sideMenuText => {
      if (sideMenuText.classList.contains("side-bar-text")) {
        sideMenuText.classList.remove("side-bar-text");
        sideMenuText.classList.add("side-bar-text-visible");
      } else {
        sideMenuText.classList.remove("side-bar-text-visible");
        sideMenuText.classList.add("side-bar-text");
      }
    });
  }

  function displayActionContainer(event) {
    const actionContainer = event.target.nextElementSibling;
    if (actionContainer && actionContainer.classList.contains("actions-container")) {
      actionContainer.classList.toggle("actions-container-visible");
    }
  }

  function attachActionListeners() {
    const actionBtns = document.querySelectorAll(".action-btn");
    actionBtns.forEach(btn => {
      btn.addEventListener("click", displayActionContainer);
    });
  }

  function displayOverlayModal() {
    modal.classList.remove("create-task-overlay");
    modal.classList.add("create-task-overlay-visible");
  }

  function closeOverlayModal() {
    if (modal.classList.contains("create-task-overlay-visible")) {
      modal.classList.remove("create-task-overlay-visible");
      modal.classList.add("create-task-overlay");
    }
  }

  function handleTaskData(e) {
    e.preventDefault();

    let inputTaskName = taskName.value;
    let inputTaskStartTime = taskStartTime.value;
    let inputTaskEndTime = taskEndTime.value;

    const taskSingleData = {
      TASKinputNAME: inputTaskName,
      TASKstartTIME: inputTaskStartTime,
      TASKendTIME: inputTaskEndTime,
      TASKstatus: "unchecked" // Default status
    };

    if (submitTaskBtn.dataset.index) {
      const index = submitTaskBtn.dataset.index;
      taskDataStorage[index] = taskSingleData;
      submitTaskBtn.textContent = "Add Task";
      delete submitTaskBtn.dataset.index;
    } else {
      taskDataStorage.unshift(taskSingleData);
    }

    localStorage.setItem("taskLocalData", JSON.stringify(taskDataStorage));
    fetchData();
    form.reset();
    taskName.focus();
    closeOverlayModal();
  }

  function fetchData() {
    if (localStorage.getItem("taskLocalData")) {
      taskDataStorage = JSON.parse(localStorage.getItem("taskLocalData"));
    }
    displayTaskOnInterface();
  }

  function displayTaskOnInterface() {
    taskContainer.innerHTML = '';
    taskDataStorage.forEach((e, index) => {
      let NAMEofTASK = e.TASKinputNAME;
      let STRARTTimeOfTask = e.TASKstartTIME;
      let ENDTimeOfTask = e.TASKendTIME;
      let TASKstatus = e.TASKstatus; // Get task status

      let task = document.createElement("div");
      task.classList.add("task");

      let statusAndTaskName = document.createElement("div");
      statusAndTaskName.classList.add("status-and-task-name");

      let statusIConCont = document.createElement("div");
      statusIConCont.classList.add("status-icon");

      let statusIcon = document.createElement("i");
      statusIcon.classList.add("bx", TASKstatus === "checked" ? "bxs-checkbox-checked" : "bx-checkbox");
      statusIcon.style.color = TASKstatus === "checked" ? "#5603AD" : ""; // Set icon color

      // Add click event listener to statusIcon
      statusIcon.addEventListener("click", function() {
        if (statusIcon.classList.contains("bx-checkbox")) {
          statusIcon.classList.remove("bx-checkbox");
          statusIcon.classList.add("bxs-checkbox-checked");
          statusIcon.style.color = "#5603AD";
          task.style.backgroundColor = "#F6F1FB";
          e.TASKstatus = "checked";
        } else {
          statusIcon.classList.remove("bxs-checkbox-checked");
          statusIcon.classList.add("bx-checkbox");
          statusIcon.style.color = ""; // Reset icon color
          task.style.backgroundColor = ""; // Reset to default or your preferred color
          e.TASKstatus = "unchecked";
        }
        localStorage.setItem("taskLocalData", JSON.stringify(taskDataStorage)); // Update local storage
      });

      let taskNameAndTime = document.createElement("div");
      taskNameAndTime.classList.add("task-name-and-time");

      let taskNameText = document.createElement("p");
      taskNameText.classList.add("task-name");
      taskNameText.textContent = NAMEofTASK;

      let timeOfTask = document.createElement("div");
      timeOfTask.classList.add("time-of-task");

      let taskstartTIME = document.createElement("p");
      taskstartTIME.classList.add("task-time");
      taskstartTIME.textContent = STRARTTimeOfTask;

      let divider = document.createElement("div");
      divider.classList.add("divider");

      let taskendTIME = document.createElement("p");
      taskendTIME.classList.add("task-time");
      taskendTIME.textContent = ENDTimeOfTask;

      let actionbtnContainer = document.createElement("div");
      actionbtnContainer.classList.add("action-btn");

      let actionIcon = document.createElement("i");
      actionIcon.classList.add("bx", "bx-dots-horizontal-rounded");

      let actionDropContainer = document.createElement("div");
      actionDropContainer.classList.add("actions-container");

      let editTask = document.createElement("p");
      editTask.classList.add("edit-task");
      editTask.textContent = `Edit`;
      editTask.dataset.index = index;

      let deleteTask = document.createElement("p");
      deleteTask.classList.add("delete-task");
      deleteTask.textContent = `Delete`;
      deleteTask.dataset.index = index;

      actionDropContainer.appendChild(editTask);
      actionDropContainer.appendChild(deleteTask);
      actionbtnContainer.appendChild(actionIcon);
      actionbtnContainer.appendChild(actionDropContainer);

      statusIConCont.appendChild(statusIcon);
      taskNameAndTime.appendChild(taskNameText);
      taskNameAndTime.appendChild(timeOfTask)
      timeOfTask.appendChild(taskstartTIME);
      timeOfTask.appendChild(divider);
      timeOfTask.appendChild(taskendTIME);

      statusAndTaskName.appendChild(statusIConCont);
      statusAndTaskName.appendChild(taskNameAndTime);

      task.appendChild(statusAndTaskName);
      task.appendChild(actionbtnContainer);

      taskContainer.appendChild(task);
    });

    attachActionListeners();
    attachEditDeleteListeners();
  }

  function attachEditDeleteListeners() {
    const editBtns = document.querySelectorAll(".edit-task");
    const deleteBtns = document.querySelectorAll(".delete-task");

    editBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        const index = this.dataset.index;
        const task = taskDataStorage[index];
        
        taskName.value = task.TASKinputNAME;
        taskStartTime.value = task.TASKstartTIME;
        taskEndTime.value = task.TASKendTIME;

        submitTaskBtn.dataset.index = index;
        submitTaskBtn.textContent = "Update Task";

        displayOverlayModal();
      });
    });

    deleteBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        const index = this.dataset.index;
        taskDataStorage.splice(index, 1);
        localStorage.setItem("taskLocalData", JSON.stringify(taskDataStorage));
        fetchData();
      });
    });
  }

  displayMenuBtn.addEventListener("click", fullMenu);
  addTaskBtn.addEventListener("click", displayOverlayModal);
  closeModal.addEventListener("click", closeOverlayModal);
  form.addEventListener("submit", handleTaskData);

  fetchData();
});
