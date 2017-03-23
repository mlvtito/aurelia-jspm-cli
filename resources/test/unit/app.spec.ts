import { App } from '../../src/app'

const expect = chai.expect;

describe("App Test Suite", function() {
    it('should setup default message', function() {
        var app: App = new App();
        expect(app.message).to.be.equal("It Works ");
    });
    
    it('should add exclaim to message message', function() {
        var app: App = new App();
        app.exclaim();
        expect(app.message).to.be.equal("It Works !!");
    });
    
    it('should fail having too much exclaim', function() {
        var app: App = new App();
        app.exclaim();
        app.exclaim();
        expect(app.message).to.be.equal("It Works ");
    });
})