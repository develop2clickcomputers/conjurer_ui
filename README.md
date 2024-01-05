# Conjurer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.0.

## Branch Details

This branch `conjurer_documentation` was created from branch `conjurer_d3_chart_integration`. This is the latest brach and for further development, Please use this branch `conjurer_documentation`.

## Branch in production

Branch Name : `conjurer_d3_chart_integration`

## How to use this project?

- Clone this project from bitbucket account `git clone https://durgesh_infiniopes@bitbucket.org/infiniopes/conjurer_ui.git`
- Run `npm install` to install dependencies for this project
- To run this project view `Development Server` topic in this readme file or see below

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Documentation
To get more help regarding documentaion please visit this [link](https://compodoc.github.io/compodoc/)
for more information please [visit here](https://compodoc.app/guides/tutorial.html)

## Install compodoc

### Globally

Run `npm install -g @compodoc/compodoc` to install globally

### Locally

Run `npm install --save @compodoc/compodoc` for dependency
or
`npm install --save-dev @compodoc/compodoc` for dev dependency
for more information [visit here](https://compodoc.app/guides/installation.html)

## To generate documentation
- Add script `"compodoc": "compodoc"` to package.json file
- Add script `"generate-doc": "npx compodoc -p src/tsconfig.app.json --theme material"` to the package.json file
for more information [visit here](https://compodoc.app/guides/usage.html)
- Run `npm run generate-doc` to generate document

## To serve the documentaion

- Add script `"serve-docs": "compodoc -s src/tsconfig.app.json --port 4202"` to package.json file
- Run `npm run serve-docs` in you project root folder, Navigate to `http://localhost:4202/` to view the documentation, for more information [visit here](https://compodoc.app/guides/usage.html)


## Upgraded from Angular 6 to Angular 8 
# node V16.10.0 recommended and then run below command
# ng version
# npm install --force
# npm run start
## If process.binding('http_parser') is deprecated occured run below commands
# set NODE_OPTIONS=--openssl-legacy-provider
# npm run start
# Open chrome browser with ->  http://localhost:4200/