import { useState } from "react";
import { useOptimistic } from "./useOptimistic";

interface TestItem {
  id: number;
  status: "optimistic" | "actual";
}

const Demo = () => {
  const [externalItems, setExternalItems] = useState<TestItem[]>([
    { id: 1, status: "actual" },
  ]);

  const [optimisticState, updateOptimistic] = useOptimistic(
    externalItems,
    (_, optimisticValue) => optimisticValue
  );

  const onClick = () => {
    const newItem: TestItem = {
      id: externalItems.length + 1,
      status: "optimistic",
    };

    const promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        setExternalItems((prevItems) => [
          ...prevItems,
          { ...newItem, status: "actual" },
        ]);
        resolve();
      }, 2000);
    });

    updateOptimistic([...optimisticState, newItem], promise);
  };

  return (
    <>
      <button type="button" onClick={onClick}>
        Update
      </button>
      <br />
      <pre lang="json">
        <b>Optimistic state:</b>
        <p>{JSON.stringify(optimisticState, null, 2)}</p>
      </pre>
    </>
  );
};

export default Demo;
