
function setDecorations(location) {
    document.getElementById('subtitle').innerHTML = location.title;
    document.getElementById('greeting').innerHTML = getGreeting() + ", Tom";
    document.getElementById('time').innerHTML = getTime();
    setInterval(function () {
        document.getElementById('time').innerHTML = getTime();
    }, 30000);
}

function initialize() {
    const location = getLocation()
    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
            pano: location.pid,
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            disableDefaultUI: true,
        }
    )
    setDecorations(location)
    setInterval(getIntervalFunction(panorama), 1)
}

function getIntervalFunction(panorama) {
    let mouseDown = false
    document.getElementById('street-view').addEventListener('mousedown', () => mouseDown = true)
    document.getElementById('street-view').addEventListener('mouseup', () => mouseDown = false)

    return () => {
        if (!mouseDown) {
            const pov = panorama.getPov()
            pov.heading = (pov.heading + 0.01) % 360
            panorama.setPov(pov)
        }
    }
}

function getLocation() {
    var location = JSON.parse(localStorage.getItem("newTabWorldLocation"));
    var time = Date.now();
    if (location === null || location.expires < Date.now()) {
        location = locations[Math.floor(Math.random() * locations.length)];
        location.expires = getEndOfDay();
        // const location = locations[Math.floor(Math.random() * locations.length)]
        location.welcome = getWelcome();
        localStorage.setItem('newTabWorldLocation', JSON.stringify(location));
    }
    return location;
}

function getWelcome() {
    return welcomes[Math.floor(Math.random() * welcomes.length)];
}

function getTime() {
    var d = new Date(Date.now());
    var m = d.getMinutes();
    var ms = m < 10 ? "0" + m : m + "";
    return d.getHours() + ":" + ms;
}

function getEndOfDay() {
    var t = new Date(Date.now());
    t.setHours(23);
    t.setMinutes(59);
    t.setSeconds(59);
    return t.getTime();
}

function getGreeting() {
    var hour = new Date(Date.now()).getHours();
    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    } else if (hour < 17) {
        return "Good Afternoon";
    } else {
        return "Good Evening"
    }
}

// window.onload = setUrl;
