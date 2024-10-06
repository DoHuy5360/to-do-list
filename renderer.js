const listEvent = document.querySelector("#listEvent");
const clickBtn = document.querySelector("#click");

clickBtn.addEventListener("click", async (e) => {
    const data = await window.electronAPI.getEventList();
    data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.content;
        listEvent.appendChild(li);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    window.task.registerCallback((data) => {
        data.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item.content;
            listEvent.appendChild(li);
        });
    });
});
