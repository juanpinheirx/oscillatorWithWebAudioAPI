const audioContext = new AudioContext();
const audio = document.querySelector('audio');
const track = audioContext.createMediaElementSource(audio);
const playStop = document.querySelector('button');

playStop.addEventListener(
  'click',
  () => {
    if (audioContext.state === 'suspended') {
      return audioContext.resume();
    }
    if (playStop.dataset.playing === 'false') {
      audio.play();
      playStop.dataset.playing = 'true';
    } else if (playStop.dataset.playing === 'true') {
      audio.pause();
      playStop.dataset.playing = 'false';
    }
  },
  false
  );
  
  audio.addEventListener(
    'ended',
    () => {
      playStop.dataset.playing = 'false';
    },
    false
    );
    
    const volumeNode = audioContext.createGain();
    console.log(volumeNode);
    const volumeControl = document.querySelector('#volume');
    
    volumeControl.addEventListener(
      'input',
      () => {
        volumeNode.gain.value = volumeControl.value;
      },
      false
      );
      
      const pannerOption = {
        pan: 0,
      };
const panner = new StereoPannerNode(audioContext, pannerOption);

console.log(panner);

const pannerControl = document.querySelector('#panner');

pannerControl.addEventListener('input', () => {
  panner.pan.value = pannerControl.value;
},
false,
);

const analyser = audioContext.createAnalyser();

track.connect(analyser);

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

analyser.getByteTimeDomainData(dataArray);

const canvas = document.getElementById("visualizer");
const canvasCtx = canvas.getContext("2d");

canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

function draw() {
  const drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx.fillStyle = "rgb(200, 200, 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";
  canvasCtx.beginPath();
  const sliceWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * (canvas.height / 2);
  
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

draw();

track.connect(volumeNode).connect(panner).connect(audioContext.destination);