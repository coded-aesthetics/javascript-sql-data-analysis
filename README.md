# SqlSelect

For the idea behind this repository check my blog post [Using SQL to analyze data in JavaScript without a database](https://blog.coded-aesthetics.com/2016/11/22/using-sql-to-analyze-data-in-javascript-without-database/)

The implementation is based on the [SQLLite parser](http://codeschool.github.io/sqlite-parser/demo/) written by [Nick Wronski](https://github.com/nwronski) for Codeschool which parses SQL statements and generates an abstract syntax tree out of which the neccessary data can be extracted. 
Please note that this is experimental and to be considered a case study.    
If you would however like to use or build on this technique, feel free to do so.  

[View Demo Here](https://s3.eu-central-1.amazonaws.com/coded-aesthetics/demos/javascript-sql-data-analysis/index.html)

You can find [a nice collection of data to analyze](https://github.com/jdorfman/awesome-json-datasets) in this github repo by Justin Dorfman

Currently supported statements:
- select *  
- select column  
- select column1, column2  
- select sum(column)  
- select avg(column)  
- select min(column)  
- select max(column)  
- select count(*)  
- where column = 3
- where column = 'str'
- where column like 'A%' (begins with A)  
- where column like '%D' (ends with D)  
- where column like 'DA' (contains DA)  
- order by column asc  
- order by column desc  
  
since the where clause is eval'd you can do more advanced stuff e.g. on sub-objects in your dataset like:  
- where "arrColumn[0].subObj" = 'something'
- where "arrColumn.every((cur) => {return cur.val > 3;})" = 'true'

### Caveats
Note that due to the fact that sqllite columns are case insensitive **you have to put camelCase columns in quotation-marks**:  
Checking if a column is null only works like this: where "column == null" = 'true'

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.20-4.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
