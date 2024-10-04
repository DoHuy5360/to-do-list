const clickBtn = document.querySelector("#click");
clickBtn.addEventListener("click", async (e) => {
	const de = await window.electronAPI.ping();
	window.electronAPI.ping02("pong02");
});

window.menuBarAPI.handleOption01((event, arg) => {
	event.sender.send("openPopup", arg);
});
window.menuBarAPI.handleOption02((event, arg) => {
	event.sender.send("view2", arg);
});
