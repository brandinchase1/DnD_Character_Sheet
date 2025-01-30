const dndBackgrounds = [
    "",
    "Acolyte",
    "Charlatan",
    "Criminal",
    "Entertainer",
    "Folk Hero",
    "Guild Artisan",
    "Hermit",
    "Noble",
    "Outlander",
    "Sage",
    "Sailor",
    "Soldier",
    "Urchin",
    "Haunted One",
    "Knight",
    "Pirate",
    "Spy",
    "Far Traveler",
    "Inheritor",
    "Mercenary Veteran",
    "Urban Bounty Hunter",
    "Gladiator",
    "Courtier",
    "Cloistered Scholar",
    "Anthropologist",
    "Archaeologist",
    "City Watch",
    "Clan Crafter",
    "Cloistered Scholar",
    "Courtier",
    "Faction Agent",
    "Far Traveler",
    "Guild Merchant",
    "Inheritor",
    "Knight of the Order",
    "Mercenary Veteran",
    "Outlander",
    "Sage",
    "Sailor",
    "Soldier",
    "Urban Bounty Hunter",
    "Uthgardt Tribe Member",
    "Waterdhavian Noble"
  ];

const dndClasses = {
  "": null, // Empty entry for no class
  "Artificer": "d8",
  "Barbarian": "d12",
  "Bard": "d8",
  "Blood Hunter": "d10", // Assuming based on homebrew rules
  "Cleric": "d8",
  "Druid": "d8",
  "Fighter": "d10",
  "Monk": "d8",
  "Paladin": "d10",
  "Ranger": "d10",
  "Rogue": "d8",
  "Sorcerer": "d6",
  "Warlock": "d8",
  "Wizard": "d6"
};
  
  const dndSpecies = [
    "",
    "Aarakocra",
    "Aasimar",
    "Bugbear",
    "Centaur",
    "Changeling",
    "Dragonborn",
    "Dwarf",
    "Elf",
    "Fairy",
    "Firbolg",
    "Genasi",
    "Gith",
    "Gnome",
    "Goblin",
    "Goliath",
    "Half-Elf",
    "Half-Orc",
    "Halfling",
    "Hobgoblin",
    "Human",
    "Kalashtar",
    "Kenku",
    "Kobold",
    "Leonin",
    "Lizardfolk",
    "Loxodon",
    "Minotaur",
    "Orc",
    "Satyr",
    "Shifter",
    "Simic Hybrid",
    "Tabaxi",
    "Tiefling",
    "Tortle",
    "Triton",
    "Vedalken",
    "Warforged",
    "Yuan-ti Pureblood"
  ];

  const dndAlignments = [
    "",
    'LG',
    'LN',
    'NE',
    'NG',
    'N',
    'LE',
    'CG',
    'CN',
    'CE',
  ];

  const backgroundImages = [
    "https://color-hex.org/colors/f4f4f4.png",
    "https://i.pinimg.com/474x/1d/98/0e/1d980ee1d1254ced72590f8ba24d37b4.jpg",
    "https://media.istockphoto.com/id/1075629340/vector/green-leaves-seamless-pattern.jpg?s=612x612&w=0&k=20&c=QGe-uKhQMhSCrGi1vPiQmOQ-b2wGpSFNVZToTtD5_qM=",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcIEiO3td-rFn7_ifW-_u89AiDvPGzVi3N8w&s",
    "https://st4.depositphotos.com/1044374/23178/i/1600/depositphotos_231785554-stock-illustration-watercolor-seamless-pattern-leaves-blue.jpg",
    "https://img.freepik.com/premium-photo/dark-background-with-pattern-interlocking-gears-gears-are-made-shiny-metal-are-arranged-repeating-pattern_14117-231314.jpg",
    "https://as2.ftcdn.net/jpg/04/15/80/49/1000_F_415804937_AmBLry1D1XN5AU7zCPGnYRAmkEh5WtFW.jpg",
    "https://as2.ftcdn.net/v2/jpg/02/71/97/33/1000_F_271973372_gWfFflwaNNN6L6dxs8cEzN8nwDDkmoUJ.jpg", 
    "https://img.freepik.com/premium-photo/seamless-pink-floral-pattern-with-elegant-vines-flowers_1304147-182723.jpg"
  ]

  const inspiration = [
    "", 
    "Advantage", 
    "d6",
    "d8",
    "d10",
    "d12",
  ]

  const exhaustion = [
    "", 
    "1 - Disadvantage on Ability Checks", 
    "2 - Speed Halved",
    "3 - Disadvantage on Attack Rolls and Saving Throws",
    "4 - Hit Point Maximum Halved",
    "5 - Speed Reduced to 0",
    "6 - Death",
  ]

  function fillSelector(options, selector) {
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerText = option;
        selector.appendChild(opt)

    });
  }

  fillSelector(Object.keys(dndClasses), document.getElementById("class-selector"))
  fillSelector(dndSpecies, document.getElementById("species-selector"))
  fillSelector(dndAlignments, document.getElementById("alignment-selector"))
  fillSelector(dndBackgrounds, document.getElementById("background-selector"))
  fillSelector(inspiration, document.getElementById("inspiration-selector"))
  fillSelector(exhaustion, document.getElementById("exhaustion-selector"))

  backgroundImages.forEach(imgSrc => {
    const pic = document.createElement('img');
    pic.src = imgSrc;
    pic.alt = `Background`;
    pic.dataset.src = imgSrc;
    document.getElementById('image-selector').appendChild(pic)
  });