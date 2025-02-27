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
const hitDiceCounts = {
    'd6':  { current: 0, total: 0 },
    'd8':  { current: 0, total: 0 },
    'd10':  { current: 0, total: 0 },
    'd12':  { current: 0, total: 0 },
};

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
    const classPills = document.querySelectorAll('#class-container .pill');
    let total_level = 0;
    let character_levels = {};

    classPills.forEach((pill) => {
        const input = pill.getElementsByTagName('input')[0]
        total_level += parseInt(input.value) || 0;
        character_levels[pill.getElementsByTagName('span')[0].textContent] = parseInt(input.value) || 0;
    });

    const proficiency_bonus = Math.max(2, 2 + Math.floor((total_level - 1) / 4));
    document.getElementById('proficiency-bonus').textContent = `+${proficiency_bonus}`;
    updateAbilityModifiers();
    updateSkillModifiers();
    getSpellSlots(character_levels);
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
            existingClassPill.children[1].dataset.previousValue = `${levelInput.value}`
        } else {
            // Create class pill
            const classPill = document.createElement('div');
            classPill.className = 'pill';
            classPill.dataset.class = selectedClass;

            classPill.innerHTML = `
                <span>${selectedClass}</span>
                Level: <input type="number" value="1" min="1" max="20" class="level" data-previous-value="1" style="width: 40px;"  />
                <button type="button">&times;</button>
            `;

            // Add event listener to remove class pill
            classPill.querySelector('button[type="button"]').addEventListener('click', () => {
                let level_removed = parseInt(event.target.previousElementSibling.value);
                hitDiceCounts[dndClasses[selectedClass]]['current'] -= level_removed;
                hitDiceCounts[dndClasses[selectedClass]]['total'] -= level_removed;
                classContainer.removeChild(classPill);
                updateHitDice();
                updateTotalLevelAndProficiency();
            });

            // Add event listener for level input
            const levelInput = classPill.querySelector('.level');
            levelInput.addEventListener('input', () => {
                let level_changed = parseInt(levelInput.value) - parseInt(levelInput.dataset.previousValue)
                
                if (isNaN(parseInt(levelInput.value))) {
                    level_changed = parseInt(levelInput.defaultValue) - parseInt(levelInput.dataset.previousValue)
                    levelInput.value = parseInt(levelInput.defaultValue) 
                }
                else if (parseInt(levelInput.value) < parseInt(levelInput.min)) {
                    level_changed = parseInt(levelInput.min) - parseInt(levelInput.dataset.previousValue)
                    levelInput.value = levelInput.min
                }
                else if (parseInt(levelInput.value) > parseInt(levelInput.max)) {
                    level_changed = parseInt(levelInput.max) - parseInt(levelInput.dataset.previousValue)
                    levelInput.value = levelInput.max
                }
                
                hitDiceCounts[dndClasses[selectedClass]]['current'] += level_changed;
                hitDiceCounts[dndClasses[selectedClass]]['total'] += level_changed;
                levelInput.dataset.previousValue = levelInput.value;

                updateHitDice();
                updateTotalLevelAndProficiency();
            });

            classContainer.appendChild(classPill);
        }
        hitDiceCounts[dndClasses[selectedClass]]['current'] += 1
        hitDiceCounts[dndClasses[selectedClass]]['total'] += 1
    }
    updateHitDice();
    updateTotalLevelAndProficiency();
});

function makeHitDice() {
    Object.keys(hitDiceCounts).forEach(hitDiceType => {
        const hitDice = hitDiceCounts[hitDiceType];

        // Create a hit dice pill
        const hitDicePill = document.createElement('div');
        hitDicePill.id = `${hitDiceType}-hit-die`;
        hitDicePill.className = 'pill';

        hitDicePill.innerHTML = `
        <button class="decrement-dice" type="button">-</button>
        <span>(${hitDice.current} / ${hitDice.total}) ${hitDiceType}</span>
        <button class="increment-dice" type="button">+</button>
        `;
        hitDicePill.style.display = "none";

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
    }
)}

// Update hit dice function
function updateHitDice() {
    // Calculate total hit dice for each type
    Object.keys(hitDiceCounts).forEach(hitDiceType => {
        const container = document.getElementById(`${hitDiceType}-hit-die`);
        const hitDice = hitDiceCounts[hitDiceType];

        if (hitDice["total"] > 0) {
            container.style.display = "block";
        }
        else if (hitDice["total"] === 0) {
            container.style.display = "none";
        }
       container.getElementsByTagName('span')[0].textContent = `(${hitDice.current} / ${hitDice.total}) ${hitDiceType}`
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
        
        // update passive
        const ability_cont = modText.parentElement.parentElement
        const passiveText = modText.nextSibling
        let passiveScore = 10 + totalModifier
        let advModifier = parseInt(ability_cont.dataset.numberClicked) % 5;
        if (isNaN(advModifier)){advModifier = 0;}
        else if (advModifier == 2) {passiveScore += 5;}
        else if (advModifier == 4) {passiveScore -= 5;}
        passiveText.textContent = `Passive: ${passiveScore}${advModifier === 1 ? " ( + 5 )" : ""}${advModifier === 3 ? " ( - 5 )" : ""}`;
    });
}

