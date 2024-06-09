document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([26.2285, 50.5860], 11);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    const greenIcon = L.ExtraMarkers.icon({
      icon: 'fa-bolt',
      markerColor: 'green',
      shape: 'circle',
      prefix: 'fa'
    });
  
    const redIcon = L.ExtraMarkers.icon({
      icon: 'fa-bolt',
      markerColor: 'red',
      shape: 'circle',
      prefix: 'fa'
    });
  
    const blueIcon = L.ExtraMarkers.icon({
      icon: 'fa-bolt',
      markerColor: 'blue',
      shape: 'circle',
      prefix: 'fa'
    });
  
    const chargingPoints = [
      {
        location: 'Manama',
        coords: [26.2154, 50.5832],
        capacity: '50 kW',
        distance: '2 km',
        available: true,
        city: 'Manama',
        selectedPort: 'A',
        price: '10 BHD',
        icon: greenIcon
      },
      {
        location: 'Riffa',
        coords: [26.1155, 50.5484],
        capacity: '75 kW',
        distance: '5 km',
        available: false,
        city: 'Riffa',
        selectedPort: 'B',
        price: '15 BHD',
        icon: redIcon
      },
      {
        location: 'Muharraq',
        coords: [26.2572, 50.6119],
        capacity: '100 kW',
        distance: '7 km',
        available: true,
        city: 'Muharraq',
        selectedPort: 'C',
        price: '20 BHD',
        icon: blueIcon
      }
    ];
  
    chargingPoints.forEach(point => {
      const marker = L.marker(point.coords, { icon: point.icon }).addTo(map);
      const availability = point.available ? 'Available' : 'Busy';
      marker.bindPopup(`<strong>Location:</strong> ${point.location}<br><strong>Capacity:</strong> ${point.capacity}<br><strong>Distance:</strong> ${point.distance}<br><strong>Status:</strong> ${availability}<br><button class="bookButton">Book</button>`);
  
      marker.on('click', () => {
        L.Routing.control({
          waypoints: [
            L.latLng(26.2285, 50.5860),
            L.latLng(point.coords[0], point.coords[1])
          ],
          routeWhileDragging: true
        }).addTo(map);
      });
  
      marker.on('popupopen', function() {
        const bookButton = marker.getPopup().getElement().querySelector(".bookButton");
        if (bookButton) {
          bookButton.addEventListener('click', () => {
            document.getElementById("chargingPoint").value = point.location;
            document.getElementById("city").value = point.city;
            document.getElementById("selectedPort").value = point.selectedPort;
            document.getElementById("price").value = point.price;
            modal.style.display = "block";
          });
        }
      });
    });
  
    const modal = document.getElementById("bookingModal");
    const span = document.getElementsByClassName("close")[0];
  
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  
    document.getElementById("bookingForm").addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
  
      fetch('http://localhost:3000/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
      alert('Thank you for your booking!');
      modal.style.display = "none";
    });
  });
  