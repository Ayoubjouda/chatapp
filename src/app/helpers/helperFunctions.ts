import { fetchRedis } from "./redisHelper";

export const getFriendsByUserId = async (userId: string) => {
  const friendsIds = (await fetchRedis("smembers", `user:${userId}:friends`)) as string[];

  const friends = await Promise.all(
    friendsIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string;
      return JSON.parse(friend) as User;
    })
  );
  return friends;
};
