const meta = {
  name: 'webcam',
  description: 'Webcam React is a powerful library that provides easy integration of webcam.',
  dependency: {
    name: '@webcam/react',
    link: 'https://github.com/siberiacancode/webcam'
  },
  props: [
    {
      name: 'mirrored',
      description: 'Flips the video and the captured snapshots horizontally. Enabled by default.'
    },
    {
      name: 'muted',
      description: 'Mutes the underlying video element. Enabled by default.'
    },
    {
      name: 'stream',
      description: 'Displays an external media stream instead of requesting one internally.'
    },
    {
      name: 'requestTimeLimit',
      description: 'Aborts the getUserMedia request after the given number of milliseconds.'
    },
    {
      name: 'videoConstraints',
      description: 'Constraints passed to getUserMedia for the video track.'
    },
    {
      name: 'audioConstraints',
      description: 'Constraints passed to getUserMedia for the audio track.'
    },
    {
      name: 'children',
      description:
        'A node, or a render prop exposing the element, getCanvas and getSnapshot helpers.'
    },
    {
      name: 'ref',
      description: 'A ref to the underlying video element.'
    },
    {
      name: 'events',
      description:
        'Hook into the media stream lifecycle to react to permission requests, track when the camera goes live or shuts off, and handle failures.'
    }
  ]
};

export default meta;
