window.racing = window.racing || {};
window.racing.data = window.racing.data || {};

(function (racing) {

    // Base URI for Racing Game Table Storage data.
    var tableStorageBaseUrl = 'https://reddoggabtest-secondary.table.core.windows.net/';

    // Enumeration of the three tracks in the racing game.
    var tracks = {
        beginner: 0,
        advanced: 1,
        expert: 2
    };

    // Table names and shared access signatures for racing game data.
    var auths = {
        rankingLapTimes: {
            tableName: 'GabTestRankingLapTimes',
            signature: 'C9RLkL27cNr57oeWphn6%2BhdmmGgOL4TXjHrwwhofDdw%3D'
        },
        achievements: {
            tableName: 'TestAchievements',
            signature: '66zq%2FZ2%2BrLtawKGkp3bHUThQSm46hSh5maxOd94zF7I%3D'
        },
        tracks: [
            {
                playerLapTimes: {
                    tableName: 'GabTestPlayerLapTimes0',
                    signature: 'yTtj%2FElZDUWQ5PTG0WjUq%2FPDPEPnRWwovlxPbn0sXmg%3D'
                },
                telemetryData: {
                    tableName: 'TestTelemetryData0',
                    signature: 'GGc%2BHEa9wJYDoOGNE3BhaAeduVOA4MH8Pgss5kWEIW4%3D'
                },
                rankingLapTimesCountryTrack: {
                    tableName: 'GabTestRankingLapTimesCountryTrack0',
                    signature: 'px0xULzW3h9reEsRzXARZuc3KNMTFFCyOTBh06%2FO6Tg%3D'
                },
                rankingLapTimesLocationTrack: {
                    tableName: 'GabTestRankingLapTimesLocationTrack0',
                    signature: 'QjFo%2B92XEOvFWRsrolCpLk8T3uuxVU7u7QSh225pn8g%3D'
                }
            },
            {
                playerLapTimes: {
                    tableName: 'GabTestPlayerLapTimes1',
                    signature: 'F6YgWIy%2FdQDEbBgu9v4Z%2FYs4KK4f18DqYaMpUcGaoKE%3D'
                },
                telemetryData: {
                    tableName: 'TestTelemetryData1',
                    signature: 'sDYpxOjziwYnuqRa%2BnRg44%2FSI%2FKBfdXyoj3ubqsSI4s%3D'
                },
                rankingLapTimesCountryTrack: {
                    tableName: 'GabTestRankingLapTimesCountryTrack1',
                    signature: '6UoPOK5NNKHeQltR9Mf1seqgaH8HNgggV1v4%2Bkf9Feo%3D'
                },
                rankingLapTimesLocationTrack: {
                    tableName: 'GabTestRankingLapTimesLocationTrack1',
                    signature: 'TJw2VfPEXyau7NM6qB1OFhu2Z1XiC02eByyLygxgof8%3D'
                }
            },
            {
                playerLapTimes: {
                    tableName: 'GabTestPlayerLapTimes2',
                    signature: 'FoLd1OaTqzd4km0UDtFYnsQKlMkhjiJ2bYb4IwMNu5U%3D'
                },
                telemetryData: {
                    tableName: 'TestTelemetryData2',
                    signature: 'iB%2FSzhOx%2B02F3qzqZPljaI5md%2FPTzBVDiO%2B8Pu8dB9c%3D'
                },
                rankingLapTimesCountryTrack: {
                    tableName: 'GabTestRankingLapTimesCountryTrack2',
                    signature: 'vfCOScm%2F9hpmaB46FYVFEl6Tytoi6TyAvXQyCFh5Kfg%3D'
                },
                rankingLapTimesLocationTrack: {
                    tableName: 'GabTestRankingLapTimesLocationTrack2',
                    signature: 'Y2JwjOiHtFJ5NR4wLgoa%2FbGR55xjR5ioPsscLmoPVtA%3D'
                }
            }
        ]
    }

    // Formats a query for a Table Storage partition.
    function getPartitionFilter(value, prefix) {
        var filter = {};
        prefix = prefix || '';
        if (typeof (value) !== 'undefined') {
            filter.partitionKey = prefix + value;
        }
        return filter;
    }


  
    // Sends a Get request to Table Storage, returning the JSON response.
    function getJson(url, successCallback, errorCallback) {

        // ToDo: Add code to get JSON data from a URI
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader('Accept', 'application/json');
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                var data = JSON.parse(this.response);
                successCallback(data);
            } else {
                errorCallback(this);
            }
        };

        request.onerror = function () {
            errorCallback(this);
        };

        request.send();


    }

    
    // Formats a URI for querying Table Storage using a Shared Access Signature
    function getTableStorageUrl(auth, fields, filter) {

        // ToDo: Add code to format a table storage URL with shared access signature
        var baseUrl = tableStorageBaseUrl
                    + auth.tableName
                    + '?tn=' + auth.tableName
                    + '&sv=2014-02-14&si=GabLab'
                    + '&sig=' + auth.signature;

        var filterUrl = '';
        var fieldsUrl = '';

        if (filter && typeof (filter.partitionKey) != 'undefined') {
            filterUrl = "&$filter=PartitionKey eq '" + filter.partitionKey + "'";
        }

        if (fields && fields.length) {
            fieldsUrl = "&$select=" + fields.join(',');
        }

        return baseUrl + fieldsUrl + filterUrl;


    }



    // Queries Table Storage and retrieves the data.
    function getTableStorageData(auth, successCallback, fields, filter) {

        // ToDo: Add code to get data from a Table Storage table
        var url = getTableStorageUrl(auth, fields, filter);
        getJson(url, function (data) {
            successCallback(data.value);
        }, function (error) {
            console.error(error);
        });


    }



    // Creates an object for retrieving data for a specified track.
    function getTrack(track) {
        return {

            // ToDo: Add code to get data for the specific location
            getRankingLapTimesByLocation: function (successCallback, fields, locationId) {
                var filter = getPartitionFilter(locationId);
                getTableStorageData(auths.tracks[track].rankingLapTimesLocationTrack,
                    successCallback, fields, filter);
            },


            // ToDo: Add code to get data for the specific country

            getRankingLapTimesByCountry: function (successCallback, fields, countryCode) {
                var filter = getPartitionFilter(countryCode);
                getTableStorageData(auths.tracks[track].rankingLapTimesCountryTrack,
                    successCallback, fields, filter);
            },


            // ToDo: Add code to get the telemetry data for a specific lap


        };
    }



    racing.data.getAchievements = function (successCallback, fields, countryCode) {

        // ToDo: Add code to get the player achievements for your country


    };



    // Create the objects for the three tracks.
    racing.data.beginnerTrack = getTrack(tracks.beginner);
    racing.data.advancedTrack = getTrack(tracks.advanced);
    racing.data.expertTrack = getTrack(tracks.expert);

}(window.racing));