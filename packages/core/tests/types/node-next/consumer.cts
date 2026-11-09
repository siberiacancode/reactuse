import { useAsync } from '@siberiacancode/reactuse';

export const useConsumer = () => {
  const result = useAsync(async () => ['ok']);
  const values: string[] | undefined = result.data;

  return values;
};
