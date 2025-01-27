const abilityModifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
};

const skills = [
    { name: "Acrobatics", ability: "dexterity", proficient: false },
    { name: "Animal Handling", ability: "wisdom", proficient: false },
    { name: "Arcana", ability: "intelligence", proficient: false },
    { name: "Athletics", ability: "strength", proficient: false },
    { name: "Deception", ability: "charisma", proficient: false },
    { name: "History", ability: "intelligence", proficient: false },
    { name: "Insight", ability: "wisdom", proficient: false },
    { name: "Intimidation", ability: "charisma", proficient: false },
    { name: "Investigation", ability: "intelligence", proficient: false },
    { name: "Medicine", ability: "wisdom", proficient: false },
    { name: "Nature", ability: "intelligence", proficient: false },
    { name: "Perception", ability: "wisdom", proficient: false },
    { name: "Performance", ability: "charisma", proficient: false },
    { name: "Persuasion", ability: "charisma", proficient: false },
    { name: "Religion", ability: "intelligence", proficient: false },
    { name: "Sleight of Hand", ability: "dexterity", proficient: false },
    { name: "Stealth", ability: "dexterity", proficient: false },
    { name: "Survival", ability: "wisdom", proficient: false },
];

let total_level = 0;

const classContainer = document.getElementById('class-container');
const classSelector = document.getElementById('class-selector');
const addClassButton = document.getElementById('add-class');


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
    const classPills = document.querySelectorAll('#class-container .pill input');
    let total_level = 0;
    
    classPills.forEach((input) => {
        total_level += parseInt(input.value) || 0;
    });

    const proficiency_bonus = Math.max(2, 2 + Math.floor((total_level - 1) / 4));
    document.getElementById('proficiency-bonus').textContent = `+${proficiency_bonus}`;
    updateSkillModifiers()

}

addClassButton.addEventListener('click', () => {
    const selectedClass = classSelector.value;
    if (selectedClass !== "") {
        const existingPill = Array.from(classContainer.children).find(
            pill => pill.dataset.class === selectedClass
        );

        if (existingPill) {
            const levelInput = existingPill.querySelector('input');
            levelInput.value = Math.max(Math.min(parseInt(levelInput.value) + 1, levelInput.max), levelInput.min)
        } else {
            const pill = document.createElement('div');
            pill.className = 'pill';
            pill.dataset.class = selectedClass;

            pill.innerHTML = `
                <span>${selectedClass} (Level:</span>
                <input type="number" value="1" min="1" max='20' class="level" style="width: 40px;" />)
                <button type="button">&times;</button>
            `;

            pill.querySelector('button').addEventListener('click', () => {
                classContainer.removeChild(pill);
                updateTotalLevelAndProficiency()
            });
        
            // Add event listener to update total level when level changes
            pill.querySelector('input').addEventListener('input', updateTotalLevelAndProficiency);

            classContainer.appendChild(pill);
        }    
    }
    updateTotalLevelAndProficiency()

});

function updateModifiers() {
    for (let ability in abilityModifiers) {
        const score = document.getElementById(ability).value;
        abilityModifiers[ability] = Math.floor((score - 10) / 2);
    }
    updateSkillModifiers();
}

function updateSkillModifiers() {
    const proficiencyBonus = parseInt(document.getElementById('proficiency-bonus').innerText) || 0;
    const skillsGrid = document.getElementById("skills-grid");
    skillsGrid.innerHTML = "";

    skills.forEach((skill, index) => {
        const modifier = abilityModifiers[skill.ability];
        const proficiencyModifier = skill.proficient ? proficiencyBonus : 0;
        const totalModifier = modifier + proficiencyModifier;

        const skillBox = document.createElement("div");
        skillBox.className = "skill-box";
        skillBox.style.display = "flex"; // Use flexbox for alignment

        const skillName = document.createElement("span");
        skillName.textContent = `${skill.name} (${skill.ability.substring(0, 3).toUpperCase()})`;
        skillName.style.flex = 1; // Ensure the name takes the remaining space

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = skill.proficient;
        checkbox.addEventListener("change", () => {
            skills[index].proficient = checkbox.checked; // Update proficiency status
            updateSkillModifiers(); // Re-render the skill list with updated proficiency status
        });

        const modText = document.createElement("span");
        modText.textContent = `${totalModifier >= 0 ? "+" : ""}${totalModifier}`;

        // Append elements in the correct order: name, checkbox, modifier
        skillBox.appendChild(skillName);
        skillBox.appendChild(checkbox);
        skillBox.appendChild(modText);

        skillsGrid.appendChild(skillBox);
    });
}


document.querySelectorAll(".collapsible").forEach(header => {
    header.addEventListener("click", () => {
        header.classList.toggle("collapsed");
        const content = header.nextElementSibling;
        if (content.classList.contains("collapsible-content")) {
            content.classList.toggle("collapsed");
        }
    });
});


document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", updateModifiers);
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


const updateAbilityModifiers = () => {
    const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

    abilities.forEach((ability) => {
        const score = parseInt(document.getElementById(ability).value) || 0;
        const modifier = Math.floor((score - 10) / 2);
        document.getElementById(`${ability}-mod`).textContent = modifier >= 0 ? `+${modifier}` : modifier;
        document.getElementById(`${ability}-saving`).textContent = modifier >= 0 ? `Saving Throw: +${modifier}` :`Saving Throw: ${modifier}`;
    });
};

document.querySelectorAll(".ability-score").forEach((input) => {
    input.addEventListener("input", updateAbilityModifiers);
});



/////////////////// Handle PDF's

async function generatePDF() {
    const formUrl = 'data:application/pdf;base64,'+ base_64;
    const existingPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Fill out fields
    form.getTextField('CharacterName').setText(document.getElementById('name').value);
    // form.getTextField('ClassLevel').setText(`${document.getElementById('class').value} ${document.getElementById('level').value}`);
    // form.getTextField('Race').setText(document.getElementById('race').value);
    // form.getTextField('Alignment').setText(document.getElementById('alignment').value);
    // form.getTextField('STR').setText(document.getElementById('strength').value);
    // form.getTextField('DEX').setText(document.getElementById('dexterity').value);
    // form.getTextField('CON').setText(document.getElementById('constitution').value);
    // form.getTextField('INT').setText(document.getElementById('intelligence').value);
    // form.getTextField('WIS').setText(document.getElementById('wisdom').value);
    // form.getTextField('CHA').setText(document.getElementById('charisma').value);

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'DnD_CharacterSheet_Filled.pdf';
    link.click();
}

document.getElementById('generate-pdf').addEventListener('click', generatePDF);

////////////// On Page Load

updateAbilityModifiers(); // Initialize ability modifiers
updateModifiers(); // Initialize modifiers



// document.getElementById("save-button").addEventListener("click", function() {
//     const name = document.getElementById("name").value;
//     const charClass = document.getElementById("class").value;
//     const level = document.getElementById("level").value;
//     const race = document.getElementById("race").value;
//     const alignment = document.getElementById("alignment").value;

//     const character = {
//         name, charClass, level, race, alignment
//     };

//     const listItem = document.createElement("li");
//     listItem.textContent = `${name} - ${charClass} - Level ${level}`;

//     document.getElementById("characters").appendChild(listItem);
// });
