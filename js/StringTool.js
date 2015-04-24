(function () {
    function create($) {
        // Create Special Exception Case
        var StringException = function StringException(msg) {
            this.name = 'LocalizationException',
            this.message = msg;
        };
        var defaultLoadCompleteEvent = 'loaded.StringTool';

        StringException.prototype.toString = function () {
            return '[' + this.name + '] ' + this.message;
        };

        // Define StringTool
        var initialized = false,
            strings = {},
            config, defaults;

        defaults = {
            path: './',
            locale: 'en_US',
            loadCompleteEvent: defaultLoadCompleteEvent
        };

        function loadStrings() {
            var endpoint = config.path + config.locale + '.json',
                dfd = $.Deferred();

            $.ajax({
                url: endpoint,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    strings = data;
                    $.publish(config.loadCompleteEvent);
                    dfd.resolve(strings);
                },
                error: function () {
                    // throw new StringException("Could not load localization file: " + endpoint);
                    dfd.reject(new StringException("Could not load localization file: " + endpoint));
                }
            });
            return dfd;
        }

        // Use this on a string like so:
        //   replace.apply("My name is %s", ["Garth"]);
        // OR use an object to replace variables like so:
        //   replace.apply("My %{type} is %{name}", [{ type: 'dog', name: 'Bingo' }]);
        function replace() {
            var args = Array.prototype.slice.call(arguments),
                str  = this.toString();

            if (args.length === 1 && typeof args[0] === 'object') {
                var variables = args[0];
                str = str.replace(/\%\{([^}]+)\}/g, function(match, p1, offset, string) {
                    if (!!variables[p1]) {
                        return variables[p1];
                    }
                    return match;
                });
            } else {
                args.forEach(function (r) {
                    str = str.replace('%s', r);
                });
            }

            return str;
        }

        return {
            init: function (options) {
                if (options !== undefined && typeof options === 'object') {
                    config = $.extend({}, defaults, options);
                } else {
                    config = defaults;
                }
                this.LOAD_COMPLETE_EVENT = config.loadCompleteEvent;

                return this.setLocale(config.locale);
            },

            get: function (stringId) {
                if (strings[stringId] === undefined) {
                    console.error("Requested string ID '" + stringId + "' does not exist");
                    return("[NO STRING ID]");
                }

                return strings[stringId].toString();
            },

            // Variable count arguments for replacement
            replace: function () {
                if (arguments.length > 1) {
                    var args = Array.prototype.slice.call(arguments),
                        stringId = args.shift();

                    return replace.apply(this.get(stringId), args);
                }
            },

            getLocale: function () {
                return config.locale;
            },

            setLocale: function (_locale) {
                config.locale = _locale;
                try {
                    return loadStrings();
                } catch (e) {
                    return $.Defered().reject();
                }
            },

            LOAD_COMPLETE_EVENT: defaultLoadCompleteEvent
        };
    }

    if (typeof define === 'function' && define.amd !== undefined) {
        // Allow for RequireJS style module loading
        define(["jquery", "jquery.pubsub"], function (jq) {
            return create(jq);
        });
    } else {
        // If not using RequireJS, jQuery must be included first
        if (jQuery === undefined) {
            throw "jQuery is a dependency of StringTool";
        }

        window.StringTool = create(jQuery);
    }
}());
