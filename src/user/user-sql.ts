export const selectById = (id: number): string =>
    `
    SELECT *
    FROM users
    WHERE id = ${id}
    ;`;

export const selectByAccess = (access: string): string =>
    `
    SELECT *
    FROM users
    WHERE access = "${access}"
    ;`;

export const selectByEmailPw = (email: string, pw: string): string =>
    `
    SELECT *
    FROM users
    WHERE email = "${email}" AND pw = "${pw}"
    ;`;

export const selectByQuery = (query: string): string =>
    `
    SELECT *
    FROM users
    WHERE name LIKE "%${query}%"
    ;`;

export const selectSaltByEmail = (email: string): string =>
    `
    SELECT salt
    FROM users
    WHERE email = "${email}"
    ;`;

export const checkEmail = (email: string): string =>
    `
    SELECT id
    FROM users
    WHERE email = "${email}"
    ;`;

export const add = (access: string, email: string, pw: string, salt: string, name: string): string =>
    `
    INSERT INTO users
    VALUES (NULL, "${access}", "${email}", "${pw}", "${salt}", "${name}", NULL)
    ;`;

export const addImage = (id: number, image: string): string =>
    `
    UPDATE users
    SET image = "${image}"
    WHERE id = ${id}
    ;`;
