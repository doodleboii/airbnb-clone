
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 1.5, // Start with a zoomed-out view
    scrollZoom: false // Disable scroll zoom for better control
});

// Add marker
const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h5>${listing.title}</h5><p>📍 Exact location will be provided after booking</p>`))
    .addTo(map);

// Smooth zoom-in effect after page load
map.once('load', () => {
    setTimeout(() => {
        map.flyTo({
            center: listing.geometry.coordinates,
            zoom: 14, // Zoom in to level 12
            speed: 2.5, // Adjust transition speed (default is 1.2)
            curve: 1.5, // Adjust easing curve (higher is slower)
            essential: true // Ensures animation plays smoothly
        });
    }, 700); // 1-second delay for smooth effect
});
