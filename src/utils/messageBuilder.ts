export const toCapitalCase = (str: string): string => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
        return char.toUpperCase();
    });
}


export const truncateString = (str: string): string => {
    const words = str.split(' ');
    let result = '';
    let count = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        if (count + word.length > 24) {
            break;
        }

        result += `${word} `;
        count += word.length + 1;
    }

    return result.trim();
};