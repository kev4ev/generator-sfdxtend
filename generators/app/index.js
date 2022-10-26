const Sfdxtension = require('../../lib/Sfdxtension');
const pkg = require('../../package.json');
const glob = require('glob');
const path = require('path/posix');
const fs = require('fs');

const GEN_SUFFIX = 'Sfdxtension';

class SfdxtensionGenerator extends Sfdxtension{

    constructor(...args){
        /** ensure you leave this line in as base class requires __dirname to be passed from subclass */
        super(__dirname, ...args);
    }

    async initializing(){
        // add self as project dependency
        let dep = {};
        dep[`${pkg.name}`] = `^${pkg.version}`;
        await this.addDependencies(dep);
    }
    
    async prompting(){
        let extNameClosure = 'MySfdxtension';
        this.answers = await this.prompt([
            {
                name: 'extName',
                message: 'What is the name of your extension?',
                default: extNameClosure,
                filter: (val) => {
                    if(val && val.length > 0){
                        let trimmed = val.replace(/\s/g, ''),
                            cleaned = `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;

                        extNameClosure = cleaned;
                        return cleaned;
                    }

                    return extNameClosure;
                }
            },
            {
                name: 'directory',
                message: 'Which directory?',
                default: extNameClosure,
                filter: (val) => {
                    return path.resolve(process.cwd(), val);
                }
            }
        ]);
    }

    async writing(){
        let { directory, extName } = this.answers;
        if(!fs.existsSync(directory)){
            fs.mkdirSync(directory);
        }
        this.destinationRoot(directory);
        this.fs.copyTpl(
            glob.sync(this.templatePath('**/*'), { dot: true }), 
            this.destinationPath(), 
            { extName }
        );
    }

}

module.exports = SfdxtensionGenerator;