export const isCoreRequiredDoc = (label: string): boolean => {
    const l = (label || "").toLowerCase();
    return (
        l.includes("fiscale") ||
        l.includes("régularité fiscale") ||
        l.includes("regularite fiscale") ||
        l.includes("commerce") ||
        l.includes("rc") ||
        l.includes("cnss") ||
        l.includes("affiliation cnss")
    );
};
