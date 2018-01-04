<p align="center"><a href="https://coinfy.com/"><img width="200"src="https://coinfy.com/static/image/logo2.svg"></a></p>

## Download and running the last release in your machine

In order to follow this you will need to install the latest version of: [git](https://git-scm.com/downloads), [node.js](https://nodejs.org) and [npm](https://www.npmjs.com/)

Open a terminal/console and type this commands

```
git clone git@github.com:elevenyellow/coinfy.git
cd coinfy
npm install
npm run build
npm run prod
open http://localhost:8000
```

## Checking versions

You can check if the files generated in your machine are the same that are being used in http://coinfy.com

```
npm run build
npm run hashes
```

The out will be something similar to this:

```
> node test/hashes

✔ 162a3e0021e56bb17ae901d1bcea87cfe2530df8 public/static/image/send.svg
✔ 647c8cd0405e092f365878323f2b1d48bf19ab1e public/static/css/index.css
✔ 2a21ac74b2626d1b63a6676ac7ae06d06b8eada2 public/index.html
✔ a35f37108d6cb90adeebfa9196b3ccd636a69696 public/static/image/BCH.svg
✔ b0e1a07808c4d6d61448a042a17a4548f41cf545 public/static/image/BTC.svg
✔ f71b61d054a030ee2ab696e2ff78a3f78be461a1 public/static/image/loading.gif
✔ e26f7f02d697636295998493365e4ab5ff74e1c3 public/static/image/favicon.png
✔ f0193a911e470730c21afd5d51fcbcaab7b2847f public/static/image/logo.svg
✔ 95fb24ad66c73aa30c6e3390e794de83db0f01e0 public/static/image/ETH.svg
✔ bd8c30606f590d2c669bbd370d7147fb62a78474 public/static/image/logo2.svg
✔ 6324b3b907a09e6d429a94d8727ced52c03b7e06 public/static/bundle/main.js
✘ fd94b7754a994ee995d153c5381caeed34cffe21 public/static/bundle/libs.js
  384da73c52159384e61123f410ab5bed45bbb231

  11/12
```

It's probably that `bundle/libs.js` fails because it depends on the npm global packages versions you have installed.

## Developers

To do

## License

[MIT](http://opensource.org/licenses/MIT)
