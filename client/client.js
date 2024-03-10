document.getElementById('insertRow').addEventListener('click', function() {
  const sqlInsert = `
    INSERT INTO patient (name, dateOfBirth) VALUES
    ('Sara Brown', '1901-01-01'),
    ('John Smith', '1941-01-01'),
    ('Jack Ma', '1961-01-30'),
    ('Elon Musk', '1999-01-01');
  `;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8083/");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      const data = JSON.parse(xhr.responseText);
      createTable(data);
    } else {
      console.error("Failed to insert data:", xhr.status);
      document.getElementById('responseDisplay').textContent = 'Error: ' + xhr.statusText;
    }
  };

  xhr.onerror = () => {
    console.error("Error making the request.");
    document.getElementById('responseDisplay').textContent = 'Request failed.';
  };

  xhr.send(JSON.stringify({ query: sqlInsert }));
});

document.getElementById('queryForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  let query = document.getElementById("queryToSend").value;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8083/");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      const data = JSON.parse(xhr.responseText);
      createTable(data);
    } else {
      console.log("error")
    }
  };

  xhr.onerror = () => {
    console.log("error");
  };

  xhr.send(JSON.stringify({ query: query }));
});

function createTable(data) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headerRow = document.createElement('tr');

  // Assuming data is an array of objects
  if(data.length > 0) {
    Object.keys(data[0]).forEach(key => {
      const headerCell = document.createElement('th');
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    });
    thead.appendChild(headerRow);

    data.forEach(row => {
      const bodyRow = document.createElement('tr');
      Object.values(row).forEach(text => {
        const cell = document.createElement('td');
        cell.textContent = text;
        bodyRow.appendChild(cell);
      });
      tbody.appendChild(bodyRow);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    const displayDiv = document.getElementById('tableDisplay');
    displayDiv.innerHTML = ''; // Clear previous table
    displayDiv.appendChild(table);
  } else {
    document.getElementById('tableDisplay').textContent = "No data to display.";
  }
}


document.getElementById('queryForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  let query = document.getElementById("queryToSend").value;
  console.log(query);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8083/"); 
  xhr.setRequestHeader("Content-Type", "application/json");

  const body = JSON.stringify({ query: query });

  xhr.onload = () => {
    // const response = JSON.parse(xhr.responseText);

    if (xhr.status === 200 || xhr.status === 201) { 
      console.log("sent");
    } else {
      console.log("error")
    }
  };

  xhr.onerror = () => {
    console.log("error");
  };

  xhr.send(body);
});
