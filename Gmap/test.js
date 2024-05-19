// function initMap() {
//   var map = null;
//   var radius_circle = null;
//   var markers_on_map = [];
//   var i;
//   var address_lat_lng = null;
//   //initialize map on document ready
//   $(document).ready(function () {
//     // show your current location
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const pos = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         infoWindow.setPosition(pos);
//         infoWindow.setContent("<h5>My Location</h5>");
//         infoWindow.open(map);
//         map.setCenter(pos);
//         showMyCloseLocations(pos);
//         getLanguageByData(pos);
//       },
//       () => {
//         handleLocationError(true, infoWindow, map.getCenter());
//       }
//     );
//     var myOptions = {
//       zoom: 14,
//       mapTypeControl: true,
//       mapTypeControlOptions: {
//         style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
//       },
//       navigationControl: true,
//       mapTypeId: google.maps.MapTypeId.ROADMAP,
//     };
//     map = new google.maps.Map(document.getElementById("map"), myOptions);
//     google.maps.event.addListener(map, "click", showCloseLocations);
//     google.maps.event.addListener(map, "click", showClickedLocations);
//     // find my location
//     let infoWindow = new google.maps.InfoWindow();
//     const locationButton = document.getElementById("myLocationButton");
//     locationButton.textContent = "My Current Location";
//     locationButton.classList.add("custom-map-control-button");
//     map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
//     locationButton.addEventListener("click", () => {
//       // Try HTML5 geolocation.
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const pos = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             };
//             infoWindow.setPosition(pos);
//             infoWindow.setContent("<h5>My Location.</h5>");
//             infoWindow.open(map);
//             map.setCenter(pos);
//             showMyCloseLocations(pos);
//           },
//           () => {
//             handleLocationError(true, infoWindow, map.getCenter());
//           }
//         );
//       } else {
//         // Browser doesn't support Geolocation
//         handleLocationError(false, infoWindow, map.getCenter());
//       }
//     });
//   });
//   function showCloseLocations(e) {
//     var radius_km = $("#radius_km").val();
//     showLocationCircle(radius_km);
//     // $('#radius_km').click(function(){
//     //     radius_km = $('#radius_km').val();
//     //     showLocationCircle(radius_km);
//     //     removePreviousMarkers();
//     // });
//     function showLocationCircle(radius_km) {
//       removeAllRadiusAndMarkers();
//       address_lat_lng = e.latLng;
//       console.log(radius_km);
//       radius_circle = new google.maps.Circle({
//         center: address_lat_lng,
//         radius: radius_km * 1000,
//         clickable: false,
//         map: map,
//         strokeColor: "rgb(0, 117, 252)",
//         strokeOpacity: 0.8,
//         strokeWeight: 2,
//         fillColor: "rgb(0, 117, 252)",
//         fillOpacity: 0.2,
//       });
//       if (radius_circle) map.fitBounds(radius_circle.getBounds());
//       ///// issue comes here -- previous data has been stored
//       getLanguageByData(address_lat_lng);
//     }
//   }
//   function showMyCloseLocations(myPosition) {
//     var my_radius_km = "1";
//     showMyLocationCircle(my_radius_km);
//     // $('#radius_km').click(function(){
//     //     my_radius_km = $('#radius_km').val();
//     //     console.log(my_radius_km)
//     //     showMyLocationCircle(my_radius_km);
//     //     removePreviousMarkers();
//     // });
//     function showMyLocationCircle(my_radius_km) {
//       removeAllRadiusAndMarkers();
//       address_lat_lng = myPosition;
//       radius_circle = new google.maps.Circle({
//         center: address_lat_lng,
//         radius: my_radius_km * 1000,
//         clickable: false,
//         map: map,
//         strokeColor: "rgb(0, 117, 252)",
//         strokeOpacity: 0.8,
//         strokeWeight: 2,
//         fillColor: "rgb(0, 117, 252)",
//         fillOpacity: 0.2,
//       });
//       if (radius_circle) map.fitBounds(radius_circle.getBounds());
//       var address_lat_lng_new = new google.maps.LatLng(
//         address_lat_lng.lat,
//         address_lat_lng.lng
//       );
//       getLanguageByData(address_lat_lng_new);
//     }
//   }
//   function removePreviousMarkers() {
//     $("#radius_km").multiSelect("deselect_all");
//   }
//   function removeAllRadiusAndMarkers() {
//     //remove all radius and markers from map before displaying new ones
//     if (radius_circle) {
//       radius_circle.setMap(null);
//       radius_circle = null;
//     }
//     for (i = 0; i < markers_on_map.length; i++) {
//       if (markers_on_map[i]) {
//         markers_on_map[i].setMap(null);
//         markers_on_map[i] = null;
//       }
//     }
//   }
//   // Default table -- English Table
//   // function to get lat lons with info with english, sinhala and tamil language
//   function getLanguageByData(address_lat_lng) {
//     $.getJSON(`./Data/english.json`, function (data) {
//       $.each(data, function (key, value) {
//         var radius_km = $("#radius_km").val();
//         let infoWindow = new google.maps.InfoWindow();
//         var latitude = parseFloat(value.Latitude);
//         var longitude = parseFloat(value.Longitude);
//         var coords = { lat: latitude, lng: longitude };
//         var name = value.Name;
//         var address = value.Address;
//         var phone = value.Phone;
//         var whatsApp = value.WhatsApp;
//         var whatsAppWithoutPlus = whatsApp.replace(/[^0-9]/g, "");
//         var viber = value.Viber;
//         var viberWithoutPlus = viber.replace(/[^0-9]/g, "");
//         var info =
//           `<h4>${name}</h4>` +
//           `<h6>${address}</h6>` +
//           `<a href="tel:+${phone}">Phone : ${phone}</a>` +
//           `<br/>` +
//           `<a href="https://api.whatsapp.com/send?phone=${whatsAppWithoutPlus}">WhatsApp :<img src="../images/whatsapp.png"></img> ${whatsApp}</a>` +
//           `<br/>` +
//           `<a href="viber://contact?number=%2B${viberWithoutPlus}">Viber :<img src="../images/viber.png"></img> ${viber}</a>`;
//         var marker_lat_lng = new google.maps.LatLng(latitude, longitude);
//         var distance_from_location =
//           google.maps.geometry.spherical.computeDistanceBetween(
//             address_lat_lng,
//             marker_lat_lng
//           ); //distance in meters between your location and the marker
//         if (distance_from_location <= radius_km * 1000) {
//           var new_marker = new google.maps.Marker({
//             position: marker_lat_lng,
//             map: map,
//             title: name,
//             icon: "/images/cross.png",
//           });
//           google.maps.event.addListener(new_marker, "click", function () {
//             const pos = {
//               lat: latitude,
//               lng: longitude,
//             };
//             distance_from_location = distance_from_location / 1000;
//             infoWindow.setPosition(pos);
//             infoWindow.setContent(
//               `${info}  <h5> Distance From Selected Point: ${distance_from_location.toFixed(
//                 2
//               )}  Km </h5>`
//             );
//             infoWindow.open(map);
//             map.setCenter(pos);
//           });
//           markers_on_map.push(new_marker);
//         }
//       });
//     });
//   }
//   function showClickedLocations(e) {
//     var my_marker = [];
//     var address_lat_lng = e.latLng;
//     for (i = 0; i < my_marker.length; i++) {
//       if (my_marker[i]) {
//         my_marker[i].setMapOnAll(null);
//       }
//     }
//     var my_new_marker = new google.maps.Marker({
//       position: address_lat_lng,
//       map: map,
//       title: name,
//     });
//     my_marker.push(my_new_marker);
//   }
// }
// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(
//     browserHasGeolocation
//       ? "Error: The Geolocation service failed."
//       : "Error: Your browser doesn't support geolocation."
//   );
//   infoWindow.open(map);
// }
// $("#dropdownForLanguage").click(function () {
//   $("#languageDropdown").toggleClass("show");
// });
// $("#dropdownForRadiusKm").click(function () {
//   $("#radius_km_new").toggleClass("show");
// });


