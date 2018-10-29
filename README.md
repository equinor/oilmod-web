# TOPS UI Library (ngx-stoui)

Monorepo containing all our packages for UI development, split into sub-packages.

## Build

To build a specific package, run `ng build stoui-<core|common|...>`. To build all packages, run `node builder`. This will run as much as possible in parallel, and output global styles and other static dependencies.

## Local development

All the libraries are linked with the prefix they would normally use (@ngx-stoui/name). To do local development, you can run:
* `ng serve`
* `ng build stoui-<name> --watch`

After this, you can test your changes by importing them to src/app/app.module.ts, and both the app and library is built on changes.

## Code scaffolding

Run `ng generate --project stoui-<core|common|...> component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Future TODOs

* Unit tests
* Demo of all components
* Auto generate docs for each module, and build a docker image
