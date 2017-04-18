/**
 * Created by w116sxn on 4/3/2017.
 */

const dgram = require('dgram');
const server = dgram.createSocket('udp4');
prevSliderValue = 0;
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
var command = `${msg}`.split(' ')[0];
var sliderValue =  `${msg}`.split(' ')[1];
if(command === 'Play'){
    var d = document.getElementsByTagName("video");
    for (var i = 0; i < d.length; i++) {
        console.log(d[i].id);
        if(d[i].currentTime < d[i].duration)
            d[i].playbackRate = parseFloat(sliderValue);
        d[i].play();
    }
}
else if(command === 'Pause'){
    var d = document.getElementsByTagName("video");
    for (var i = 0; i < d.length; i++) {
        console.log(d[i].id);
        d[i].pause();
    }
}
else if(command === 'MoveToTime'){
    var d = document.getElementsByTagName("video");
    sliderValue = parseInt(sliderValue);
    for (var i = 0; i < d.length; i++) {
        console.log(d[i].id);
        var epochs = Object.keys(filesToLoad[d[i].id]);
        if(epochs.length > 0){
            epochs.sort(function(a, b){return a-b});
            var lowerFile = '', upperFile = '', lowerFileDuration = 0, upperFileDuration = 0, lowerEpoch = 0, upperEpoch = 0, fileToPlay = '';
            for(var j = 0; j < epochs.length; j++){
                if(sliderValue > epochs[j]){
                    continue;
                }
                else{
                    if(j > 0){
                        lowerEpoch = epochs[j - 1];
                        lowerFile = filesToLoad[d[i].id][epochs[j - 1]]['filename'];
                        lowerFileDuration = filesToLoad[d[i].id][epochs[j - 1]].duration * 1000;

                        upperEpoch = epochs[j];
                        upperFile = filesToLoad[d[i].id][epochs[j]]['filename'];
                        upperFileDuration = filesToLoad[d[i].id][epochs[j]].duration * 1000;
                    }
                    else{
                        // lowerEpoch = epochs[0];
                        // lowerFile = filesToLoad[foldersInVideoDir[i]][epochs[0]]['filename'];
                        // lowerFileDuration = filesToLoad[foldersInVideoDir[i]][epochs[0]].duration * 1000;
                    }
                    break;
                }
            }

            lowerEpoch = parseInt(lowerEpoch);
            lowerFileDuration = parseInt(lowerFileDuration);

            if(lowerEpoch === 0){
                lowerEpoch = epochs[epochs.length - 1];
                lowerFile = filesToLoad[d[i].id][epochs[epochs.length - 1]]['filename'];
                lowerFileDuration = filesToLoad[d[i].id][epochs[epochs.length - 1]].duration * 1000;
            }


            if(lowerEpoch < sliderValue && sliderValue < lowerEpoch + lowerFileDuration){
                fileToPlay = lowerFile;
                console.log('file://' + videoDir + d[i].id + '/' + fileToPlay);
                if(d[i].getAttribute('src') !== 'file://' + videoDir + d[i].id + '/' + fileToPlay)
                    d[i].setAttribute('src', 'file://' + videoDir + d[i].id + '/' + fileToPlay);
                d[i].currentTime = (sliderValue - lowerEpoch)/1000;
                // d[i].currentTime = d[i].currentTime - (sliderValue - lowerEpoch)/1000;
            }
            else {
                fileToPlay = upperFile;
                console.log('file://' + videoDir + d[i].id + '/' + fileToPlay);
                if(d[i].getAttribute('src') !== 'file://' + videoDir + d[i].id + '/' + fileToPlay)
                    d[i].setAttribute('src', 'file://' + videoDir + d[i].id + '/' + fileToPlay);
                d[i].currentTime = (upperEpoch - sliderValue)/1000;

                if(prevSliderValue > sliderValue){
                    console.log(d[i].currentTime);
                    d[i].currentTime = d[i].currentTime - (sliderValue - lowerEpoch)/1000;
                    console.log(d[i].currentTime);
                }
                else{
                    console.log(d[i].currentTime);
                    d[i].currentTime = d[i].currentTime + (sliderValue - lowerEpoch)/1000;
                    console.log(d[i].currentTime);
                }


                prevSliderValue = sliderValue;
            }
        }
    }
}
});

server.on('listening', () => {
    var address = server.address();
console.log(`server listening ${address.address}:${address.port}`);
});

server.bind({
    address: 'localhost',
    port: 5251
});