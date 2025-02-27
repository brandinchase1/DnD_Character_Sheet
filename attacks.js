const weaponsList = [
    // Simple Melee Weapons
    { name: "Club", damage: "1d4", type: "Bludgeoning", attributes: ["Light", "Simple", "Melee"], proficient: false },
    { name: "Dagger", damage: "1d4", type: "Piercing", attributes: ["Finesse", "Light", "Thrown (20/60)", "Simple", "Melee"], proficient: false },
    { name: "Greatclub", damage: "1d8", type: "Bludgeoning", attributes: ["Two-Handed", "Simple", "Melee"], proficient: false },
    { name: "Handaxe", damage: "1d6", type: "Slashing", attributes: ["Light", "Thrown (20/60)", "Simple", "Melee"], proficient: false },
    { name: "Javelin", damage: "1d6", type: "Piercing", attributes: ["Thrown (30/120)", "Simple", "Melee"], proficient: false },
    { name: "Light Hammer", damage: "1d4", type: "Bludgeoning", attributes: ["Light", "Thrown (20/60)", "Simple", "Melee"], proficient: false },
    { name: "Mace", damage: "1d6", type: "Bludgeoning", attributes: ["Simple", "Melee"], proficient: false },
    { name: "Quarterstaff", damage: "1d6", type: "Bludgeoning", attributes: ["Versatile (1d8)", "Simple", "Melee"], proficient: false },
    { name: "Sickle", damage: "1d4", type: "Slashing", attributes: ["Light", "Simple", "Melee"], proficient: false },
    { name: "Spear", damage: "1d6", type: "Piercing", attributes: ["Thrown (20/60)", "Versatile (1d8)", "Simple", "Melee"], proficient: false },

    // Simple Ranged Weapons
    { name: "Crossbow, Light", damage: "1d8", type: "Piercing", attributes: ["Ammunition (80/320)", "Loading", "Two-Handed", "Simple", "Ranged"], proficient: false },
    { name: "Dart", damage: "1d4", type: "Piercing", attributes: ["Finesse", "Thrown (20/60)", "Simple", "Ranged"], proficient: false },
    { name: "Shortbow", damage: "1d6", type: "Piercing", attributes: ["Ammunition (80/320)", "Two-Handed", "Simple", "Ranged"], proficient: false },
    { name: "Sling", damage: "1d4", type: "Bludgeoning", attributes: ["Ammunition (30/120)", "Simple", "Ranged"], proficient: false },

    // Martial Melee Weapons
    { name: "Battleaxe", damage: "1d8", type: "Slashing", attributes: ["Versatile (1d10)", "Martial", " Melee"], proficient: false },
    { name: "Flail", damage: "1d8", type: "Bludgeoning", attributes: ["Martial", " Melee"], proficient: false },
    { name: "Glaive", damage: "1d10", type: "Slashing", attributes: ["Heavy", "Reach", "Two-Handed", "Martial", " Melee"], proficient: false },
    { name: "Greataxe", damage: "1d12", type: "Slashing", attributes: ["Heavy", "Two-Handed", "Martial", " Melee"], proficient: false },
    { name: "Greatsword", damage: "2d6", type: "Slashing", attributes: ["Heavy", "Two-Handed", "Martial", " Melee"], proficient: false },
    { name: "Halberd", damage: "1d10", type: "Slashing", attributes: ["Heavy", "Reach", "Two-Handed", "Martial", " Melee"], proficient: false },
    { name: "Lance", damage: "1d12", type: "Piercing", attributes: ["Reach", "Special", "Martial", " Melee"], proficient: false },
    { name: "Longsword", damage: "1d8", type: "Slashing", attributes: ["Versatile (1d10)", "Martial", " Melee"], proficient: false },
    { name: "Maul", damage: "2d6", type: "Bludgeoning", attributes: ["Heavy", "Two-Handed", "Martial", " Melee"], proficient: false },
    { name: "Morningstar", damage: "1d8", type: "Piercing", attributes: ["Martial", " Melee"], proficient: false },
    { name: "Pike", damage: "1d10", type: "Piercing", attributes: ["Heavy", "Reach", "Two-Handed", "Martial", " Melee"], proficient: false },
    { name: "Rapier", damage: "1d8", type: "Piercing", attributes: ["Finesse", "Martial", " Melee"], proficient: false },
    { name: "Scimitar", damage: "1d6", type: "Slashing", attributes: ["Finesse", "Light", "Martial", " Melee"], proficient: false },
    { name: "Shortsword", damage: "1d6", type: "Piercing", attributes: ["Finesse", "Light", "Martial", " Melee"], proficient: false },
    { name: "Trident", damage: "1d6", type: "Piercing", attributes: ["Thrown (20/60)", "Versatile (1d8)", "Martial", " Melee"], proficient: false },
    { name: "War Pick", damage: "1d8", type: "Piercing", attributes: ["Martial", " Melee"], proficient: false },
    { name: "Warhammer", damage: "1d8", type: "Bludgeoning", attributes: ["Versatile (1d10)", "Martial", " Melee"], proficient: false },
    { name: "Whip", damage: "1d4", type: "Slashing", attributes: ["Finesse", "Reach", "Martial", " Melee"], proficient: false },

    // Martial Ranged Weapons
    { name: "Blowgun", damage: "1", type: "Piercing", attributes: ["Ammunition (25/100)", "Martial", " Ranged"], proficient: false },
    { name: "Crossbow, Hand", damage: "1d6", type: "Piercing", attributes: ["Ammunition (30/120)", "Light", "Loading", "Martial", " Ranged"], proficient: false },
    { name: "Crossbow, Heavy", damage: "1d10", type: "Piercing", attributes: ["Ammunition (100/400)", "Heavy", "Loading", "Two-Handed", "Martial", " Ranged"], proficient: false },
    { name: "Longbow", damage: "1d8", type: "Piercing", attributes: ["Ammunition (150/600)", "Heavy", "Two-Handed", "Martial", " Ranged"], proficient: false },
    { name: "Net", damage: "-", type: "None", attributes: ["Thrown (5/15)", "Special", "Martial", " Ranged"], proficient: false }
];

