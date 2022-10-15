# Compressor

A simple, standard hard-knee compressor for Elementary. This repository is intended to show
a minimal example of the types of packages that ship on the Elementary Private Registry, demonstrate
a complete, small but functional audio plugin written in Elementary, and provide a simple, lightweight
and no-frills utility for dynamics compression.

The compiled audio plugin is available for free in AU/VST3 formats for MacOS 10.11+, and can be found
on the [Elementary Marketplace](https://www.elementary.audio/marketplace/QGVsZW1hdWRpby9jb21wcmVzc29y).

## Usage

The Compressor code here is distributed in the Elementary Private Registry. After creating an account
on [the Elementary website](https://www.elementary.audio) and configuring your `.npmrc`, you can
fetch the package as normal:

```bash
npm install @elemaudio/compressor
```

### Example

```js
import compressor from '@elemaudio/compressor';
import {default as core} from '@elemaudio/plugin-renderer';


core.on('load', function(e) {
  let [leftChannelInput, rightChannelInput] = [el.in({channel: 0}), el.in({channel: 1})];
  let [leftChannelOutput, rightChannelOutput] = compressor({
    // These values are normalized [0, 1]
    attack: 0.5,      // [0, 1] => [2ms,    250ms]
    release: 0.5,     // [0, 1] => [2ms,    250ms]
    threshold: 0.5,   // [0, 1] => [-96dB,  0dB]
    ratio: 0.5,       // [0, 1] => [1,      50]
    outputGain: 0.5,  // [0, 1] => [-36dB,  36dB]
  }, leftChannelInput, rightChannelInput);


  core.render(
    leftChannelOutput,
    rightChannelOutput,
  );
});

core.initialize();
```

## Running Locally

You can also build and run this project locally on MacOS 10.11+ as long as you have a host that can
load an AU/VST3 plugin. Try running it and you can tweak the algorithm to your heart's content.

```bash
# Clone the repository
git clone https://github.com/elemaudio/compressor.git

# Change directory to the root of the repository
cd compressor

# Install dependencies
npm install

# The @elemaudio/plugin-renderer package provides audio plugin binaries for
# the Elementary Plugin Dev Kit, which will dynamically load our code here from
# our dev server.
npx run elem-copy-binaries

# Spin up the dev server on localhost:3000 so that the Plugin Dev Kit can find
# our app. You will need to generate a local HTTPS certificate and copy the files
# to the root of this repository.
#
# See https://github.com/FiloSottile/mkcert for a quick way to do that.
npm run start-plugin
```

Next, open the Elementary Plugin Dev Kit audio plugin in the host of your choice. You can
edit and iterate on the code here as you like. You can also attach Safari's debugger using the
Develop menu from the Safari browser.

## License

The source code listed in this repository is distributed under the terms of the ISC license,
for which the full text can be found in [LICENSE.md](./LICENSE.md).

The **Elementary Audio logo and icon** are copyright © 2022 Elementary Audio, LLC and may not be used in derivative works.
# Share-Tune
