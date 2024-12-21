import { useState } from 'react';

import { useCounter } from '../useCounter/useCounter';
import { useMutation } from '../useMutation/useMutation';
import { useOptimistic } from './useOptimistic';

const Demo = () => {
  const [messages, setMessages] = useState({
    name: 'dima'
  });

  const [optimisticMessages, updateOptimistic] = useOptimistic<string[], string>(
    messages,
    (currentState, optimisticValue) => ({
      name: optimisticValue
    })
  );

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

  // const [optimisticLikes, updateOptimistic] = useOptimistic(
  //   likes.value,
  //   (_, optimisticValue) => optimisticValue
  // );

  const onClick = async () => {
    updateOptimistic('asd');
    await postLikeMutation.mutateAsync();
    setMessages({ name: 'dima' });
  };

  return (
    <>
      <button type='button' onClick={onClick}>
        click
      </button>
      <br />
      {JSON.stringify(optimisticMessages)}
      {String(postLikeMutation.isLoading)}
    </>
  );
};

export default Demo;
