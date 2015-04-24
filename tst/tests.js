var dfd;
var options = {
        validLocales: ['en_US', 'de_DE', 'it_IT'],
        locale: 'en_US'
    };

QUnit.test('Localize.init()', function (assert) {
    assert.equal(dfd = Localize.init(options), dfd);
    assert.equal(dfd = Localize.init('en'), 'Invalid parameter sent to init() method');
});

QUnit.test('Localize.validateLocale()', function (assert) {
    assert.equal(Localize.validateLocale('en_US'), 'Validated Locale: en_US');
    assert.equal(Localize.validateLocale('it_IT'), 'Validated Locale: it_IT');
    assert.equal(Localize.validateLocale('en'), 'Invalid Locale: en');
    assert.notEqual(Localize.validateLocale('en'), 'Validated Locale: en');
});

QUnit.test('Localize.loadStrings()', function (assert) {
    assert.equal(dfd = Localize.loadStrings('it_IT'), dfd);
});

QUnit.test('Localize.get()', function (assert) {
    var strings = {
        "helloString": "Hello"
    };
    assert.equal(Localize.get('helloString'), 'Hello');
    assert.equal(Localize.get('unknownString'), '[NO TRANSLATION]');
});

QUnit.test('getLocale()', function (assert) {
    Localize.loadStrings('de_DE');
    assert.equal(Localize.getLocale(), 'de_DE');
    assert.notEqual(Localize.getLocale(), 'it_IT');

    Localize.loadStrings('en_US');
    assert.equal(Localize.getLocale(), 'en_US');
    assert.notEqual(Localize.getLocale(), 'de_DE');
});

QUnit.test('Localize.replace()', function (assert) {
    var strings = {
        "myNameIsString": "My name is %{name}",
        "whoIsString": "Who is %{firstName} %{lastName}?"
    };
    assert.equal(Localize.replace('myNameIsString', {name: 'John'}), 'My name is John');
    assert.equal(Localize.replace('My name is %{name}', {name: 'John'}), 'My name is John');
    assert.equal(Localize.replace('whoIsString', {firstName: 'John', lastName: 'Doe'}), 'Who is John Doe?');
    assert.equal(Localize.replace('Who is %{firstName} %{lastName}?', {firstName: 'John', lastName: 'Doe'}), 'Who is John Doe?');
    assert.equal(Localize.replace(),
        'Incorrect parameters passed to Localization.replace(). First parameter must be a string ID. Second parameter must be an object.');
    assert.equal(Localize.replace('whoIsString'),
        'Incorrect parameters passed to Localization.replace(). First parameter must be a string ID. Second parameter must be an object.');
    assert.equal(Localize.replace('whoIsString', [{firstName: 'John', lastName: 'Doe'}]),
        'Incorrect parameters passed to Localization.replace(). First parameter must be a string ID. Second parameter must be an object.');
    assert.equal(Localize.replace('Who is %{firstName} %{lastName}?', [{firstName: 'John', lastName: 'Doe'}]),
        'Incorrect parameters passed to Localization.replace(). First parameter must be a string ID. Second parameter must be an object.');
    assert.notEqual(Localize.replace('myNameIsString', {firstName: 'John'}), 'My name is John');
    assert.notEqual(Localize.replace('My name is %{name}', {firstName: 'John'}), 'My name is John');
});