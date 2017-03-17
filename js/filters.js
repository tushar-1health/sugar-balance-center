angular.module('your_app_name.filters', [])

        .filter('rawHtml', function ($sce) {
            return function (val) {
                return $sce.trustAsHtml(val);
            };
        })

        .filter('parseDate', function () {
            return function (value) {
                return Date.parse(value);
            };
        })
        .filter('capitalize', function () {
            return function (input, scope) {
                if (input != null)
                    input = input.toLowerCase();
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            }
        })
        
        .filter('tolowercase',function(){
            return function(input,scope){
                if(input != null){
                    input = input.toLowerCase();
                }
                return input;
            }
        })
        .filter('capitalizeEach', function () {
            return function (input) {
                if (input.indexOf(' ') !== -1) {
                    var inputPieces,
                            i;

                    input = input.toLowerCase();
                    inputPieces = input.split(' ');

                    for (i = 0; i < inputPieces.length; i++) {
                        inputPieces[i] = capitalizeString(inputPieces[i]);
                    }

                    return inputPieces.toString().replace(/,/g, ' ');
                } else {
                    input = input.toLowerCase();
                    return capitalizeString(input);
                }

                function capitalizeString(inputString) {
                    return inputString.substring(0, 1).toUpperCase() + inputString.substring(1);
                }
            };
        })

        .filter('timesec', function ($filter)
        {
            return function (totalSeconds)
            {
                var hours = Math.floor(totalSeconds / 3600);
                var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
                var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

                // round seconds
                seconds = Math.round(seconds * 100) / 100

                // var result = (hours < 10 ? "0" + hours : hours);
                var result = (minutes < 10 ? "0" + minutes : minutes);
                result += ":" + (seconds < 10 ? "0" + seconds : seconds);
                return result;
            }
        })
        .filter('truncate', function () {
            return function (text, length, end) {
                if (isNaN(length))
                    length = 10;
                if (end === undefined)
                    end = "...";
                if (text.length <= length || text.length - end.length <= length) {
                    return text;
                } else {
                    return String(text).substring(0, length - end.length) + end;
                }
            }
        })
        .filter('ceil', function () {
            return function (n) {
                return Math.ceil(n);
            };
        })
        .filter('floor', function () {
            return function (n) {
                return Math.floor(n);
            };
        })
        .filter('dateFormat', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'yyyy-MM-dd');

                return _date.toUpperCase();

            };
        })
        .filter('dateFormat1', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'MM dd yyyy');

                return _date.toUpperCase();

            };
        })

        .filter('dateFormat2', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'yyyy-MM-dd');

                return _date.toUpperCase();

            };
        })
        .filter('dateFormat3', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'dd MMM, yyyy');

                return _date.toUpperCase();

            };
        })
        .filter('dateFormat4', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'dd-MM-yyyy');

                return _date.toUpperCase();

            };
        })
        .filter('dateFormat5', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'dd MMM, yyyy HH:mm a');

                return _date.toUpperCase();

            };
        })
        .filter('dateFormat6', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'dd MMM, yyyy hh:mm a');

                return _date.toUpperCase();

            };
        })
        .filter('time', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'hh:mm');

                return _date.toUpperCase();

            };
        })
        .filter('time1', function ($filter) {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'hh:mm a');

                return _date.toUpperCase();

            };
        })

        .filter('timeN', function ($filter)
        {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input), 'HH:mm');

                return _date.toUpperCase();

            };
        })

        .filter('datetime', function ($filter)
        {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input),
                        'MMM dd yyyy - HH:mm');

                return _date.toUpperCase();

            };
        })
        .filter('datetime1', function ($filter)
        {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input),
                        'yyyy-mm-dd  HH:mm:ss');

                return _date.toUpperCase();

            };
        })
        .filter('datetime2', function ($filter)
        {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input),
                        'MM dd yyyy - HH:mm:ss');

                return _date.toUpperCase();

            };
        })
        .filter('datetime3', function ($filter)
        {
            return function (input)
            {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input),
                        'd MMM, yyyy - HH:mm a');

                return _date.toUpperCase();

            };
        })
        .filter('split', function () {
            return function (input, splitChar, splitIndex) {
                // do some bounds checking here to ensure it has that index
                return input.split(splitChar)[splitIndex];
            }
        })

        .filter('groupBy', ['$parse', function ($parse) {
                return function (list, group_by) {

                    var filtered = [];
                    var prev_item = null;
                    var group_changed = false;
                    // this is a new field which is added to each item where we append "_CHANGED"
                    // to indicate a field change in the list
                    //was var new_field = group_by + '_CHANGED'; - JB 12/17/2013
                    var new_field = 'group_by_CHANGED';
                    // loop through each item in the list
                    angular.forEach(list, function (item) {

                        group_changed = false;
                        // if not the first item
                        if (prev_item !== null) {

                            // check if any of the group by field changed

                            //force group_by into Array
                            group_by = angular.isArray(group_by) ? group_by : [group_by];
                            //check each group by parameter
                            for (var i = 0, len = group_by.length; i < len; i++) {
                                if ($parse(group_by[i])(prev_item) !== $parse(group_by[i])(item)) {
                                    group_changed = true;
                                }
                            }


                        }// otherwise we have the first item in the list which is new
                        else {
                            group_changed = true;
                        }

                        // if the group changed, then add a new field to the item
                        // to indicate this
                        if (group_changed) {
                            item[new_field] = true;
                        } else {
                            item[new_field] = false;
                        }

                        filtered.push(item);
                        prev_item = item;
                    });
                    return filtered;
                };
            }])
        ;
