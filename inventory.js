let containers = {};
let activeContainer = null;

function addContainer() {
    event.preventDefault();
    const containerName = prompt("Enter container name:");
    if (!containerName || containers[containerName]) return;

    containers[containerName] = [];
    activeContainer = containerName;
    updateContainers();
    updateItems();
}

function removeContainer(name) {
    event.preventDefault();
    delete containers[name];
    activeContainer = Object.keys(containers)[0] || null;
    updateContainers();
    updateItems();
}

function updateContainers() {
    event.preventDefault();
    const pillsContainer = document.getElementById("container-pills");
    pillsContainer.innerHTML = "";
    Object.keys(containers).forEach(name => {
        const pill = document.createElement("div");
        pill.className = "container";
        pill.innerHTML = `<span>${name}</span> <button type='button' onclick="removeContainer('${name}')">&times;</button>`;
        pill.onclick = () => {
            activeContainer = name;
            updateItems();
        };
        pillsContainer.appendChild(pill);
    });
}

function addItem() {
    event.preventDefault();
    if (!activeContainer) {
        alert("No container selected!");
        return;
    }
    const itemName = document.getElementById("item-name").value.trim();
    if (!itemName) return;

    containers[activeContainer].push(itemName);
    document.getElementById("item-name").value = "";
    updateItems();
}

function removeItem(index) {
    event.preventDefault();
    if (activeContainer) {
        containers[activeContainer].splice(index, 1);
        updateItems();
    }
}

function updateItems() {
    event.preventDefault();
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";
    if (!activeContainer) return;

    Object.keys(containers).forEach(key => {
        if (key === activeContainer){
            containers[key].style.borderColor = "green";
            containers[key].style.border = "solid";
        } else {
            // containers[key].style.borderColor = "green";
            containers[key].style.border = "None";
        }
    })


    containers[activeContainer].forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";
        itemDiv.innerHTML = `<span>${item}</span> <button type='button' onclick="removeItem(${index})">&times;</button>`;
        itemList.appendChild(itemDiv);
    });
}