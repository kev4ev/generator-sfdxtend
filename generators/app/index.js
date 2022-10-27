const Generator = require('yeoman-generator');
const pkg = require('../../package.json');
const glob = require('glob');
const path = require('path/posix');
const fs = require('fs');

const GEN_SUFFIX = 'Sfdxtension';

class SfdxtensionGenerator extends Generator{

    async initializing(){
        // add sfdxtends as project dependency
        let dep = {},
            name = '@alpha-bytes/sfdxtend',
            version = pkg.devDependencies[dep];
        dep[name] = version;
        // await this.addDependencies(dep);
        this.tmplData = { sfdxtendVersion: version }
    }
    
    async prompting(){
        let extNameClosure = 'MySfdxtension';
        let answers = await this.prompt([
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
        Object.assign(this.tmplData, answers);
    }

    async writing(){
        let { directory, extName, sfdxtendVersion } = this.tmplData;
        if(!fs.existsSync(directory)){
            fs.mkdirSync(directory);
        }
        this.destinationRoot(directory);
        this.fs.copyTpl(
            glob.sync(this.templatePath('**/*'), { dot: true }), 
            this.destinationPath(), 
            { extName, sfdxtendVersion }
        );
    }

}

module.exports = SfdxtensionGenerator;