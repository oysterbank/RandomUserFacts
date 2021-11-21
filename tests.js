mocha.setup('bdd');

let assert = chai.assert;

describe('RandomUserTable tests', function () {
    describe('The RandomUserTable class', function () {
        it('can be instantiated', function () {
            assert.isObject(new RandomUserTable());
        });
    });
});
  
mocha.run();
