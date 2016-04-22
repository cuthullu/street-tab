function setUrl() {
    var location = getLocation();
    var heading = Math.floor(Math.random() * 360);
    var url = "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyA9vzLlvQtvlDLs9Dq6TJi1pzZdpkqSvJc&pano="
    url += location.pid;
    url += "&heading="
    url += heading
    url += "&pitch=10&fov=90"
    document.getElementById('frame').setAttribute('src', url);
    document.getElementById('title').innerHTML = location.title;
    document.getElementById('subtitle').innerHTML = location.subtitle;
    document.getElementById('greeting').innerHTML = getGreeting() + ", User";
    document.getElementById('time').innerHTML = getTime();
}

function getLocation() {
    var location = JSON.parse(localStorage.getItem("newTabWorldLocation"));
    var time = Date.now();
    if (location === null || location.expires < Date.now()) {
        location = locations[Math.floor( Math.random() * locations.length )];
        location.expires = getEndOfDay();
        localStorage.setItem('newTabWorldLocation', JSON.stringify(location));
    }
    return location;
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

window.onload = setUrl;
