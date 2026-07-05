const stream = await navigator.mediaDevices.getUserMedia({ video: true });

<Webcam stream={stream} />
