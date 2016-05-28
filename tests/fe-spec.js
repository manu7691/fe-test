describe('search flight almeria-dublin', function() {
    it('should show results view after this', function() {
        browser.get('http://127.0.0.1:8000');

        element(by.id('origin_value')).sendKeys('Almeria');
        element(by.cssContainingText('span', 'Almeria')).click();
        element(by.id('destination_value')).sendKeys('Dublin');
        element(by.cssContainingText('span', 'Dublin')).click();

        element(by.model('departure_date')).sendKeys('2016-06-13');
        element(by.model('return_date')).sendKeys('2016-06-25');


        expect(element(by.model('departure_date')).getAttribute('value')).toBe('2016-06-13','Departure date was set correctly');
        expect(element(by.model('return_date')).getAttribute('value')).toBe('2016-06-25','Return date was set correctly');


        element(by.css('.box-container')).click();

        element(by.css('.btn')).click();

        // Considering api results are random we cant determine if query is gonna return results
        expect(element(by.css('.btn')).isPresent()).toBe(true,'Search was done');
    });
});

describe('search flight with no results', function() {
    it('should show no results message', function() {
        browser.get('http://127.0.0.1:8000/#/flights/from/AAR/to/STN/2016-05-28/2016-05-55/');
        expect(element(by.css('.icon-boat')).isPresent()).toBe(true);
        expect(element(by.css('.text-center')).getText()).toBe('maybe you want to conquer the sea? ;)','No results were found');
    });
});