function advantageSystem(event) {
    let numberClicked = (parseInt(event.currentTarget.dataset.numberClicked) + 1) % 5;
    if (isNaN(numberClicked)){
        numberClicked = 1;
    }
    event.currentTarget.dataset.numberClicked = numberClicked;
    switch(numberClicked) {
        case 0:
            // mormal
            event.currentTarget.style.background = '#f9f9f9';
            break;
        case 1:
            // half advantage
            event.currentTarget.style.background = `repeating-linear-gradient(
                -45deg,
                transparent 0px,
                transparent 10px,
                rgba(0, 128, 0, 0.3) 10px,
                rgba(0, 128, 0, 0.3) 20px
                )`;
                break;
        case 2:
            // advantage
            event.currentTarget.style.background = 'rgba(0, 128, 0, 0.3)';
            break;
        case 3:
            // half disdvantage
            event.currentTarget.style.background = `repeating-linear-gradient(
                -45deg,
                transparent 0px,
                transparent 10px,
                rgba(128, 0, 0, 0.3) 10px,
                rgba(128, 0, 0, 0.3) 20px
            )`;
            break;
        case 4:
            // disadvantage
            event.currentTarget.style.background = 'rgba(128, 0, 0, 0.3)';
            break;
        default:
            event.currentTarget.style.background = '#f9f9f9';
        }
    updateSkillModifiers()
}

function makeSkillModifiers() {
    const proficiencyBonus = parseInt(document.getElementById('proficiency-bonus').innerText) || 0;
    const skillsGrid = document.getElementById("skills-grid");

    skills.forEach((skill, index) => {
        const modifier = abilityModifiers[skill.ability];
        const proficiencyModifier = skill.proficient * proficiencyBonus;
        const totalModifier = modifier + proficiencyModifier;
        const passiveScore = 10 + totalModifier; // Passive skill score formula

        const skillBox = document.createElement("div");
        skillBox.className = "skill-box";

        const innerSkillBox = document.createElement("div");
        innerSkillBox.className = 'inner-skill-box';

        const skillName = document.createElement("span");
        skillName.textContent = `${skill.name} (${skill.ability.substring(0, 3).toUpperCase()})`;
        // skillName.style.flex = 1;
        

        // Passive score element (hidden by default)
        const passiveText = document.createElement("div");
        passiveText.className = "passive-score";
        passiveText.textContent = `Passive: ${passiveScore}`;

        // Hover event listeners to show/hide passive score
        skillBox.addEventListener("mouseenter", () => {
            passiveText.style.display = "block";
        });
        skillBox.addEventListener("mouseleave", () => {
            passiveText.style.display = "none";
        });

        // Create advantage system
        skillBox.addEventListener("dblclick", (event) => {
            if (event.target.className !== 'two_click'){
                advantageSystem(event);
            }
        }) 

        // Append elements in the correct order
        innerSkillBox.appendChild(skillName);

        const checkbox1 = createTwoClickCheckbox(skill);
        innerSkillBox.appendChild(checkbox1);
        
        const modText = document.createElement("label");
        modText.id = `${skill.name}-mod`;
        modText.textContent = `${totalModifier >= 0 ? "+" : ""}${totalModifier}`;
        innerSkillBox.appendChild(modText);
        innerSkillBox.appendChild(passiveText);

        skillBox.appendChild(innerSkillBox);
        skillsGrid.appendChild(skillBox);
    });

    updateSkillModifiers();
}
///////////////////////////////

document.querySelectorAll(".collapsible").forEach(header => {
    header.addEventListener("click", () => {
        header.classList.toggle("collapsed");
        const content = header.nextElementSibling;

        if (content.classList.contains("collapsible-content")) {
            if (content.style.maxHeight) {
                content.style.maxHeight = null; // Collapse
                content.style.padding = "0"; 
            } else {
                content.style.maxHeight = content.scrollHeight + 20 + "px"; // Expand smoothly
                content.style.padding = "10px"; 
            }
        }
    });

    // Observer to detect changes in collapsible content
    const content = header.nextElementSibling;
    if (content.classList.contains("collapsible-content")) {
        const observer = new MutationObserver(() => {
            if (header.classList.contains("collapsed")) {
                content.style.maxHeight = content.scrollHeight + 20 + "px";
            }
        });

        observer.observe(content, { childList: true, subtree: true });
    }
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
        
        ability_pill.addEventListener("dblclick", (event) => {
            if (event.target.className !== 'saving-throw-check' && event.target.className !== 'ability-score') {
                advantageSystem(event)
            }
        }) 

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

    document.getElementById('initiative').value = parseInt(document.getElementById(`dexterity-mod`).textContent)
};
////////////////////////

const image = document.getElementById("character-image"); // TODO: Fix this so it works for each img

let isResizing = false;

const elements = document.querySelectorAll('.resizer');
elements.forEach(element => {
    // Access each element using element
    element.addEventListener("mousedown", function (e) {
        e.preventDefault();
        isResizing = true;
    })
});

document.addEventListener("mousemove", function (e) {
    if (!isResizing) return;
    const newWidth = e.clientX - image.getBoundingClientRect().left;
    const newHeight = e.clientY - image.getBoundingClientRect().top;
    image.style.width = newWidth + "px";
    image.style.height = newHeight + "px";
});

document.addEventListener("mouseup", function () {
    isResizing = false;
});

////////////// On Page Load
makeAbilityModifiers();
updateAbilityModifiers(); // Initialize ability modifiers
makeSkillModifiers();
updateModifiers(); // Initialize modifiers
makeHitDice()

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

document.getElementById("initiative").addEventListener("dblclick", advantageSystem);