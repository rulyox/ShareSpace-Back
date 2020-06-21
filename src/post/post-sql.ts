export const add = (access: string, user: number, text: string): string =>
    `
    INSERT INTO post
    VALUES (NULL, "${access}", ${user}, "${text}", NULL)
    ;`;

export const deleteById = (id: number): string =>
    `
    DELETE FROM post
    WHERE id = ${id}
    ;`;

export const addImage = (post: number, image: string): string =>
    `
    INSERT INTO post_image
    VALUES (NULL, ${post}, "${image}")
    ;`;

export const selectIdByAccess = (access: string): string =>
    `
    SELECT id
    FROM post
    WHERE access = "${access}"
    ;`;

export const selectNumberOfPostByUser = (user: number): string =>
    `
    SELECT COUNT(*) as count
    FROM post
    WHERE user = ${user}
    ;`;

export const selectPostByUserInRange = (user: number, start: number, count: number): string =>
    `
    SELECT access
    FROM post
    WHERE user = ${user}
    ORDER BY id DESC
    LIMIT ${start}, ${count}
    ;`;

export const selectPostData = (id: number): string =>
    `
    SELECT user.id AS user, user.access AS access, user.name AS name, user.image AS profile, post.text AS text
    FROM post, user
    WHERE post.id = ${id}
    AND post.user = user.id
    ;`;

export const selectPostImage = (post: number): string =>
    `
    SELECT image
    FROM post_image
    WHERE post = ${post}
    ;`;

export const selectImageFile = (post: number, image: string): string =>
    `
    SELECT image
    FROM post_image
    WHERE post = ${post} AND image = "${image}"
    ;`;

export const selectFeedInRange = (user: number, start: number, count: number): string =>
    `
    SELECT access
    FROM feed
    WHERE user = ${user}
    LIMIT ${start}, ${count}
    ;`;
