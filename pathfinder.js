// implementation of Dijkstra's algorithm in
// method subway_system.add_station
// API @method subway_system.add_train_line
// @param {array, string, array - optional} - stations, line, times
// Ex. {['Canal', 'Houston', 'Christopher', '14th'], '1', [
//      ['Canal', 'Houston', 3],
//      ['Houston', 'Christopher', 7],
//      ['Christopher', '14th', 2]
//      ]}
// @return null
// API @method subway_system.take_train
// @param {string, string} - origin, destination
// Ex. {'Houston', '23rd'}
// @return path, time
// API @method subway_system.clear_stations
// @param none

'use strict';
var subway_system = {
  times_included: true,

  add_train_line: function(stations, line, durations) {
    var previous;
    for (var i = 0; i < stations.length; i++) {
      var station = stations[i];
      var time_obj = {};
      if (durations === undefined) {
        this.times_included = false;
        if (previous) {
          time_obj[previous] = 0;
        }
        if (i < stations.length - 1) {
          time_obj[stations[i + 1]] = 0;
        }
      } else {
        if (previous) {
          time_obj[previous] = durations[i - 1][2];
        }
        if (i < stations.length - 1) {
          time_obj[stations[i + 1]] = durations[i][2];
        }
      }
      subway_system.add_station(station, time_obj);
      previous = stations[i];
    }
  },

  helper_queue: function() {
    this._stations = [];

    this.enqueue = function(priority, key) {
      this._stations.push({
        key: key,
        priority: priority
      });
      this.sort();
    }
    this.dequeue = function() {
      return this._stations.shift().key;
    }
    this.sort = function() {
      this._stations.sort(function(a, b) {
        return a.priority - b.priority;
      });
    }
    this.isEmpty = function() {
      return !this._stations.length;
    }
  },

  stations: {},

  add_station: function(name, edges) {
    for (var i in edges) {
      if (this.stations[name] === undefined) {
        this.stations[name] = {};
      }
      this.stations[name][i] = edges[i];
    }
  },

  take_train: function(origin, destination) {
    var nodes = new this.helper_queue();
    var times = {};
    var previous = {};
    var path = [];
    var shortest;
    var vertex;
    var neighbor;
    var alt;
    for (vertex in this.stations) {
      if (vertex === origin) {
        times[vertex] = 0;
        nodes.enqueue(0, vertex);
      } else {
        times[vertex] = Infinity;
        nodes.enqueue(Infinity, vertex);
      }

      previous[vertex] = null;
    }
    while (!nodes.isEmpty()) {
      shortest = nodes.dequeue();

      if (shortest === destination) {
        path;

        while (previous[shortest]) {
          path.push(shortest);
          shortest = previous[shortest];
        }
        break;
      }
      if (!shortest || times[shortest] === Infinity) {
        continue;
      }
      for (neighbor in this.stations[shortest]) {
        alt = times[shortest] + this.stations[shortest][neighbor];

        if (alt < times[neighbor]) {
          times[neighbor] = alt;
          previous[neighbor] = shortest;
          nodes.enqueue(alt, neighbor);
        }
      }
    }
    var best_path = path.concat(origin).reverse();
    var best_time = times[destination];
    if (best_time && this.times_included) {
      console.log(best_path, best_time);
      return [best_path, best_time];
    }
    console.log(best_path);
    return [best_path];
  },

  clear_stations: function() {
    this.stations = {};
  }
}

subway_system.clear_stations();

// add new lines with time definitions

subway_system.add_train_line(['Canal', 'Houston', 'Christopher', '14th'], '1', [
  ['Canal', 'Houston', 3],
  ['Houston', 'Christopher', 7],
  ['Christopher', '14th', 2]
]);

subway_system.add_train_line(['Spring', 'West 4th', '14th', '23rd'], 'E', [
  ['Spring', 'West 4th', 1],
  ['West 4th', '14th', 5],
  ['14th', '23rd', 2]
]);

subway_system.add_train_line(['Wall', 'Fulton', 'Park Pl', 'Chambers', '14th', '34th'], '2', [
  ['Wall', 'Fulton', 1],
  ['Fulton', 'Park Pl', 5],
  ['Park Pl', 'Chambers', 2],
  ['Chambers', '14th', 5],
  ['14th', '34th', 6]
]);

// add new lines without time definitions

// subway_system.add_train_line(['Canal', 'Houston', 'Christopher', '14th'], '1');
// subway_system.add_train_line(['Spring', 'West 4th', '14th', '23rd'], 'E');
// subway_system.add_train_line(['Wall', 'Fulton', 'Park Pl', 'Chambers', '14th', '34th'], '2');

subway_system.take_train('Houston', '23rd');
