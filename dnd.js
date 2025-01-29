const abilityModifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
};

const skills = [
    { name: "Acrobatics", ability: "dexterity", proficient: 0 },
    { name: "Animal Handling", ability: "wisdom", proficient: 0 },
    { name: "Arcana", ability: "intelligence", proficient: 0 },
    { name: "Athletics", ability: "strength", proficient: 0 },
    { name: "Deception", ability: "charisma", proficient: 0 },
    { name: "History", ability: "intelligence", proficient: 0 },
    { name: "Insight", ability: "wisdom", proficient: 0 },
    { name: "Intimidation", ability: "charisma", proficient: 0 },
    { name: "Investigation", ability: "intelligence", proficient: 0 },
    { name: "Medicine", ability: "wisdom", proficient: 0 },
    { name: "Nature", ability: "intelligence", proficient: 0 },
    { name: "Perception", ability: "wisdom", proficient: 0 },
    { name: "Performance", ability: "charisma", proficient: 0 },
    { name: "Persuasion", ability: "charisma", proficient: 0 },
    { name: "Religion", ability: "intelligence", proficient: 0 },
    { name: "Sleight of Hand", ability: "dexterity", proficient: 0 },
    { name: "Stealth", ability: "dexterity", proficient: 0 },
    { name: "Survival", ability: "wisdom", proficient: 0 },
];

let total_level = 0;

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

const classContainer = document.getElementById('class-container');
const classSelector = document.getElementById('class-selector');
const addClassButton = document.getElementById('add-class');
const hitDiceContainer = document.getElementById('hit-dice'); // New hit dice container


///////////////////// Image Selector
const imageSelectorContainer = document.getElementById('image-selector-container');
const imageSelector = document.getElementById('image-selector');
const images = imageSelector.querySelectorAll('img');
const currentImage = document.getElementById('current-image');
let hoverTimeout;

const showSelector = () => {
    clearTimeout(hoverTimeout);
    imageSelector.style.display = 'flex';
};

const hideSelector = () => {
    hoverTimeout = setTimeout(() => {
        imageSelector.style.display = 'none';
    }, 100); 
};

imageSelectorContainer.addEventListener('mouseenter', showSelector);
imageSelectorContainer.addEventListener('mouseleave', hideSelector);
imageSelector.addEventListener('mouseenter', showSelector);
imageSelector.addEventListener('mouseleave', hideSelector);

images.forEach((img) => {
    img.addEventListener('click', () => {
        // Remove "selected" class from all images
        images.forEach((img) => img.classList.remove('selected'));

        // Add "selected" class to clicked image
        img.classList.add('selected');

        // Update body background image
        if (img.dataset.src !== null){
            document.body.style.backgroundImage = `url(${img.dataset.src})`;
        
            // Update the current image preview
            currentImage.src = img.dataset.src;
        }
    });
});

/////////////////////
const updateTotalLevelAndProficiency = () => {
    const classPills = document.querySelectorAll('#class-container .pill input.level');
    let total_level = 0;

    classPills.forEach((input) => {
        total_level += parseInt(input.value) || 0;
    });

    const proficiency_bonus = Math.max(2, 2 + Math.floor((total_level - 1) / 4));
    document.getElementById('proficiency-bonus').textContent = `+${proficiency_bonus}`;
    updateAbilityModifiers();
    updateSkillModifiers();
};

addClassButton.addEventListener('click', () => {
    const selectedClass = classSelector.value;
    if (selectedClass !== "") {
        const existingClassPill = Array.from(classContainer.children).find(
            pill => pill.dataset.class === selectedClass
        );

        if (existingClassPill) {
            const levelInput = existingClassPill.querySelector('input.level');
            levelInput.value = Math.max(Math.min(parseInt(levelInput.value) + 1, levelInput.max), levelInput.min);
        } else {
            // Create class pill
            const classPill = document.createElement('div');
            classPill.className = 'pill';
            classPill.dataset.class = selectedClass;

            classPill.innerHTML = `
                <span>${selectedClass}</span>
                Level: <input type="number" value="1" min="1" max="20" class="level" style="width: 40px;" />
                <button type="button">&times;</button>
            `;

            // Add event listener to remove class pill
            classPill.querySelector('button[type="button"]').addEventListener('click', () => {
                classContainer.removeChild(classPill);
                updateHitDice();
                updateTotalLevelAndProficiency();
            });

            // Add event listener for level input
            const levelInput = classPill.querySelector('.level');
            levelInput.addEventListener('input', () => {
                updateHitDice();
                updateTotalLevelAndProficiency();
            });

            classContainer.appendChild(classPill);
        }
    }
    updateHitDice();
    updateTotalLevelAndProficiency();
});

