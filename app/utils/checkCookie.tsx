
export const checkCookie = (): string | null => {
    const cookies = document.cookie.split("; ").find((row) => row.startsWith(`uId=`));
    return cookies ? cookies.split("=")[1] : null;
};
export const LoadRealname = (): string | null => {
    const cookies = document.cookie.split("; ").find((row) => row.startsWith(`uRealname=`));
    return cookies ? cookies.split("=")[1] : null;
};
export const LoadRole = (): string | null => {
    const cookies = document.cookie.split("; ").find((row) => row.startsWith(`uRole=`));
    return cookies ? cookies.split("=")[1] : null;
};
export const LoadCatalogy = (): string[] | null => {
    const cookies = document.cookie.split("; ").find((row) => row.startsWith(`catalogy=`));
    
    return cookies ? (cookies.split("=")[1]).split("|") : null;
};