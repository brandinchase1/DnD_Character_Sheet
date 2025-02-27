let spells;

const spellSlotTable = [
    [],
    [2],
    [3],
    [4, 2],
    [4, 3],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1]
];
  
const fullCasters = ["Bard", "Cleric", "Druid", "Sorcerer", "Wizard"];
const halfCasters = ["Artificer", "Paladin", "Ranger"];
const thirdCasters = ["Blood Hunter", "Fighter", "Rogue"];
// const warlockPactMagic = ["Warlock"]; 

function addArrays(arr1, arr2) {
    const result = [];
    const maxLength = Math.max(arr1.length, arr2.length);
  
    for (let i = 0; i < maxLength; i++) {
      const val1 = arr1[i] || 0;
      const val2 = arr2[i] || 0;
      result.push(val1 + val2);
    }
  
    return result;
}

function getCasterLevel(classes) {
  let casterLevel = 0;
  let multi_class = Object.keys(classes).length !== 1;
  // TODO: check for negative inputs
  for (const [cls, level] of Object.entries(classes)) {
    if (multi_class) {
        if (fullCasters.includes(cls)) casterLevel += level;
        else if (halfCasters.includes(cls)) casterLevel += Math.floor(level / 2);
        else if (thirdCasters.includes(cls)) casterLevel += Math.floor(level / 3);
    } else {
        if (fullCasters.includes(cls)) casterLevel += level;
        else if (halfCasters.includes(cls)) casterLevel += (level >= 2) ?  Math.floor((level+1) / 2) : 0;
        else if (thirdCasters.includes(cls)) casterLevel += (level >= 3) ? Math.floor((level + 2) / 3) : 0;
        if (cls === "Artificer" && level === 1) casterLevel  += 1
    }
  }

  return Math.min(casterLevel, 20);
}

function getSpellSlots(classes) {
    const casterLevel = getCasterLevel(classes);
    let spell_slots =  spellSlotTable[casterLevel] || [];
    
    // handles warlock spell slots
    if ("Warlock" in classes) {
        let warlockLevel = classes['Warlock'];
        let slotLevel = Math.min(Math.floor((warlockLevel+1)/2), 5);
        let spellLevels = new Array(slotLevel).fill(0) || [];
        spellLevels[spellLevels.length - 1] = 1;
        let spellSlots = 0;
        if (warlockLevel >=1){spellSlots+=1;}
        if (warlockLevel >=2){spellSlots+=1;}
        if (warlockLevel >=11){spellSlots+=1;}
        if (warlockLevel >=17){spellSlots+=1;}
        spell_slots = addArrays(spell_slots, spellLevels.map((x) => {return x*spellSlots})); 
    }
    
    for (let index = 0; index < 9; index++) {
        const slots = (index < spell_slots.length) ? spell_slots[index] : "-";
        document.getElementById(`spell_slot_value_${index + 1}`).value = slots;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////
  
// // Show the details modal for a specific spell
function showSpellDetails(spell) {
  document.getElementById('spellName').textContent = spell.Name;
  document.getElementById('spellLevel').textContent = spell.Level;
  document.getElementById('spellCastingTime').textContent = spell['Casting Time'];
  document.getElementById('spellRange').textContent = spell.Range;
  document.getElementById('spellDuration').textContent = spell.Duration;
  document.getElementById('spellSchool').textContent = spell.School;
  document.getElementById('spellComponents').textContent = spell.Components;
  document.getElementById('spellText').textContent = spell.Text;
  
  // Some spells might have "At Higher Levels"
  document.getElementById('spellAtHigherLevels').textContent = 
    spell['At Higher Levels'] ? `At Higher Levels: ${spell['At Higher Levels']}` : '';

  document.getElementById('spellDetailsModal').classList.remove('hidden');
}


async function fetchSpells() {
    const url = "https://raw.githubusercontent.com/brandinchase1/DnD_Character_Sheet/main/Spells.csv";
    // const url = "https://corsproxy.io/?" + encodeURIComponent("https://raw.githubusercontent.com/brandinchase1/DnD_Character_Sheet/main/Spells.csv");

    try {
        const data = await fetch(url).then((response) => response.text()).catch((error) => {
            console.log(error)
          });
        processCSV(data);
    } catch (error) {
        console.error("Error fetching spells:", error);
    }
}

function processCSV(csvData) {
    Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            spells = results.data;
            filterSpells(spells);
        }
    });
}

function filterSpells(spells) {
    const characterClass = "Wizard"; // Example class
    const maxLevel = 5; // Example level

    const filteredSpells = spells.filter(spell => {
        return spell.Classes !== null && spell.Classes.includes(characterClass) && (spell.Level === "Cantrip" || parseInt(spell.Level[0]) <= maxLevel)
    });

    displaySpells(filteredSpells);
}
//////////////////////////////////////////////////////////////////////////
let currentSort = { key: null, ascending: true };

document.querySelectorAll('.spell.header [data-sort]').forEach(header => {
    header.addEventListener('click', () => {
        const key = header.getAttribute('data-sort');

        // Toggle sorting order
        if (currentSort.key === key) {
            currentSort.ascending = !currentSort.ascending;
        } else {
            currentSort.key = key;
            currentSort.ascending = true;
        }

        // Sort and display
        sortSpells(spells, key, currentSort.ascending);
    });
});

function sortSpells(spells, key, ascending) {
    spells.sort((a, b) => {
        let valA = a[key] || "";
        let valB = b[key] || "";

        // Convert numeric values for proper sorting
        if (!isNaN(valA) && !isNaN(valB)) {
            valA = Number(valA);
            valB = Number(valB);
        } else {
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
        }

        return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    displaySpells(spells);
}
//////////////////////////////////////////////////////////////////////////

function displaySpells(spells) {
    const spellContainer = document.getElementById("spellListContainer");
    spellContainer.innerHTML = "";

    spells.forEach(spell => {
        const spellElement = document.createElement("div");
        spellElement.className = "spell inline";
        spellElement.innerHTML = `
        <input type="checkbox">
        <div class="spell-name">${spell.Name}</div>
        <div class="spell-time">${spell["Casting Time"]}</div>
        <div class="spell-Range">${spell.Range}</div>
        <div class="spell-level">${spell.Level}</div>
        <div class="spell-duration">${spell.Duration}</div>
        `;

        spellElement.addEventListener('click', () => showSpellDetails(spell));
        spellContainer.appendChild(spellElement);
    });
}

// Run on page load
fetchSpells();
document.getElementById('closeDetails').addEventListener('click', () => {
    event.preventDefault();
    document.getElementById('spellDetailsModal').classList.add('hidden');
});  

