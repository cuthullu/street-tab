function initialize() {
    const location = getLocation()
    const h = location.heading || 165
    const heading = Math.abs(parseFloat(h))
    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
            pano: location.pid,
            pov: { heading, pitch: 0 },
            zoom: 1,
            disableDefaultUI: true,
        }
    )
    panorama.addListener('status_changed', () => getAddress(panorama));
    setInterval(CreateHeadingIntervalFunction(location, panorama), 100)

    setTitleText(location)
    setInterval(setDateTime, 1000);
    setDateTime()
}

function CreateHeadingIntervalFunction(location, panorama) {
    let mouseDown = false
    
    document.getElementById('street-view').addEventListener('mousedown', () => mouseDown = true)
    document.getElementById('street-view').addEventListener('mouseup', () => mouseDown = false)
    window.addEventListener('beforeunload', () => saveLocation(location))

    return () => {
        if (!mouseDown) {
            requestAnimationFrame(() => {
                const pov = panorama.getPov()
                pov.heading = (pov.heading + 0.01) % 360
                location.heading = pov.heading
                panorama.setPov(pov)
            })
        }
    }
}

function saveLocation(location) {
    localStorage.setItem('newTabWorldLocation', JSON.stringify(location));
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

function getAddress(panorama) {
    const { lat, lng } = panorama.getLocation().latLng
    const data = {
        location: { lat: lat(), lng: lng() }
    }
    const Geocoder = new google.maps.Geocoder()

    Geocoder.geocode(data, setAddress)
}

function setAddress([{ formatted_address }]) {
    document.getElementById('address').innerHTML = formatted_address
}

function setTitleText(location) {
    document.getElementById('subtitle').innerHTML = location.title;
    document.getElementById('welcome').innerHTML = location.welcome;
    document.getElementById('greeting').innerHTML = getGreeting() + " Tom";
}

function setDateTime() {
    const d = new Date()
    document.getElementById('date').innerHTML = d.toLocaleDateString()
    document.getElementById('time').innerHTML = formatDate(d)
}

function formatDate(date) {
    var m = date.getMinutes();
    var ms = m < 10 ? "0" + m : m + "";
    return date.getHours() + ":" + ms;
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
