<Webcam
  onError={(error) => console.error(error)}
  onRequest={() => console.log('requesting...')}
  onStart={(stream) => console.log(stream)}
  onStop={(stream) => console.log(stream)}
/>;
