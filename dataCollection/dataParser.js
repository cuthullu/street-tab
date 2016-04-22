var fs = require('fs');

function readBigThing() {
    var bigObj = JSON.parse(fs.readFileSync('dataCollection/data.json', 'utf8'));
    var locations = [];
    bigObj['1'].forEach(function(site) {
        locations.push({
            title : site['1'],
            subtitle : site['5']['3'].split('-').map(capitalise).join(' '),
            pid : site['5']['1']
        })
    });

    fs.writeFileSync('locations.json', JSON.stringify(locations));
}
function capitalise(s) {
    return s.substr(0,1).toUpperCase()  + s.substr(1);
}

readBigThing();
