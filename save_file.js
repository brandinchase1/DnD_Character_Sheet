let fileHandle;

/////////////////// Load file

async function openFile() {
    [fileHandle] = await window.showOpenFilePicker({
        types: [
            {
                description: "Text Files",
                accept: { "text/plain": [".txt"] },
            },
        ],
        multiple: false,
    });

    const file = await fileHandle.getFile();
    const contents = await file.text();
    console.log("File loaded:", contents);

    // Show the file contents in a textarea for editing
    document.getElementById("character-name").value = contents;
}

/////////////////// Save file

async function saveFile() {
    if (!fileHandle) {
        // Prompt the user to create a new file
        fileHandle = await window.showSaveFilePicker({
            suggestedName: "character.txt",
            types: [
                {
                    description: "Text Files",
                    accept: { "text/plain": [".txt"] },
                },
            ],
        });
    }

    const writable = await fileHandle.createWritable();
    const newContent = document.getElementById("character-name").value;

    // Write new content to the file
    await writable.write(newContent);
    await writable.close();

    alert("File saved successfully!");
}

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


/////////////////// Handle PDF's

// Assume you have preview images for templates (replace with actual paths)
const templatePreviews = ["template1_preview.png", "template2_preview.png"];
const templates = [template1, template2];
const fields = [pdf1_Fields, pdf2_Fields];
let selectedTemplateIndex = 0; // Default selection

// Function to render template options
function renderTemplateOptions() {
    const container = document.getElementById("template-selector");
    container.innerHTML = ""; // Clear previous selections

    templates.forEach((_, index) => {
        const img = document.createElement("img");
        img.src = templatePreviews[index];
        img.style.width = "150px"; // Adjust size as needed
        img.style.cursor = "pointer";
        img.onclick = () => selectTemplate(index);

        const div = document.createElement("div");
        div.appendChild(img);
        container.appendChild(div);
    });
}

// Function to select a template
function selectTemplate(index) {
    selectedTemplateIndex = index;
    document.querySelectorAll("#template-selector img").forEach((img, i) => {
        img.style.border = i === index ? "3px solid blue" : "none"; // Highlight selected
    });
}


// Updated PDF generation function
async function generatePDF() {
    const index = selectedTemplateIndex;
    const formUrl = 'data:application/pdf;base64,' + templates[index];
    const existingPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Fill out fields
    const field = fields[index];
    Object.keys(field).forEach(key => {
        let item = field[key][1];
        if (item !== "") {
            form.getTextField(key).setText(document.getElementById(item).value);
        }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "DnD_CharacterSheet_Filled.pdf";
    link.click();
}

// Call this function when the page loads
window.onload = renderTemplateOptions;

document.getElementById("open-file").addEventListener("click", openFile);
document.getElementById("save-file").addEventListener("click", saveFile);
document.getElementById('generate-pdf').addEventListener('click', generatePDF);
