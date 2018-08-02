var recordButton = document.querySelector('.record');
var submitButton = document.querySelector('.submit');
var audioEle = document.querySelector('audio');
var blob = null;
var blobUrl = null;
var recorder = null;

function fillAudioEle(blobUrl) {
    audioEle.controls = true;
    const sourceEle = document.createElement('source');
    sourceEle.src = blobUrl;
    sourceEle.type = 'audio/wav';
    audioEle.appendChild(sourceEle);
    audioEle.load();
    submitButton.disabled = false;
}

function removeAudio() {
    audioEle.controls = false;
    if (audioEle.firstElementChild) {
        audioEle.removeChild(audioEle.firstElementChild);
    }
}

function checkResponse(res) {
    if (!res.ok) throw Error(res.statusText);
    return res;
}

function errorCallback(err) {
    console.log(err);
    alert('Operation failed. Please check the log.');
}

recordButton.onclick = function() {
    if (recordButton.innerText == 'Record') {
        submitButton.disabled = true;
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const chunks = [];
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = e => chunks.push(e.data);
            recorder.onstop = e => {
                blob = new Blob(chunks, { type: 'audio/wav' });
                blobUrl = URL.createObjectURL(blob);
                fillAudioEle(blobUrl);
            }
            recorder.start();
            removeAudio();
        }).catch(console.error);
        recordButton.innerText = 'Stop';
        recordButton.classList.add('stop');
        recordButton.classList.remove('record');
    } else {
        recorder.stop();
        recordButton.innerText = 'Record';
        recordButton.classList.remove('stop');
        recordButton.classList.add('record');
    }
}

submitButton.onclick = function(){
    let fd = new FormData();
    submitButton.disabled = true;
    fd.append('audio', blob, blobUrl);
    fetch('/submit', {
        method: 'POST',
        body: fd,
        credentials: 'include'
    })
    .then(checkResponse)
    .then(removeAudio)
    .catch(errorCallback);
}
