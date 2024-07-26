

export const parseJson = (text: string) => {
    try {
        return JSON.parse(text);
    } catch(e) {
        console.warn(`can't parse JSON(${text})`, e);
        return {};
    }
}
