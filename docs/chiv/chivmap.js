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

var hudMarkers = L.layerGroup();
var weapons = L.layerGroup();
var carryables = L.layerGroup();
var other = L.layerGroup();
var dynamicGroups = {}
var overlayMaps = {
  "Objective": hudMarkers,
  "Weapons": weapons,
  "Carryables": carryables,
  "Uncategorized": other
};

let filteredNameCount = {}
layerList = [hudMarkers, weapons, carryables, other]

if (typeof leafMarkers !== 'undefined') {

  var nameCounts = {}
  var factionNameCounts = {}
  nameThresh = 9;

  leafMarkers.forEach(el => {
    if (el.Name.length > 0) {
      if (nameCounts[el.Name]) {
        nameCounts[el.Name]++;

        //var faction = nameCounts[el.Name].faction
        if (el.faction && el.faction !== 'All') {
          if (factionNameCounts[el.faction])
            factionNameCounts[el.faction]++;
          else
            factionNameCounts[el.faction] = 1;
        }
      }
      else
        nameCounts[el.Name] = 1;
    }
  });
  console.log()

  filteredNameCount = Object.assign({}, factionNameCounts, Object.fromEntries(
    Object.entries(nameCounts).filter(([name, count]) => count > nameThresh)
  ));


  for (const [name, cnt] of Object.entries(filteredNameCount)) {
    dynamicGroups[name] = L.layerGroup();
    overlayMaps[`${name} (${cnt})`] = dynamicGroups[name]
    layerList.push(dynamicGroups[name])
  }
}

var map = L.map('map', { crs: L.CRS.Simple, layers: layerList }).setView([0, 0], 1);
var bnd = [map.layerPointToLatLng([-0, -0]), map.layerPointToLatLng([2000, 2000])];

L.tileLayer('assets/tiles/{z}/{x}/{y}.jpg', {
  continuousWorld: false,
  noWrap: true,
  minZoom: -1,
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

  updateHTML: function (lat, lng) {
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
function makeAmmo(icon) {
  const ammo = L.icon({
    // iconUrl: 'assets/Game/UI/Textures/Icons/ObjectiveIcons/T_ObjIcon_Ammo.png',  // Replace with your custom marker image
    iconUrl: icon,
    iconSize: [32, 32],  // Adjust the size
    iconAnchor: [16, 32], // Adjust the anchor point
  });
  return ammo
}

var markerGroups = {}
var iconOverride = {
  'MANTLET': '/icons/Mantlet.png',
  'AMMO': '/Game/UI/Textures/Icons/ObjectiveIcons/T_ObjIcon_Ammo.png',
  'GOLDEN ROOSTER': '/icons/GoldenCock.png',
  'CRAB CRATE': '/icons/CrabCrate.png',
  'BOOK': '/icons/Book.png',
  'DOOR': '/icons/Door.png',
  'SKULL': '/icons/Skull.png',
  'Yorick': '/icons/Yorick.png',
  'BROKEN SWORD': '/icons/BrokenSword.png',
  'BATTERING RAM': '/icons/BatteringRam.png',
}

function makeMarker(loc, name, description, objectName, icon, type, faction) {

  // console.log(name)
  // console.log(description)
  // if (typeof name == 'string' && name === 'AMMO') {
  //   icon = 'assets/Game/UI/Textures/Icons/ObjectiveIcons/T_ObjIcon_Ammo.png'
  // }
  console.log(iconOverride[name])
  if (iconOverride[name])
    icon = '../../assets' + iconOverride[name]

  const ammo = L.icon({
    // iconUrl: 'assets/Game/UI/Textures/Icons/ObjectiveIcons/T_ObjIcon_Ammo.png',  // Replace with your custom marker image
    iconUrl: icon,
    iconSize: [28, 28],  // Adjust the size
    iconAnchor: [14, 14], // Adjust the anchor point
  });
  var m = L.marker([loc[0] * 4, loc[1] * 4], { icon: ammo })
  m.bindPopup(objectName);
  // m.bindTooltip(tooltip).openTooltip()
  m.bindTooltip("<div style='background:white; padding:1px 3px 1px 3px'><b>" + name + " " + description + "</b></div>",
    {
      direction: 'right',
      permanent: false,
      sticky: true,
      offset: [10, 0],
      opacity: 0.75,
      className: 'leaflet-tooltip-own'
    });


  // Add marker to category

  // if (el.Name.length > 0){
  //   markerGroups[el.Name] 
  // }
  // else
  if (dynamicGroups[name]) {
    m.addTo(dynamicGroups[name])
  }

  if (faction && faction !== 'All')
    if (dynamicGroups[faction]){
      m.addTo(dynamicGroups[faction])
      m.addTo(hudMarkers)
    }
    else
      console.log(`Unknown faction ${faction}`)

  if (type !== 'undefined') {
    if (type === 'HudMarkers')
      m.addTo(hudMarkers)
    else if (type === 'InventoryItems') {
      if (objectName.startsWith('Carryable_'))
        m.addTo(carryables)
      else if (objectName.startsWith('Weapon_'))
        m.addTo(weapons)
    }
    else
      m.addTo(other)
  }
  else
    m.addTo(map)



}

var layerControl = L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

if (typeof leafMarkers !== 'undefined') {


  // makeMarker([909,3713],'TWO HANDED HAMMER ','Carryable_WoodenHammer_2','assets/Game/UI/Textures/Icons/WeaponIcons/SquareIcons/Wood_Hammer.png')
  leafMarkers.forEach(el => {
    var faction = 'All'
    if (typeof el['faction'] !== 'undefined')
      faction = el.faction
    makeMarker([el.Position[0] / 2, el.Position[1] / 2], el.Name, el.Description, el.ObjectName, '../../assets' + el.Icon + ".png", el.type, faction)
  });

}

