# Instructions

## Install NPM
[Install NPM](https://phoenixnap.com/kb/install-node-js-npm-on-windows)


### Run this once per system:
npm install -g @angular/cli

* ignore the warnings/errors on windows (unless it's a package failing to be brought down)

### Installing (go to the root area of your project):
npm install

* close your command window here, so path variables get brought in

## Run Server Locally
ng serve

* server will be accessible at localhost:4200

## Push Code To GitHub pages
ng build --prod --base-href "https://pages.github.nwie.net/user-name/repo/"
ngh

### For this site:
ng build --prod --base-href "https://pages.github.nwie.net/Nationwide/LearningFramework/"
ng deploy


* replace your user-name and repo in the string above. This path should be the root for your gh-pages (unless you want to set your root deeper into the project)
* ngh will push the code to your branch

## View on GitHub pages
"https://pages.github.nwie.net/user-name/repo/"


## More info 
* CLI can be found here: https://www.npmjs.com/package/angular-cli
* CLI for GHPags here: https://www.npmjs.com/package/angular-cli-ghpages
* Tutorial: https://angular.io/tutorial
* Lynda Course: https://www.lynda.com/AngularJS-tutorials/Angular-2-Essential-Training/540347-2.html
