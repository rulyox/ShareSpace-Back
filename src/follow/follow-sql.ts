export const selectFollowing = (id: number): string =>
    `
    SELECT user.access AS access
    FROM follow, user
    WHERE follow.follower = ${id}
    AND user.id = follow.following
    ;`;

export const selectFollower = (id: number): string =>
    `
    SELECT user.access AS access
    FROM follow, user
    WHERE follow.following = ${id}
    AND user.id = follow.follower
    ;`;

export const checkFollowing = (follower: number, following: number): string =>
    `
    SELECT following
    FROM follow
    WHERE follower = ${follower} AND following = ${following}
    ;`;

export const addFollow = (follower: number, following: number): string =>
    `
    INSERT INTO follow
    VALUES ("${follower}", "${following}")
    ;`;

export const deleteFollow = (follower: number, following: number): string =>
    `
    DELETE FROM follow
    WHERE follower = "${follower}" AND following = "${following}"
    ;`;
