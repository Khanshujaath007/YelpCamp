
const parsedcamp = JSON.parse(campground)
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: parsedcamp, // starting position [lng, lat]
    zoom: 14 // starting zoom
});


// Create a new marker.
new mapboxgl.Marker()
    .setLngLat(parsedcamp)
    .setPopup(
        new mapboxgl.Popup({ Offset: 12 })
            .setHTML(
                `<h5>${camptitle}</h5><p><b>${camploc}</b></p>`
            )
    )
    .addTo(map)
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());

