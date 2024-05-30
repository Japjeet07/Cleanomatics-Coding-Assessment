const carDataUrl = 'data.json'; 

fetch(carDataUrl)
  .then(response => response.json()) 
  .then(data => {
    populateDropdown(data);
    storeCarData(data); 
    const distanceInput = document.getElementById('distance');
    const calculateTimeButton = document.getElementById('calculate-time');

    
    //function to display car details
    function displayCarDetails(car) {
      if (car) { 
        const carListElement = document.getElementById('car-list');
        carListElement.innerHTML = `
          <h3>${car['TYPE OF VEHICLE']}</h3>
          <p>Top Speed: ${car['TOP SPEED (KM/H)']} KM/H</p>
          <p>Fuel Efficiency: ${car['FUEL EFFICIENCY (KM/L)']} KM/L</p>
          <p>Fuel Tank Capacity: ${car['FUEL TANK CAPACITY (L)']} L</p>
          <p>Max Range: ${car['MAX RANGE (KM)']} KM</p>
        `;
      } else {
        document.getElementById('car-list').innerHTML = '';
      }
    }


    // event listener for calculate button
    document.getElementById('calculate-time').addEventListener('click', () => {
      const selectedCar = getSelectedCar(); 
      const distance = getDistanceInput(); 
      calculateAndDisplayTime(selectedCar, distance, data); 
    });

    const comparisonElement = document.getElementById('comparison-result');

    const distanceInputcompare = document.getElementById('distance');
    distanceInputcompare.addEventListener('input', () => {
      comparisonElement.textContent = ''; 
    });
    


   
    //event listener to remove the selected car from the 1st dropdown
    document.getElementById('car-filter').addEventListener('change', (event) => {
      const selectedValue = event.target.value;
      if (selectedValue !== 'all') {
        const filteredCar = data.find(car => car['TYPE OF VEHICLE'] === selectedValue);
        displayCarDetails(filteredCar); 
        populateCompareCarDropdown(data, selectedValue);
      } else {
        document.getElementById('car-list').innerHTML = '';
      }
    });



    


    //event listener to compare the 2 cars
    document.getElementById('compare-button').addEventListener('click', () => {
      if (data) { 
        const selectedCar = getSelectedCar();
        const distance = getDistanceInput(); 
        const compareCarFilterSelect = document.getElementById('compare-car-filter');
        const comparedCar = data.find(car => car['TYPE OF VEHICLE'] === compareCarFilterSelect.value);
    
        if (selectedCar && distance && comparedCar) {
          comparisonElement.textContent = ''; 
    
          const selectedCarTravelTime = distance / selectedCar['FUEL EFFICIENCY (KM/L)'];
          const comparedCarTravelTime = distance / comparedCar['FUEL EFFICIENCY (KM/L)'];
          let comparisonMessage;
    
          if (distance > comparedCar['MAX RANGE (KM)']) {
            showDistanceValidationPopup(`Distance exceeds ${comparedCar['TYPE OF VEHICLE']} max range of ${comparedCar['MAX RANGE (KM)']} KM.`);
          } else {
            if (selectedCarTravelTime > comparedCarTravelTime) {
              comparisonMessage = `${comparedCar['TYPE OF VEHICLE']} would be faster by ${(selectedCarTravelTime - comparedCarTravelTime).toFixed(2)} hours.`;
            } else if (selectedCarTravelTime < comparedCarTravelTime) {
              comparisonMessage = `${selectedCar['TYPE OF VEHICLE']} would be faster by ${(comparedCarTravelTime - selectedCarTravelTime).toFixed(2)} hours.`;
            } else {
              comparisonMessage = `${selectedCar['TYPE OF VEHICLE']} and ${comparedCar['TYPE OF VEHICLE']} would have the same travel time.`;
            }
    
            comparisonElement.textContent = `Distance: ${distance} KM\n${comparisonMessage}`;
          }
        } else {
          alert('Please select a car from both dropdowns and enter a valid distance.');
        }
      } else {
        console.error('Data is not yet available for comparison.'); 
      }
    });




    
    
    function showDistanceValidationPopup(message) {
      const distancemessage = document.getElementById('distance-message');
      distancemessage.textContent = message;
      distancemessage.classList.add('error'); 
    }


    //event listener to tell the user than the input distance is out of range and which also disables the calculate button
    distanceInput.addEventListener('input', () => {
      const distance = parseFloat(distanceInput.value);
      const selectedCar = getSelectedCar();

    
      calculateTimeButton.disabled = true;
    
      if (!isNaN(distance) && distance >= 0) {
        if (selectedCar && distance <= selectedCar['MAX RANGE (KM)']) {
          calculateTimeButton.disabled = false; 
          distancemessage.textContent = ''; 
          distancemessage.classList.remove('error'); 
       
        } else {

          showDistanceValidationPopup('Distance is out of range');

        }
      }
          
        
      else {
        showDistanceValidationPopup('Please enter a valid non-negative distance in KM.');
      }
    
  
    });
    
  })
  .catch(error => console.error(error)); 










 // Function to populate dropdown options using car names
 function populateDropdown(data) {
  const carFilterSelect = document.getElementById('car-filter');
  data.forEach(car => {
    const optionElement = document.createElement('option');
    optionElement.value = car['TYPE OF VEHICLE']; 
    optionElement.textContent = car['TYPE OF VEHICLE'];
    carFilterSelect.appendChild(optionElement);
  });
}

