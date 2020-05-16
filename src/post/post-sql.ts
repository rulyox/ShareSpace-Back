const add = (access: string, user: number, text: string): string =>
    `
    INSERT INTO post
    VALUES (NULL, "${access}", ${user}, "${text}", NULL)
    ;`;

const addImage = (post: number, image: string): string =>
    `
    INSERT INTO post_image
    VALUES (NULL, ${post}, "${image}")
    ;`;

const selectIdByAccess = (access: string): string =>
    `
    SELECT id
    FROM post
    WHERE access = "${access}"
    ;`;

const selectNumberOfPostByUser = (user: number): string =>
    `
    SELECT COUNT(*) as count
    FROM post
    WHERE user = ${user}
    ;`;

const selectPostByUserInRange = (user: number, start: number, count: number): string =>
    `
    SELECT access
    FROM post
    WHERE user = ${user}
    ORDER BY id DESC
    LIMIT ${start}, ${count}
    ;`;

const selectPostData = (id: number): string =>
    `
    SELECT user.id AS user, user.access AS access, user.name AS name, user.image AS profile, post.text AS text
    FROM post, user
    WHERE post.user = user.id AND post.id = ${id}
    ;`;

const selectPostImage = (post: number): string =>
    `
    SELECT image
    FROM post_image
    WHERE post = ${post}
    ;`;

const selectImageFile = (post: number, image: string): string =>
    `
    SELECT image
    FROM post_image
    WHERE post = ${post} AND image = "${image}"
    ;`;

const selectFeedInRange = (user: number, start: number, count: number): string =>
    `
    SELECT access
    FROM feed
    WHERE user = ${user}
    LIMIT ${start}, ${count}
    ;`;

export default {
    add,
    addImage,
    selectIdByAccess,
    selectNumberOfPostByUser,
    selectPostByUserInRange,
    selectPostData,
    selectPostImage,
    selectImageFile,
    selectFeedInRange
};
