export const selectById = (id: number): string =>
    `
    SELECT user.id AS user, user.access AS access, user.email AS email, user.name AS name, user.image AS profile, post.text AS text, DATE_FORMAT(post.time, '%Y. %m. %d. %H:%i') AS time
    FROM post, user
    WHERE post.id = ${id}
    AND post.user = user.id
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

export const selectFeedInRange = (user: number, start: number, count: number): string =>
    `
    SELECT access
    FROM feed
    WHERE user = ${user}
    LIMIT ${start}, ${count}
    ;`;

export const add = (access: string, user: number, text: string): string =>
    `
    INSERT INTO post
    VALUES (NULL, "${access}", ${user}, "${text}", NULL)
    ;`;

export const addImage = (post: number, image: string): string =>
    `
    INSERT INTO post_image
    VALUES (NULL, ${post}, "${image}")
    ;`;

export const deleteById = (id: number): string =>
    `
    DELETE FROM post
    WHERE id = ${id}
    ;`;

export const selectImage = (post: number): string =>
    `
    SELECT image
    FROM post_image
    WHERE post = ${post}
    ;`;

export const checkImage = (post: number, image: string): string =>
    `
    SELECT image
    FROM post_image
    WHERE post = ${post} AND image = "${image}"
    ;`;

export const addLike = (post: number, user: number): string =>
    `
    INSERT INTO post_like
    VALUES (${post}, ${user})
    ;`;

export const deleteLike = (post: number, user: number): string =>
    `
    DELETE FROM post_like
    WHERE post = ${post} AND user = ${user}
    ;`;

export const selectLike = (post: number): string =>
    `
    SELECT user.access
    FROM post_like, user
    WHERE post_like.post = ${post}
    AND post_like.user = user.id
    ;`;

export const addComment = (post: number, user: number, comment: string): string =>
    `
    INSERT INTO post_comment
    VALUES (NULL, ${post}, ${user}, "${comment}", NULL)
    ;`;

export const deleteComment = (id: number): string =>
    `
    DELETE FROM post_comment
    WHERE id = ${id}
    ;`;

export const selectComment = (post: number): string =>
    `
    SELECT post_comment.id, user.access, post_comment.comment, DATE_FORMAT(post_comment.time, '%Y. %m. %d. %H:%i') AS time
    FROM post_comment, user
    WHERE post_comment.post = ${post}
    AND post_comment.user = user.id
    ;`;
