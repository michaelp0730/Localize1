(function ($) {
    'use strict';
    var strings = {},
        dfd = $.Deferred(),
        successMessage,
        errorMessage,
        settings = {},
        defaults = {
            validLocales: ['en_US', 'de_DE'], // array of supported locales
            locale: 'en_US', // set the default locale
            path: './json/' // path to location of locale JSON files
        },

        NO_TRANSLATION = '[NO TRANSLATION]', // constant

        Localize = {
            init: function init(options) {
                /* --------
                An optional options object should be passed as a parameter to the init() method.
                This object allows the developer to update any of the properties listed in the defaults object.
                New properties that don't exist in the defaults object may also be added to the options object.
                A new object called 'settings' will be created by extending the defaults and options objects.
                The rest of the plugin relies on properties found in the settings object.

                If the options parameter that is sent to the init() method is undefined, or is not of the
                type 'object', an error message will be logged to the console, and returned.
                -------- */

                if (options !== undefined && typeof options !== 'object') {
                    errorMessage = 'Invalid parameter sent to init() method';
                    console.error(errorMessage);
                    return errorMessage;
                } else {
                    settings = $.extend({}, defaults, options);
                    return this.loadStrings(settings.locale);
                }
            },

            validateLocale: function validateLocale(lang) {
                /* --------
                This method loops through the settings object's validLocales array and checks to see
                if there is a match with the lang parameter that was passed to it. If the lang parameter
                represents a valid locale, a success message will be logged to the console and the locale
                will be returned. If the lang parameter represents an invalid locale, an error message will
                be logged to the console, and returned.
                -------- */
                var validLocale = false;

                $.each(settings.validLocales, function (index, value) {
                    if (lang === value) {
                        validLocale = true;
                    }
                });

                if (validLocale) {
                    settings.locale = lang;
                    successMessage = 'Validated Locale: ' + lang ;
                    console.log(successMessage);
                    return successMessage;
                } else {
                    errorMessage = 'Invalid Locale: ' + lang;
                    console.error(errorMessage);
                    return errorMessage;
                }
            },

            loadStrings: function loadStrings(lang) {
                /* --------
                This method accepts a lang parameter, validates that parameter with the validateLocale() method,
                then performs an AJAX request to retrieve the appropriate locale's JSON file.

                If the AJAX call is successful, the JSON data is returned as a deferred, and assigned to a variable
                named 'strings'. A success message is also logged to the console.

                If the AJAX call is unsuccessful, the deferred is rejected and an error message is logged
                to the console.
                -------- */

                var endpoint;

                this.validateLocale(lang);

                settings.locale = lang;

                endpoint = settings.path + settings.locale + '.json';

                return $.ajax({
                    url: endpoint,
                    method: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        strings = data;
                        successMessage = 'Success loading strings';
                        console.log(successMessage);
                    },
                    error: function () {
                        dfd.reject();
                        errorMessage = 'Could not load localization file: ' + endpoint;
                        console.error(errorMessage);
                    }
                });
            },

            get: function get(id) {
                /* --------
                This method return a string from the current JSON file based on the string ID
                that was passed to it as a parameter. If the string ID parameter can't be found,
                the string '[NO TRANSLATION]' will be returned and an error message will be logged
                to the console.
                -------- */
                if (strings[id]) {
                    return strings[id];
                } else {
                    errorMessage = 'String ID ' + id + ' does not exist';
                    console.error(errorMessage);
                    return NO_TRANSLATION;
                }
            },

            getLocale: function getLocale() { // return the current locale
                return settings.locale;
            },

            replace: function replace() {
                /* --------
                This method validates parameters passed to it, then uses a regular expression to replace
                values contained within %{ } with values passed in the second parameter, which is an object.
                The first parameter is either a string, or a string ID, and the second parameter is an object
                containing key-value pairs.

                Example1:
                Localize.replace('Who is %{firstName} %{lastName}?', {firstName: 'John', lastName: 'Doe'});
                returns => Who is John Doe?

                Example2:
                If you had this string in your JSON -
                "whoIsString": "Who is %{firstName} %{lastName}?"

                Localize.replace('whoIsString', {firstName: 'John', lastName: 'Doe'});
                returns => Who is John Doe?
                -------- */

                var args = Array.prototype.slice.call(arguments), // cast the function's arguments as an array
                    matchRegEx = new RegExp('\%\{([^}]+)\}', 'g'),
                    match;

                if (args.length !== 2 || typeof args[0] !== 'string' || typeof args[1] !== 'object' || args[1].length !== undefined) {
                    errorMessage = 'Incorrect parameters passed to Localization.replace(). First parameter must be a string ID. Second parameter must be an object.';
                    console.error(errorMessage);
                    return errorMessage;
                }

                if (strings[args[0]] !== undefined) { // if strings have been loaded from a JSON file via the loadStrings() method
                    match = strings[args[0]].replace(matchRegEx, function (x, y) {
                        return (args[1][y]) ? args[1][y] : null;
                    });
                } else { // if a string is passed directly to the replace() method, rather than being read from a JSON file
                    match = args[0].replace(matchRegEx, function (x, y) {
                        return (args[1][y]) ? args[1][y] : null;
                    });
                }

                return match;
            }
        };

    window.Localize = Localize; // make Localize globally available
}(jQuery));
