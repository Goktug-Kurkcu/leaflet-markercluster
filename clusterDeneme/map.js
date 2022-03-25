

//                MAP OPTIONS START
//========================================================

//City Center Map Informations
var lat = 40.7783; //latitude
var longt = 30.0366; //longtitude
var zoom = 10; //zoom

//Map View Options
var map = L.map('map',  { zoomControl: false, minZoom: 0 }).setView([lat, longt], zoom);

// Add Zoom
new L.Control.Zoom({ position: 'topright' }).addTo(map); //zoom position- top right
//========================================================
//                MAP OPTIONS END


//                MAP LAYERS START
//========================================================

//OpenStreetMap
var standartMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Cluster Denemesi' }).addTo(map);

//========================================================
//                MAP LAYERS END


//========================================================
//                   FUNCTIONS

//Take data from API
function Ajax(url, cBak) {

    // XMLHttpRequest
    var xhr = new XMLHttpRequest();    
    xhr.open('GET', url, true);
    xhr.responseType = 'JSON'; //return api file

    xhr.onload = function () { //send request
 
        //Request Success
        if (this.status == 200)  
        {
            
            // Marker Informations Array
            var markers = []  
            //Informations
            var lst = JSON.parse(xhr.responseText); 

            //Add Infos to markers Array
            var itemNums = lst["items"].length
            for (var i = 0; i < itemNums; i++) {

                //if x or y coords aren't equal 0; add markers array
                if (lst["items"][i]["x"] !== 0 || lst["items"][i]["y"] !== 0) {
 
                    //add Informations in markers array
                    markers.push({  
                        subjectName: lst["items"][i]["subjectName"],
                        subjectId: lst["items"][i]["subjectId"], 
                        x: returnCoordX_3857to4326(lst["items"][i]["x"]),
                        y: returnCoordY_3857to4326(lst["items"][i]["y"])
                    })
                }
            }

            // CLUSTER GROUP
            var markerCluster = L.markerClusterGroup();
		
            for (var i = 0; i < markers.length; i++) {
                
                //objects in marker
                var a = markers[i];
                var title = a["subjectName"];

                // Icon Switch
                switch (title){
                    case "Kasis":
                        var myIconUrl = "images/marker-icon-black.png"
                        break;

                    case "Geçici Yol Kapamalar":
                        var myIconUrl = "images/marker-icon-violet.png"
                        break;
                    
                    case "Uyarıcı Trafik Levhaları":
                        var myIconUrl = "images/marker-icon-yellow.png"
                        break;

                    case "Trafik Yönlendirme İşaret ve Levha Düzenlemeleri":
                        var myIconUrl="images/marker-icon-orange.png"
                        break;

                    case "Işıklı İkaz Lambaları":
                        var myIconUrl = "images/marker-icon-red.png"
                        break;

                    case "Alt ve Üst Yapı Çalışmaları":
                        var myIconUrl = "images/marker-icon-grey.png"
                        break;

                    case "Ulaşım Şartları ve Noktaları Ulaşabilirlik Görüşü":
                        var myIconUrl = "images/marker-icon-gold.png"
                        break;

                    case "Belediye Otobüs Güzergahı" :
                        var myIconUrl = "images/marker-icon-gold.png"
                        break;

                    case "Otopark Geçiş Yolu İzinleri":
                        var myIconUrl = "images/marker-icon-green.png"
                        break;

                    default :
                        var myIconUrl = "images/marker-icon-blue.png"
                }
    
                var myIcon = L.icon({
                    iconUrl: myIconUrl,
                    iconSize: [25, 30],
                    iconAnchor: [25, 30],
                    popupAnchor: [25, 25],
                    });
                
                var marker = L.marker(new L.LatLng(a["y"],a["x"]), { title: title, icon : myIcon});
                marker.bindPopup(title);
                markerCluster.addLayer(marker);
            }
            map.addLayer(markerCluster);
        }
        cBak(lst);
    };
    xhr.send({});

    // ====================================
    // ====================================
    
    //FUNCTIONS FOR CHANGE COORDINATES; EPSG 3857 TO EPSG 4326

    var e = 2.7182818284
    var X = 20037508.34

    //--converting the logitute from epsg 3857 to 4326
    function returnCoordX_3857to4326(coord) {
        StartLng = (coord * 180) / X
        return StartLng
    }

    // --converting the latitude from epsg 3857 to 4326
    function returnCoordY_3857to4326(coord) {
        StartLat = coord / (X / 180)
        StartLat = ((Math.atan(Math.pow(e, ((Math.PI / 180) * StartLat)))) / (Math.PI / 360)) - 90
        return StartLat
    }
}

// ====================================

Ajax("API---KEY", function (res) { })
