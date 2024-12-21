import { useCounter } from '../useCounter/useCounter';
import { useMutation } from '../useMutation/useMutation';
import { useOptimistic } from './useOptimistic';

const Demo = () => {
  const likes = useCounter();
  const postLikeMutation = useMutation(
    () =>
      new Promise((resolve) =>
        setTimeout(() => {
          const updatedLikes = likes.value + 1;
          likes.set(updatedLikes);
          resolve(updatedLikes);
        }, 1000)
      )
  );

  const [optimisticLikes, updateOptimistic] = useOptimistic(
    likes.value,
    (_, optimisticValue) => optimisticValue
  );

  const onClick = () => {
    const promise = postLikeMutation.mutateAsync();
    updateOptimistic(likes.value + 1, promise);
  };

  return (
    <>
      <button type='button' onClick={onClick}>
        likes {optimisticLikes}
      </button>
      <br />
      <p>
        Optimistic value: <code>{optimisticLikes}</code>
      </p>
      <p>
        Actual value: <code>{likes.value}</code>
      </p>
    </>
  );
};

export default Demo;