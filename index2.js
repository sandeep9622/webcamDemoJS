$(function () {
    debugger
    let cameraButton = document.querySelector("#startcamera");
    let video = document.querySelector("#video");
    let startButton = document.querySelector("#startrecord");
    let stopButton = document.querySelector("#stoprecord");
    let downloadLink = document.querySelector("#downloadvideo");
    let stopCamera = document.querySelector("#stopcamera");
    let capturePhoto = document.querySelector('#capture');
    let canvas = document.querySelector('#cameraPhoto');
    let savePhoto = document.querySelector('#downloadphoto');

    let cameraStream = null;
    let mediaRecorder = null;
    let blobsRecorded = [];

    let seconds = 00;
    let tens = 00;
    let appendTens = document.getElementById("tens")
    let appendSeconds = document.getElementById("seconds");
    let Interval;

    cameraButton.addEventListener('click', async function () {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = cameraStream;
    });

    stopCamera.addEventListener('click', async function () {
        cameraStream = null;
        mediaRecorder = null;
        video.srcObject = null;
    });

    startButton.addEventListener('click', async function () {
        mediaRecorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm' });
        blobsRecorded = [];

        mediaRecorder.addEventListener('dataavailable', function (e) {
            blobsRecorded.push(e.data);
        });

        mediaRecorder.addEventListener('stop', function () {
            let videoLocal = URL.createObjectURL(new Blob(blobsRecorded, { type: 'video/webm' }));
            downloadLink.href = videoLocal;
        });

        mediaRecorder.start(100);

        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);
    });

    stopButton.addEventListener('click', function () {
        mediaRecorder.stop();
        clearInterval(Interval);
    });

    video.addEventListener('click', function () {
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    });

    canvas.addEventListener('click', function () {
        let image = canvas.toDataURL('image/jpeg');
        let element = document.createElement("a");
        element.href = image;
        element.setAttribute("download", "abc");
        document.body.append(element);
        element.click();
    });

    function startTimer() {
        tens++;

        if (tens <= 9) {
            appendTens.innerHTML = "0" + tens;
        }

        if (tens > 9) {
            appendTens.innerHTML = tens;

        }

        if (tens > 99) {
            console.log("seconds");
            seconds++;
            appendSeconds.innerHTML = "0" + seconds;
            tens = 0;
            appendTens.innerHTML = "0" + 0;
        }

        if (seconds > 9) {
            appendSeconds.innerHTML = seconds;
        }
    }
});