import invariant from 'invariant';

import {el, createNode, resolve} from '@elemaudio/core';


// We start off here with a Composite node for the main compressor
// logic. This allows Elementary to significantly optimize the rendering
// of the resulting compressor signal flow.
function CompressComposite({children}) {
  const [atkMs, relMs, threshold, ratio, sidechain, xn] = children;
  const env = el.env(
    el.tau2pole(el.mul(0.001, atkMs)),
    el.tau2pole(el.mul(0.001, relMs)),
    sidechain,
  );

  const envDecibels = el.gain2db(env);

  // Strength here is on the range [0, 1] where 0 = 1:1, 1 = infinity:1.
  //
  // We therefore need to map [1, infinity] onto [0, 1] for the standard "ratio" idea,
  // which is done here. We do so by basically arbitrarily saying any ratio value 50:1 or
  // greater is considered inf:1.
  const strength = el.select(
    el.leq(ratio, 1),
    0,
    el.select(
      el.geq(ratio, 50),
      1,
      el.sub(1, el.div(1, ratio)),
    ),
  );

  // Finally our gain computer; when the envelope is above the threshold,
  // we compute a gain value to apply according to the strength above.
  const gain = el.select(
    el.ge(envDecibels, threshold),
    el.db2gain(
      el.mul(
        el.sub(threshold, envDecibels),
        strength,
      ),
    ),
    1,
  );

  return resolve(el.mul(xn, gain));
}

// A simple wrapper around our CompressComposite funtion to provide an API that
// feels similar to the Elementary standard library.
export function compress(attack, release, threshold, ratio, sidechain, xn) {
  return createNode(CompressComposite, {}, [attack, release, threshold, ratio, sidechain, xn]);
}

// Then our main DSP export. Here we expect to receive as props an object of the
// same shape that we describe in our `defaultState` property of the exported
// manifest below.
//
// This function takes the incoming state and returns an updated description of
// the underlying audio process matching the given state. The caller is responsible
// for ensuring that the appropriate Elementary renderer renders this result.
export default function compressor(props, xl, xr) {
  invariant(typeof props === 'object', 'Unexpected props object');
  invariant(typeof props.key === 'string', 'Unexpected key prop');
  invariant(typeof props.attack === 'number', 'Unexpected attack prop');
  invariant(typeof props.release === 'number', 'Unexpected release prop');
  invariant(typeof props.threshold === 'number', 'Unexpected threshold prop');
  invariant(typeof props.ratio === 'number', 'Unexpected ratio prop');
  invariant(typeof props.outputGain === 'number', 'Unexpected outputGain prop');

  let db2gain = (db) => Math.pow(10, db / 20);

  let attack = el.sm(el.const({key: `${props.key}:attack`, value: 2 + (props.attack * (250 - 2))}));
  let release = el.sm(el.const({key: `${props.key}:release`, value: 2 + (props.release * (250 - 2))}));
  let threshold = el.sm(el.const({key: `${props.key}:threshold`, value: -96 + (props.threshold * 96)}));
  let ratio = el.sm(el.const({key: `${props.key}:ratio`, value: 1 + (props.ratio * props.ratio * 49)}));
  let gain = el.sm(el.const({key: `${props.key}:gain`, value: db2gain(-36 + (props.outputGain * 36 * 2))}));

  let sidechain = el.add(xl, xr);

  return [
    el.mul(gain, compress(attack, release, threshold, ratio, sidechain, xl)),
    el.mul(gain, compress(attack, release, threshold, ratio, sidechain, xr)),
  ];
}

// Next up we export a manifest object providing metadata about this plugin,
// including name, input/output configuration, parameters, and default state.
export const manifest = {
  displayName: 'Compressor',
  numInputChannels: 2,
  numOutputChannels: 2,
  parameters: {
    attack: {
      valueFromString: (s) => parseFloat(s),
      valueToString: (v) => `${Math.round(2 + (v * 248))}ms`,
    },
    release: {
      valueFromString: (s) => parseFloat(s),
      valueToString: (v) => `${Math.round(2 + (v * 248))}ms`,
    },
    threshold: {
      valueFromString: (s) => parseFloat(s),
      valueToString: (v) => `${Math.round(-96 + (v * 96))}dB`,
    },
    ratio: {
      valueFromString: (s) => parseFloat(s),
      valueToString: (v) => `${(1 + (v * v * 49)).toFixed(1)}`,
    },
    outputGain: {
      valueFromString: (s) => parseFloat(s),
      valueToString: (v) => `${Math.round(-36 + (v * 36 * 2))}dB`,
    },
  },
  defaultState: {
    attack: 0.5,
    release: 0.5,
    threshold: 0.5,
    ratio: 0.5,
    outputGain: 0.5,
  },
};
