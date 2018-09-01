var app     = require('../app');
var chai    = require('chai');
var expect  = require('chai').expect;
var chaiXml = require('chai-xml');
var fs      = require('fs');

chai.use(chaiXml);




describe('#convert', () => {
    const expectedMindMapOutput = fs.readFileSync('./test/test.mm', 'utf8');

    it("XML should be valid", () => {
        expect(expectedMindMapOutput).xml.to.be.valid();
    });

    it('should convert json input to mind map output', () => {
        const jsonInput = fs.readFileSync('./test/test.json', 'utf8');
        const mindMapOutput = app.convert(jsonInput, 'test.json');
        expect(mindMapOutput).xml.to.equal(expectedMindMapOutput)
    });

    it('should throw an error that the json is invalid', () => {
        const jsonInput = fs.readFileSync('./test/crap.json', 'utf8');
        try {
            app.convert(jsonInput);
        } catch (err) {
            expect(err).to.equal('Error: invalid json');
        }
    });
});

describe('#createMindMap', () => {
    it('should throw an error that the source file does not exist', () => {
        try {
            app.createMindMap('nonExistingFile.json', 'myNewMindMap.mm');
        } catch (err) {
            expect(err).to.equal('Error: json file does not exist');
        }
    });
});