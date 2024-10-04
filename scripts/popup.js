const input = document.querySelector("#input");
input.addEventListener("input", (e) => {
    e.target.style.height = "5px";
    e.target.style.height = (e.target.scrollHeight) + "px";
})


const clickBtn = document.querySelector("#close");
clickBtn.addEventListener("click", async (e) => {
    window.de.closePopup();
});