const inputBox =  document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const errorMsg = document.getElementById("error");
const counter = document.getElementById("counter");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";
let newTaskId = null;

function addTask(event){
    
    event.preventDefault();

    const text = inputBox.value.trim();

    if(text === ''){
	errorMsg.textContent = "You must write something!";
    }
    else{
	errorMsg.textContent = "";
	const task = { id: Date.now(), text: text, done: false };
	tasks.push(task);
	newTaskId = task.id;
	inputBox.value = "";
	saveData();
	render();
    }
}

listContainer.addEventListener("click", function(e){
    const li = e.target.closest("li");
    if(!li) return;
    const id = Number(li.dataset.id);

    if(e.target.tagName === "SPAN"){
	tasks = tasks.filter(function(t){ return t.id !== id; });
    }
    else{
	const task = tasks.find(function(t){ return t.id === id; });
	task.done = !task.done;
    }
	saveData();
	render();
},false);

filterButtons.forEach(function(btn){
   btn.addEventListener("click", function(){
	currentFilter = btn.dataset.filter;
	filterButtons.forEach(function(b){
	   b.classList.toggle("active", b === btn);
	});
	render();
   });
});

function render(){
    listContainer.innerHTML = "";

    tasks
        .filter(function(t){
	    if(currentFilter === "active") return !t.done;
	    if(currentFilter === "done") return t.done;
	    return true;
	})
	.forEach(function(task){
	    let li = document.createElement("li");
	    li.textContent = task.text;
	    li.dataset.id = task.id;
	    if(task.done) li.classList.add("checked");
	    

	    let span = document.createElement("span");
	    span.textContent = "×";
	    span.setAttribute("aria-label", "Delete task");
	    li.appendChild(span);

	    listContainer.appendChild(li);
	});

    const left = tasks.filter(function(t){ return !t.done; }).length;
    counter.textContent = tasks.length === 0
	? "Nothing to do 🎉"
	: left + (left === 1 ? " task left" : " tasks left");
}
	
function saveData(){
  try{
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }catch(err){}
}   
function showTask(){
    try{
        const saved = JSON.parse(localStorage.getItem("tasks"));
	tasks = Array.isArray(saved) ? saved : [];
    }catch(err){
       tasks = [];
    }
    render();
}
showTask();
