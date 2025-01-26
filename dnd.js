const abilityModifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
};


function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
}

function updateModifiers() {
    for (let ability in abilityModifiers) {
        const score = document.getElementById(ability).value;
        abilityModifiers[ability] = calculateModifier(score);
    }
    updateSkillModifiers();
}

function updateSkillModifiers() {
    const skills = [
        { name: "Acrobatics", ability: "dexterity" },
        { name: "Animal Handling", ability: "wisdom" },
        { name: "Arcana", ability: "intelligence" },
        { name: "Athletics", ability: "strength" },
        { name: "Deception", ability: "charisma" },
        { name: "History", ability: "intelligence" },
        { name: "Insight", ability: "wisdom" },
        { name: "Intimidation", ability: "charisma" },
        { name: "Investigation", ability: "intelligence" },
        { name: "Medicine", ability: "wisdom" },
        { name: "Nature", ability: "intelligence" },
        { name: "Perception", ability: "wisdom" },
        { name: "Performance", ability: "charisma" },
        { name: "Persuasion", ability: "charisma" },
        { name: "Religion", ability: "intelligence" },
        { name: "Sleight of Hand", ability: "dexterity" },
        { name: "Stealth", ability: "dexterity" },
        { name: "Survival", ability: "wisdom" },
    ];

    const skillsGrid = document.getElementById("skills-grid");
    skillsGrid.innerHTML = "";

    skills.forEach(skill => {
        const modifier = abilityModifiers[skill.ability];
        const skillBox = document.createElement("div");
        skillBox.className = "skill-box";
        skillBox.innerHTML = `
            <span>${skill.name} (${skill.ability.substring(0, 3).toUpperCase()})</span>
            <span>${modifier >= 0 ? "+" : ""}${modifier}</span>
        `;
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


document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", updateModifiers);
});

// Initialize modifiers on page load
updateModifiers();