// Update hit dice function
const updateHitDice = () => {
    const classPills = document.querySelectorAll('#class-container .pill');
    const hitDiceCounts = {};

    // Calculate total hit dice for each type
    classPills.forEach(pill => {
        const selectedClass = pill.dataset.class;
        const level = parseInt(pill.querySelector('.level').value) || 0;
        const hitDiceType = dndClasses[selectedClass];

        if (!hitDiceCounts[hitDiceType]) {
            hitDiceCounts[hitDiceType] = { current: 0, total: 0 };
        }
        hitDiceCounts[hitDiceType].total += level;
    });

    // Update the hit dice pills
    hitDiceContainer.innerHTML = ""; // Clear existing pills
    Object.keys(hitDiceCounts).forEach(hitDiceType => {
        const hitDice = hitDiceCounts[hitDiceType];

        // Create a hit dice pill
        const hitDicePill = document.createElement('div');
        hitDicePill.className = 'pill';

        hitDicePill.innerHTML = `
        <button class="decrement-dice" type="button">-</button>
        <span>(${hitDice.current} / ${hitDice.total}) ${hitDiceType}</span>
            <button class="increment-dice" type="button">+</button>
        `;

        // Add event listeners for increment and decrement buttons
        const decrementButton = hitDicePill.querySelector('.decrement-dice');
        const incrementButton = hitDicePill.querySelector('.increment-dice');

        decrementButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (hitDice.current > 0) {
                hitDice.current--;
                hitDicePill.querySelector('span').textContent = `(${hitDice.current} / ${hitDice.total}) ${hitDiceType}`;
            }
        });

        incrementButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (hitDice.current < hitDice.total) {
                hitDice.current++;
                hitDicePill.querySelector('span').textContent = `(${hitDice.current} / ${hitDice.total}) ${hitDiceType}`;
            }
        });

        hitDiceContainer.appendChild(hitDicePill);
    });
};

////////////////////////////////

function updateModifiers() {
    for (let ability in abilityModifiers) {
        const score = document.getElementById(ability).value;
        abilityModifiers[ability] = Math.floor((score - 10) / 2);
    }
    updateSkillModifiers();
}

// Function to create a TwoClickCheckbox
function createTwoClickCheckbox(skill) {
    // Create a button element
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "two_click";
    checkbox.dataset.clickCount = 0;
    // Update the button appearance and skill proficiency on each click
    checkbox.addEventListener("click", () => {
        
        let clickCount = parseInt(checkbox.dataset.clickCount);

        // Increment the click count (max 2)
        if (clickCount == 2) {
            clickCount = 0;
        }
        else if (clickCount < 2) {
            clickCount++;
        }
        checkbox.dataset.clickCount = clickCount;
  
        if (clickCount === 0) {
            checkbox.style.accentColor = 'blue'
            checkbox.checked = false;  
        }  
        else if (clickCount === 1) {
            checkbox.style.accentColor = 'blue'
            checkbox.checked = true;
        } 
        else if (clickCount === 2) {
            checkbox.style.accentColor = 'green'
            checkbox.checked = true;
        }
  
        // Update the skill proficiency based on click count
        skill['proficient'] = clickCount;
        updateSkillModifiers(); // Re-render the skill list with updated proficiency status
    });
  
    return checkbox;
  }

function updateSkillModifiers() {
    const proficiencyBonus = parseInt(document.getElementById('proficiency-bonus').innerText) || 0;

    skills.forEach((skill, index) => {
        const modifier = abilityModifiers[skill.ability];
        const proficiencyModifier = skill.proficient * proficiencyBonus;
        const totalModifier = modifier + proficiencyModifier;

        const modText = document.getElementById(`${skill.name}-mod`)
        modText.textContent = `${totalModifier >= 0 ? "+" : ""}${totalModifier}`;
    });
}

