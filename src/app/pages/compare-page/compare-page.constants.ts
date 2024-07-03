export const compareOptions = [
    { value: 1, display: "At least one copy" }, 
    { value: 2, display: "At least two copies" }, 
    { value: 4, display: "At least four copies" }, 
]

export const orderOptionDirections = {
    desc: "desc",
    asc: "asc"
}

export const orderOptions = [
    { value: 'number-' + orderOptionDirections.asc, display: 'By number' },
    { value: 'name-' + orderOptionDirections.asc, display: 'By name' },
    { value: 'price-' + orderOptionDirections.desc, display: 'By price (desc.)' },
    { value: 'price-' + orderOptionDirections.asc, display: 'By price (asc.)' },
    { value: 'convertedManaCost-' + orderOptionDirections.desc, display: 'By mana cost (desc.)' },
    { value: 'convertedManaCost-' + orderOptionDirections.asc, display: 'By mana cost (asc.)' },
    { value: 'type-' + orderOptionDirections.desc, display: 'By type (desc.)' },
    { value: 'type-' + orderOptionDirections.asc, display: 'By type (asc.)' },
    { value: 'color-' + orderOptionDirections.desc, display: 'By color (desc.)' },
    { value: 'color-' + orderOptionDirections.asc, display: 'By color (asc.)' },
    { value: 'set-' + orderOptionDirections.asc, display: 'By edition' },
    { value: 'releaseDate-' + orderOptionDirections.desc, display: 'By release date (desc.)' },
    { value: 'releaseDate-' + orderOptionDirections.asc, display: 'By release date (asc.)' },
    { value: 'count-' + orderOptionDirections.desc, display: 'By quantity (desc.)' },
    { value: 'count-' + orderOptionDirections.asc, display: 'By quantity (asc.)' }
]

export const colors = [
    "White", 
    "Blue", 
    "Black", 
    "Red", 
    "Green", 
    "Multicolors", 
    "Colorless",
]