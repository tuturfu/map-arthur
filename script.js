// votre code JS


var mymap = L.map('mapid').setView([48.8534, 2.3488], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoianVsaWVua29tcCIsImEiOiJjanR1NGFuYjkxMmNvNDBucGI1aXZ4Y285In0.hiSplFD5CODUd9yxRO_qkg'
}).addTo(mymap);

let layerMarkers = L.layerGroup().addTo(mymap);


async function getData(query) {

    layerMarkers.clearLayers();

    let url = "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=date_start+%3E%3D+%23now()+AND+date_start+%3C+%23now(months%3D1)&rows=50&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type"
    
    if (query) {
        url = "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=date_start+%3E%3D+%23now()+AND+date_start+%3C+%23now(months%3D1) " + query + "&rows=50&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type"
    }

    
    let response = await fetch(url)
    let data = await response.json()
    data.records.forEach(function(event) {

    let title = event.fields.title

    if (!event.fields.lat_lon) {
        return;
    }

    let latitude = event.fields.lat_lon[0]

    let longitude = event.fields.lat_lon[1]

    let price = event.fields.price_detail

    if  (!price) {
        price = "Gratuit";
    }

    let marker = L.marker([latitude, longitude]);
    marker.bindPopup("<h2>" + title + "</h2>" + price).openPopup();

    marker.addTo(layerMarkers);

    });
}
    getData();

function onFormSubmit (event) {
    event.preventDefault();
    console.log("le formulaire a bien été envoyé");
    console.log(searchInput.value);

    getData(searchInput.value);
};