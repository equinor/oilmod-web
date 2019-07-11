# TOPS UI Library (ngx-stoui)

Monorepo containing all our packages for UI development, split into sub-packages.

## Build

To build a specific package, run `node builder --project <core|common|...>`. To build all packages, run `node builder`. This will run as much as possible in parallel, and output global styles and other static dependencies.

Adding --bump patch|minor|major to the builder will also bump the package version

## Local development

You have two options for local development:

#### Via angular cli

All the libraries are linked with the prefix they would normally use (@ngx-stoui/name). To do local development, you can run:
* `ng serve`
* `ng build stoui-<name> --watch`

After this, you can test your changes by importing them to src/app/app.module.ts, and both the app and library is built on changes.

#### Via Storybook

Simply create a new story for your new component, and run `yarn storybook`. 


## Code scaffolding

Run `ng generate --project stoui-<core|common|...> component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

##### Docker
Run `docker build --build-arg PROJECT={core|common|form|datatable|etc}` to execute unit tests in a container with HeadlessChrome. This will also print out a coverage summary, but primarily this is intended to be used in a CI environment.

##### Browser (Chrome)

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Attributions
* StoComplexDatatableComponent builds on [@swimlane/ngx-datatable](https://github.com/swimlane/ngx-datatable) (MIT License)
* Misc other components extends from [@angular/material](https://github.com/angular/components) (MIT License)

## Future TODOs

* Demo of ~~all~~ remaining components (storybook)
* Integrate documentation with storybook ~~Auto generate docs for each module, and build a docker image~~ 
