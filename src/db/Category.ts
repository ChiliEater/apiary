enum Category {
    Burger = 1,
    Chinese = 2,
    Donuts = 3,
    Fish = 4,
    Italian = 5,
    Japanese = 6,
    Mexican = 7,
    Pizza = 8,
    Sandwich = 9,
    Vietnamese = 10,
}

export function parseCategory(num: number): Category | undefined { 
    return Category[Category[num] as keyof typeof Category];
}


export default Category;