export const getRandomThreeElements = <T>(arr: T[]): [T, T, T] | null => {
  if (arr.length < 3) {
    return null;
  }

  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1], shuffled[2]];
};
