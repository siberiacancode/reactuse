import { useNetwork } from '@siberiacancode/reactuse';

const Demo = () => {
  const network = useNetwork();

  return (
    <div>
      <p>Network status</p>
      <ul>
        <li>
          online: <code>{String(network.online)}</code>
        </li>
        <li>
          saveData: <code>{String(network.saveData)}</code>
        </li>
        <li>
          type: <code>{String(network.type)}</code>
        </li>
        <li>
          downlink: <code>{network.downlink}</code>
        </li>
        <li>
          downlinkMax: <code>{String(network.downlinkMax)}</code>
        </li>
        <li>
          effectiveType: <code>{network.effectiveType}</code>
        </li>
        <li>
          rtt: <code>{network.rtt}</code>
        </li>
        <li>
          saveData: <code>{String(network.saveData)}</code>
        </li>
      </ul>
    </div>
  );
};

export default Demo;