const weapons = []
const proficiencyBonus = 2;

function createWeaponElement(weapon) {
    const div = document.createElement("div");
    div.classList.add("weapon");

    // Weapon Name
    const name = document.createElement("span");
    name.textContent = weapon.name;
    
    // Quantity
    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.value = 1;
    quantity.min = 1;
    quantity.style.width = "40px";

    // Ability Selector
    const abilitySelect = document.createElement("select");
    Object.keys(abilityModifiers).forEach(stat => {
        const option = document.createElement("option");
        option.value = stat;
        option.textContent = stat;
        abilitySelect.appendChild(option);
    });

    // Attack Bonus
    const attackBonus = document.createElement("span");
    
    // Damage
    const damage = document.createElement("span");
    
    function updateStats() {
        const ability = abilitySelect.value;
        const mod = abilityModifiers[ability] || 0;
        const profBonus = weapon.proficient ? proficiencyBonus : 0;
        attackBonus.textContent = `+${mod + profBonus}`;
        damage.textContent = `${weapon.damage} + ${mod}`;
    }

    abilitySelect.addEventListener("change", updateStats);
    updateStats();

    // Tooltip
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = `<strong>Damage Type:</strong> ${weapon.type}<br><strong>Attributes:</strong> ${weapon.attributes}`;

    div.appendChild(name);
    div.appendChild(quantity);
    div.appendChild(abilitySelect);
    div.appendChild(attackBonus);
    div.appendChild(damage);
    div.appendChild(tooltip);

    document.getElementById("weapon-list").appendChild(div);
}

const weaponContainer = document.getElementById("weapon-list");
weapons.forEach(weapon => {
    weaponContainer.appendChild(createWeaponElement(weapon));
});




const fuse = new Fuse(weaponsList, {
    shouldSort: true,
    threshold: 0.6, // Higher tolerance for typos
    distance: 100,
    includeMatches: true,
    caseSensitive: false,
    minMatchCharLength: 1,
    useExtendedSearch: true,
    location: 0,
    keys: [
        {name: "name", weight:0.8},  // Prioritize weapon name
        {name: "attributes", weight:0.2},  // Also search inside attributes like "Finesse"
    ]
});

// Function to search and display suggestions
function searchWeapons() {
    let input = document.getElementById("weaponName").value.trim();
    let suggestionsBox = document.getElementById("suggestions");
    suggestionsBox.innerHTML = "";

    if (input.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    // Perform fuzzy search (limit to 5 results)
    let results = fuse.search(input, { limit: 5 });

    if (results.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    results.forEach(result => {
        let weapon = result.item;
        let div = document.createElement("div");
        div.classList.add("suggestion");
        div.innerHTML = `<strong>${weapon.name}</strong> <small>(${weapon.damage} ${weapon.type}) (${weapon.attributes.join(", ")})</small>`;
        div.onclick = () => {
            document.getElementById("weaponName").value = weapon.name;
            suggestionsBox.style.display = "none";
        };
        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
}

function addWeapon() {
    event.preventDefault()
    let weaponName = document.getElementById("weaponName").value.trim();
    let weapon = weaponsList.find(w => w.name.toLowerCase() === weaponName.toLowerCase());
    if (weapon) {
        createWeaponElement(weapon)
    } else {
        alert("Weapon not found!");
    }
}

// Close suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (!document.querySelector(".weapon-controls").contains(e.target)) {
        document.getElementById("suggestions").style.display = "none";
    }
});