export const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export const arrayMatch = (arr1, arr2) => {
    let result = false;
    arr1.forEach((el1) => {
        arr2.forEach((el2) => {
            if (el1 === el2) result = true;
        });
    });
    return result;
}