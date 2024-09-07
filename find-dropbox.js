function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: -34.397, lng: 150.644 }, // Default center in case geolocation fails
    });

    // Dummy dropbox data (replace with real data as needed)
    const dropboxes = [
        { id: 1, name: 'Dropbox 1', location: { lat: -34.397, lng: 150.644 }, capacity: 30, filled: 0 },
        { id: 2, name: 'Dropbox 2', location: { lat: -34.400, lng: 150.650 }, capacity: 30, filled: 10 },
        { id: 3, name: 'Dropbox 3', location: { lat: -34.390, lng: 150.660 }, capacity: 30, filled: 20 },
    ];

    // Get current location of the user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center the map on user's location
                map.setCenter(userLocation);

                // Add a marker for the user's location
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location',
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                });

                // Listen for input change on weight of clothes to donate
                const weightInput = document.getElementById('weight');
                weightInput.addEventListener('input', () => {
                    const weight = parseFloat(weightInput.value);
                    if (!isNaN(weight)) {
                        updateDropboxes(map, userLocation, weight);
                    }
                });
            },
            () => {
                alert('Geolocation failed. Please enable location services.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }

    // Function to update dropbox markers based on weight input and capacity
    function updateDropboxes(map, userLocation, weight) {
        // Clear existing markers
        clearMarkers();

        // Filter dropboxes based on available capacity
        const availableDropboxes = dropboxes.filter((dropbox) => dropbox.capacity - dropbox.filled >= weight);

        availableDropboxes.forEach((dropbox) => {
            const marker = new google.maps.Marker({
                position: dropbox.location,
                map: map,
                title: dropbox.name,
            });

            // Show dropbox info and capacity
            const infoWindow = new google.maps.InfoWindow({
                content: `<h3>${dropbox.name}</h3><p>Capacity Remaining: ${dropbox.capacity - dropbox.filled} kg</p>`,
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            // Add event listener to update capacity and rewards when clothes are donated
            marker.addListener('click', () => {
                const newFilled = dropbox.filled + weight;
                if (newFilled <= dropbox.capacity) {
                    dropbox.filled = newFilled;
                    const earnedCoins = weight * 10; // 1 kg = 10 coins
                    alert(`You earned ${earnedCoins} coins!`);
                    updateDropboxes(map, userLocation, weight);
                } else {
                    alert('This dropbox cannot accept the full weight. Please choose another.');
                }
            });

            // Store marker to clear later if needed
            markers.push(marker);
        });

        // Check if no dropboxes are available
        if (availableDropboxes.length === 0) {
            alert('No available dropboxes nearby can accept the full weight. Please adjust the weight or try a different area.');
        }
    }

    // Function to clear existing markers from the map
    function clearMarkers() {
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        markers = [];
    }
}

// Initialize an empty array to store markers
let markers = [];
