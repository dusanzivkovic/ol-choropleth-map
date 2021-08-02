import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import states from 'url:./data/us-states.geojson';

const stroke = new Stroke({
  color: 'rgb(255, 255, 255)',
  width: 2,
  lineDash: [3, 3]
})

function getStyle(feature) {
if (feature.get('density') > 1000) {
    return new Style({
      fill: new Fill({
          color: 'rgba(140,45,4, .9)'
      }),
      stroke: stroke
    })
} else if(feature.get('density') > 500){
    return new Style({
      fill: new Fill({
          color: 'rgba(217,72,1, .9)'
      }),
      stroke: stroke
  })
} else if(feature.get('density') > 200){
    return new Style({
      fill: new Fill({
        color: 'rgba(241,105,19, .9)'
      }),
      stroke: stroke
  })
} else if(feature.get('density') > 100){
    return new Style({
      fill: new Fill({
        color: 'rgba(253,141,60, .9)'
      }),
      stroke: stroke
  })
} else if(feature.get('density') > 50){
    return new Style({
      fill: new Fill({
        color: 'rgba(253,174,107, .9)'
      }),
      stroke: stroke
  })
} else if(feature.get('density') > 20){
    return new Style({
      fill: new Fill({
        color: 'rgba(253,208,162, .9)'
      }),
      stroke: stroke
  })
} else if(feature.get('density') > 10){
    return new Style({
      fill: new Fill({
        color: 'rgba(254,230,206, .9)'
      }),
      stroke: stroke
  })
}  else {
    return new Style({
      fill: new Fill({
        color: 'rgba(255,245,235, .9)'
      }),
    stroke: stroke
   })
 }
}

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      })
    }),
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: states
      }),
      style: getStyle
    })
  ],
  view: new View({
    center: fromLonLat([-96, 38]),
    zoom: 5
  })
});

let selected = null;
const info = document.getElementById('info');

map.on('pointermove', function (e) {
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  map.forEachFeatureAtPixel(e.pixel, function (f) {
    selected = f;
    return true;
  });

  if (selected) {
    info.innerHTML =` 
                      <p class="sov">${selected.get('name')}</p>
                      <p>${selected.get('density')} people/sqmi</p>
                    `
  } else {
    info.innerHTML = '&nbsp;';
  }
});


