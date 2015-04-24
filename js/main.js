(function () {
    'use strict';
    var options = {
        validLocales: ['en_US', 'de_DE', 'it_IT'],
        locale: 'en_US'
    };

    var dfd = Localize.init(options);

    dfd.then(function (val) {
        localizeElements();
    });

    $('#german-button').click(function () {
        resolveDeferred('de_DE');
    });

    $('#italian-button').click(function () {
        resolveDeferred('it_IT');
    });

    $('#english-button').click(function () {
        resolveDeferred('en_US');
    });

    $('#alert-current-locale').click(function () {
        alert('The current locale is: ' + Localize.getLocale());
    });

    function resolveDeferred(locale) {
        var dfd = Localize.loadStrings(locale);
        dfd.done(function () {
            localizeElements();
        });
    }

    function localizeElements() {
        $('#one').html(Localize.get('helloString'));
        $('#two').html(Localize.get('goodbyeString'));
        $('#three').html(Localize.replace('myNameIsString', {name: 'John'}));
        $('#four').html(Localize.replace('whoIsString', {firstName: 'John', lastName: 'Doe'}));
    }
})();