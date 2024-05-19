var map, ren, ser;
var data = {};
var data2 = {};
var marker;
var infowindow;
var doMark = true;
var directionsDisplay;

var wayA;
var wayB;

function initMap() {
  var map = null;
  var radius_circle = null;
  var markers_on_map = [];
  var i;
  var address_lat_lng = null;

  infoWindow = new google.maps.InfoWindow();

  // initialize map on document ready
  $(document).ready(function () {
    // show your current location
    /* navigator.geolocation.getCurrentPosition(
      (position) => {
      const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent("<h5>My Location</h5>");
      infoWindow.open(map);
      map.setCenter(pos);
      // show close pharmacies of my location 
      showMyCloseLocations(pos);
      getLanguageByData(pos)
      },
      () => {
      handleLocationError(true, infoWindow, map.getCenter());
      }
  ); */
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        //infoWindow.setPosition(pos);
        // infoWindow.setContent("<h5>My Location</h5>");
        // infoWindow.open(map);
        // map.setCenter(pos);
        // show close pharmacies of my location
        showMyCloseLocations(pos);
        getLanguageByData(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );

    var myOptions = {
      zoom: 14,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      },
      navigationControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    // create map
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    var control = document.createElement("DIV");
    control.style.padding = "1px";
    control.style.border = "1px solid #000";
    control.style.backgroundColor = "white";
    control.style.cursor = "pointer";
    control.innerHTML =
      '<img src="https://web.archive.org/web/20151226013612if_/http://i47.tinypic.com/2dlp2fc.jpg" border="0" alt="Image and video hosting by TinyPic">';
    control.index = 1;

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

    google.maps.event.addDomListener(control, "click", function () {
      doMark = false;
      markNow();
    });

    google.maps.event.addListener(map, "click", function (event) {
      if (!wayA) {
        wayA = new google.maps.Marker({
          position: event.latLng,
          map: map,
        });
      } else {
        wayB = new google.maps.Marker({
          position: event.latLng,
          map: map,
        });

        //Renderiza a rota, o draggable é diz se o waypoint é arrastavel ou não
        ren = new google.maps.DirectionsRenderer({
          draggable: true,
        });
        ren.setMap(map);
        ren.setPanel(document.getElementById("directionsPanel"));
        ser = new google.maps.DirectionsService();

        //Cria a rota, o DirectionTravelMode pode ser: DRIVING, WALKING, BICYCLING ou TRANSIT
        ser.route(
          {
            origin: wayA.getPosition(),
            destination: wayB.getPosition(),
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
          },
          function (res, sts) {
            if (sts == "OK") ren.setDirections(res);
          }
        );
      }
    });

    // show close pharmacies when click on map
    google.maps.event.addListener(map, "click", showCloseLocations);
    // show mark when click on map
    google.maps.event.addListener(map, "click", showClickedLocations);

    // show my location
    let infoWindow = new google.maps.InfoWindow();
    const locationButton = document.getElementById("myLocationButton");
    locationButton.textContent = "My Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        /* navigator.geolocation.getCurrentPosition(
          (position) => {
          const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("<h5>My Location</h5>");
          infoWindow.open(map);
          map.setCenter(pos);
          // show close pharmacies of my location 
          showMyCloseLocations(pos);
          getLanguageByData(pos)
          },
          () => {
          handleLocationError(true, infoWindow, map.getCenter());
          }
      ); */
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            //infoWindow.setPosition(pos);
            // infoWindow.setContent("<h5>My Location.</h5>");
            // infoWindow.open(map, marker);
            //  map.setCenter(pos);
            showMyCloseLocations(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        handleLocationError(false, infoWindow, map.getCenter());
      }
    });
  });

  // show close pharmacies when click on map
  function showCloseLocations(e) {
    var radius_km = $("#radius_km").val();

    showLocationCircle(radius_km);

    function showLocationCircle(radius_km) {
      removeAllRadiusAndMarkers();
      address_lat_lng = e.latLng;
      console.log(radius_km);
      radius_circle = new google.maps.Circle({
        center: address_lat_lng,
        radius: radius_km * 1000,
        clickable: false,
        map: map,
        strokeColor: "rgb(0, 117, 252)",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "rgb(0, 117, 252)",
        fillOpacity: 0.2,
      });
      if (radius_circle) map.fitBounds(radius_circle.getBounds());
      getLanguageByData(address_lat_lng);
    }
  }

  // show close pharmacies of my location
  function showMyCloseLocations(myPosition) {
    var my_radius_km = "1";
    showMyLocationCircle(my_radius_km);

    function showMyLocationCircle(my_radius_km) {
      let marker = new google.maps.Marker({
        position: map.getCenter(),
        label: "My Location",
        map: map,
        //draggable:true
      });

      removeAllRadiusAndMarkers();
      address_lat_lng = myPosition;
      radius_circle = new google.maps.Circle({
        center: address_lat_lng,
        radius: my_radius_km * 1000,
        clickable: false,
        map: map,
        strokeColor: "rgb(0, 117, 252)",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "rgb(0, 117, 252)",
        fillOpacity: 0.2,
        editable: true,
      });
      // radius_circle.bindTo('center',marker,'position');
      // radius_circle.addListener('center_changed', function() {
      //     document.getElementById('center').innerHTML = "center=" + marker.getPosition().toUrlValue(6);
      //   });
      //   radius_circle.addListener('radius_changed', function() {
      //     document.getElementById('radius').innerHTML = "radius=" + radius_circle.getRadius().toFixed(2);
      //   })

      //   radius_circle.push(marker)
      //   map.fitBounds(marker.Circle.getBounds())

      if (radius_circle) map.fitBounds(radius_circle.getBounds());
      var address_lat_lng_new = new google.maps.LatLng(
        address_lat_lng.lat,
        address_lat_lng.lng
      );
      getLanguageByData(address_lat_lng_new);
    }
  }

  // remove all radius and markers from map before displaying new ones
  function removeAllRadiusAndMarkers() {
    if (radius_circle) {
      radius_circle.setMap(null);
      radius_circle = null;
    }
    for (i = 0; i < markers_on_map.length; i++) {
      if (markers_on_map[i]) {
        markers_on_map[i].setMap(null);
        markers_on_map[i] = null;
      }
    }
  }

  // function to get lat,lons and info by English, Sinhala and Tamil language
  function getLanguageByData(address_lat_lng) {
    // Default table -- English Table
    language = "english";
    getPharmacyData(language);

    // table -- Sinhala Table, Tamil Table
    $("#languageDropdown a").click(function (event) {
      var language = this.textContent;
      console.log(language);
      getPharmacyData(language);
    });

    function getPharmacyData(language) {
      $.getJSON(`../Data/${language}.json`, function (data) {
        $.each(data, function (key, value) {
          var radius_km = $("#radius_km").val();
          let infoWindow = new google.maps.InfoWindow();
          var latitude = parseFloat(value.Latitude);
          var longitude = parseFloat(value.Longitude);
          var coords = { lat: latitude, lng: longitude };
          var name = value.Name;
          var clientid = value.clientID;
          var address = value.Address;
          var phone = value.Phone;
          var whatsApp = value.WhatsApp;
          var whatsAppWithoutPlus = whatsApp.replace(/[^0-9]/g, "");
          var viber = value.Viber;
          var viberWithoutPlus = viber.replace(/[^0-9]/g, "");
          var info =
            `<h3>${name}</h3>` +
            `<h5>${address}</h5>` +
            `<a href="tel:+${phone}">Phone : ${phone}</a>` +
            `<br/>` +
            `<a href="https://api.whatsapp.com/send?phone=${whatsAppWithoutPlus}">WhatsApp :<img src="../images/whatsapp.png"></img> ${whatsApp}</a>` +
            `<br/>` +
            `<a href="viber://contact?number=%2B${viberWithoutPlus}">Viber :<img src="../images/viber.png"></img> ${viber}</a>`;
          var marker_lat_lng = new google.maps.LatLng(latitude, longitude);
          var distance_from_location =
            google.maps.geometry.spherical.computeDistanceBetween(
              address_lat_lng,
              marker_lat_lng
            ); //distance in meters between your location and the marker
          if (distance_from_location <= radius_km * 1000) {
            var new_marker = new google.maps.Marker({
              position: marker_lat_lng,
              map: map,
              title: name,
              icon: "/images/cross.png",
            });
            google.maps.event.addListener(new_marker, "click", function () {
              const pos = {
                lat: latitude,
                lng: longitude,
              };
              distance_from_location = distance_from_location / 1000;
              infoWindow.setPosition(pos);
              infoWindow.setContent(`${info}<h5>Distance From Selected Point: ${distance_from_location.toFixed(2)}  Km </h5>
                            <h4>Medicine Availability</h4> 
                            <h6>->All types of medicines available</h6> 
                            <h6>->Delivery Available only within 10km</h6>
                            <h6>->Special Discounts upto 10%</h6>
                            <button id="Checkdrug" type="button" class="btn btn-primary" onclick="PharmacyApiCall(${clientid});">Check Available Drug</button>`);
              infoWindow.set;
              infoWindow.open(map);
              map.setCenter(pos);
            });
            markers_on_map.push(new_marker);
          }
        });
      });
    }
  }

  // show mark when click on map
  function showClickedLocations(e) {
    var my_marker = [];
    var address_lat_lng = e.latLng;
    for (i = 0; i < my_marker.length; i++) {
      if (my_marker[i]) {
        my_marker[i].setMapOnAll(null);
      }
    }
    var my_new_marker = new google.maps.Marker({
      position: address_lat_lng,
      map: map,
      title: name,
    });
    my_marker.push(my_new_marker);
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

// language dropdown visible
$("#dropdownForLanguage").click(function () {
  $("#languageDropdown").toggleClass("show");
});

function CloseDrugsPopUp() {
  $("#myModal").modal("hide");
}

// var map, ren, ser;
// var data = {};
// var data2 = {};
// var marker;
// var infowindow;
// var doMark = true;
// var directionsDisplay;
// var wayA;
// var wayB;

// //var waypoints;
// function initMap()
// {
//     var map = null;
//     var radius_circle = null;
//     var markers_on_map = [];
//     var i;
//     var address_lat_lng = null;

//     // initialize map on document ready
//     $(document).ready(function ()
//     {

//         // show your current location
//         navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                 const pos = {
//                     // lat: position.coords.latitude,
//                     // lng: position.coords.longitude,
//                     lat:7.025667447315725,
//                     lng:79.95141652134865,
//                 };
//                 infoWindow.setPosition(pos);
//                 infoWindow.setContent("<h5>My Location</h5>");
//                 infoWindow.open(map);
//                 map.setCenter(pos);
//                 // show close pharmacies of my location
//                 showMyCloseLocations(pos);
//                 getLanguageByData(pos)
//                 },
//                 () => {
//                 handleLocationError(true, infoWindow, map.getCenter());
//                 }
//             );
//         var myOptions = {
//             zoom: 14,
//             mapTypeControl: true,
//             mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
//             navigationControl: true,
//             mapTypeId: google.maps.MapTypeId.ROADMAP,
//             center: new google.maps.LatLng(7.025667447315725,79.95141652134865),

//         };

//         // create map
//         map = new google.maps.Map(document.getElementById("map"), myOptions);

//         //𝘋𝘳𝘢𝘸 𝘳𝘰𝘶𝘵𝘦 𝘸𝘩𝘦𝘯 𝘤𝘭𝘪𝘤𝘬 𝘰𝘯 𝘵𝘸𝘰 𝘱𝘭𝘢𝘤𝘦𝘴
//         var control = document.createElement('DIV');
//         control.style.padding = '1px';
//         control.style.border = '1px solid #000';
//         control.style.backgroundColor = 'white';
//         control.style.cursor = 'pointer';
//         control.innerHTML = '<img src="https://web.archive.org/web/20151226013612if_/http://i47.tinypic.com/2dlp2fc.jpg" border="0" alt="Image and video hosting by TinyPic">';
//         control.index = 1;

//         map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

//         google.maps.event.addDomListener(control, "click", function () {
//             doMark = false;
//             markNow();
//         });
//         map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

//         google.maps.event.addDomListener(control, 'click', function() {
//             doMark = false;
//             markNow();
//         });

//         google.maps.event.addListener(map, "click", function(event) {
//             if (!wayA)
//             {
//             wayA = new google.maps.Marker({

//                 position: event.latLng,
//                 map: map

//             });
//             }
//             else
//             {
//             wayB = new google.maps.Marker({

//                 position: event.latLng,
//                 map: map

//             });
//              removeAllRadiusAndMarkers();
//             ren = new google.maps.DirectionsRenderer({
//                 'draggable': true
//             });
//             ren.setMap(map);
//             ren.setPanel(document.getElementById("directionsPanel"));
//             ser = new google.maps.DirectionsService();

//             ser.route({
//                 'origin': wayA.getPosition(),
//                 'destination': wayB.getPosition(),
//                 'travelMode': google.maps.DirectionsTravelMode.DRIVING
//             }, function(res, sts) {
//                 if (sts == 'OK') ren.setDirections(res);
//             })

//             }
//         });

//         // show close pharmacies when click on map
//         google.maps.event.addListener(map, 'click', showCloseLocations);
//         // show mark when click on map
//         google.maps.event.addListener(map, 'click', showClickedLocations);

//         // show my location
//         let infoWindow = new google.maps.InfoWindow();
//         const locationButton = document.getElementById("myLocationButton");
//         locationButton.textContent = "My Current Location";
//         locationButton.classList.add("custom-map-control-button");
//         map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
//         locationButton.addEventListener("click", () => {
//             if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                 const pos = {
//                     lat:7.025667447315725,
//                     lng:79.95141652134865,
//                     // lat: position.coords.latitude,
//                     // lng: position.coords.longitude,
//                 };
//                 infoWindow.setPosition(pos);
//                 infoWindow.setContent("<h5>My Location.</h5>");
//                 infoWindow.open(map);
//                 map.setCenter(pos);
//                 showMyCloseLocations(pos);
//                 },
//                 () => {
//                 handleLocationError(true, infoWindow, map.getCenter());
//                 }
//             );
//             } else {
//             handleLocationError(false, infoWindow, map.getCenter());
//             }
//         });
//     });

//     // show close pharmacies when click on map
//     function showCloseLocations(e)
//     {
//         var radius_km = $('#radius_km').val();
//         showLocationCircle(radius_km);
//         function showLocationCircle(radius_km)
//          {
//             removeAllRadiusAndMarkers()
//             address_lat_lng = e.latLng;
//             console.log(radius_km)
//             radius_circle = new google.maps.Circle({
//                 center: address_lat_lng,
//                 radius: radius_km * 1000,
//                 clickable: false,
//                 map: map,
//                 strokeColor: "rgb(0, 117, 252)",
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//                 fillColor: "rgb(0, 117, 252)",
//                 fillOpacity: 0.20,
//                 editable:true
//             });
//             if(radius_circle) map.fitBounds(radius_circle.getBounds());
//             getLanguageByData(address_lat_lng)
//         }
//     }

//     // show close pharmacies of my location
//     function showMyCloseLocations(myPosition)
//     {
//         var my_radius_km = "1";
//         showMyLocationCircle(my_radius_km);

//         function showMyLocationCircle(my_radius_km)
//         {
//             map.circles = [];
//             let marker = new google.maps.Marker({
//                 position:map.getCenter(),
//                 label:"My Location",
//                 map:map,
//                 draggable:true
//             });
//             removeAllRadiusAndMarkers();
//             address_lat_lng = myPosition;
//             radius_circle = new google.maps.Circle({
//                 center: address_lat_lng,
//                 radius: my_radius_km * 1000,
//                 clickable: false,
//                 map: map,
//                 strokeColor: "rgb(0, 117, 252)",
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//                 fillColor: "rgb(0, 117, 252)",
//                 fillOpacity: 0.20,
//                 map:map,
//                 center:marker.getPosition(),
//                 editable:true
//             })
//         //    // myPosition.radius_circle.bindTo('center',marker, 'position');
//         //     marker.radius_circle.addListener('center_changed',function(){
//         //         document.getElementById('center').innerHTML = "center="+marker.getPosition().toUrlValue(6);
//         //     });
//         //     marker.radius_circle.addListener('radius_changed',function(){
//         //         document.getElementById('center').innerHTML = "center="+marker.radius_circle.getRadius(2);
//         //     })

//         //     map.circles.push(marker)
//         //     map.fitBounds(marker.radius_circle.getBounds())

//             if(radius_circle) map.fitBounds(radius_circle.getBounds());
//             var address_lat_lng_new = new google.maps.LatLng(address_lat_lng.lat, address_lat_lng.lng);
//             getLanguageByData(address_lat_lng_new)
//         }
//     }

//     // remove all radius and markers from map before displaying new ones
//     function removeAllRadiusAndMarkers()
//     {
//         if (radius_circle)
//         {
//             radius_circle.setMap(null);
//             radius_circle = null;
//         }
//         for (i = 0; i < markers_on_map.length; i++)
//          {
//             if (markers_on_map[i])
//             {
//                 markers_on_map[i].setMap(null);
//                 markers_on_map[i] = null;
//             }
//         }
//     }

//     // function to get lat,lons and info by English, Sinhala and Tamil language
//     function getLanguageByData(address_lat_lng)
//     {
//         // Default table -- English Table
//         language = "english"
//         getPharmacyData(language);

//         // table -- Sinhala Table, Tamil Table
//         $('#languageDropdown a').click(function(event)
//         {
//             var language = this.textContent;
//             console.log(language)
//             getPharmacyData(language);
//         })

//         function getPharmacyData(language) {
//             $.getJSON(`../Data/${language}.json`, function (data)
//             {
//                 $.each(data, function (key, value) {
//                     var radius_km = $('#radius_km').val();
//                     let infoWindow = new google.maps.InfoWindow();
//                     var latitude = parseFloat(value.Latitude)
//                     var longitude = parseFloat(value.Longitude)
//                     var coords = {lat:latitude,lng:longitude}
//                     var name = value.Name
//                     var address = value.Address
//                     var phone = value.Phone
//                     var whatsApp = value.WhatsApp
//                     var whatsAppWithoutPlus = whatsApp.replace(/[^0-9]/g,'')
//                     var viber = value.Viber
//                     var viberWithoutPlus = viber.replace(/[^0-9]/g,'')
//                     var info = `<h4>${name}</h4>`
//                     + `<h6>${address}</h6>`
//                     + `<a href="tel:+${phone}">Phone : ${phone}</a>`
//                     + `<br/>`
//                     + `<a href="https://api.whatsapp.com/send?phone=${whatsAppWithoutPlus}">WhatsApp :<img src="../images/whatsapp.png"></img> ${whatsApp}</a>`
//                     + `<br/>`
//                     + `<a href="viber://contact?number=%2B${viberWithoutPlus}">Viber :<img src="../images/viber.png"></img> ${viber}</a>`

//                     var marker_lat_lng = new google.maps.LatLng(latitude, longitude);
//                     var distance_from_location = google.maps.geometry.spherical.computeDistanceBetween(address_lat_lng, marker_lat_lng); //distance in meters between your location and the marker

//                     if (distance_from_location <= radius_km * 1000)
//                     {
//                         var new_marker = new google.maps.Marker({
//                             position: marker_lat_lng,
//                             map: map,
//                             title: name,
//                             icon:'/images/cross.png'
//                         });
//                         google.maps.event.addListener(new_marker, 'click', function () {
//                             const pos = {
//                                 // lat: latitude,
//                                 // lng: longitude,

//                                 lat:7.025667447315725,
//                                 lng:79.95141652134865,
//                             };
//                             distance_from_location = distance_from_location/1000
//                             infoWindow.setPosition(pos);
//                             infoWindow.setContent(`${info}  <h5> Distance From Selected Point: ${distance_from_location.toFixed(2)}  Km </h5>`);
//                             infoWindow.open(map);
//                             map.setCenter(pos);
//                         });
//                         markers_on_map.push(new_marker);
//                     }
//                 });
//             });
//         }
//     }

//     // show mark when click on map
//     function showClickedLocations(e)
//      {
//         var my_marker = [];
//         var address_lat_lng = e.latLng;
//         for (i = 0; i < my_marker.length; i++)
//         {
//             if (my_marker[i])
//             {
//                 my_marker[i].setMapOnAll(null);
//             }
//         }
//         var my_new_marker = new google.maps.Marker({
//             position: address_lat_lng,
//             map: map,
//             title: name,
//         });
//         my_marker.push(my_new_marker);
//     }

// }
// function drawPath(directionsService, directionsDisplay,start,end) {
//     directionsService.route({
//       origin: start,
//       destination: end,
//       optimizeWaypoints: true,
//       travelMode: $("input[name='travel_mode']:checked"). val()
//     }, function(response, status) {
//         if (status === 'OK') {
//         directionsDisplay.setDirections(response);
//         } else {
//         window.alert('Problem in showing direction due to ' + status);
//         }
//     });
// }

// function handleLocationError(browserHasGeolocation, infoWindow, pos)
// {
//     infoWindow.setPosition(pos);
//     infoWindow.setContent(
//         browserHasGeolocation
//         ? "Error: The Geolocation service failed."
//         : "Error: Your browser doesn't support geolocation."
//     );
//     infoWindow.open(map);
// }

// // language dropdown visible
// $('#dropdownForLanguage').click(function(){
//     $('#languageDropdown').toggleClass('show');
// });

// // function initMap() {
// //     var map = null;
// //     var radius_circle = null;
// //     var markers_on_map = [];
// //     var i;
// //     var address_lat_lng = null;

// //     // initialize map on document ready
// //     $(document).ready(function(){
// //         // show your current location
// //         navigator.geolocation.getCurrentPosition(
// //                 (position) => {
// //                 const pos = {
// //                     lat: position.coords.latitude,
// //                     lng: position.coords.longitude,
// //                 };
// //                 infoWindow.setPosition(pos);
// //                 infoWindow.setContent("<h5>My Location</h5>");
// //                 infoWindow.open(map);
// //                 map.setCenter(pos);
// //                 // show close pharmacies of my location
// //                 showMyCloseLocations(pos);
// //                 getLanguageByData(pos)
// //                 },
// //                 () => {
// //                 handleLocationError(true, infoWindow, map.getCenter());
// //                 }
// //             );
// //         var myOptions = {
// //             zoom: 14,
// //             mapTypeControl: true,
// //             mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
// //             navigationControl: true,
// //             mapTypeId: google.maps.MapTypeId.ROADMAP
// //         };

// //         // create map
// //         map = new google.maps.Map(document.getElementById("map"), myOptions);
// //         // show close pharmacies when click on map
// //         google.maps.event.addListener(map, 'click', showCloseLocations);
// //         // show mark when click on map
// //         google.maps.event.addListener(map, 'click', showClickedLocations);

// //         // show my location
// //         let infoWindow = new google.maps.InfoWindow();
// //         const locationButton = document.getElementById("myLocationButton");
// //         locationButton.textContent = "My Current Location";
// //         locationButton.classList.add("custom-map-control-button");
// //         map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
// //         locationButton.addEventListener("click", () => {
// //             if (navigator.geolocation) {
// //             navigator.geolocation.getCurrentPosition(
// //                 (position) => {
// //                 const pos = {
// //                     lat: position.coords.latitude,
// //                     lng: position.coords.longitude,
// //                 };
// //                 infoWindow.setPosition(pos);
// //                 infoWindow.setContent("<h5>My Location.</h5>");
// //                 infoWindow.open(map);
// //                 map.setCenter(pos);
// //                 showMyCloseLocations(pos);
// //                 },
// //                 () => {
// //                 handleLocationError(true, infoWindow, map.getCenter());
// //                 }
// //             );
// //             } else {
// //             handleLocationError(false, infoWindow, map.getCenter());
// //             }
// //         });
// //     });

// //     // show close pharmacies when click on map
// //     function showCloseLocations(e)
// //     {
// //         var radius_km = $('#radius_km').val();
// //         showLocationCircle(radius_km);
// //         function showLocationCircle(radius_km)
// //          {
// //             removeAllRadiusAndMarkers()
// //             address_lat_lng = e.latLng;
// //             console.log(radius_km)
// //             radius_circle = new google.maps.Circle({
// //                 center: address_lat_lng,
// //                 radius: radius_km * 1000,
// //                 clickable: false,
// //                 map: map,
// //                 strokeColor: "rgb(0, 117, 252)",
// //                 strokeOpacity: 0.8,
// //                 strokeWeight: 2,
// //                 fillColor: "rgb(0, 117, 252)",
// //                 fillOpacity: 0.20,
// //             });
// //             if(radius_circle) map.fitBounds(radius_circle.getBounds());
// //             getLanguageByData(address_lat_lng)
// //         }
// //     }

// //     // show close pharmacies of my location
// //     function showMyCloseLocations(myPosition)
// //     {
// //         var my_radius_km = "1";
// //         showMyLocationCircle(my_radius_km);
// //         function showMyLocationCircle(my_radius_km)
// //         {
// //             removeAllRadiusAndMarkers()
// //             address_lat_lng = myPosition;
// //             radius_circle = new google.maps.Circle({
// //                 center: address_lat_lng,
// //                 radius: my_radius_km * 1000,
// //                 clickable: false,
// //                 map: map,
// //                 strokeColor: "rgb(0, 117, 252)",
// //                 strokeOpacity: 0.8,
// //                 strokeWeight: 2,
// //                 fillColor: "rgb(0, 117, 252)",
// //                 fillOpacity: 0.20,
// //             });
// //             if(radius_circle) map.fitBounds(radius_circle.getBounds());
// //             var address_lat_lng_new = new google.maps.LatLng(address_lat_lng.lat, address_lat_lng.lng);
// //             getLanguageByData(address_lat_lng_new)
// //         }
// //     }

// //     // remove all radius and markers from map before displaying new ones
// //     function removeAllRadiusAndMarkers()
// //     {
// //         if (radius_circle)
// //         {
// //             radius_circle.setMap(null);
// //             radius_circle = null;
// //         }
// //         for (i = 0; i < markers_on_map.length; i++)
// //          {
// //             if (markers_on_map[i])
// //             {
// //                 markers_on_map[i].setMap(null);
// //                 markers_on_map[i] = null;
// //             }
// //         }
// //     }

// //     // function to get lat,lons and info by English, Sinhala and Tamil language
// //     function getLanguageByData(address_lat_lng)
// //     {
// //         // Default table -- English Table
// //         language = "english"
// //         getPharmacyData(language);

// //         // table -- Sinhala Table, Tamil Table
// //         $('#languageDropdown a').click(function(event)
// //         {
// //             var language = this.textContent;
// //             console.log(language)
// //             getPharmacyData(language);
// //         })

// //         function getPharmacyData(language) {
// //             $.getJSON(`../Data/${language}.json`, function (data)
// //             {
// //                 $.each(data, function (key, value) {
// //                     var radius_km = $('#radius_km').val();
// //                     let infoWindow = new google.maps.InfoWindow();
// //                     var latitude = parseFloat(value.Latitude)
// //                     var longitude = parseFloat(value.Longitude)
// //                     var coords = {lat:latitude,lng:longitude}
// //                     var name = value.Name
// //                     var address = value.Address
// //                     var phone = value.Phone
// //                     var whatsApp = value.WhatsApp
// //                     var whatsAppWithoutPlus = whatsApp.replace(/[^0-9]/g,'')
// //                     var viber = value.Viber
// //                     var viberWithoutPlus = viber.replace(/[^0-9]/g,'')
// //                     var info = `<h4>${name}</h4>`
// //                     + `<h6>${address}</h6>`
// //                     + `<a href="tel:+${phone}">Phone : ${phone}</a>`
// //                     + `<br/>`
// //                     + `<a href="https://api.whatsapp.com/send?phone=${whatsAppWithoutPlus}">WhatsApp :<img src="../images/whatsapp.png"></img> ${whatsApp}</a>`
// //                     + `<br/>`
// //                     + `<a href="viber://contact?number=%2B${viberWithoutPlus}">Viber :<img src="../images/viber.png"></img> ${viber}</a>`
// //                     var marker_lat_lng = new google.maps.LatLng(latitude, longitude);
// //                     var distance_from_location = google.maps.geometry.spherical.computeDistanceBetween(address_lat_lng, marker_lat_lng); //distance in meters between your location and the marker
// //                     if (distance_from_location <= radius_km * 1000) {
// //                         var new_marker = new google.maps.Marker({
// //                             position: marker_lat_lng,
// //                             map: map,
// //                             title: name,
// //                             icon:'/images/cross.png'
// //                         });
// //                         google.maps.event.addListener(new_marker, 'click', function () {
// //                             const pos = {
// //                                 lat: latitude,
// //                                 lng: longitude,
// //                             };
// //                             distance_from_location = distance_from_location/1000
// //                             infoWindow.setPosition(pos);
// //                             infoWindow.setContent(`${info}  <h5> Distance From Selected Point: ${distance_from_location.toFixed(2)}  Km </h5>`);
// //                             infoWindow.open(map);
// //                             map.setCenter(pos);
// //                         });
// //                         markers_on_map.push(new_marker);
// //                     }
// //                 });
// //             });
// //         }
// //     }

// //     // show mark when click on map
// //     function showClickedLocations(e)
// //      {
// //         var my_marker = [];
// //         var address_lat_lng = e.latLng;
// //         for (i = 0; i < my_marker.length; i++)
// //         {
// //             if (my_marker[i])
// //             {
// //                 my_marker[i].setMapOnAll(null);
// //             }
// //         }
// //         var my_new_marker = new google.maps.Marker({
// //             position: address_lat_lng,
// //             map: map,
// //             title: name,
// //         });
// //         my_marker.push(my_new_marker);
// //     }
// // }

// // function handleLocationError(browserHasGeolocation, infoWindow, pos)
// // {
// //     infoWindow.setPosition(pos);
// //     infoWindow.setContent(
// //         browserHasGeolocation
// //         ? "Error: The Geolocation service failed."
// //         : "Error: Your browser doesn't support geolocation."
// //     );
// //     infoWindow.open(map);
// // }

// // // language dropdown visible
// // $('#dropdownForLanguage').click(function(){
// //     $('#languageDropdown').toggleClass('show');
// // });

//Live
//let BaseUrl = ;

// let JsonRequestObject = [
//   {
//     pid: "3911",
//     clientID: "1",
//     quantity: "2",
//   },
//   {
//     pid: "3912",
//     clientID: "1",
//     quantity: "5",
//   },
// ];
var JsonRequestObject = JSON.parse(localStorage.getItem("JSONValue"));
var CLIENTID = 0; // Client ID

//Order Checking Function
function OrderCall(
  Endpoint,
  JsonRequestObject,
  SuccessFunction,
  ErrorFunction,
  BeforeSendFunction,
  CompleteFunction
) {
  JsonRequestObject.clientID = CLIENTID; //Assign the Particular ClientID

  $.ajax({
    beforeSend: BeforeSendFunction,
    url: Endpoint,
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(JsonRequestObject),
    complete: CompleteFunction,
    error: ErrorFunction,
    success: SuccessFunction,
  });
}

function BeforeSendToDo(Request) {
  //Request Header Set to Bearer Token
  Request.setRequestHeader(
    "Authorization",
    "Bearer =esafsdfhkjsaoiewrkjfnisdufhgrewenrqwkqwiruweirewhfkjefwigwefnwejf"
  );
  console.log("BeforeSendToDo.Request:", Request);
  document.getElementById("data-wrapper").style.display = "";
  $("#myModal").modal("show");
  $("#myModal").modal("hide");
}

function CompleteToDo(Response) {
  console.log("CompleteToDo.Response:", Response);
  //document.getElementById("Spinnerdiv").style.display = "none";
  document.getElementById("data-wrapper").style.display = "";
}

function ErrorToDo(Response) {
  var error = console.log("ErrorToDo.Response:", Response);

  if (error == true) document.getElementById("data-wrapper").style.display = "";
  else document.getElementById("data-wrapper").style.display = "";
}

function SuccessToDo(Response) {
  var success = console.log("SuccessToDo.Response:", Response.textContent);
  if (success == true) {
    document.getElementById("data-wrapper").style.display = "none";
  } else {
    document.getElementById("data-wrapper").style.display = "";
  }
}
//Button Click Event
function PharmacyOrderCall() {
  OrderCall(
    "https://healthapi.appexsl.com/apiv1.0/pharmacy_order",
    JsonRequestObject,
    SuccessToDo,
    ErrorToDo,
    BeforeSendToDo,
    CompleteToDo,
    CLIENTID
  );
}

//Product Availablity Checking Function
function ApiCall(
  Endpoint,
  JsonRequestObject,
  SuccessFunction,
  ErrorFunction,
  BeforeSendFunction,
  CompleteFunction,
  CLIENT
) {
  let RequestList = []; //Data Sending List

  //Data Add to the RequestList
  JsonRequestObject.DRUGS.forEach((item) => {
    //pid: "3106", name: "ALDREN 70mg", quantity: 10, dosage: "None"
    var piese = { pid: item.pid, clientID: CLIENT };
    RequestList.push(piese);
  });
  console.log(RequestList);
  $.ajax({
    beforeSend: BeforeSendFunction,
    url: Endpoint,
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(RequestList),
    complete: CompleteFunction,
    error: ErrorFunction,
    success: SuccessFunction,
  });
}

function BeforeSendToDo(Request) {
  //Request Header Set to Bearer Token
  Request.setRequestHeader(
    "Authorization",
    "Bearer =esafsdfhkjsaoiewrkjfnisdufhgrewenrqwkqwiruweirewhfkjefwigwefnwejf"
  );
  console.log("BeforeSendToDo.Request:", Request);
  document.getElementById("Spinnerdiv").style.display = "";
  document.getElementById("data-wrapper").style.display = "none";
  $("#myModal").modal("show");
  $("#myModal").modal("hide");
}

function CompleteToDo(Response) {
  console.log("CompleteToDo.Response:", Response);
  document.getElementById("Spinnerdiv").style.display = "none";
  document.getElementById("data-wrapper").style.display = "";
}

function ErrorToDo(Response) {
  var error = console.log("ErrorToDo.Response:", Response);

  if (error == true)
    document.getElementById("Checkdrug").style.display = "none";
  else document.getElementById("Checkdrug").style.display = "";
}

function SuccessToDo(Response) {
  var success = console.log("SuccessToDo.Response:", Response);
  //Print List  with price
  PrintData(Response);
  if (success == true)
    document.getElementById("Checkdrug").style.display = "none";
  else document.getElementById("Checkdrug").style.display = "";
}

function PharmacyApiCall(value) {
  // let JsonRequestObject = {
  //   id: 78912,
  // };
  CLIENTID = 1;
  console.log("Client ID : " + value);
  ApiCall(
    "https://healthapi.appexsl.com/apiv1.0/product_avmul",
    JsonRequestObject,
    SuccessToDo,
    ErrorToDo,
    BeforeSendToDo,
    CompleteToDo,
    CLIENTID
  );
}

function PrintData(Response) {
  var total = 0; //Bil Total
  var service = 50; //Service Charge
  var tax = 50; //Tax
  let htmlCode = "";
  console.log(Response);
  Response.forEach((item) => {
    item.forEach((one) => {
      console.log("Available : " + one[1]);
      if (one[1].constructor.toString().indexOf("Array") === -1) {
        var name = "";
        console.log(JsonRequestObject.DRUGS[1]);
        for (var x = 0; x < JsonRequestObject.DRUGS.length; x = x + 1) {
          if (JsonRequestObject.DRUGS[x].pid === one[0]) {
            name = JsonRequestObject.DRUGS[x].name;
          }
        }
        htmlCode += `
                            <tr>
                              <td>${one[0]}</td>
                              <td>${name}</td>
                              <td colspan="3" style="color: rgb(255, 255, 255); font-weight: 600; background-color: rgb(175, 74, 74); vertical-align: middle; text-align: center">${
                                one[1]
                              }</td>
                              <td style="vertical-align: middle; text-align: right">${(0).toFixed(
                                2
                              )}</td>
                            </tr>`;
      } else {
        one[1].forEach((two) => {
          var i = 0; //JsonObjectToSend Array index
          let ProductID = JsonRequestObject.DRUGS[i].pid;
          console.log(two);
          if (two.isactive === 1) {
            total =
              total +
              parseFloat(two.unit_price.replace(/,/g, "")) *
                parseInt(JsonRequestObject.DRUGS[i].quantity);
            htmlCode += `
                            <tr>
                              <td>${one[0]}</td>
                              <td>${two.name}</td>
                              <td style="background-color: rgb(130, 218, 130); vertical-align: middle; text-align: center">yes</td>
                              <td style="vertical-align: middle; text-align: center">${
                                JsonRequestObject.DRUGS[i].quantity
                              }</td>
                              <td style="vertical-align: middle; text-align: right">${
                                two.unit_price
                              }</td>
                              <td style="vertical-align: middle; text-align: right">${(
                                parseFloat(two.unit_price.replace(/,/g, "")) *
                                parseInt(JsonRequestObject.DRUGS[i].quantity)
                              ).toFixed(2)}</td>
                            </tr>`;
          } else {
            htmlCode += `
                            <tr>
                              <td>${one[0]}</td>
                              <td>${two.name}</td>
                              <td style="background-color: rgb(175, 74, 74); vertical-align: middle; text-align: center">No</td>
                              <td style="vertical-align: middle; text-align: center">${
                                JsonRequestObject.DRUGS[i].quantity
                              }</td>
                              <td style="vertical-align: middle; text-align: right">${
                                two.unit_price
                              }</td>
                              <td style="vertical-align: middle; text-align: right">${
                                parseInt(two.unit_price) *
                                parseInt(JsonRequestObject.DRUGS[i].quantity)
                              }</td>
                            </tr>`;
          }
          i = i + 1; //JsonObjectToSend Array index increment by 1
        });
      }
    });
  });
  if (total === 0) {
    htmlCode += `<tr>
                        <td colspan="5">${"Tax"}</td>
                        <td style="vertical-align: middle; text-align: right">${(0).toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td colspan="5">${"Service Charge"}</td>
                        <td style="vertical-align: middle; text-align: right">${(0).toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td colspan="5">${"Grand Total"}</td>
                        <td style="vertical-align: middle; text-align: right; font-weight: 600;">${(0).toFixed(
                          2
                        )}</td>
                    </tr>`;
  } else {
    htmlCode += `<tr>
                        <td colspan="5">${"Tax"}</td>
                        <td style="vertical-align: middle; text-align: right">${parseFloat(
                          tax
                        ).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="5">${"Service Charge"}</td>
                        <td style="vertical-align: middle; text-align: right">${parseFloat(
                          service
                        ).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="5" style="font-weight: 600;">${"Grand Total"}</td>
                        <td style="vertical-align: middle; text-align: right; font-weight: 600;">${(
                          total +
                          tax +
                          service
                        ).toFixed(2)}</td>
                    </tr>`;
  }

  let whole = `<table class="table table-bordered table-hover"  style="margin: 0px auto; width: auto; font-size: 12px; font-family: calibri" id="mytable">
                            <thead>
                              <tr>
                                <th style="width: 10%; vertical-align: middle; text-align: center">ID</th>
                                <th style="width: 28%; vertical-align: middle; text-align: center">Name</th>
                                <th style="width: 14%; vertical-align: middle; text-align: center">Availablity</th>
                                <th style="width: 15%; vertical-align: middle; text-align: center">Quantity</th>
                                <th style="width: 12%; vertical-align: middle; text-align: center">Unit Price</th>
                                <th style="width: 21%; vertical-align: middle; text-align: center">Prices</th>
                              </tr>
                            </thead>
                            <tbody id="table_body">${htmlCode}</tbody>
                          </table>`;
  document.getElementById("data-wrapper").innerHTML = whole;
}
