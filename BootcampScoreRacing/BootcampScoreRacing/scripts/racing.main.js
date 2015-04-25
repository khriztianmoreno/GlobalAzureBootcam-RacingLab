window.racing = window.racing || {};
window.racing.app = window.racing.app || {};

(function (racing) {

    // Formats the lap time for display on the web page.
    function formatMs(ms) {
        function pad(n) {
            return (n < 10 ? '0' : '') + n;
        }

        var milliseconds = ms % 1000;
        var seconds = Math.floor((ms / 1000) % 60);
        var minutes = Math.floor((ms / (60 * 1000)) % 60);

        return pad(minutes) + ":" + pad(seconds) + "." + milliseconds;
    }

    // Creates a row in the results table with the appropriate values
    function getTableRow(values, type, onClick) {
        var row = document.createElement('tr');
        values.forEach(function (value) {
            var cell = document.createElement(type);
            cell.innerText = value;
            row.appendChild(cell);
        });
        if (onClick) {
            row.addEventListener('click', onClick);
        }
        return row;
    }

    
    function showLapTelemetry(lap, track) {

        // ToDo: Add code to retrieve the telemetry data from storage and render a telemetry graph


    }


    // Renders the lap time data in the appropriate table on the results page.
    function renderRankingLapTimes(laps, tableSelector, track, mode) {
        var table = document.querySelector(tableSelector);
        var tableHead = document.createElement('thead');
        var tableBody = document.createElement('tbody');
        var lapTimeZero = laps && laps.length > 0 ? laps[0].LapTimeMs : 0;

        laps.forEach(function (lap, index) {
            var lapTimeOffset = lap.LapTimeMs - lapTimeZero;

            var cells;

            switch (mode) {
                case 'Country':
                    cells = [(index + 1), lap.PlayerName, lap.Location, formatMs(lap.LapTimeMs), formatMs(lapTimeOffset), lap.Dammage];
                    break;
                case 'Location':
                    cells = [(index + 1), lap.PlayerName, formatMs(lap.LapTimeMs), formatMs(lapTimeOffset), lap.Dammage];
                    break;
                default:
                    cells = [(index + 1), lap.PlayerName, lap.Country, lap.Location, formatMs(lap.LapTimeMs), formatMs(lapTimeOffset), lap.Dammage];
                    break;
            }

            tableBody.appendChild(getTableRow(cells, 'td', function () {
                showLapTelemetry(lap, track);
            }));

        });

        table.innerHTML = '';

        switch (mode) {
            case 'Country':
                tableHead.appendChild(getTableRow(['Pos', 'Name', 'Location', 'Laptime', 'Delta', 'Dammage'], 'th'));
                break;
            case 'Location':
                tableHead.appendChild(getTableRow(['Pos', 'Name', 'Laptime', 'Delta', 'Dammage'], 'th'));
                break;
            default:
                tableHead.appendChild(getTableRow(['Pos', 'Name', 'Country', 'Location', 'Laptime', 'Delta', 'Dammage'], 'th'));
                break;
        }

        table.appendChild(tableHead);
        table.appendChild(tableBody);
    }



    // Country Statistics
    function initCountryStat(track, selector, countryCode) {

        // ToDo: Add code to get the country track data and pass it to the render method
        track.getRankingLapTimesByCountry(function (data) {
            renderRankingLapTimes(data, '.track-stats-country ' + selector, track, 'Country');
        }, ['PartitionKey', 'PlayerName', 'Location', 'LapTimeMs', 'Damage', 'LapId'], countryCode);

    }

    function initCountryStats(countryCode) {

        // ToDo: Add code to initialize the country data for the three tracks
        initCountryStat(racing.data.beginnerTrack, '.track-stats-beginner', countryCode);
        initCountryStat(racing.data.advancedTrack, '.track-stats-advanced', countryCode);
        initCountryStat(racing.data.expertTrack, '.track-stats-expert', countryCode);

    }

    // Location Statistics

    // Get the track data and pass it to the render method
    function initLocationStat(track, selector, locationId) {

        // ToDo: Add code to get the track data and pass it to the render method
        track.getRankingLapTimesByLocation(function (data) {
            renderRankingLapTimes(data, '.track-stats-location ' + selector, track, 'Location');
        }, ['PartitionKey', 'PlayerName', 'LapTimeMs', 'Dammage', 'LapId'], locationId);


    }



    // Initialize the data for the tracks.
    function initLocationStats(locationId) {

        // ToDo: Add code to initialize the location data for the beginner track
        initLocationStat(racing.data.beginnerTrack, '.track-stats-beginner', locationId);


        // ToDo: Add code to initialize the data for the advanced and expert tracks

        initLocationStat(racing.data.advancedTrack, '.track-stats-advanced', locationId);

        initLocationStat(racing.data.expertTrack, '.track-stats-expert', locationId);


    }



    // ToDo: Set your country code and location ID.
    var yourLocationId = '131';//'YOUR_LOCATION_ID';
    var yourCountryCode = 'CO';//'YOUR_COUNTRY_CODE';

    // Initialize the page with location statistics
    initLocationStats(yourLocationId);
    initCountryStats(yourCountryCode);

}(window.racing));
