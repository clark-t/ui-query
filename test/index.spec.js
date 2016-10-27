var $ = require('../dist/ui-query.min');
var expect = require('chai').expect;

describe('test stringify', function () {
    it('should be equal', function () {
        expect($.stringify({
            border: '1px solid #dcdcdc',
            width: '2px'
        }))
        .to.be.equal('border:1px solid #dcdcdc;width:2px;');
    });
});

describe('test parse', function () {
    it('should be deeply equal', function () {
        expect($.parse('   border: 1px solid #dcdcdc;   width: 2px;    '))
        .to.be.deep.equal({
            border: '1px solid #dcdcdc',
            width: '2px'
        });
    });
});
