# expo-env
.env solution for React Native apps Built with EXPO

> Expo does not give us much in terms of managing multiple environment based configuration. Atleast other than `production` and `development`. To overcome that, this is simply a workaround until a proper support is released by good folks at [Expo.io](https://expo.io).

## How it works
* `Expo` passes the options available in `app.json` file at the root of your React Native application, along with some other details, called as `manifest` and can be accessed by [`Expo.Constants.manifest`](https://docs.expo.io/versions/latest/sdk/constants.html#expoconstantsmanifest)
* We simply use this to pass our environment based variables and configuration using the `extra` field inside that `manifest`.
* We create a new `app.json` file reading the `[environment].config.js` file and passing it within that `extra` parameter.

## What it involves
* Firstly we would need to make our `app.json` to not be pushed to version control (i.e `git`), because whenever we will change our environment, we would be updating this file, so it will not make much sense to check this into you repository.
* You will also create a configuration file for each of the environments you have. For ex. if you have `staging`, `production` and `dev` environments, you would create *3* files named `staging.config.js`, `production.config.js` and `dev.config.js`
* Every time there is a need to change the `env` we would simply run this module so that it injects proper `options` within `app.json`, and then restart our `packager` using either `exp` CLI or through the `XDE GUI` tool.

## Making it more seamless
* TO make it more seamless, we can simple add these as `npm scripts` in our `Expo` app's `package.json`, such as:

`package.json`
```
  ...
   "scripts": {
     ...pre existing scripts,
     "env": "expo-env --env=development",
     "env:prod": "expo-env --env=prod"
   }
  ...
```


`sample config file - i.e staging.config.js`
```
module.exports = {
  "endpoint": "https://some-endpoint.someapi.com",
  "AWSKey": "Avsgvdye523"
}
```

You would be getting the above config/ENV vars inside your application if you use `Expo.Constants.manifest.extra` to get those values.

## Options / Arguments
* `--env=[env]`: Specifies the environment config to be picked up. (_default_: __`development`__)
* `--configPath=[path]`: The path to all the `env` files. _for ex._ `--configPath=./config` will look into the `config` folder. (_default_: __`./`__)
* `--template=[templatename]`: The Name postfix for the env files. _i.e_ [env].[templatename]. If values passed is `.env.js` it will look for `[env].env.js` in the `configPath`. (_default_: __`config.js`__)

### Thank You!