import React, { useState } from 'react';

import { manifest } from './pkg/index.js';

import Knob from './Knob.js';
import Lockup from './Lockup_Dark2.svg';
import pkg from './pkg/package.json';


// The interface of our plugin, exported here as a React.js function
// component. The host may use this component to render the interface of our
// plugin where appropriate.
//
// We use the `props.requestParamValueUpdate` callback provided by the caller
// of this function to propagate new parameter values to the host.
export default function Interface(props) {
  const colorProps = {
    meterColor: '#EC4899',
    knobColor: '#64748B',
    thumbColor: '#F8FAFC',
  };

  let setAttackValue = (v) => props.requestParamValueUpdate('attack', v);;
  let setReleaseValue = (v) => props.requestParamValueUpdate('release', v);;
  let setThresholdValue = (v) => props.requestParamValueUpdate('threshold', v);;
  let setRatioValue = (v) => props.requestParamValueUpdate('ratio', v);;
  let setOutputGainValue = (v) => props.requestParamValueUpdate('outputGain', v);;

  let mp = manifest.parameters;

  let data = [
    { name: 'Attack',       value: props.attack,      readout: mp.attack.valueToString(props.attack),         setValue: setAttackValue },
    { name: 'Release',      value: props.release,     readout: mp.release.valueToString(props.release),       setValue: setReleaseValue },
    { name: 'Threshold',    value: props.threshold,   readout: mp.threshold.valueToString(props.threshold),   setValue: setThresholdValue },
    { name: 'Ratio',        value: props.ratio,       readout: mp.ratio.valueToString(props.ratio),           setValue: setRatioValue },
    { name: 'Output Gain',  value: props.outputGain,  readout: mp.outputGain.valueToString(props.outputGain), setValue: setOutputGainValue },
  ]

  return (
    <div className="w-full h-screen min-w-[492px] min-h-[238px] bg-slate-800 bg-mesh p-6">
      <div className="h-1/5 flex justify-between items-center">
        <Lockup className="h-8 w-auto" />
        <span className="text-sm text-slate-300 font-light">@elemaudio/compressor &middot; {pkg.version}</span>
      </div>
      <div className="flex h-4/5">
        {data.map(({name, value, readout, setValue}) => (
          <div key={name} className="flex flex-col flex-1 justify-center items-center">
            <Knob className="h-20 w-20 m-4" value={value} onChange={setValue} {...colorProps} />
            <div className="flex-initial mt-2">
              <div className="text-sm text-slate-50 text-center font-light">{name}</div>
              <div className="text-sm text-pink-500 text-center font-light">{readout}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
