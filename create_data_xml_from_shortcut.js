/**
 * Created by w116sxn on 4/2/2017.
 */

var fs = require('fs');
xml2js = require('xml2js');
var parser = new xml2js.Parser();
var path = require('path')
var js2xmlparser = require("js2xmlparser");
var probe = require('node-ffprobe');
var ffmpeg = require('fluent-ffmpeg');
var rp = require('fs.realpath');
var util = require('util');

var ws = require('windows-shortcuts');


// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });

videoDir = process.argv[2]
console.log(videoDir);

filesInVideoDir = [];
filesToLoad = {};
filesToSave = {};
var fileArray = []
var itemsProcessed = 0;
var filesToSkip = 0
writeMyData();

function writeMyData() {

    var shortcut_text = ' - Shortcut.lnk';
    filesInVideoDir = fs.readdir(videoDir, function (err, files) {
        // console.log(files);

        files.forEach((videoFile, index, array) => {
            // console.log(videoFile);
            if (!(videoFile.endsWith('.MP4') || videoFile.endsWith('.mp4') || videoFile.endsWith('.mp4 - Shortcut.lnk')))
                filesToSkip++;
            console.log(filesToSkip);
            if (!(videoFile === 'data_1.xml' || videoFile === 'data.xml' || videoFile === 'Thumbs.db')) {


                        ws.query(path.resolve(videoDir, videoFile), function (err, actualVideoFile) {
                            console.log(actualVideoFile.target);

                            fs.stat(actualVideoFile.target, function (error, stats) {
                                 // console.log(stats)
                                if (stats.isFile()) {
                                    // console.log(stats.birthtime);
                                    var birthtime = new Date(stats.birthtime);
                                    console.log(birthtime)
                                    var dateString = '1_' + birthtime.getFullYear() + '-' + ("0" + (birthtime.getMonth() + 1)).slice(-2) + '-' + ("0" + birthtime.getDate()).slice(-2) + '_' + ("0" + birthtime.getHours()).slice(-2) + '-' + ("0" + birthtime.getMinutes()).slice(-2) + '-' + ("0" + birthtime.getSeconds()).slice(-2) + '.mp4';
                                    dateString = dateString + shortcut_text;
                                    console.log(dateString);

                            probe(path.resolve(actualVideoFile.target), function (err, metadata) {
                                console.log(err)
                                console.log("--->" + actualVideoFile.target);

                                // console.dir(metadata);
                                fileArray.push({
                                    "@": {
                                        'Filename': dateString,
                                        'SizeBytes': stats.size,
                                        'DurationSeconds': Math.ceil(metadata['format']['duration']),
                                        'OriginalFileName': videoFile
                                    }

                                });
                                itemsProcessed++;
                                console.log(itemsProcessed);
                                console.log(array.length)
                                console.log(index)
                                console.log(videoFile);
                                fs.renameSync(videoFile, dateString);
                                // console.log('Probe Time:' + metadata['probe_time'])

                                if (itemsProcessed === array.length - filesToSkip) {
                                    console.log(fileArray)
                                    filesToSave["File"] = fileArray;
                                    console.log(js2xmlparser.parse("Files", filesToSave));
                                    var fd = fs.openSync('data_1.xml', 'w');
                                    fs.writeSync(fd, js2xmlparser.parse("Files", filesToSave));
                                    fs.closeSync(fd);
                                }
                            });

                        }
                    })
                        });

            }
        });
    })
}

// if (!(videoFile === 'data_2 .xml' || videoFile === 'data.xml' || videoFile === 'Thumbs.db')){
// ffmpeg.ffprobe(path.resolve('.', videoFile), function (err, metadata) {
//     console.log("--->" + videoFile);
//     console.dir(metadata);
//     fileArray.push({
//         "@": {
//             'Filename': dateString,
//             'SizeBytes': stats.size,
//             'DurationSeconds': Math.ceil(metadata['format']['duration']),
//             'OriginalFileName': videoFile
//         }
//     });
//     itemsProcessed++
//     // console.log(array.length)
//     // console.log(index)
//     fs.renameSync(videoFile, dateString);
//
//     if (itemsProcessed === array.length - filesToSkip) {
//         console.log(fileArray)
//         filesToSave["File"] = fileArray;
//         console.log(js2xmlparser.parse("Files", filesToSave));
//         var fd = fs.openSync('data_1.xml', 'w');
//         fs.writeSync(fd, js2xmlparser.parse("Files", filesToSave));
//         fs.closeSync(fd);
//     }
// });
// }