function makeSkillModifiers() {
    const proficiencyBonus = parseInt(document.getElementById('proficiency-bonus').innerText) || 0;
    const skillsGrid = document.getElementById("skills-grid");
    skillsGrid.innerHTML = "";

    skills.forEach((skill, index) => {
        const modifier = abilityModifiers[skill.ability];
        const proficiencyModifier = skill.proficient * proficiencyBonus;
        const totalModifier = modifier + proficiencyModifier;

        const skillBox = document.createElement("div");
        skillBox.className = "skill-box";
        skillBox.style.display = "flex"; // Use flexbox for alignment

        const skillName = document.createElement("span");
        skillName.textContent = `${skill.name} (${skill.ability.substring(0, 3).toUpperCase()})`;
        skillName.style.flex = 1; // Ensure the name takes the remaining space

        const checkbox = createTwoClickCheckbox(skill);
        const modText = document.createElement("span");
        modText.id = `${skill.name}-mod`

        // Append elements in the correct order: name, checkbox, modifier
        skillBox.appendChild(skillName);
        skillBox.appendChild(checkbox);
        skillBox.appendChild(modText);
        skillsGrid.appendChild(skillBox);
    });
    updateSkillModifiers()
}

///////////////////////////////

document.querySelectorAll(".collapsible").forEach(header => {
    header.addEventListener("click", () => {
        header.classList.toggle("collapsed");
        const content = header.nextElementSibling;
        if (content.classList.contains("collapsible-content")) {
            content.classList.toggle("collapsed");
        }
    });
});




document.querySelectorAll(".collapsible").forEach(header => {
    header.addEventListener("click", () => {
        header.classList.toggle("collapsed");
        const content = header.nextElementSibling;
        if (content.classList.contains("collapsible-content")) {
            content.classList.toggle("expanded");
        }
    });
});

////////////////////////////////
const makeAbilityModifiers = () => {
    const abilitygrid = document.getElementsByClassName('ability-grid')[0];

    Object.keys(abilityModifiers).forEach((ability) => {
        const ability_pill = document.createElement("div");
        ability_pill.className = "ability";
        
        ability_pill.innerHTML = `<div id="${ability}-mod" class="ability-mod">+0</div>
        <label for="${ability}">${titleCase(ability)}</label>
        <input type="number" id="${ability}" class="ability-score" name="${ability}" min="0" max="30" defaultValue='10' value='10'>
        <div id="${ability}-saving-label" class="saving-throw-label">Saving Throw:</div>
        <div id="${ability}-saving" class="saving-throw">+0</div>
        <input type="checkbox" class="saving-throw-check" id="${ability}-saving-prof">`
        
        abilitygrid.appendChild(ability_pill);
        }
)};


const updateAbilityModifiers = () => { // TODO: Make it so it only triggers for the ability triggered, not all abilities

    Object.keys(abilityModifiers).forEach((ability) => {
        const ability_cont = document.getElementById(ability)
        let score = parseInt(ability_cont.value) || 0;
        if (score === "") {
            score = ability_cont.defaultValue
            ability_cont.value = score
        }
        else if (score < parseInt(ability_cont.min)) {
            score = ability_cont.min
            ability_cont.value = score
        }
        else if (score > parseInt(ability_cont.max)) {
            score = ability_cont.max
            ability_cont.value = score
        }
        let modifier = Math.floor((score - 10) / 2);
        document.getElementById(`${ability}-mod`).textContent = modifier >= 0 ? `+${modifier}` : modifier;
        if (document.getElementById(`${ability}-saving-prof`).checked){
            modifier += parseInt(document.getElementById('proficiency-bonus').innerText) || 0;
        }
        document.getElementById(`${ability}-saving`).textContent = modifier >= 0 ? `+${modifier}` :`${modifier}`;
    });

    document.getElementById('initiative').textContent = document.getElementById(`dexterity-mod`).textContent
};


////////////// On Page Load
makeAbilityModifiers();
updateAbilityModifiers(); // Initialize ability modifiers
makeSkillModifiers();
updateModifiers(); // Initialize modifiers

document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", updateModifiers);
});

document.querySelectorAll(".ability-score").forEach((input) => {
    input.addEventListener("input", updateAbilityModifiers);
    // input.defaultValue = '10'
});

document.querySelectorAll(".saving-throw-check").forEach((input) => {
    input.addEventListener("input", updateAbilityModifiers);
});