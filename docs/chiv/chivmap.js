const crs = L.CRS.Simple;
//https://gis.stackexchange.com/questions/427986/leaflet-crs-simple-transformation-for-real-life-measurement
// const width = 6144;
// const height = 6144;
// const dpiX = (256 / width * Math.pow(2, 5)) * 1;
// const dpiY = (256 / height * Math.pow(2, 5)) * 1;
//   const factorX = 1 / (1 / dpiX );
//   const factorY = 1 / (1 / dpiY );
//   console.log(factorX, factorY);
  // @ts-ignore
   crs.transformation = new L.Transformation(0.0314, 0, 0.0314, 0);
            // console.log(leafMarkers)
            var y = document.getElementsByClassName('md-content__inner')
            var myDiv = document.createElement('div')
            myDiv.id = 'map'
            y[0].appendChild(myDiv)
            var map = L.map('map',{crs: L.CRS.Simple}).setView([0, 0], 1);
            var bnd = [map.layerPointToLatLng([-0,-0]), map.layerPointToLatLng([2000,2000])];
            L.tileLayer('assets/tiles/{z}/{x}/{y}.jpg', {
                continuousWorld: false,
                noWrap: true,
                minZoom: 1,
                maxZoom: 5,
                tileSize: 128,
                bounds: bnd,
                //zoomReverse: true
            }).addTo(map);

            //https://gis.stackexchange.com/questions/331360/leaflet-mouse-move-to-get-coordinate
let Position = L.Control.extend({ 
        _container: null,
        options: {
          position: 'bottomleft'
        },

        onAdd: function (map) {
          var latlng = L.DomUtil.create('div', 'mouseposition');
          this._latlng = latlng;
          return latlng;
        },

        updateHTML: function(lat, lng) {
          var latlng = lat + " " + lng;
          //this._latlng.innerHTML = "Latitude: " + lat + "   Longitiude: " + lng;
          this._latlng.innerHTML = "LatLng: " + latlng;
        }
      });
      this.position = new Position();
      map.addControl(this.position);
      map.addEventListener('mousemove', (event) => {
        
    this.position.updateHTML(event.layerPoint, '');
  }
);
function makeAmmo(icon){
    const ammo = L.icon({
                // iconUrl: 'assets/Game/UI/Textures/Icons/ObjectiveIcons/T_ObjIcon_Ammo.png',  // Replace with your custom marker image
                iconUrl: icon,
                iconSize: [32, 32],  // Adjust the size
                iconAnchor: [16, 32], // Adjust the anchor point
            });
    return ammo
}

function makeMarker(loc, tooltip, description, icon){
    
    const ammo = L.icon({
                // iconUrl: 'assets/Game/UI/Textures/Icons/ObjectiveIcons/T_ObjIcon_Ammo.png',  // Replace with your custom marker image
                iconUrl: icon,
                iconSize: [32, 32],  // Adjust the size
                iconAnchor: [16, 32], // Adjust the anchor point
            });
    var m = L.marker([loc[0]*4, loc[1]*4], {icon: ammo})
    m.bindPopup(description);
    // m.bindTooltip(tooltip).openTooltip()
    m.bindTooltip("<div style='background:white; padding:1px 3px 1px 3px'><b>" + tooltip + "</b></div>", 
{
    direction: 'right',
    permanent: false,
    sticky: true,
    offset: [10, 0],
    opacity: 0.75,
    className: 'leaflet-tooltip-own' 
});
    m.addTo(map)
}

// makeMarker([909,3713],'TWO HANDED HAMMER ','Carryable_WoodenHammer_2','assets/Game/UI/Textures/Icons/WeaponIcons/SquareIcons/Wood_Hammer.png')
leafMarkers.forEach(el => {
  makeMarker([el.Position[0]/2, el.Position[1]/2], el.Name + " " + el.Description, el.ObjectName, '../assets' + el.Icon + ".png")
});