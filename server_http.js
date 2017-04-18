var express = require('express')
var app = express()

// var video1 = document.getElementById("video1"); /* Video object */
// var video2 = document.getElementById("video2"); /* Video object */
// var video3 = document.getElementById("video3"); /* Video object */
// var video4 = document.getElementById("video4"); /* Video object */
// var video5 = document.getElementById("video5"); /* Video object */
// var video6 = document.getElementById("video6"); /* Video object */

app.get('/', function (req, res) {
    res.sendfile('slider.html')
})

app.get('/:sliderValue', function (req, res) {
    console.log(req.params.sliderValue);
    console.log(new Date(parseInt(req.params.sliderValue)));
    var sliderValue = req.params.sliderValue;
    if(sliderValue === 'play'){
        var d = document.getElementsByTagName("video");
        for (var i = 0; i < d.length; i++) {
            console.log(d[i].id);
            if(d[i].currentTime < d[i].duration)
                // d[i].playbackRate = 3.0;
                d[i].play();
        }
    }
    else if(sliderValue === 'pause'){
        var d = document.getElementsByTagName("video");
        for (var i = 0; i < d.length; i++) {
            console.log(d[i].id);
            d[i].pause();
        }
    }
    else {
        var d = document.getElementsByTagName("video");

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
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})