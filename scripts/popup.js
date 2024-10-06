const task_input = document.querySelector("#task_input");
const close_button = document.querySelector("#close_button");
const submit_button = document.querySelector("#submit_button");

// 
task_input.addEventListener("input", (e) => {
    e.target.style.height = "5px";
    e.target.style.height = (e.target.scrollHeight) + "px";
})


close_button.addEventListener("click", async (e) => {
    window.popup.close();
});


submit_button.addEventListener("click", async (e) => {
    const acknowledged = await window.task.save(task_input.value);
    if (acknowledged) {
        alert("success")
    }
});