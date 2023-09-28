import '../style.css'
import { Map } from './class.js'

document.querySelector('#app').innerHTML = `
<h1>Interactive Map</h1>
  <div class="main__container">
    <div id="map"></div>
    <div id="controls">
      <h2>Filter added Pins</h2>
      <input class="disable" type="text" id="filter-text">
    </div>
  </div>
`

export let map = new Map();
const textFilter = document.getElementById('filter-text')

textFilter.oninput = function() {
  const text = this.value;
  map.filterMarkers(text);
}