export const selectById = (id: number): string =>
    `
    SELECT *
    FROM user
    WHERE id = ${id}
    ;`;

export const selectByAccess = (access: string): string =>
    `
    SELECT *
    FROM user
    WHERE access = "${access}"
    ;`;

export const selectByEmailPw = (email: string, pw: string): string =>
    `
    SELECT *
    FROM user
    WHERE email = "${email}" AND pw = "${pw}"
    ;`;

export const selectByQuery = (query: string): string =>
    `
    SELECT *
    FROM user
    WHERE name LIKE "%${query}%"
    ;`;

export const selectSaltByEmail = (email: string): string =>
    `
    SELECT salt
    FROM user
    WHERE email = "${email}"
    ;`;

export const checkEmail = (email: string): string =>
    `
    SELECT id
    FROM user
    WHERE email = "${email}"
    ;`;

export const add = (access: string, email: string, pw: string, salt: string, name: string): string =>
    `
    INSERT INTO user
    VALUES (NULL, "${access}", "${email}", "${pw}", "${salt}", "${name}", NULL)
    ;`;

export const addImage = (id: number, image: string): string =>
    `
    UPDATE user
    SET image = "${image}"
    WHERE id = ${id}
    ;`;
