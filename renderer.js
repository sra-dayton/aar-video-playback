// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

fs = require('fs');
xml2js = require('xml2js');

var parser = new xml2js.Parser();
foldersInVideoDir = [];
filesToLoad = {};
// var ticksToEpochs = function(ticks){
// //ticks are in nanotime; convert to microtime
//     var ticksToMicrotime = ticks / 10000;
//
// //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
//     var epochMicrotimeDiff = Math.abs(new Date(0, 0, 1).setFullYear(1));//2208988800000;
//
// //new date is ticks, converted to microtime, minus difference from epoch microtime
//     var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
//     var tickDateEpochs = (ticksToMicrotime - epochMicrotimeDiff)
//     console.log(((tickDate.getTime() * 10000) + 621355968000000000))
//     console.log(((tickDateEpochs * 10000) + 621355968000000000))
//     return tickDate;
// };

// var ticks = ((yourDateObject.getTime() * 10000) + 621355968000000000);

videoDir = gOptions.videoDir;
console.log(process.type)
fs.readdir(videoDir, (err, files) => {
    files.forEach(file => {
        console.log(file);
        foldersInVideoDir.push(file)
    });

    // var folders = foldersInVideoDir;
    var folders = gOptions.videoOrder;
    folders.forEach(function(folder){
        filesToLoad[folder] = {};

        fs.readFile(videoDir + folder + '/data_1.xml', function(err, data) {
            parser.parseString(data, function (err, result) {
                console.log(result['Files']['File'][0]['$']['Filename']);
                console.log(result);

                result['Files']['File'].forEach(function(file) {
                    var fileNameSplit = file['$']['Filename'].split('_');
                    var dateString = fileNameSplit[1].split('-').join('/');
                    var timeString = fileNameSplit[2].split('.')[0].split('-').join(':');

                    var timeInEpochs = new Date(dateString + ' ' + timeString).getTime();
                    console.log(dateString + ' ' + timeString);
                    console.log(timeInEpochs);
                    console.log('Filename: ' + file['$']['Filename'] + ' Duration: ' + file['$']['DurationSeconds'] + ' SizeBytes: ' + file['$']['SizeBytes'] + ' CreatedDateTicks: ' + file['$']['CreatedDateTicks']);
                    console.log('\n');

                    filesToLoad[folder][timeInEpochs] = {'filename': file['$']['Filename'],
                                                            'duration': file['$']['DurationSeconds'] - 2};

                });
                console.log('Done');
            });
        });

        console.log(filesToLoad);

        var videoDiv = document.getElementById('videoDiv');
        var div = document.createElement('div');
        var video = document.createElement('video');
        var p = document.createElement('p');
        div.setAttribute('class', 'floated_video');
        // div.setAttribute('style', 'background-color:lightslategrey')
        div.setAttribute('style', 'padding:2px; border:1px solid lightgray;');
        video.setAttribute('id', folder);
        video.setAttribute('width', '480');
        video.setAttribute('height', '275');
        video.setAttribute('controls', 'true');
        var source = document.createElement('source');
        var files = fs.readdirSync(videoDir + folder);
        source.setAttribute('src', 'file://' + videoDir + folder + '/' + files[0]);
        source.setAttribute('type', 'video/mp4');
        video.appendChild(source);
        p.innerHTML = 'Camera: ' + folder;
        p.setAttribute('style', 'padding-bottom:5px; padding-top:5px; padding-left:5px; background-color:#8F8F8F; color: white; margin-bottom:0px; margin-top:5px;');
        p.setAttribute('align', 'left');
        div.appendChild(p);
        div.appendChild(video);
        videoDiv.setAttribute('align', 'center');
        videoDiv.appendChild(div);
    })

});



// var go_forward_button = document.getElementById("v-goto-forward"); /* Jump button */
// var go_backward_button = document.getElementById("v-goto-backward"); /* Jump button */
// var slider = document.getElementById("defaultSlider");
// var video1 = document.getElementById("video1"); /* Video object */
// var video2 = document.getElementById("video2"); /* Video object */
// var video3 = document.getElementById("video3"); /* Video object */
// var video4 = document.getElementById("video4"); /* Video object */
// var video5 = document.getElementById("video3"); /* Video object */
// var video6 = document.getElementById("video4"); /* Video object */
//
// slider.addEventListener("change", function(){
//     video1.currentTime = this.value;
//     video2.currentTime = this.value;
//     video3.currentTime = this.value;
//     video4.currentTime = this.value;
//     video5.currentTime = this.value;
//     video6.currentTime = this.value;
// });


/*
/!* Move timeline to 10 seconds *!/
go_forward_button.addEventListener("click", function()
{
    video1.currentTime = 10;
    video2.currentTime = 10;
    video3.currentTime = 10;
    video4.currentTime = 10;
}, false);

/!* Move timeline to 0 seconds *!/
go_backward_button.addEventListener("click", function()
{
    video1.currentTime = 0;
    video2.currentTime = 0;
    video3.currentTime = 0;
    video4.currentTime = 0;
}, false);*/





