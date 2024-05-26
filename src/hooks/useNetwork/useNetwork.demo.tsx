import { useNetwork } from './useNetwork';

const Demo = () => {
  const network = useNetwork();

  return (
    <ul>
      <li>online: {String(network.online)}</li>
      <li>saveData: {String(network.saveData)}</li>
      <li>type: {String(network.type)}</li>
      <li>downlink: {network.downlink}</li>
      <li>downlinkMax: {String(network.downlinkMax)}</li>
      <li>effectiveType: {network.effectiveType}</li>
      <li>rtt: {network.rtt}</li>
      <li>saveData: {String(network.saveData)}</li>
    </ul>
  );
};

export default Demo;
