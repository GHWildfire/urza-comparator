export const compareOptions = [
    { value: 1, display: "At least one copy" }, 
    { value: 2, display: "At least two copies" }, 
    { value: 4, display: "At least four copies" }, 
]

export const orderOptionDirections = {
    desc: "desc",
    asc: "asc"
};

export const orderOptions = [
    { value: 'number-' + orderOptionDirections.asc, display: 'Par numéro' },
    { value: 'name-' + orderOptionDirections.asc, display: 'Par nom' },
    { value: 'convertedManaCost-' + orderOptionDirections.desc, display: 'Par coût de mana (desc.)' },
    { value: 'convertedManaCost-' + orderOptionDirections.asc, display: 'Par coût de mana (asc.)' },
    { value: 'type-' + orderOptionDirections.desc, display: 'Par type (desc.)' },
    { value: 'type-' + orderOptionDirections.asc, display: 'Par type (asc.)' },
    { value: 'color-' + orderOptionDirections.desc, display: 'Par couleur (desc.)' },
    { value: 'color-' + orderOptionDirections.asc, display: 'Par couleur (asc.)' },
    { value: 'prices.eur-' + orderOptionDirections.desc, display: 'Par prix (desc.)' },
    { value: 'prices.eur-' + orderOptionDirections.asc, display: 'Par prix (asc.)' },
    { value: 'set-' + orderOptionDirections.asc, display: 'Par édition' },
    { value: 'releaseDate-' + orderOptionDirections.desc, display: 'Par date de sortie (desc.)' },
    { value: 'releaseDate-' + orderOptionDirections.asc, display: 'Par date de sortie (asc.)' },
    { value: 'count-' + orderOptionDirections.desc, display: 'Par quantité (desc.)' },
    { value: 'count-' + orderOptionDirections.asc, display: 'Par quantité (asc.)' }
  ];

export const colors = [
    "White", 
    "Blue", 
    "Black", 
    "Red", 
    "Green", 
    "Multicolors", 
    "Colorless",
]