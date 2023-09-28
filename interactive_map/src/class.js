const storage = JSON.parse(localStorage.getItem('markers')) // for debug

export class MarkerManager {
    constructor() {
        this.markers = JSON.parse(localStorage.getItem('markers')) || [];
        console.log('init storage', storage)
    }
  
    addMarker(marker) {
        this.markers.push(marker);
        this.saveMarkers();
    }

    editMarker(id, newMarkerData) {
        const mark = this.markers.find(marker => marker.id === id);
        const markerIndex = this.markers.findIndex(marker => marker === mark);

        if (markerIndex !== -1) {
            // Update the marker data
            this.markers[markerIndex] = { ...this.markers[markerIndex], ...newMarkerData };
            this.saveMarkers();
        }
    }
  
    removeMarker(id) {
        const mark = this.markers.find(marker => marker.id === id);
        const markerIndex = this.markers.findIndex(marker => marker === mark);

        if (markerIndex !== -1) {
            this.markers[markerIndex].leafletMarker.remove();
            this.markers.splice(markerIndex, 1);
            this.saveMarkers();
        }
    }
  
    saveMarkers() {
        localStorage.setItem('markers', JSON.stringify(this.markers, (key, value) => key === 'leafletMarker' ? undefined : value));
        this.checkMarkers() 
    }
  
    checkMarkers() {
        const textFilter = document.getElementById('filter-text')

        this.markers.length === 0 
        ? 
        (textFilter.classList.add("disable"),
        textFilter.placeholder = 'Add new pin first')
        : 
        (textFilter.classList.remove("disable"),
        textFilter.placeholder = '')
    }

    getMarkers() {
        this.checkMarkers() 
        return this.markers;
    }
  
    filterMarkers(text) {
        return this.markers.filter(marker => marker.description.includes(text));
    }
  }
  
  export class Map {
    constructor() {
      this.map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
      }).addTo(this.map);
      this.markerManager = new MarkerManager();
      this.loadMarkers();
      this.map.on('click', this.onMapClick.bind(this));
  }
  
    loadMarkers() {
        this.markerManager.getMarkers().forEach(markerData => this.addMarkerToMap(markerData));
    }

    addMarkerToMap(markerData) {
        const marker = L.marker([markerData.lat, markerData.lng], { draggable: true, title: markerData.title, icon: this.getMarkerIcon(markerData.color || 'blue') }).addTo(this.map);
        marker.on('dragend', () => {
            this.markerManager.editMarker(markerData.id, { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng });
        });

        marker.bindPopup(this.getMarkerPopupHTML(markerData));
        marker.on('popupopen', () => {
            console.log('ello')
            const editForm = document.getElementById('edit-marker-form')
            const deleteBtn = document.getElementById('delete-Btn')
            
            editForm.onsubmit = (e) => {
                e.preventDefault();
                const description = document.getElementById('edit-description').value;
                const color = document.getElementById('edit-color').value;
                this.editMarker(markerData.id, { description, color });
                marker.bindPopup(this.getMarkerPopupHTML({ ...markerData, description, color }));
                marker.closePopup()
            }
            deleteBtn.onclick = (e) => {
                e.preventDefault();
                console.log('deletin')
                this.markerManager.removeMarker(markerData.id);
                marker.closePopup()
            }
        });
        markerData.leafletMarker = marker;
    }

    getMarkerPopupHTML(markerData) {
        return `
            <form id="edit-marker-form">
                <span class="pin-span">Edit or delete this pin</span>
                <span>Title: ${markerData.title}</span>
                <label>
                    Info:
                    <input type="text" id="edit-description" value="${markerData.description}" required>
                </label>
                <label>
                    Color:
                    <select id="edit-color" required>
                        <option value="blue" ${markerData.color === 'blue' ? 'selected' : ''}>Blue</option>
                        <option value="gold" ${markerData.color === 'gold' ? 'selected' : ''}>Gold</option>
                        <option value="red" ${markerData.color === 'red' ? 'selected' : ''}>Red</option>
                        <option value="green" ${markerData.color === 'green' ? 'selected' : ''}>Green</option>
                        <option value="orange" ${markerData.color === 'orange' ? 'selected' : ''}>Orange</option>
                        <option value="yellow" ${markerData.color === 'yellow' ? 'selected' : ''}>Yellow</option>
                        <option value="violet" ${markerData.color === 'violet' ? 'selected' : ''}>Violet</option>
                        <option value="grey" ${markerData.color === 'grey' ? 'selected' : ''}>Grey</option>
                        <option value="black" ${markerData.color === 'black' ? 'selected' : ''}>Black</option>
                    </select>
                </label>
                <div id="pupup-btn-container">
                    <button type="submit">Save</button>
                    <button id="delete-Btn" type="button">Delete</button>
                </div>
            </form>
        `;
    }

    getMarkerIcon(color) {
        console.log('color', color)
        return new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + color + '.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }
  
    createMarker(markerData) {
        this.markerManager.addMarker(markerData);
        this.addMarkerToMap(markerData);
    }

    editMarker(id, newMarkerData) {
        this.markerManager.editMarker(id, newMarkerData);
        // Update the marker on the map
        const markerData = this.markerManager.getMarkers().find(marker => marker.id === id);
        if (markerData && markerData.leafletMarker) {
            if (newMarkerData.lat && newMarkerData.lng) {
                markerData.leafletMarker.setLatLng([newMarkerData.lat, newMarkerData.lng]);
            }
            if (newMarkerData.description) {
                markerData.leafletMarker.bindPopup(this.getMarkerPopupHTML({ ...markerData, ...newMarkerData }));
            }
            if (newMarkerData.color) {
                markerData.leafletMarker.setIcon(this.getMarkerIcon(newMarkerData.color));
                markerData.leafletMarker.bindPopup(this.getMarkerPopupHTML({ ...markerData, ...newMarkerData }));
            }
        }
    }
  
    removeMarker(id) {
        this.markerManager.removeMarker(id);
    }
  
    filterMarkers(text) {
        // Update the markers on the map based on the filtered markers
        const filteredMarkers = this.markerManager.filterMarkers(text);
        this.markerManager.getMarkers().forEach(markerData => {
            if (filteredMarkers.includes(markerData)) {
                markerData.leafletMarker.addTo(this.map);
            } else {
                markerData.leafletMarker.remove();
            }
        });
    }

    getMarkers() {
        return this.markerManager.getMarkers();
    }
  
    onMapClick(event) {
      // Open a popup at the location of the click with form to add a new marker
      const popup = L.popup()
          .setLatLng(event.latlng)
          .setContent(this.getAddMarkerFormHTML())
          .openOn(this.map);
  
      // Add event listener to the form in the popup
      const addForm = document.getElementById('add-marker-form')
      addForm.onsubmit = (e) => {
        e.preventDefault();
        const id = Math.floor(Math.random() * Date.now()).toString(16)
        const title = document.getElementById('add-title').value;
        const description = document.getElementById('add-description').value;
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        this.createMarker({ id, title, description, lat, lng }); // + id test
        this.map.closePopup();
      }
    }
  
    getAddMarkerFormHTML() {
      return `
          <form id="add-marker-form">
              <span class="pin-span">Create new pin</span>
              <label>
                  Title:
                  <input type="text" id="add-title" required>
              </label>
              <label>
                  Info:
                  <input type="text" id="add-description" required>
              </label>
              <button type="submit">Add</button>
          </form>
      `;
    }
}
  