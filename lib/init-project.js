const ora = require('ora')
const clone = require('git-clone')
const config = require('../config')
const path = require('path')
const { readdirSync, lstatSync } = require('fs')
const inquirer = require('inquirer')
const ncp = require('ncp').ncp
const rimraf = require('rimraf')
const minimist = require('minimist')

let argv

module.exports = function initProject() {
    const spinner = ora('Loading...').start()
    argv = minimist(process.argv.slice(2))
    spinner.text = 'Getting Templates'
    clone(config.template.repo, config.clone.tmpDirectory, postCloning(spinner))
}

function postCloning(spinner) {
    return () => {
        spinner.text = 'Cloned, Generating template list...'
        const contents = readdirSync(config.clone.tmpDirectory)
        const ignoreList = ['.git']
        const availableTemplates = contents.filter((item) => {
            if (
                !lstatSync(
                    path.join(config.clone.tmpDirectory, item)
                ).isDirectory() ||
                ignoreList.indexOf(item) > -1
            ) {
                return false
            }
            return true
        })

        spinner.stop()

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectedTemplate',
                    message: 'Select a template to start with',
                    default: 'babel',
                    choices: availableTemplates,
                },
            ])
            .then((data) => {
                copyTemplate(data.selectedTemplate)
            })
    }
}

function copyTemplate(templateItem) {
    const directory = argv.dir || argv.d || '.'
    ncp(path.join(config.clone.tmpDirectory, templateItem), directory)
    const spinner = ora('Removing Cloned templates').start()
    rimraf(path.join(config.clone.tmpDirectory), () => {
        spinner.succeed()
    })
}
