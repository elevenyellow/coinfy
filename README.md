<p align="center"><a href="https://coinfy.com/"><img width="200"src="https://coinfy.com/static/image/logo2.svg"></a></p>

## [FAQ](https://github.com/elevenyellow/coinfy/blob/master/FAQ.md)

## Security

We have a cron that is running contiously in background checking if the files served by https://coinfy.com are the same version of this repository.

You can run it yourself by clonning this repository and running this two commands:

```
npm install
npm run hashes
```

The output will be something similar to this:

```
Getting tree list...
Checking list: Tue Jul 03 2018 18:50:34 GMT+0200 (CEST)
✔ fcd68a44bb1f50ea722420ddb865459cbe269a26 https://coinfy.com/index.html
✔ 46cc72aa782beda606cdcb96ebd95bfc8c313bbb https://coinfy.com/static/css/index.css
✔ 610f961f6e7ee96956157540fcccebb1b32bdfc2 https://coinfy.com/static/bundle/main.js
✔ a284dedba3fb97fe4a233bacb8729db908ab37e6 https://coinfy.com/static/bundle/libs.js
✔ 5905705df7c34b92140e6b91dba9e9d5111f4d4a https://coinfy.com/static/libs/instascan.min.js
  0 fails
```

## Download and running the latest release on your machine

In order to follow this you will need to install the latest version of: [git](https://git-scm.com/downloads), [node.js](https://nodejs.org) and [npm](https://www.npmjs.com/)

Open a terminal/console and type these commands

```
git clone git@github.com:elevenyellow/coinfy.git
cd coinfy
npm install
npm run build
npm run prod
open http://localhost:8000
```

## Developers

```
git clone git@github.com:elevenyellow/coinfy.git
cd coinfy
npm install
npm run dev
open http://localhost:8000
```

... to do

## License

[MIT](http://opensource.org/licenses/MIT)
