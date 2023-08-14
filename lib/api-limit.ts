import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth();
  if (!userId) return;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  // update
  if (userApiLimit)
    await prismadb.userApiLimit.update({
      where: {
        userId: userId,
      },
      data: {
        count: userApiLimit.count + 1,
      },
    });
  // create
  else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();
  if (!userId) return false;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  // can still use app
  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) return true;

  // exists and is less than free counts
  return false;
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  // no user should be able to make an api call if there is no user id, so return max + 1
  if (!userId) return MAX_FREE_COUNTS + 1;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  // user has not accessed this before
  if (!userApiLimit) return 0;

  return userApiLimit.count;
};
