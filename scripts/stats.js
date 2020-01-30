window.addEventListener('load', () => {
  loadJson((error, result) => {
    if (error)
      console.log(error);

    result = result.filter(function(el) {
      return el.name != null;
    });
    CreateUserTableFromJSON(result, 'showOnlineUsers', 'Nutzer (online)');
  }, '/api/online_users');

  loadJson((error, result) => {
    if (error)
      console.log(error);


    result = result.sort((a, b) => b.click_count - a.click_count);
    CreateTableFromJSON(result, 'showUsers', 'Nutzer (alle)');
  }, '/api/users');

  loadJson((error, result) => {
    if (error)
      console.log(error);

    result = groupBy(result, click => click.user + "\n" + click.comment)
    result = Object.entries(result).map((key) => {
      // console.log(key);
      const clicks = key[1];
      const firstClick = clicks[0];
      return {
        count: clicks.length,
        user: firstClick.user,
        comment: firstClick.comment
      };
    });
    result = result.sort((a, b) => b.count - a.count);

    CreateTableFromJSON(result, 'latest-clicks', 'Klicks (heute)');
  }, '/api/latest_clicks');

  loadJson((error, result) => {
    if (error)
      console.log(error);

    console.log("raw result ", result)
    result = groupBy(result, event => event.user + "\n" + event.name)
    console.log("grouped result ", result)
    result = Object.entries(result).map((key) => {
      // console.log(key);
      const events = key[1];
      const firstEvent = events[0];
      return {
        count: events.length,
        user: firstEvent.user,
        event: firstEvent.name
      };
    });
    result = result.sort((a, b) => b.count - a.count);
    // console.log("final result ", result)

    CreateTableFromJSON(result, 'latest-events', 'Events (heute)');
  }, '/api/latest_events');

  loadJson((error, result) => {
    if (error)
      console.log(error);

    console.log("raw result ", result)
    result = groupBy(result, event => event.name)
    console.log("grouped result ", result)
    result = Object.entries(result).map((key) => {
      // console.log(key);
      const events = key[1];
      const firstEvent = events[0];
      return {
        count: events.length,
        event: firstEvent.name
      };
    });
    console.log("final result ", result)
    var values = [];
    var names = [];
    values = result.map(x => x.count)
    names = result.map(x => x.event)

    makeChart({
      names: names,
      values: values
    }, 'eventChart', 'Events (heute)');
  }, '/api/latest_events');

  loadJson((error, result) => {
    if (error) console.log(error);

    // Date takes time in ms not s, get local time
    const timestamps = result.map(x => new Date(x.timestamp * 1000).getHours())
    const clicks = result.map(x => x.click_count)
    const events = result.map(x => x.event_count)
    makeLineChart({
      timestamps: timestamps,
      events: events,
      clicks: clicks
    }, 'hourChart', 'Stunden (heute)');
  }, '/api/latest_hours');

  loadJson((error, result) => {
    if (error) console.log(error);
    CreateTextFromJSON(result, 'versionData', 'Frontend version:');
  }, '/version.json');

  loadJson((error, result) => {
    if (error) console.log(error);
    CreateTextFromJSON(result, 'api-version', 'Backend version:');
  }, '/api');
});

function makeChart(res, eid, caption) {
  const ctx = document.getElementById(eid);

  const lightRed = 'rgba(183, 28, 28, 1)'
  const darkRed = 'rgba(127, 0, 0, 1)'

  const colors = res.values.map((x, i) => i % 2 == 0 ? lightRed : darkRed);
  const bcolors = res.values.map((x, i) => i % 2 == 1 ? lightRed : darkRed);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: res.names,
      datasets: [{
        label: caption,
        data: res.values,
        backgroundColor: colors,
        borderColor: bcolors,
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function makeLineChart(res, eid, caption) {
  const ctx = document.getElementById(eid);

  new Chart(ctx, {
      type: 'line',
      data: {
        labels: res.timestamps,
        datasets: [
          /*{
                  label: 'events',
                  backgroundColor: 'rgba(127, 0, 0, 1)',
                  borderColor: 'rgba(183, 28, 28, 1)',
                  data: res.events,
                  fill: false,
                  yAxisID: 'y-axis-2',
                },*/
          {
            label: 'Clicks',
            backgroundColor: 'rgba(240, 85, 69, 1)',
            borderColor: 'rgba(127, 0, 0, 1)',
            data: res.clicks,
            fill: false,
            yAxisID: 'y-axis-1',
          }
        ]
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Hours'
            }
          }],
          yAxes: [{
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Clicks'
              },
              id: 'y-axis-1',
            }
            /*, {
                      type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                      display: true,
                      position: 'right',
                      scaleLabel: {
                        display: true,
                        labelString: 'Clicks'
                      },
                      id: 'y-axis-2',

            // grid line settings
            gridLines: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          }*/]
      }
    }
  });
}


function CreateUserTableFromJSON(jsonData, eid, caption) {
  ownuser = {
    name: storage.name || "Gast",
      event_count_session: 0,
          click_count_session: 0,
  }
  jsonData.push(ownuser);
  // console.log(jsonData);

  CreateTableFromJSON(jsonData, eid, caption);
}

function CreateTableFromJSON(jsonData, eid, caption) {
  var col = [];
  for (var i = 0; i < jsonData.length; i++)
    for (var key in jsonData[i])
      if (col.indexOf(key) === -1)
        col.push(key);

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  //CREATE TABLE CAPTION
  var cap = table.createCaption();
  cap.textContent = caption;



  var tr; // TABLE ROW.

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (var i = 0; i < jsonData.length; i++) {
    tr = table.insertRow(-1);
    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = jsonData[i][col[j]];
    }
  }

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
  var head = table.createTHead();

  tr = head.insertRow(-1);
  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

function CreateTextFromJSON(jsonData, eid, caption) {
  console.log(jsonData);

  const txt = document.createElement("h2");
  txt.textContent = [caption, JSON.stringify(jsonData, null, 4)].join(" ");
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = "";
  divContainer.appendChild(txt);
}

function groupBy(array, kf) {
  const result = array.reduce(function(r, a) {
    key = kf(a)
    r[key] = r[key] || [];
    r[key].push(a);
    return r;
  }, Object.create(null));
  return result
}
