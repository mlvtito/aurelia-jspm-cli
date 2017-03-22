import { App } from '../../src/app'

const expect = chai.expect;

describe("App Test Suite", function() {
    it('should work', function() {
        var app: App = new App();
        app.exclaim();
        app.exclaim();
        app.exclaim();
        expect(app.message).to.be.equal("It Works !!!!!!");
    });
});