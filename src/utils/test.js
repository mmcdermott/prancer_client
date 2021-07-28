import fs from 'fs';
fs.readdir('.', function(err, files) {
    console.log(files);
});
