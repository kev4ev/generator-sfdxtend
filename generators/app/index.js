const Generator = require('yeoman-generator');

const GEN_SUFFIX = 'Sfdxtension';

class SfdxtensionGenerator extends Generator{
    
    async prompting(){
        this.answers = await this.prompt([
            {
                name: 'extName',
                message: 'What is the name of your extension?',
                default: 'My',
                filter: (val) => {
                    if(val && val.length > 0){
                        let trimmed = val.replace(/\s/g, '');

                        return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
                    }

                    return 'My';
                }
            }
        ]);
    }

    async writing(){
        await this.renderTemplateAsync(
            'Sfdxtension.js', 
            `${this.answers.extName}${GEN_SUFFIX}.js`,
            this.answers
        );
    }

}

module.exports = SfdxtensionGenerator;