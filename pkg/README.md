# Compressor

A simple, standard hard-knee compressor for Elementary. This package demonstrates
a complete, small but functional audio plugin written in Elementary, and provides a simple, lightweight
and no-frills utility for dynamics compression within your own Elementary applications.

## Installation

The Compressor code here is distributed in the Elementary Private Registry. After creating an account
on [the Elementary website](https://www.elementary.audio) and configuring your `.npmrc`, you can
fetch the package as normal:

```bash
npm install --save @elemaudio/compressor
```

## Usage Example

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

## Reference

### compressor(props, xl, xr)

* `@param {object}` props
* `@param {string}` props.key uniquely identify the compressor
* `@param {number}` props.attack in [0, 1]
* `@param {number}` props.release in [0, 1]
* `@param {number}` props.threshold in [0, 1]
* `@param {number}` props.ratio in [0, 1]
* `@param {number}` props.outputGain in [0, 1]
* `@param {core.Node}` xl left channel input
* `@param {core.Node}` xr right channel input
* `@returns {Array<core.Node>}` [yl, yr] left and right output pair

## License

This package is distributed under the terms of the ISC license.
