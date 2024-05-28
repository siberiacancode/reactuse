import { useMediaQuery } from './useMediaQuery';

const Demo = () => {
  const matches = useMediaQuery('(max-width: 768px)');

  return (
    <div>
      This is <code>{matches ? 'mobile' : 'desktop'}</code> screen
    </div>
  );
};

export default Demo;
