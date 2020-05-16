const selectFollowing = (id: number): string =>
    `
    SELECT user.access AS access
    FROM follow, user
    WHERE follow.follower = ${id}
    AND user.id = follow.following
    ;`;

const selectFollower = (id: number): string =>
    `
    SELECT user.access AS access
    FROM follow, user
    WHERE follow.following = ${id}
    AND user.id = follow.follower
    ;`;

const checkFollowing = (follower: number, following: number): string =>
    `
    SELECT following
    FROM follow
    WHERE follower = ${follower} AND following = ${following}
    ;`;

const addFollow = (follower: number, following: number): string =>
    `
    INSERT INTO follow
    VALUES ("${follower}", "${following}")
    ;`;

const deleteFollow = (follower: number, following: number): string =>
    `
    DELETE FROM follow
    WHERE follower = "${follower}" AND following = "${following}"
    ;`;

export default {
    selectFollowing,
    selectFollower,
    checkFollowing,
    addFollow,
    deleteFollow
};