// Function to store car data
function storeCarData(data) {
  localStorage.setItem('carData', JSON.stringify(data)); 
}



// Function to get the selected car 
function getSelectedCar() {
  const selectedValue = document.getElementById('car-filter').value;
  if (selectedValue !== 'all') {
    const carData = JSON.parse(localStorage.getItem('carData'));
    return carData.find(car => car['TYPE OF VEHICLE'] === selectedValue);
  }
  return null; 
}




// Function to get user-entered distance
function getDistanceInput() {
  const distanceInput = document.getElementById('distance');
  const distance = parseFloat(distanceInput.value);
  if (!isNaN(distance) && distance >= 0) {
    return distance;
  } else {
    alert('Please enter a valid non-negative distance in KM.');
    return null;
  }
}



//function to calculate and display the time
function calculateAndDisplayTime(selectedCar, distance, data) {
  if (selectedCar && distance) {
    const travelTime = distance / selectedCar['FUEL EFFICIENCY (KM/L)']; 

    const formattedTravelTime = travelTime.toFixed(2);

    document.getElementById('car-list').innerHTML = `
      <h3>Travel Time Estimate (for ${selectedCar['TYPE OF VEHICLE']})</h3>
      <p>Distance: ${distance} KM</p>
      <p>Estimated Travel Time: ${formattedTravelTime} hours</p>
    `;

    const compareCarFilterSelect = document.getElementById('compare-car-filter');
    const availableCars = compareCarFilterSelect.options.length > 1; 
    document.getElementById('compare-button').disabled = !availableCars;
    document.getElementById('compare-car-filter').disabled = !availableCars;
  } else {
    document.getElementById('car-list').innerHTML = '';
    alert('Please select a car and enter a valid distance.');
  }
  if (selectedCar && distance) {
    document.getElementById('distance-message').textContent = '';
  }
}





//function to remove the selected car from the 2nd dropdown
function populateCompareCarDropdown(data, selectedValue) {
  const compareCarFilterSelect = document.getElementById('compare-car-filter');

  const availableCars = data.filter(car => car['TYPE OF VEHICLE'] !== selectedValue);

  compareCarFilterSelect.innerHTML = '';

  if (availableCars.length > 0) {
    availableCars.forEach(car => {
      const optionElement = document.createElement('option');
      optionElement.value = car['TYPE OF VEHICLE']; 
      optionElement.textContent = car['TYPE OF VEHICLE'];
      compareCarFilterSelect.appendChild(optionElement);
    });
  } else {
    const optionElement = document.createElement('option');
    optionElement.value = 'none';
    optionElement.textContent = 'No other cars available';
    optionElement.disabled = true;
    compareCarFilterSelect.appendChild(optionElement);
  }
}
