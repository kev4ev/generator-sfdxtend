const Generator = require('yeoman-generator');

class Sfdxtension extends Generator{
    constructor(derivedRoot, ...args){
        super(...args);
        this.sourceRoot(`${derivedRoot}/templates`);
    }
}

module.exports = Sfdxtension;