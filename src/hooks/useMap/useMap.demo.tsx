import { useMap } from './useMap';

const Demo = () => {
  const [map, actions] = useMap<number, boolean>();

  const toggleItem = (clickedItem: number) => {
    if (actions.has(clickedItem)) {
      actions.delete(clickedItem);
    } else {
      actions.set(clickedItem, true);
    }
  };

  return (
    <>
      <div>
        {Array.from({ length: 10 }, (_, index) => index + 1).map((item) => (
          <button key={item} onClick={() => toggleItem(item)} style={{ margin: 4 }}>
            {item}
          </button>
        ))}
      </div>

      <div>
        {actions.map((_value, item) => (
          <div key={item} style={{ margin: 4 }}>
            {item}
          </div>
        ))}
      </div>
    </>
  );
};

export default Demo;
