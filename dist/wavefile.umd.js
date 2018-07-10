(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.WaveFile = factory());
}(this, (function () { 'use strict';

  /*
   * bitdepth: Change the resolution of samples to and from any bit depth.
   * https://github.com/rochars/bitdepth
   *
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview The bitdepth() function and private helper functions.
   */

  /** @module bitdepth */

  /** @private */
  var f64f32_ = new Float32Array(1);

  /**
   * Change the bit depth of samples. The input array.
   * @param {!TypedArray} input The samples.
   * @param {string} original The original bit depth of the data.
   *      One of "8" ... "53", "32f", "64"
   * @param {string} target The desired bit depth for the data.
   *      One of "8" ... "53", "32f", "64"
   * @param {!TypedArray} output The output array.
   */
  function bitDepth(input, original, target, output) {
    validateBitDepth_(original);
    validateBitDepth_(target);
    /** @type {!Function} */
    var toFunction = getBitDepthFunction_(original, target);
    /** @type {!Object<string, number>} */
    var options = {
      oldMin: Math.pow(2, parseInt(original, 10)) / 2,
      newMin: Math.pow(2, parseInt(target, 10)) / 2,
      oldMax: Math.pow(2, parseInt(original, 10)) / 2 - 1,
      newMax: Math.pow(2, parseInt(target, 10)) / 2 - 1
    };
    /** @type {number} */
    var len = input.length;
    // sign the samples if original is 8-bit
    if (original == "8") {
      for (var i = 0; i < len; i++) {
        output[i] = input[i] -= 128;
      }
    }
    // change the resolution of the samples
    for (var _i = 0; _i < len; _i++) {
      output[_i] = toFunction(input[_i], options);
    }
    // unsign the samples if target is 8-bit
    if (target == "8") {
      for (var _i2 = 0; _i2 < len; _i2++) {
        output[_i2] = output[_i2] += 128;
      }
    }
  }

  /**
   * Change the bit depth from int to int.
   * @param {number} sample The sample.
   * @param {!Object<string, number>} args Data about the original and target bit depths.
   * @return {number}
   * @private
   */
  function intToInt_(sample, args) {
    if (sample > 0) {
      sample = parseInt(sample / args.oldMax * args.newMax, 10);
    } else {
      sample = parseInt(sample / args.oldMin * args.newMin, 10);
    }
    return sample;
  }

  /**
   * Change the bit depth from float to int.
   * @param {number} sample The sample.
   * @param {!Object<string, number>} args Data about the original and target bit depths.
   * @return {number}
   * @private
   */
  function floatToInt_(sample, args) {
    return parseInt(sample > 0 ? sample * args.newMax : sample * args.newMin, 10);
  }

  /**
   * Change the bit depth from int to float.
   * @param {number} sample The sample.
   * @param {!Object<string, number>} args Data about the original and target bit depths.
   * @return {number}
   * @private
   */
  function intToFloat_(sample, args) {
    return sample > 0 ? sample / args.oldMax : sample / args.oldMin;
  }

  /**
   * Change the bit depth from float to float.
   * @param {number} sample The sample.
   * @return {number}
   * @private
   */
  function floatToFloat_(sample) {
    f64f32_[0] = sample;
    return f64f32_[0];
  }

  /**
   * Return the function to change the bit depth of a sample.
   * @param {string} original The original bit depth of the data.
   *      One of "8" ... "53", "32f", "64"
   * @param {string} target The new bit depth of the data.
   *      One of "8" ... "53", "32f", "64"
   * @return {!Function}
   * @private
   */
  function getBitDepthFunction_(original, target) {
    /** @type {!Function} */
    var func = function func(x) {
      return x;
    };
    if (original != target) {
      if (["32f", "64"].includes(original)) {
        if (["32f", "64"].includes(target)) {
          func = floatToFloat_;
        } else {
          func = floatToInt_;
        }
      } else {
        if (["32f", "64"].includes(target)) {
          func = intToFloat_;
        } else {
          func = intToInt_;
        }
      }
    }
    return func;
  }

  /**
   * Validate the bit depth.
   * @param {string} bitDepth The original bit depth.
   *     Should be one of "8" ... "53", "32f" or "64".
   * @throws {Error} If any argument does not meet the criteria.
   * @private
   */
  function validateBitDepth_(bitDepth) {
    if (bitDepth != "32f" && bitDepth != "64" && (parseInt(bitDepth, 10) < "8" || parseInt(bitDepth, 10) > "53")) {
      throw new Error("Invalid bit depth.");
    }
  }

  /*
   * imaadpcm: IMA ADPCM codec in JavaScript.
   * Derived from https://github.com/acida/pyima  
   * Copyright (c) 2016 acida. MIT License.  
   * Copyright (c) 2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview imaadpcm API and private methods.
   */

  /** @module imaadpcm */

  /**
   * @type {!Array<number>}
   * @private
   */
  var INDEX_TABLE = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];
  /**
   * @type {!Array<number>}
   * @private
   */
  var STEP_TABLE = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];
  /**
   * @type {number}
   * @private
   */
  var encoderPredicted_ = 0;
  /**
   * @type {number}
   * @private
   */
  var encoderIndex_ = 0;
  /**
   * @type {number}
   * @private
   */
  var decoderPredicted_ = 0;
  /**
   * @type {number}
   * @private
   */
  var decoderIndex_ = 0;
  /**
   * @type {number}
   * @private
   */
  var decoderStep_ = 7;

  /**
   * Encode 16-bit PCM samples into 4-bit IMA ADPCM samples.
   * @param {!Int16Array} samples A array of samples.
   * @return {!Uint8Array}
   */
  function encode(samples) {
    /** @type {!Uint8Array} */
    var adpcmSamples = new Uint8Array(samples.length / 2 + 512);
    /** @type {!Array<number>} */
    var block = [];
    /** @type {number} */
    var fileIndex = 0;
    for (var i = 0; i < samples.length; i++) {
      if (i % 505 == 0 && i != 0) {
        adpcmSamples.set(encodeBlock(block), fileIndex);
        fileIndex += 256;
        block = [];
      }
      block.push(samples[i]);
    }
    return adpcmSamples;
  }

  /**
   * Decode IMA ADPCM samples into 16-bit PCM samples.
   * @param {!Uint8Array} adpcmSamples A array of ADPCM samples.
   * @param {number} blockAlign The block size.
   * @return {!Int16Array}
   */
  function decode(adpcmSamples) {
    var blockAlign = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 256;

    /** @type {!Int16Array} */
    var samples = new Int16Array(adpcmSamples.length * 2);
    /** @type {!Array<number>} */
    var block = [];
    /** @type {number} */
    var fileIndex = 0;
    for (var i = 0; i < adpcmSamples.length; i++) {
      if (i % blockAlign == 0 && i != 0) {
        samples.set(decodeBlock(block), fileIndex);
        fileIndex += blockAlign * 2;
        block = [];
      }
      block.push(adpcmSamples[i]);
    }
    return samples;
  }

  /**
   * Encode a block of 505 16-bit samples as 4-bit ADPCM samples.
   * @param {!Array<number>} block A sample block of 505 samples.
   * @return {!Array<number>}
   */
  function encodeBlock(block) {
    /** @type {!Array<number>} */
    var adpcmSamples = blockHead_(block[0]);
    for (var i = 3; i < block.length; i += 2) {
      /** @type {number} */
      var sample2 = encodeSample_(block[i]);
      /** @type {number} */
      var sample = encodeSample_(block[i + 1]);
      adpcmSamples.push(sample << 4 | sample2);
    }
    while (adpcmSamples.length < 256) {
      adpcmSamples.push(0);
    }
    return adpcmSamples;
  }

  /**
   * Decode a block of ADPCM samples into 16-bit PCM samples.
   * @param {!Array<number>} block A adpcm sample block.
   * @return {!Array<number>}
   */
  function decodeBlock(block) {
    decoderPredicted_ = sign_(block[1] << 8 | block[0]);
    decoderIndex_ = block[2];
    decoderStep_ = STEP_TABLE[decoderIndex_];
    /** @type {!Array<number>} */
    var result = [decoderPredicted_, sign_(block[3] << 8 | block[2])];
    for (var i = 4; i < block.length; i++) {
      /** @type {number} */
      var original_sample = block[i];
      /** @type {number} */
      var second_sample = original_sample >> 4;
      /** @type {number} */
      var first_sample = second_sample << 4 ^ original_sample;
      result.push(decodeSample_(first_sample));
      result.push(decodeSample_(second_sample));
    }
    return result;
  }

  /**
   * Sign a 16-bit integer.
   * @param {number} num A 16-bit integer.
   * @return {number}
   * @private
   */
  function sign_(num) {
    return num > 32768 ? num - 65536 : num;
  }

  /**
   * Compress a 16-bit PCM sample into a 4-bit ADPCM sample.
   * @param {number} sample The sample.
   * @return {number}
   * @private
   */
  function encodeSample_(sample) {
    /** @type {number} */
    var delta = sample - encoderPredicted_;
    /** @type {number} */
    var value = 0;
    if (delta >= 0) {
      value = 0;
    } else {
      value = 8;
      delta = -delta;
    }
    /** @type {number} */
    var step = STEP_TABLE[encoderIndex_];
    /** @type {number} */
    var diff = step >> 3;
    if (delta > step) {
      value |= 4;
      delta -= step;
      diff += step;
    }
    step >>= 1;
    if (delta > step) {
      value |= 2;
      delta -= step;
      diff += step;
    }
    step >>= 1;
    if (delta > step) {
      value |= 1;
      diff += step;
    }
    updateEncoder_(value, diff);
    return value;
  }

  /**
   * Set the value for encoderPredicted_ and encoderIndex_
   * after each sample is compressed.
   * @param {number} value The compressed ADPCM sample
   * @param {number} diff The calculated difference
   * @private
   */
  function updateEncoder_(value, diff) {
    if (value & 8) {
      encoderPredicted_ -= diff;
    } else {
      encoderPredicted_ += diff;
    }
    if (encoderPredicted_ < -0x8000) {
      encoderPredicted_ = -0x8000;
    } else if (encoderPredicted_ > 0x7fff) {
      encoderPredicted_ = 0x7fff;
    }
    encoderIndex_ += INDEX_TABLE[value & 7];
    if (encoderIndex_ < 0) {
      encoderIndex_ = 0;
    } else if (encoderIndex_ > 88) {
      encoderIndex_ = 88;
    }
  }

  /**
   * Decode a 4-bit ADPCM sample into a 16-bit PCM sample.
   * @param {number} nibble A 4-bit adpcm sample.
   * @return {number}
   * @private
   */
  function decodeSample_(nibble) {
    /** @type {number} */
    var difference = 0;
    if (nibble & 4) {
      difference += decoderStep_;
    }
    if (nibble & 2) {
      difference += decoderStep_ >> 1;
    }
    if (nibble & 1) {
      difference += decoderStep_ >> 2;
    }
    difference += decoderStep_ >> 3;
    if (nibble & 8) {
      difference = -difference;
    }
    decoderPredicted_ += difference;
    if (decoderPredicted_ > 32767) {
      decoderPredicted_ = 32767;
    } else if (decoderPredicted_ < -32767) {
      decoderPredicted_ = -32767;
    }
    updateDecoder_(nibble);
    return decoderPredicted_;
  }

  /**
   * Update the index and step after decoding a sample.
   * @param {number} nibble A 4-bit adpcm sample.
   * @private
   */
  function updateDecoder_(nibble) {
    decoderIndex_ += INDEX_TABLE[nibble];
    if (decoderIndex_ < 0) {
      decoderIndex_ = 0;
    } else if (decoderIndex_ > 88) {
      decoderIndex_ = 88;
    }
    decoderStep_ = STEP_TABLE[decoderIndex_];
  }

  /**
   * Return the head of a ADPCM sample block.
   * @param {number} sample The first sample of the block.
   * @return {!Array<number>}
   * @private
   */
  function blockHead_(sample) {
    encodeSample_(sample);
    /** @type {!Array<number>} */
    var adpcmSamples = [];
    adpcmSamples.push(sample & 0xFF);
    adpcmSamples.push(sample >> 8 & 0xFF);
    adpcmSamples.push(encoderIndex_);
    adpcmSamples.push(0);
    return adpcmSamples;
  }

  /*
   * alawmulaw: A-Law and mu-Law codecs in JavaScript.
   * https://github.com/rochars/alawmulaw
   *
   * Copyright (c) 2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview A-Law codec.
   */

  /** @module alawmulaw/alaw */

  /** @type {!Array<number>} */
  var LOG_TABLE = [1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];

  /**
   * Encode a 16-bit linear PCM sample as 8-bit A-Law.
   * @param {number} sample A 16-bit PCM sample
   * @return {number}
   */
  function encodeSample(sample) {
    /** @type {number} */
    var compandedValue = void 0;
    sample = sample == -32768 ? -32767 : sample;
    /** @type {number} */
    var sign = ~sample >> 8 & 0x80;
    if (!sign) {
      sample = sample * -1;
    }
    if (sample > 32635) {
      sample = 32635;
    }
    if (sample >= 256) {
      /** @type {number} */
      var exponent = LOG_TABLE[sample >> 8 & 0x7F];
      /** @type {number} */
      var mantissa = sample >> exponent + 3 & 0x0F;
      compandedValue = exponent << 4 | mantissa;
    } else {
      compandedValue = sample >> 4;
    }
    return compandedValue ^ (sign ^ 0x55);
  }

  /**
   * Decode a 8-bit A-Law sample as 16-bit PCM.
   * @param {number} aLawSample The 8-bit A-Law sample
   * @return {number}
   */
  function decodeSample(aLawSample) {
    /** @type {number} */
    var sign = 0;
    aLawSample ^= 0x55;
    if (aLawSample & 0x80) {
      aLawSample &= ~(1 << 7);
      sign = -1;
    }
    /** @type {number} */
    var position = ((aLawSample & 0xF0) >> 4) + 4;
    /** @type {number} */
    var decoded = 0;
    if (position != 4) {
      decoded = 1 << position | (aLawSample & 0x0F) << position - 4 | 1 << position - 5;
    } else {
      decoded = aLawSample << 1 | 1;
    }
    decoded = sign === 0 ? decoded : -decoded;
    return decoded * 8 * -1;
  }

  /**
   * Encode 16-bit linear PCM samples as 8-bit A-Law samples.
   * @param {!Int16Array} samples A array of 16-bit PCM samples.
   * @return {!Uint8Array}
   */
  function encode$1(samples) {
    /** @type {!Uint8Array} */
    var aLawSamples = new Uint8Array(samples.length);
    for (var i = 0; i < samples.length; i++) {
      aLawSamples[i] = encodeSample(samples[i]);
    }
    return aLawSamples;
  }

  /**
   * Decode 8-bit A-Law samples into 16-bit linear PCM samples.
   * @param {!Uint8Array} samples A array of 8-bit A-Law samples.
   * @return {!Int16Array}
   */
  function decode$1(samples) {
    /** @type {!Int16Array} */
    var pcmSamples = new Int16Array(samples.length);
    for (var i = 0; i < samples.length; i++) {
      pcmSamples[i] = decodeSample(samples[i]);
    }
    return pcmSamples;
  }

  var alaw = /*#__PURE__*/Object.freeze({
    encodeSample: encodeSample,
    decodeSample: decodeSample,
    encode: encode$1,
    decode: decode$1
  });

  /*
   * alawmulaw: A-Law and mu-Law codecs in JavaScript.
   * https://github.com/rochars/alawmulaw
   *
   * Copyright (c) 2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview mu-Law codec.
   */

  /** @module alawmulaw/mulaw */

  /**
   * @type {number}
   * @private
   */
  var BIAS = 0x84;
  /**
   * @type {number}
   * @private
   */
  var CLIP = 32635;
  /**
   * @type {Array<number>}
   * @private
   */
  var encodeTable = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
  /**
   * @type {Array<number>}
   * @private
   */
  var decodeTable = [0, 132, 396, 924, 1980, 4092, 8316, 16764];

  /**
   * Encode a 16-bit linear PCM sample as 8-bit mu-Law.
   * @param {number} sample A 16-bit PCM sample
   * @return {number}
   */
  function encodeSample$1(sample) {
    /** @type {number} */
    var sign = void 0;
    /** @type {number} */
    var exponent = void 0;
    /** @type {number} */
    var mantissa = void 0;
    /** @type {number} */
    var muLawSample = void 0;
    /** get the sample into sign-magnitude **/
    sign = sample >> 8 & 0x80;
    if (sign != 0) sample = -sample;
    if (sample > CLIP) sample = CLIP;
    /** convert from 16 bit linear to ulaw **/
    sample = sample + BIAS;
    exponent = encodeTable[sample >> 7 & 0xFF];
    mantissa = sample >> exponent + 3 & 0x0F;
    muLawSample = ~(sign | exponent << 4 | mantissa);
    /** return the result **/
    return muLawSample;
  }

  /**
   * Decode a 8-bit mu-Law sample as 16-bit PCM.
   * @param {number} muLawSample The 8-bit mu-Law sample
   * @return {number}
   */
  function decodeSample$1(muLawSample) {
    /** @type {number} */
    var sign = void 0;
    /** @type {number} */
    var exponent = void 0;
    /** @type {number} */
    var mantissa = void 0;
    /** @type {number} */
    var sample = void 0;
    muLawSample = ~muLawSample;
    sign = muLawSample & 0x80;
    exponent = muLawSample >> 4 & 0x07;
    mantissa = muLawSample & 0x0F;
    sample = decodeTable[exponent] + (mantissa << exponent + 3);
    if (sign != 0) sample = -sample;
    return sample;
  }

  /**
   * Encode 16-bit linear PCM samples into 8-bit mu-Law samples.
   * @param {!Int16Array} samples A array of 16-bit PCM samples.
   * @return {!Uint8Array}
   */
  function encode$1$1(samples) {
    /** @type {!Uint8Array} */
    var muLawSamples = new Uint8Array(samples.length);
    for (var i = 0; i < samples.length; i++) {
      muLawSamples[i] = encodeSample$1(samples[i]);
    }
    return muLawSamples;
  }

  /**
   * Decode 8-bit mu-Law samples into 16-bit PCM samples.
   * @param {!Uint8Array} samples A array of 8-bit mu-Law samples.
   * @return {!Int16Array}
   */
  function decode$1$1(samples) {
    /** @type {!Int16Array} */
    var pcmSamples = new Int16Array(samples.length);
    for (var i = 0; i < samples.length; i++) {
      pcmSamples[i] = decodeSample$1(samples[i]);
    }
    return pcmSamples;
  }

  var mulaw = /*#__PURE__*/Object.freeze({
    encodeSample: encodeSample$1,
    decodeSample: decodeSample$1,
    encode: encode$1$1,
    decode: decode$1$1
  });

  /*
   * base64-arraybuffer
   * https://github.com/niklasvh/base64-arraybuffer
   *
   * Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen
   * Licensed under the MIT license.
   */

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
  }

  var encode$2 = function encode(arraybuffer, byteOffset, length) {
      var bytes = new Uint8Array(arraybuffer, byteOffset, length),
          len = bytes.length;
      var base64 = '';

      for (var _i = 0; _i < len; _i += 3) {
          base64 += chars[bytes[_i] >> 2];
          base64 += chars[(bytes[_i] & 3) << 4 | bytes[_i + 1] >> 4];
          base64 += chars[(bytes[_i + 1] & 15) << 2 | bytes[_i + 2] >> 6];
          base64 += chars[bytes[_i + 2] & 63];
      }

      if (len % 3 === 2) {
          base64 = base64.substring(0, base64.length - 1) + '=';
      } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + '==';
      }

      return base64;
  };

  var decode$2 = function decode(base64) {
      var len = base64.length;

      var bufferLength = base64.length * 0.75;
      var p = 0;
      var encoded1 = void 0,
          encoded2 = void 0,
          encoded3 = void 0,
          encoded4 = void 0;

      if (base64[base64.length - 1] === '=') {
          bufferLength--;
          if (base64[base64.length - 2] === '=') {
              bufferLength--;
          }
      }

      var arraybuffer = new ArrayBuffer(bufferLength),
          bytes = new Uint8Array(arraybuffer);

      for (var _i2 = 0; _i2 < len; _i2 += 4) {
          encoded1 = lookup[base64.charCodeAt(_i2)];
          encoded2 = lookup[base64.charCodeAt(_i2 + 1)];
          encoded3 = lookup[base64.charCodeAt(_i2 + 2)];
          encoded4 = lookup[base64.charCodeAt(_i2 + 3)];

          bytes[p++] = encoded1 << 2 | encoded2 >> 4;
          bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
          bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
      }

      return arraybuffer;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  /*
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview A function to swap endianness in byte buffers.
   * @see https://github.com/rochars/endianness
   */

  /**
   * Swap the byte ordering in a buffer. The buffer is modified in place.
   * @param {!Array<number|string>|!Uint8Array} bytes The bytes.
   * @param {number} offset The byte offset.
   * @param {number=} index The start index. Assumes 0.
   * @param {number=} end The end index. Assumes the buffer length.
   * @throws {Error} If the buffer length is not valid.
   */
  function endianness(bytes, offset) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : bytes.length;

    if (end % offset) {
      throw new Error("Bad buffer length.");
    }
    for (; index < end; index += offset) {
      swap(bytes, offset, index);
    }
  }

  /**
   * Swap the byte order of a value in a buffer. The buffer is modified in place.
   * @param {!Array<number|string>|!Uint8Array} bytes The bytes.
   * @param {number} offset The byte offset.
   * @param {number} index The start index.
   * @private
   */
  function swap(bytes, offset, index) {
    offset--;
    for (var x = 0; x < offset; x++) {
      /** @type {number|string} */
      var theByte = bytes[index + x];
      bytes[index + x] = bytes[index + offset];
      bytes[index + offset] = theByte;
      offset--;
    }
  }

  /*
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview Pack and unpack two's complement ints and unsigned ints.
   * @see https://github.com/rochars/byte-data
   */

  /**
   * A class to pack and unpack two's complement ints and unsigned ints.
   */

  var Integer = function () {

    /**
     * @param {number} bits Number of bits used by the data.
     * @param {boolean} signed True for signed types.
     * @throws {Error} if the number of bits is smaller than 1 or greater than 64.
     */
    function Integer(bits, signed) {
      classCallCheck(this, Integer);

      /**
       * The max number of bits used by the data.
       * @type {number}
       * @private
       */
      this.bits = bits;
      /**
       * If this type it is signed or not.
       * @type {boolean}
       * @private
       */
      this.signed = signed;
      /**
       * The number of bytes used by the data.
       * @type {number}
       * @private
       */
      this.offset = 0;
      /**
       * Min value for numbers of this type.
       * @type {number}
       * @private
       */
      this.min = -Infinity;
      /**
       * Max value for numbers of this type.
       * @type {number}
       * @private
       */
      this.max = Infinity;
      /**
       * The practical number of bits used by the data.
       * @type {number}
       * @private
       */
      this.realBits_ = this.bits;
      /**
       * The mask to be used in the last byte.
       * @type {number}
       * @private
       */
      this.lastByteMask_ = 255;
      this.build_();
    }

    /**
     * Read one integer number from a byte buffer.
     * @param {!Uint8Array} bytes An array of bytes.
     * @param {number=} i The index to read.
     * @return {number}
     */


    createClass(Integer, [{
      key: 'read',
      value: function read(bytes) {
        var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var num = 0;
        var x = this.offset - 1;
        while (x > 0) {
          num = bytes[x + i] << x * 8 | num;
          x--;
        }
        num = (bytes[i] | num) >>> 0;
        return this.overflow_(this.sign_(num));
      }

      /**
       * Write one integer number to a byte buffer.
       * @param {!Array<number>} bytes An array of bytes.
       * @param {number} number The number.
       * @param {number=} j The index being written in the byte buffer.
       * @return {number} The next index to write on the byte buffer.
       */

    }, {
      key: 'write',
      value: function write(bytes, number) {
        var j = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        number = this.overflow_(number);
        bytes[j++] = number & 255;
        for (var i = 2; i <= this.offset; i++) {
          bytes[j++] = Math.floor(number / Math.pow(2, (i - 1) * 8)) & 255;
        }
        return j;
      }

      /**
       * Write one integer number to a byte buffer.
       * @param {!Array<number>} bytes An array of bytes.
       * @param {number} number The number.
       * @param {number=} j The index being written in the byte buffer.
       * @return {number} The next index to write on the byte buffer.
       * @private
       */

    }, {
      key: 'writeEsoteric_',
      value: function writeEsoteric_(bytes, number) {
        var j = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        number = this.overflow_(number);
        j = this.writeFirstByte_(bytes, number, j);
        for (var i = 2; i < this.offset; i++) {
          bytes[j++] = Math.floor(number / Math.pow(2, (i - 1) * 8)) & 255;
        }
        if (this.bits > 8) {
          bytes[j++] = Math.floor(number / Math.pow(2, (this.offset - 1) * 8)) & this.lastByteMask_;
        }
        return j;
      }

      /**
       * Read a integer number from a byte buffer by turning int bytes
       * to a string of bits. Used for data with more than 32 bits.
       * @param {!Uint8Array} bytes An array of bytes.
       * @param {number=} i The index to read.
       * @return {number}
       * @private
       */

    }, {
      key: 'readBits_',
      value: function readBits_(bytes) {
        var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var binary = '';
        var j = 0;
        while (j < this.offset) {
          var bits = bytes[i + j].toString(2);
          binary = new Array(9 - bits.length).join('0') + bits + binary;
          j++;
        }
        return this.overflow_(this.sign_(parseInt(binary, 2)));
      }

      /**
       * Build the type.
       * @throws {Error} if the number of bits is smaller than 1 or greater than 64.
       * @private
       */

    }, {
      key: 'build_',
      value: function build_() {
        this.setRealBits_();
        this.setLastByteMask_();
        this.setMinMax_();
        this.offset = this.bits < 8 ? 1 : Math.ceil(this.realBits_ / 8);
        if (this.realBits_ != this.bits || this.bits < 8 || this.bits > 32) {
          this.write = this.writeEsoteric_;
          this.read = this.readBits_;
        }
      }

      /**
       * Sign a number.
       * @param {number} num The number.
       * @return {number}
       * @private
       */

    }, {
      key: 'sign_',
      value: function sign_(num) {
        if (num > this.max) {
          num -= this.max * 2 + 2;
        }
        return num;
      }

      /**
       * Limit the value according to the bit depth in case of
       * overflow or underflow.
       * @param {number} value The data.
       * @return {number}
       * @private
       */

    }, {
      key: 'overflow_',
      value: function overflow_(value) {
        if (value > this.max) {
          throw new Error('Overflow.');
        } else if (value < this.min) {
          throw new Error('Underflow.');
        }
        return value;
      }

      /**
       * Set the minimum and maximum values for the type.
       * @private
       */

    }, {
      key: 'setMinMax_',
      value: function setMinMax_() {
        var max = Math.pow(2, this.bits);
        if (this.signed) {
          this.max = max / 2 - 1;
          this.min = -max / 2;
        } else {
          this.max = max - 1;
          this.min = 0;
        }
      }

      /**
       * Set the practical bit number for data with bit count different
       * from the standard types (8, 16, 32, 40, 48, 64) and more than 8 bits.
       * @private
       */

    }, {
      key: 'setRealBits_',
      value: function setRealBits_() {
        if (this.bits > 8) {
          this.realBits_ = (this.bits - 1 | 7) + 1;
        }
      }

      /**
       * Set the mask that should be used when writing the last byte.
       * @private
       */

    }, {
      key: 'setLastByteMask_',
      value: function setLastByteMask_() {
        var r = 8 - (this.realBits_ - this.bits);
        this.lastByteMask_ = Math.pow(2, r > 0 ? r : 8) - 1;
      }

      /**
       * Write the first byte of a integer number.
       * @param {!Array<number>} bytes An array of bytes.
       * @param {number} number The number.
       * @param {number} j The index being written in the byte buffer.
       * @return {number} The next index to write on the byte buffer.
       * @private
       */

    }, {
      key: 'writeFirstByte_',
      value: function writeFirstByte_(bytes, number, j) {
        if (this.bits < 8) {
          bytes[j++] = number < 0 ? number + Math.pow(2, this.bits) : number;
        } else {
          bytes[j++] = number & 255;
        }
        return j;
      }
    }]);
    return Integer;
  }();

  /*
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview Functions to validate input.
   * @see https://github.com/rochars/byte-data
   */

  /**
   * Validate that the code is a valid ASCII code.
   * @param {number} code The code.
   * @throws {Error} If the code is not a valid ASCII code.
   */


  function validateASCIICode(code) {
    if (code > 127) {
      throw new Error('Bad ASCII code.');
    }
  }

  /**
   * Validate that the value is not null or undefined.
   * @param {number} value The value.
   * @throws {Error} If the value is of type undefined.
   */
  function validateNotUndefined(value) {
    if (value === undefined) {
      throw new Error('Undefined value.');
    }
  }

  /**
   * Validate the type definition.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   */
  function validateType(theType) {
    if (!theType) {
      throw new Error('Undefined type.');
    }
    if (theType.float) {
      validateFloatType_(theType);
    } else {
      validateIntType_(theType);
    }
  }

  /**
   * Validate the type definition of floating point numbers.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   * @private
   */
  function validateFloatType_(theType) {
    if ([16, 32, 64].indexOf(theType.bits) == -1) {
      throw new Error('Bad float type.');
    }
  }

  /**
   * Validate the type definition of integers.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   * @private
   */
  function validateIntType_(theType) {
    if (theType.bits < 1 || theType.bits > 53) {
      throw new Error('Bad type definition.');
    }
  }

  /*
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * Use a Typed Array to check if the host is BE or LE. This will impact
   * on how 64-bit floating point numbers are handled.
   * @type {boolean}
   * @private
   */
  var BE_ENV = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12;
  var HIGH = BE_ENV ? 1 : 0;
  var LOW = BE_ENV ? 0 : 1;

  /**
   * @type {!Int8Array}
   * @private
   */
  var int8_ = new Int8Array(8);
  /**
   * @type {!Uint32Array}
   * @private
   */
  var ui32_ = new Uint32Array(int8_.buffer);
  /**
   * @type {!Float32Array}
   * @private
   */
  var f32_ = new Float32Array(int8_.buffer);
  /**
   * @type {!Float64Array}
   * @private
   */
  var f64_ = new Float64Array(int8_.buffer);
  /**
   * @type {Function}
   * @private
   */
  var reader_ = void 0;
  /**
   * @type {Function}
   * @private
   */
  var writer_ = void 0;
  /**
   * @type {Object}
   * @private
   */
  var gInt_ = {};

  /**
   * Validate the type and set up the packing/unpacking functions.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   * @private
   */
  function setUp_(theType) {
    validateType(theType);
    theType.offset = theType.bits < 8 ? 1 : Math.ceil(theType.bits / 8);
    theType.be = theType.be || false;
    setReader(theType);
    setWriter(theType);
    gInt_ = new Integer(theType.bits == 64 ? 32 : theType.bits, theType.float ? false : theType.signed);
  }

  /**
   * Turn numbers to bytes.
   * @param {number} value The value to be packed.
   * @param {!Object} theType The type definition.
   * @param {!Uint8Array|!Array<number>} buffer The buffer to write the bytes to.
   * @param {number} index The index to start writing.
   * @param {number} len The end index.
   * @param {!Function} validate The function used to validate input.
   * @param {boolean} be True if big-endian.
   * @return {number} the new index to be written.
   * @private
   */
  function writeBytes_(value, theType, buffer, index, len, validate, be) {
    while (index < len) {
      validate(value, theType);
      index = writer_(buffer, value, index);
    }
    if (be) {
      endianness(buffer, theType.offset, index - theType.offset, index);
    }
    return index;
  }

  /**
   * Read int values from bytes.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} i The index to read.
   * @return {number}
   * @private
   */
  function readInt_(bytes, i) {
    return gInt_.read(bytes, i);
  }

  /**
   * Read 1 16-bit float from bytes.
   * Thanks https://stackoverflow.com/a/8796597
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} i The index to read.
   * @return {number}
   * @private
   */
  function read16F_(bytes, i) {
    /** @type {number} */
    var int = gInt_.read(bytes, i);
    /** @type {number} */
    var exponent = (int & 0x7C00) >> 10;
    /** @type {number} */
    var fraction = int & 0x03FF;
    /** @type {number} */
    var floatValue = void 0;
    if (exponent) {
      floatValue = Math.pow(2, exponent - 15) * (1 + fraction / 0x400);
    } else {
      floatValue = 6.103515625e-5 * (fraction / 0x400);
    }
    return floatValue * (int >> 15 ? -1 : 1);
  }

  /**
   * Read 1 32-bit float from bytes.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} i The index to read.
   * @return {number}
   * @private
   */
  function read32F_(bytes, i) {
    ui32_[0] = gInt_.read(bytes, i);
    return f32_[0];
  }

  /**
   * Read 1 64-bit float from bytes.
   * Thanks https://gist.github.com/kg/2192799
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} i The index to read.
   * @return {number}
   * @private
   */
  function read64F_(bytes, i) {
    ui32_[HIGH] = gInt_.read(bytes, i);
    ui32_[LOW] = gInt_.read(bytes, i + 4);
    return f64_[0];
  }

  /**
   * Write a integer value to a byte buffer.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} number The number to write as bytes.
   * @param {number} j The index being written in the byte buffer.
   * @return {!number} The next index to write on the byte buffer.
   * @private
   */
  function writeInt_(bytes, number, j) {
    return gInt_.write(bytes, number, j);
  }

  /**
   * Write one 16-bit float as a binary value.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} number The number to write as bytes.
   * @param {number} j The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @private
   */
  function write16F_(bytes, number, j) {
    f32_[0] = number;
    /** @type {number} */
    var x = ui32_[0];
    /** @type {number} */
    var bits = x >> 16 & 0x8000;
    /** @type {number} */
    var m = x >> 12 & 0x07ff;
    /** @type {number} */
    var e = x >> 23 & 0xff;
    if (e >= 103) {
      bits |= e - 112 << 10 | m >> 1;
      bits += m & 1;
    }
    bytes[j++] = bits & 0xFF;
    bytes[j++] = bits >>> 8 & 0xFF;
    return j;
  }

  /**
   * Write one 32-bit float as a binary value.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} number The number to write as bytes.
   * @param {number} j The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @private
   */
  function write32F_(bytes, number, j) {
    f32_[0] = number;
    return gInt_.write(bytes, ui32_[0], j);
  }

  /**
   * Write one 64-bit float as a binary value.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} number The number to write as bytes.
   * @param {number} j The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @private
   */
  function write64F_(bytes, number, j) {
    f64_[0] = number;
    j = gInt_.write(bytes, ui32_[HIGH], j);
    return gInt_.write(bytes, ui32_[LOW], j);
  }

  /**
   * Set the function to unpack the data.
   * @param {!Object} theType The type definition.
   * @private
   */
  function setReader(theType) {
    if (theType.float) {
      if (theType.bits == 16) {
        reader_ = read16F_;
      } else if (theType.bits == 32) {
        reader_ = read32F_;
      } else if (theType.bits == 64) {
        reader_ = read64F_;
      }
    } else {
      reader_ = readInt_;
    }
  }

  /**
   * Set the function to pack the data.
   * @param {!Object} theType The type definition.
   * @private
   */
  function setWriter(theType) {
    if (theType.float) {
      if (theType.bits == 16) {
        writer_ = write16F_;
      } else if (theType.bits == 32) {
        writer_ = write32F_;
      } else if (theType.bits == 64) {
        writer_ = write64F_;
      }
    } else {
      writer_ = writeInt_;
    }
  }

  /*
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  // ASCII characters
  /**
   * Read a string of ASCII characters from a byte buffer.
   * @param {!Uint8Array} bytes A byte buffer.
   * @param {number=} index The index to read.
   * @param {?number=} len The number of bytes to read.
   * @return {string}
   * @throws {Error} If a character in the string is not valid ASCII.
   */
  function unpackString(bytes) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var chrs = '';
    len = len ? index + len : bytes.length;
    while (index < len) {
      validateASCIICode(bytes[index]);
      chrs += String.fromCharCode(bytes[index]);
      index++;
    }
    return chrs;
  }

  /**
   * Write a string of ASCII characters as a byte buffer.
   * @param {string} str The string to pack.
   * @return {!Array<number>} The next index to write on the buffer.
   * @throws {Error} If a character in the string is not valid ASCII.
   */
  function packString(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      validateASCIICode(code);
      bytes[i] = code;
    }
    return bytes;
  }

  /**
   * Write a string of ASCII characters to a byte buffer.
   * @param {string} str The string to pack.
   * @param {!Uint8Array|!Array<number>} buffer The output buffer.
   * @param {number=} index The index to write in the buffer.
   * @return {number} The next index to write in the buffer.
   * @throws {Error} If a character in the string is not valid ASCII.
   */
  function packStringTo(str, buffer) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      validateASCIICode(code);
      buffer[index] = code;
      index++;
    }
    return index;
  }

  // Numbers
  /**
   * Pack a number as a byte buffer.
   * @param {number} value The number.
   * @param {!Object} theType The type definition.
   * @return {!Array<number>} The packed value.
   * @throws {Error} If the type definition is not valid.
   * @throws {Error} If the value is not valid.
   */
  function pack(value, theType) {
    var output = [];
    packTo(value, theType, output);
    return output;
  }

  /**
   * Pack a number to a byte buffer.
   * @param {number} value The value.
   * @param {!Object} theType The type definition.
   * @param {!Uint8Array|!Array<number>} buffer The output buffer.
   * @param {number=} index The index to write.
   * @return {number} The next index to write.
   * @throws {Error} If the type definition is not valid.
   * @throws {Error} If the value is not valid.
   */
  function packTo(value, theType, buffer) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    setUp_(theType);
    return writeBytes_(value, theType, buffer, index, index + theType.offset, validateNotUndefined, theType.be);
  }

  /**
   * Pack a array of numbers to a byte buffer.
   * @param {!Array<number>|!TypedArray} values The value.
   * @param {!Object} theType The type definition.
   * @param {!Uint8Array|!Array<number>} buffer The output buffer.
   * @param {number=} index The buffer index to write.
   * @return {number} The next index to write.
   * @throws {Error} If the type definition is not valid.
   * @throws {Error} If the value is not valid.
   */
  function packArrayTo(values, theType, buffer) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    setUp_(theType);
    var be = theType.be;
    var offset = theType.offset;
    var len = values.length;
    for (var i = 0; i < len; i++) {
      index = writeBytes_(values[i], theType, buffer, index, index + offset, validateNotUndefined, be);
    }
    return index;
  }

  /**
   * Unpack an array of numbers from a byte buffer.
   * @param {!Uint8Array} buffer The byte buffer.
   * @param {!Object} theType The type definition.
   * @return {!Array<number>}
   * @throws {Error} If the type definition is not valid.
   */
  function unpackArray(buffer, theType) {
    return unpackArrayFrom(buffer, theType);
  }

  /**
   * Unpack a number from a byte buffer by index.
   * @param {!Uint8Array} buffer The byte buffer.
   * @param {!Object} theType The type definition.
   * @param {number=} index The buffer index to read.
   * @return {number}
   * @throws {Error} If the type definition is not valid
   */
  function unpackFrom(buffer, theType) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    setUp_(theType);
    if (theType.be) {
      endianness(buffer, theType.offset, index, index + theType.offset);
    }
    var value = reader_(buffer, index);
    if (theType.be) {
      endianness(buffer, theType.offset, index, index + theType.offset);
    }
    return value;
  }

  /**
   * Unpack a array of numbers from a byte buffer by index.
   * @param {!Uint8Array} buffer The byte buffer.
   * @param {!Object} theType The type definition.
   * @param {number=} index The start index. Assumes 0.
   * @param {?number=} end The end index. Assumes the buffer length.
   * @return {!Array<number>}
   * @throws {Error} If the type definition is not valid
   */
  function unpackArrayFrom(buffer, theType) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    setUp_(theType);
    var len = end || buffer.length;
    while ((len - index) % theType.offset) {
      len--;
    }
    if (theType.be) {
      endianness(buffer, theType.offset, index, len);
    }
    var values = [];
    var step = theType.offset;
    for (var i = index; i < len; i += step) {
      values.push(reader_(buffer, i));
    }
    if (theType.be) {
      endianness(buffer, theType.offset, index, len);
    }
    return values;
  }

  /**
   * Unpack a array of numbers to a typed array.
   * @param {!Uint8Array} buffer The byte buffer.
   * @param {!Object} theType The type definition.
   * @param {!TypedArray} output The output array.
   * @param {number=} index The start index. Assumes 0.
   * @param {?number=} end The end index. Assumes the buffer length.
   * @throws {Error} If the type definition is not valid
   */
  function unpackArrayTo(buffer, theType, output) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var end = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    setUp_(theType);
    var len = end || buffer.length;
    while ((len - index) % theType.offset) {
      len--;
    }
    if (theType.be) {
      endianness(buffer, theType.offset, index, len);
    }
    var outputIndex = 0;
    var step = theType.offset;
    for (var i = index; i < len; i += step) {
      output.set([reader_(buffer, i)], outputIndex);
      outputIndex++;
    }
    if (theType.be) {
      endianness(buffer, theType.offset, index, len);
    }
  }

  /*
   * Copyright (c) 2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview A tool to create wav file headers.
   * @see https://github.com/rochars/wavefile
   */

  /**
   * Audio formats.
   * Formats not listed here will be set to 65534,
   * the code for WAVE_FORMAT_EXTENSIBLE
   * @enum {number}
   * @private
   */
  var AUDIO_FORMATS = {
    '4': 17,
    '8': 1,
    '8a': 6,
    '8m': 7,
    '16': 1,
    '24': 1,
    '32': 1,
    '32f': 3,
    '64': 3
  };

  /**
   * Return the header for a wav file.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  function wavHeader(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
    var header = {};
    if (bitDepthCode == '4') {
      header = createADPCMHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
    } else if (bitDepthCode == '8a' || bitDepthCode == '8m') {
      header = createALawMulawHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
    } else if (Object.keys(AUDIO_FORMATS).indexOf(bitDepthCode) == -1 || numChannels > 2) {
      header = createExtensibleHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
    } else {
      header = createPCMHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
    }
    return header;
  }

  /**
   * Create the header of a linear PCM wave file.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  function createPCMHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
    return {
      container: options.container,
      chunkSize: 36 + samplesLength,
      format: 'WAVE',
      fmt: {
        chunkId: 'fmt ',
        chunkSize: 16,
        audioFormat: AUDIO_FORMATS[bitDepthCode] ? AUDIO_FORMATS[bitDepthCode] : 65534,
        numChannels: numChannels,
        sampleRate: sampleRate,
        byteRate: numChannels * numBytes * sampleRate,
        blockAlign: numChannels * numBytes,
        bitsPerSample: parseInt(bitDepthCode, 10),
        cbSize: 0,
        validBitsPerSample: 0,
        dwChannelMask: 0,
        subformat: []
      }
    };
  }

  /**
   * Create the header of a ADPCM wave file.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  function createADPCMHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
    var header = createPCMHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
    header.chunkSize = 40 + samplesLength;
    header.fmt.chunkSize = 20;
    header.fmt.byteRate = 4055;
    header.fmt.blockAlign = 256;
    header.fmt.bitsPerSample = 4;
    header.fmt.cbSize = 2;
    header.fmt.validBitsPerSample = 505;
    header.fact = {
      chunkId: 'fact',
      chunkSize: 4,
      dwSampleLength: samplesLength * 2
    };
    return header;
  }

  /**
   * Create the header of WAVE_FORMAT_EXTENSIBLE file.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  function createExtensibleHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
    var header = createPCMHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
    header.chunkSize = 36 + 24 + samplesLength;
    header.fmt.chunkSize = 40;
    header.fmt.bitsPerSample = (parseInt(bitDepthCode, 10) - 1 | 7) + 1;
    header.fmt.cbSize = 22;
    header.fmt.validBitsPerSample = parseInt(bitDepthCode, 10);
    header.fmt.dwChannelMask = getDwChannelMask_(numChannels);
    // subformat 128-bit GUID as 4 32-bit values
    // only supports uncompressed integer PCM samples
    header.fmt.subformat = [1, 1048576, 2852126848, 1905997824];
    return header;
  }

  /**
   * Create the header of mu-Law and A-Law wave files.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  function createALawMulawHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
    var header = createPCMHeader_(bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
    header.chunkSize = 40 + samplesLength;
    header.fmt.chunkSize = 20;
    header.fmt.cbSize = 2;
    header.fmt.validBitsPerSample = 8;
    header.fact = {
      chunkId: 'fact',
      chunkSize: 4,
      dwSampleLength: samplesLength
    };
    return header;
  }

  /**
   * Get the value for dwChannelMask according to the number of channels.
   * @return {number} the dwChannelMask value.
   * @private
   */
  function getDwChannelMask_(numChannels) {
    /** @type {number} */
    var dwChannelMask = 0;
    // mono = FC
    if (numChannels === 1) {
      dwChannelMask = 0x4;
      // stereo = FL, FR
    } else if (numChannels === 2) {
      dwChannelMask = 0x3;
      // quad = FL, FR, BL, BR
    } else if (numChannels === 4) {
      dwChannelMask = 0x33;
      // 5.1 = FL, FR, FC, LF, BL, BR
    } else if (numChannels === 6) {
      dwChannelMask = 0x3F;
      // 7.1 = FL, FR, FC, LF, BL, BR, SL, SR
    } else if (numChannels === 8) {
      dwChannelMask = 0x63F;
    }
    return dwChannelMask;
  }

  /*
   * riff-chunks: Read and write the chunks of RIFF and RIFX files.
   * https://github.com/rochars/riff-chunks
   *
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /** @private */
  var uInt32_ = { bits: 32 };
  /** @type {number} */
  var head_ = 0;

  /**
   * Return the chunks in a RIFF/RIFX file.
   * @param {!Uint8Array} buffer The file bytes.
   * @return {!Object} The RIFF chunks.
   */
  function riffChunks(buffer) {
      head_ = 0;
      var chunkId = getChunkId_(buffer, 0);
      uInt32_.be = chunkId == 'RIFX';
      var format = unpackString(buffer, 8, 4);
      head_ += 4;
      return {
          chunkId: chunkId,
          chunkSize: getChunkSize_(buffer, 0),
          format: format,
          subChunks: getSubChunksIndex_(buffer)
      };
  }

  /**
   * Return the sub chunks of a RIFF file.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @return {!Array<Object>} The subchunks of a RIFF/RIFX or LIST chunk.
   * @private
   */
  function getSubChunksIndex_(buffer) {
      var chunks = [];
      var i = head_;
      while (i <= buffer.length - 8) {
          chunks.push(getSubChunkIndex_(buffer, i));
          i += 8 + chunks[chunks.length - 1].chunkSize;
          i = i % 2 ? i + 1 : i;
      }
      return chunks;
  }

  /**
   * Return a sub chunk from a RIFF file.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @param {number} index The start index of the chunk.
   * @return {!Object} A subchunk of a RIFF/RIFX or LIST chunk.
   * @private
   */
  function getSubChunkIndex_(buffer, index) {
      var chunk = {
          chunkId: getChunkId_(buffer, index),
          chunkSize: getChunkSize_(buffer, index)
      };
      if (chunk.chunkId == 'LIST') {
          chunk.format = unpackString(buffer, index + 8, 4);
          head_ += 4;
          chunk.subChunks = getSubChunksIndex_(buffer);
      } else {
          var realChunkSize = chunk.chunkSize % 2 ? chunk.chunkSize + 1 : chunk.chunkSize;
          head_ = index + 8 + realChunkSize;
          chunk.chunkData = {
              start: index + 8,
              end: head_
          };
      }
      return chunk;
  }

  /**
   * Return the fourCC_ of a chunk.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @param {number} index The start index of the chunk.
   * @return {string} The id of the chunk.
   * @private
   */
  function getChunkId_(buffer, index) {
      head_ += 4;
      return unpackString(buffer, index, 4);
  }

  /**
   * Return the size of a chunk.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @param {number} index The start index of the chunk.
   * @return {number} The size of the chunk without the id and size fields.
   * @private
   */
  function getChunkSize_(buffer, index) {
      head_ += 4;
      return unpackFrom(buffer, uInt32_, index + 4);
  }

  /*
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * @fileoverview A class with the data structure of a wav file.
   * @see https://github.com/rochars/wavefile
   */

  /**
   * A class with the data structure of a wav file.
   */
  var WavStruct = function WavStruct() {
    classCallCheck(this, WavStruct);

    /**
     * The container identifier.
     * 'RIFF', 'RIFX' and 'RF64' are supported.
     * @type {string}
     */
    this.container = '';
    /**
     * @type {number}
     */
    this.chunkSize = 0;
    /**
     * The format.
     * Always 'WAVE'.
     * @type {string}
     */
    this.format = '';
    /**
     * The data of the 'fmt' chunk.
     * @type {!Object<string, *>}
     */
    this.fmt = {
      /** @type {string} */
      chunkId: '',
      /** @type {number} */
      chunkSize: 0,
      /** @type {number} */
      audioFormat: 0,
      /** @type {number} */
      numChannels: 0,
      /** @type {number} */
      sampleRate: 0,
      /** @type {number} */
      byteRate: 0,
      /** @type {number} */
      blockAlign: 0,
      /** @type {number} */
      bitsPerSample: 0,
      /** @type {number} */
      cbSize: 0,
      /** @type {number} */
      validBitsPerSample: 0,
      /** @type {number} */
      dwChannelMask: 0,
      /**
       * 4 32-bit values representing a 128-bit ID
       * @type {!Array<number>}
       */
      subformat: []
    };
    /**
     * The data of the 'fact' chunk.
     * @type {!Object<string, *>}
     */
    this.fact = {
      /** @type {string} */
      chunkId: '',
      /** @type {number} */
      chunkSize: 0,
      /** @type {number} */
      dwSampleLength: 0
    };
    /**
     * The data of the 'cue ' chunk.
     * @type {!Object<string, *>}
     */
    this.cue = {
      /** @type {string} */
      chunkId: '',
      /** @type {number} */
      chunkSize: 0,
      /** @type {number} */
      dwCuePoints: 0,
      /** @type {!Array<!Object>} */
      points: []
    };
    /**
     * The data of the 'smpl' chunk.
     * @type {!Object<string, *>}
     */
    this.smpl = {
      /** @type {string} */
      chunkId: '',
      /** @type {number} */
      chunkSize: 0,
      /** @type {number} */
      dwManufacturer: 0,
      /** @type {number} */
      dwProduct: 0,
      /** @type {number} */
      dwSamplePeriod: 0,
      /** @type {number} */
      dwMIDIUnityNote: 0,
      /** @type {number} */
      dwMIDIPitchFraction: 0,
      /** @type {number} */
      dwSMPTEFormat: 0,
      /** @type {number} */
      dwSMPTEOffset: 0,
      /** @type {number} */
      dwNumSampleLoops: 0,
      /** @type {number} */
      dwSamplerData: 0,
      /** @type {!Array<!Object>} */
      loops: []
    };
    /**
     * The data of the 'bext' chunk.
     * @type {!Object<string, *>}
     */
    this.bext = {
      /** @type {string} */
      chunkId: '',
      /** @type {number} */
      chunkSize: 0,
      /** @type {string} */
      description: '', //256
      /** @type {string} */
      originator: '', //32
      /** @type {string} */
      originatorReference: '', //32
      /** @type {string} */
      originationDate: '', //10
      /** @type {string} */
      originationTime: '', //8
      /**
       * 2 32-bit values, timeReference high and low
       * @type {!Array<number>}
       */
      timeReference: [0, 0],
      /** @type {number} */
      version: 0, //WORD
      /** @type {string} */
      UMID: '', // 64 chars
      /** @type {number} */
      loudnessValue: 0, //WORD
      /** @type {number} */
      loudnessRange: 0, //WORD
      /** @type {number} */
      maxTruePeakLevel: 0, //WORD
      /** @type {number} */
      maxMomentaryLoudness: 0, //WORD
      /** @type {number} */
      maxShortTermLoudness: 0, //WORD
      /** @type {string} */
      reserved: '', //180
      /** @type {string} */
      codingHistory: '' // string, unlimited
    };
    /**
     * The data of the 'ds64' chunk.
     * Used only with RF64 files.
     * @type {!Object<string, *>}
     */
    this.ds64 = {
      /** @type {string} */
      chunkId: '',
      /** @type {number} */
      chunkSize: 0,
      /** @type {number} */
      riffSizeHigh: 0, // DWORD
      /** @type {number} */
      riffSizeLow: 0, // DWORD
      /** @type {number} */
      dataSizeHigh: 0, // DWORD
      /** @type {number} */
      dataSizeLow: 0, // DWORD
      /** @type {number} */
      originationTime: 0, // DWORD
      /** @type {number} */
      sampleCountHigh: 0, // DWORD
      /** @type {number} */
      sampleCountLow: 0 // DWORD
      /** @type {number} */
      //'tableLength': 0, // DWORD
      /** @type {!Array<number>} */
      //'table': []
    };
    /**
     * The data of the 'data' chunk.
     * @type {!Object<string, *>}
     */
    this.data = {
      /** @type {string} */
      chunkId: '',
      /** @type {number} */
      chunkSize: 0,
      /** @type {!Uint8Array} */
      samples: new Uint8Array(0)
    };
    /**
     * The data of the 'LIST' chunks.
     * Each item in this list look like this:
     *  {
     *      chunkId: '',
     *      chunkSize: 0,
     *      format: '',
     *      subChunks: []
     *   }
     * @type {!Array<!Object>}
     */
    this.LIST = [];
    /**
     * The data of the 'junk' chunk.
     * @type {!Object<string, *>}
     */
    this.junk = {
      /** @type {string} */
      chunkId: '',
      /** @type {number} */
      chunkSize: 0,
      /** @type {!Array<number>} */
      chunkData: []
    };
  };

  /*
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * A class to read and write wav data.
   * @extends WavStruct
   */

  var WavIO = function (_WavStruct) {
    inherits(WavIO, _WavStruct);

    function WavIO() {
      classCallCheck(this, WavIO);

      /**
       * @type {!Object}
       * @private
       */
      var _this = possibleConstructorReturn(this, (WavIO.__proto__ || Object.getPrototypeOf(WavIO)).call(this));

      _this.uInt16_ = { bits: 16, be: false };
      /**
       * @type {!Object}
       * @private
       */
      _this.uInt32_ = { bits: 32, be: false };
      /**
       * The bit depth code according to the samples.
       * @type {string}
       */
      _this.bitDepth = '0';
      /**
       * @type {number}
       * @private
       */
      _this.head_ = 0;
      /**
       * @type {!Object}
       * @private
       */
      _this.dataType = {};
      return _this;
    }

    /**
     * Write a variable size string as bytes. If the string is smaller
     * than the max size the output array is filled with 0s.
     * @param {string} str The string to be written as bytes.
     * @param {number} maxSize the max size of the string.
     * @return {!Array<number>} The bytes.
     * @private
     */


    createClass(WavIO, [{
      key: 'writeString_',
      value: function writeString_(str, maxSize) {
        var push = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        /** @type {!Array<number>} */
        var bytes = packString(str);
        if (push) {
          for (var i = bytes.length; i < maxSize; i++) {
            bytes.push(0);
          }
        }
        return bytes;
      }

      /**
       * Return the bytes of the 'bext' chunk.
       * @return {!Array<number>} The 'bext' chunk bytes.
       * @private
       */

    }, {
      key: 'getBextBytes_',
      value: function getBextBytes_() {
        /** @type {!Array<number>} */
        var bytes = [];
        this.enforceBext_();
        if (this.bext.chunkId) {
          this.bext.chunkSize = 602 + this.bext.codingHistory.length;
          bytes = bytes.concat(packString(this.bext.chunkId), pack(602 + this.bext.codingHistory.length, this.uInt32_), this.writeString_(this.bext.description, 256), this.writeString_(this.bext.originator, 32), this.writeString_(this.bext.originatorReference, 32), this.writeString_(this.bext.originationDate, 10), this.writeString_(this.bext.originationTime, 8), pack(this.bext.timeReference[0], this.uInt32_), pack(this.bext.timeReference[1], this.uInt32_), pack(this.bext.version, this.uInt16_), this.writeString_(this.bext.UMID, 64), pack(this.bext.loudnessValue, this.uInt16_), pack(this.bext.loudnessRange, this.uInt16_), pack(this.bext.maxTruePeakLevel, this.uInt16_), pack(this.bext.maxMomentaryLoudness, this.uInt16_), pack(this.bext.maxShortTermLoudness, this.uInt16_), this.writeString_(this.bext.reserved, 180), this.writeString_(this.bext.codingHistory, this.bext.codingHistory.length));
        }
        return bytes;
      }

      /**
       * Make sure a 'bext' chunk is created if BWF data was created in a file.
       * @private
       */

    }, {
      key: 'enforceBext_',
      value: function enforceBext_() {
        for (var prop in this.bext) {
          if (this.bext.hasOwnProperty(prop)) {
            if (this.bext[prop] && prop != 'timeReference') {
              this.bext.chunkId = 'bext';
              break;
            }
          }
        }
        if (this.bext.timeReference[0] || this.bext.timeReference[1]) {
          this.bext.chunkId = 'bext';
        }
      }

      /**
       * Return the bytes of the 'ds64' chunk.
       * @return {!Array<number>} The 'ds64' chunk bytes.
       * @private
       */

    }, {
      key: 'getDs64Bytes_',
      value: function getDs64Bytes_() {
        /** @type {!Array<number>} */
        var bytes = [];
        if (this.ds64.chunkId) {
          bytes = bytes.concat(packString(this.ds64.chunkId), pack(this.ds64.chunkSize, this.uInt32_), pack(this.ds64.riffSizeHigh, this.uInt32_), pack(this.ds64.riffSizeLow, this.uInt32_), pack(this.ds64.dataSizeHigh, this.uInt32_), pack(this.ds64.dataSizeLow, this.uInt32_), pack(this.ds64.originationTime, this.uInt32_), pack(this.ds64.sampleCountHigh, this.uInt32_), pack(this.ds64.sampleCountLow, this.uInt32_));
        }
        //if (this.ds64.tableLength) {
        //  ds64Bytes = ds64Bytes.concat(
        //    pack(this.ds64.tableLength, this.uInt32_),
        //    this.ds64.table);
        //}
        return bytes;
      }

      /**
       * Return the bytes of the 'cue ' chunk.
       * @return {!Array<number>} The 'cue ' chunk bytes.
       * @private
       */

    }, {
      key: 'getCueBytes_',
      value: function getCueBytes_() {
        /** @type {!Array<number>} */
        var bytes = [];
        if (this.cue.chunkId) {
          /** @type {!Array<number>} */
          var cuePointsBytes = this.getCuePointsBytes_();
          bytes = bytes.concat(packString(this.cue.chunkId), pack(cuePointsBytes.length + 4, this.uInt32_), pack(this.cue.dwCuePoints, this.uInt32_), cuePointsBytes);
        }
        return bytes;
      }

      /**
       * Return the bytes of the 'cue ' points.
       * @return {!Array<number>} The 'cue ' points as an array of bytes.
       * @private
       */

    }, {
      key: 'getCuePointsBytes_',
      value: function getCuePointsBytes_() {
        /** @type {!Array<number>} */
        var points = [];
        for (var i = 0; i < this.cue.dwCuePoints; i++) {
          points = points.concat(pack(this.cue.points[i].dwName, this.uInt32_), pack(this.cue.points[i].dwPosition, this.uInt32_), packString(this.cue.points[i].fccChunk), pack(this.cue.points[i].dwChunkStart, this.uInt32_), pack(this.cue.points[i].dwBlockStart, this.uInt32_), pack(this.cue.points[i].dwSampleOffset, this.uInt32_));
        }
        return points;
      }

      /**
       * Return the bytes of the 'smpl' chunk.
       * @return {!Array<number>} The 'smpl' chunk bytes.
       * @private
       */

    }, {
      key: 'getSmplBytes_',
      value: function getSmplBytes_() {
        /** @type {!Array<number>} */
        var bytes = [];
        if (this.smpl.chunkId) {
          /** @type {!Array<number>} */
          var smplLoopsBytes = this.getSmplLoopsBytes_();
          bytes = bytes.concat(packString(this.smpl.chunkId), pack(smplLoopsBytes.length + 36, this.uInt32_), pack(this.smpl.dwManufacturer, this.uInt32_), pack(this.smpl.dwProduct, this.uInt32_), pack(this.smpl.dwSamplePeriod, this.uInt32_), pack(this.smpl.dwMIDIUnityNote, this.uInt32_), pack(this.smpl.dwMIDIPitchFraction, this.uInt32_), pack(this.smpl.dwSMPTEFormat, this.uInt32_), pack(this.smpl.dwSMPTEOffset, this.uInt32_), pack(this.smpl.dwNumSampleLoops, this.uInt32_), pack(this.smpl.dwSamplerData, this.uInt32_), smplLoopsBytes);
        }
        return bytes;
      }

      /**
       * Return the bytes of the 'smpl' loops.
       * @return {!Array<number>} The 'smpl' loops as an array of bytes.
       * @private
       */

    }, {
      key: 'getSmplLoopsBytes_',
      value: function getSmplLoopsBytes_() {
        /** @type {!Array<number>} */
        var loops = [];
        for (var i = 0; i < this.smpl.dwNumSampleLoops; i++) {
          loops = loops.concat(pack(this.smpl.loops[i].dwName, this.uInt32_), pack(this.smpl.loops[i].dwType, this.uInt32_), pack(this.smpl.loops[i].dwStart, this.uInt32_), pack(this.smpl.loops[i].dwEnd, this.uInt32_), pack(this.smpl.loops[i].dwFraction, this.uInt32_), pack(this.smpl.loops[i].dwPlayCount, this.uInt32_));
        }
        return loops;
      }

      /**
       * Return the bytes of the 'fact' chunk.
       * @return {!Array<number>} The 'fact' chunk bytes.
       * @private
       */

    }, {
      key: 'getFactBytes_',
      value: function getFactBytes_() {
        /** @type {!Array<number>} */
        var bytes = [];
        if (this.fact.chunkId) {
          bytes = bytes.concat(packString(this.fact.chunkId), pack(this.fact.chunkSize, this.uInt32_), pack(this.fact.dwSampleLength, this.uInt32_));
        }
        return bytes;
      }

      /**
       * Return the bytes of the 'fmt ' chunk.
       * @return {!Array<number>} The 'fmt' chunk bytes.
       * @throws {Error} if no 'fmt ' chunk is present.
       * @private
       */

    }, {
      key: 'getFmtBytes_',
      value: function getFmtBytes_() {
        /** @type {!Array<number>} */
        var fmtBytes = [];
        if (this.fmt.chunkId) {
          return fmtBytes.concat(packString(this.fmt.chunkId), pack(this.fmt.chunkSize, this.uInt32_), pack(this.fmt.audioFormat, this.uInt16_), pack(this.fmt.numChannels, this.uInt16_), pack(this.fmt.sampleRate, this.uInt32_), pack(this.fmt.byteRate, this.uInt32_), pack(this.fmt.blockAlign, this.uInt16_), pack(this.fmt.bitsPerSample, this.uInt16_), this.getFmtExtensionBytes_());
        }
        throw Error('Could not find the "fmt " chunk');
      }

      /**
       * Return the bytes of the fmt extension fields.
       * @return {!Array<number>} The fmt extension bytes.
       * @private
       */

    }, {
      key: 'getFmtExtensionBytes_',
      value: function getFmtExtensionBytes_() {
        /** @type {!Array<number>} */
        var extension = [];
        if (this.fmt.chunkSize > 16) {
          extension = extension.concat(pack(this.fmt.cbSize, this.uInt16_));
        }
        if (this.fmt.chunkSize > 18) {
          extension = extension.concat(pack(this.fmt.validBitsPerSample, this.uInt16_));
        }
        if (this.fmt.chunkSize > 20) {
          extension = extension.concat(pack(this.fmt.dwChannelMask, this.uInt32_));
        }
        if (this.fmt.chunkSize > 24) {
          extension = extension.concat(pack(this.fmt.subformat[0], this.uInt32_), pack(this.fmt.subformat[1], this.uInt32_), pack(this.fmt.subformat[2], this.uInt32_), pack(this.fmt.subformat[3], this.uInt32_));
        }
        return extension;
      }

      /**
       * Return the bytes of the 'LIST' chunk.
       * @return {!Array<number>} The 'LIST' chunk bytes.
       */

    }, {
      key: 'getLISTBytes_',
      value: function getLISTBytes_() {
        /** @type {!Array<number>} */
        var bytes = [];
        for (var i = 0; i < this.LIST.length; i++) {
          /** @type {!Array<number>} */
          var subChunksBytes = this.getLISTSubChunksBytes_(this.LIST[i].subChunks, this.LIST[i].format);
          bytes = bytes.concat(packString(this.LIST[i].chunkId), pack(subChunksBytes.length + 4, this.uInt32_), packString(this.LIST[i].format), subChunksBytes);
        }
        return bytes;
      }

      /**
       * Return the bytes of the sub chunks of a 'LIST' chunk.
       * @param {!Array<!Object>} subChunks The 'LIST' sub chunks.
       * @param {string} format The format of the 'LIST' chunk.
       *    Currently supported values are 'adtl' or 'INFO'.
       * @return {!Array<number>} The sub chunk bytes.
       * @private
       */

    }, {
      key: 'getLISTSubChunksBytes_',
      value: function getLISTSubChunksBytes_(subChunks, format) {
        /** @type {!Array<number>} */
        var bytes = [];
        for (var i = 0; i < subChunks.length; i++) {
          if (format == 'INFO') {
            bytes = bytes.concat(packString(subChunks[i].chunkId), pack(subChunks[i].value.length + 1, this.uInt32_), this.writeString_(subChunks[i].value, subChunks[i].value.length));
            bytes.push(0);
          } else if (format == 'adtl') {
            if (['labl', 'note'].indexOf(subChunks[i].chunkId) > -1) {
              bytes = bytes.concat(packString(subChunks[i].chunkId), pack(subChunks[i].value.length + 4 + 1, this.uInt32_), pack(subChunks[i].dwName, this.uInt32_), this.writeString_(subChunks[i].value, subChunks[i].value.length));
              bytes.push(0);
            } else if (subChunks[i].chunkId == 'ltxt') {
              bytes = bytes.concat(this.getLtxtChunkBytes_(subChunks[i]));
            }
          }
          if (bytes.length % 2) {
            bytes.push(0);
          }
        }
        return bytes;
      }

      /**
       * Return the bytes of a 'ltxt' chunk.
       * @param {!Object} ltxt the 'ltxt' chunk.
       * @return {!Array<number>} The 'ltxt' chunk bytes.
       * @private
       */

    }, {
      key: 'getLtxtChunkBytes_',
      value: function getLtxtChunkBytes_(ltxt) {
        return [].concat(packString(ltxt.chunkId), pack(ltxt.value.length + 20, this.uInt32_), pack(ltxt.dwName, this.uInt32_), pack(ltxt.dwSampleLength, this.uInt32_), pack(ltxt.dwPurposeID, this.uInt32_), pack(ltxt.dwCountry, this.uInt16_), pack(ltxt.dwLanguage, this.uInt16_), pack(ltxt.dwDialect, this.uInt16_), pack(ltxt.dwCodePage, this.uInt16_), this.writeString_(ltxt.value, ltxt.value.length));
      }

      /**
       * Return the bytes of the 'junk' chunk.
       * @return {!Array<number>} The 'junk' chunk bytes.
       * @private
       */

    }, {
      key: 'getJunkBytes_',
      value: function getJunkBytes_() {
        /** @type {!Array<number>} */
        var bytes = [];
        if (this.junk.chunkId) {
          return bytes.concat(packString(this.junk.chunkId), pack(this.junk.chunkData.length, this.uInt32_), this.junk.chunkData);
        }
        return bytes;
      }

      /**
       * Return 'RIFF' if the container is 'RF64', the current container name
       * otherwise. Used to enforce 'RIFF' when RF64 is not allowed.
       * @return {string}
       * @private
       */

    }, {
      key: 'correctContainer_',
      value: function correctContainer_() {
        return this.container == 'RF64' ? 'RIFF' : this.container;
      }

      /**
       * Set the string code of the bit depth based on the 'fmt ' chunk.
       * @private
       */

    }, {
      key: 'bitDepthFromFmt_',
      value: function bitDepthFromFmt_() {
        if (this.fmt.audioFormat === 3 && this.fmt.bitsPerSample === 32) {
          this.bitDepth = '32f';
        } else if (this.fmt.audioFormat === 6) {
          this.bitDepth = '8a';
        } else if (this.fmt.audioFormat === 7) {
          this.bitDepth = '8m';
        } else {
          this.bitDepth = this.fmt.bitsPerSample.toString();
        }
      }

      /**
       * Return a .wav file byte buffer with the data from the WaveFile object.
       * The return value of this method can be written straight to disk.
       * @return {!Uint8Array} The wav file bytes.
       * @private
       */

    }, {
      key: 'createWaveFile_',
      value: function createWaveFile_() {
        /** @type {!Array<!Array<number>>} */
        var fileBody = [this.getJunkBytes_(), this.getDs64Bytes_(), this.getBextBytes_(), this.getFmtBytes_(), this.getFactBytes_(), packString(this.data.chunkId), pack(this.data.samples.length, this.uInt32_), this.data.samples, this.getCueBytes_(), this.getSmplBytes_(), this.getLISTBytes_()];
        /** @type {number} */
        var fileBodyLength = 0;
        for (var i = 0; i < fileBody.length; i++) {
          fileBodyLength += fileBody[i].length;
        }
        /** @type {!Uint8Array} */
        var file = new Uint8Array(fileBodyLength + 12);
        /** @type {number} */
        var index = 0;
        index = packStringTo(this.container, file, index);
        index = packTo(fileBodyLength + 4, this.uInt32_, file, index);
        index = packStringTo(this.format, file, index);
        for (var _i = 0; _i < fileBody.length; _i++) {
          file.set(fileBody[_i], index);
          index += fileBody[_i].length;
        }
        return file;
      }

      /**
       * Update the type definition used to read and write the samples.
       * @private
       */

    }, {
      key: 'updateDataType_',
      value: function updateDataType_() {
        /** @type {!Object} */
        this.dataType = {
          bits: (parseInt(this.bitDepth, 10) - 1 | 7) + 1,
          float: this.bitDepth == '32f' || this.bitDepth == '64',
          signed: this.bitDepth != '8',
          be: this.container == 'RIFX'
        };
        if (['4', '8a', '8m'].indexOf(this.bitDepth) > -1) {
          this.dataType.bits = 8;
          this.dataType.signed = false;
        }
      }

      /**
       * Set up the WaveFile object from a byte buffer.
       * @param {!Uint8Array} buffer The buffer.
       * @param {boolean=} samples True if the samples should be loaded.
       * @throws {Error} If container is not RIFF, RIFX or RF64.
       * @throws {Error} If no 'fmt ' chunk is found.
       * @throws {Error} If no 'data' chunk is found.
       */

    }, {
      key: 'readWavBuffer',
      value: function readWavBuffer(buffer) {
        var samples = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        this.head_ = 0;
        this.clearHeader_();
        this.readRIFFChunk_(buffer);
        /** @type {!Object} */
        var chunk = riffChunks(buffer);
        this.readDs64Chunk_(buffer, chunk.subChunks);
        this.readFmtChunk_(buffer, chunk.subChunks);
        this.readFactChunk_(buffer, chunk.subChunks);
        this.readBextChunk_(buffer, chunk.subChunks);
        this.readCueChunk_(buffer, chunk.subChunks);
        this.readSmplChunk_(buffer, chunk.subChunks);
        this.readDataChunk_(buffer, chunk.subChunks, samples);
        this.readJunkChunk_(buffer, chunk.subChunks);
        this.readLISTChunk_(buffer, chunk.subChunks);
        this.bitDepthFromFmt_();
        this.updateDataType_();
      }

      /**
       * Return the closest greater number of bits for a number of bits that
       * do not fill a full sequence of bytes.
       * @param {string} bitDepthCode The bit depth.
       * @return {string}
       * @private
       */

    }, {
      key: 'realBitDepth_',
      value: function realBitDepth_(bitDepthCode) {
        if (bitDepthCode != '32f') {
          bitDepthCode = ((parseInt(bitDepthCode, 10) - 1 | 7) + 1).toString();
        }
        return bitDepthCode;
      }

      /**
       * Reset attributes that should emptied when a file is
       * created with the fromScratch() or fromBuffer() methods.
       * @private
       */

    }, {
      key: 'clearHeader_',
      value: function clearHeader_() {
        this.fmt.cbSize = 0;
        this.fmt.validBitsPerSample = 0;
        this.fact.chunkId = '';
        this.ds64.chunkId = '';
      }

      /**
       * Set up to work wih big-endian or little-endian files.
       * The types used are changed to LE or BE. If the
       * the file is big-endian (RIFX), true is returned.
       * @return {boolean} True if the file is RIFX.
       * @private
       */

    }, {
      key: 'LEorBE_',
      value: function LEorBE_() {
        /** @type {boolean} */
        var bigEndian = this.container === 'RIFX';
        this.uInt16_.be = bigEndian;
        this.uInt32_.be = bigEndian;
        return bigEndian;
      }

      /**
       * Find a chunk by its fourCC_ in a array of RIFF chunks.
       * @param {!Object} chunks The wav file chunks.
       * @param {string} chunkId The chunk fourCC_.
       * @param {boolean} multiple True if there may be multiple chunks
       *    with the same chunkId.
       * @return {?Array<!Object>}
       * @private
       */

    }, {
      key: 'findChunk_',
      value: function findChunk_(chunks, chunkId) {
        var multiple = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        /** @type {!Array<!Object>} */
        var chunk = [];
        for (var i = 0; i < chunks.length; i++) {
          if (chunks[i].chunkId == chunkId) {
            if (multiple) {
              chunk.push(chunks[i]);
            } else {
              return chunks[i];
            }
          }
        }
        if (chunkId == 'LIST') {
          return chunk.length ? chunk : null;
        }
        return null;
      }

      /**
       * Read the RIFF chunk a wave file.
       * @param {!Uint8Array} bytes A wav buffer.
       * @throws {Error} If no 'RIFF' chunk is found.
       * @private
       */

    }, {
      key: 'readRIFFChunk_',
      value: function readRIFFChunk_(bytes) {
        this.head_ = 0;
        this.container = this.readString_(bytes, 4);
        if (['RIFF', 'RIFX', 'RF64'].indexOf(this.container) === -1) {
          throw Error('Not a supported format.');
        }
        this.LEorBE_();
        this.chunkSize = this.read_(bytes, this.uInt32_);
        this.format = this.readString_(bytes, 4);
        if (this.format != 'WAVE') {
          throw Error('Could not find the "WAVE" format identifier');
        }
      }

      /**
       * Read the 'fmt ' chunk of a wave file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @throws {Error} If no 'fmt ' chunk is found.
       * @private
       */

    }, {
      key: 'readFmtChunk_',
      value: function readFmtChunk_(buffer, signature) {
        /** @type {?Object} */
        var chunk = this.findChunk_(signature, 'fmt ');
        if (chunk) {
          this.head_ = chunk.chunkData.start;
          this.fmt.chunkId = chunk.chunkId;
          this.fmt.chunkSize = chunk.chunkSize;
          this.fmt.audioFormat = this.read_(buffer, this.uInt16_);
          this.fmt.numChannels = this.read_(buffer, this.uInt16_);
          this.fmt.sampleRate = this.read_(buffer, this.uInt32_);
          this.fmt.byteRate = this.read_(buffer, this.uInt32_);
          this.fmt.blockAlign = this.read_(buffer, this.uInt16_);
          this.fmt.bitsPerSample = this.read_(buffer, this.uInt16_);
          this.readFmtExtension_(buffer);
        } else {
          throw Error('Could not find the "fmt " chunk');
        }
      }

      /**
       * Read the 'fmt ' chunk extension.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @private
       */

    }, {
      key: 'readFmtExtension_',
      value: function readFmtExtension_(buffer) {
        if (this.fmt.chunkSize > 16) {
          this.fmt.cbSize = this.read_(buffer, this.uInt16_);
          if (this.fmt.chunkSize > 18) {
            this.fmt.validBitsPerSample = this.read_(buffer, this.uInt16_);
            if (this.fmt.chunkSize > 20) {
              this.fmt.dwChannelMask = this.read_(buffer, this.uInt32_);
              this.fmt.subformat = [this.read_(buffer, this.uInt32_), this.read_(buffer, this.uInt32_), this.read_(buffer, this.uInt32_), this.read_(buffer, this.uInt32_)];
            }
          }
        }
      }

      /**
       * Read the 'fact' chunk of a wav file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @private
       */

    }, {
      key: 'readFactChunk_',
      value: function readFactChunk_(buffer, signature) {
        /** @type {?Object} */
        var chunk = this.findChunk_(signature, 'fact');
        if (chunk) {
          this.head_ = chunk.chunkData.start;
          this.fact.chunkId = chunk.chunkId;
          this.fact.chunkSize = chunk.chunkSize;
          this.fact.dwSampleLength = this.read_(buffer, this.uInt32_);
        }
      }

      /**
       * Read the 'cue ' chunk of a wave file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @private
       */

    }, {
      key: 'readCueChunk_',
      value: function readCueChunk_(buffer, signature) {
        /** @type {?Object} */
        var chunk = this.findChunk_(signature, 'cue ');
        if (chunk) {
          this.head_ = chunk.chunkData.start;
          this.cue.chunkId = chunk.chunkId;
          this.cue.chunkSize = chunk.chunkSize;
          this.cue.dwCuePoints = this.read_(buffer, this.uInt32_);
          for (var i = 0; i < this.cue.dwCuePoints; i++) {
            this.cue.points.push({
              dwName: this.read_(buffer, this.uInt32_),
              dwPosition: this.read_(buffer, this.uInt32_),
              fccChunk: this.readString_(buffer, 4),
              dwChunkStart: this.read_(buffer, this.uInt32_),
              dwBlockStart: this.read_(buffer, this.uInt32_),
              dwSampleOffset: this.read_(buffer, this.uInt32_)
            });
          }
        }
      }

      /**
       * Read the 'smpl' chunk of a wave file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @private
       */

    }, {
      key: 'readSmplChunk_',
      value: function readSmplChunk_(buffer, signature) {
        /** @type {?Object} */
        var chunk = this.findChunk_(signature, 'smpl');
        if (chunk) {
          this.head_ = chunk.chunkData.start;
          this.smpl.chunkId = chunk.chunkId;
          this.smpl.chunkSize = chunk.chunkSize;
          this.smpl.dwManufacturer = this.read_(buffer, this.uInt32_);
          this.smpl.dwProduct = this.read_(buffer, this.uInt32_);
          this.smpl.dwSamplePeriod = this.read_(buffer, this.uInt32_);
          this.smpl.dwMIDIUnityNote = this.read_(buffer, this.uInt32_);
          this.smpl.dwMIDIPitchFraction = this.read_(buffer, this.uInt32_);
          this.smpl.dwSMPTEFormat = this.read_(buffer, this.uInt32_);
          this.smpl.dwSMPTEOffset = this.read_(buffer, this.uInt32_);
          this.smpl.dwNumSampleLoops = this.read_(buffer, this.uInt32_);
          this.smpl.dwSamplerData = this.read_(buffer, this.uInt32_);
          for (var i = 0; i < this.smpl.dwNumSampleLoops; i++) {
            this.smpl.loops.push({
              dwName: this.read_(buffer, this.uInt32_),
              dwType: this.read_(buffer, this.uInt32_),
              dwStart: this.read_(buffer, this.uInt32_),
              dwEnd: this.read_(buffer, this.uInt32_),
              dwFraction: this.read_(buffer, this.uInt32_),
              dwPlayCount: this.read_(buffer, this.uInt32_)
            });
          }
        }
      }

      /**
       * Read the 'data' chunk of a wave file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @param {boolean} samples True if the samples should be loaded.
       * @throws {Error} If no 'data' chunk is found.
       * @private
       */

    }, {
      key: 'readDataChunk_',
      value: function readDataChunk_(buffer, signature, samples) {
        /** @type {?Object} */
        var chunk = this.findChunk_(signature, 'data');
        if (chunk) {
          this.data.chunkId = 'data';
          this.data.chunkSize = chunk.chunkSize;
          if (samples) {
            this.data.samples = buffer.slice(chunk.chunkData.start, chunk.chunkData.end);
          }
        } else {
          throw Error('Could not find the "data" chunk');
        }
      }

      /**
       * Read the 'bext' chunk of a wav file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @private
       */

    }, {
      key: 'readBextChunk_',
      value: function readBextChunk_(buffer, signature) {
        /** @type {?Object} */
        var chunk = this.findChunk_(signature, 'bext');
        if (chunk) {
          this.head_ = chunk.chunkData.start;
          this.bext.chunkId = chunk.chunkId;
          this.bext.chunkSize = chunk.chunkSize;
          this.bext.description = this.readString_(buffer, 256);
          this.bext.originator = this.readString_(buffer, 32);
          this.bext.originatorReference = this.readString_(buffer, 32);
          this.bext.originationDate = this.readString_(buffer, 10);
          this.bext.originationTime = this.readString_(buffer, 8);
          this.bext.timeReference = [this.read_(buffer, this.uInt32_), this.read_(buffer, this.uInt32_)];
          this.bext.version = this.read_(buffer, this.uInt16_);
          this.bext.UMID = this.readString_(buffer, 64);
          this.bext.loudnessValue = this.read_(buffer, this.uInt16_);
          this.bext.loudnessRange = this.read_(buffer, this.uInt16_);
          this.bext.maxTruePeakLevel = this.read_(buffer, this.uInt16_);
          this.bext.maxMomentaryLoudness = this.read_(buffer, this.uInt16_);
          this.bext.maxShortTermLoudness = this.read_(buffer, this.uInt16_);
          this.bext.reserved = this.readString_(buffer, 180);
          this.bext.codingHistory = this.readString_(buffer, this.bext.chunkSize - 602);
        }
      }

      /**
       * Read the 'ds64' chunk of a wave file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @throws {Error} If no 'ds64' chunk is found and the file is RF64.
       * @private
       */

    }, {
      key: 'readDs64Chunk_',
      value: function readDs64Chunk_(buffer, signature) {
        /** @type {?Object} */
        var chunk = this.findChunk_(signature, 'ds64');
        if (chunk) {
          this.head_ = chunk.chunkData.start;
          this.ds64.chunkId = chunk.chunkId;
          this.ds64.chunkSize = chunk.chunkSize;
          this.ds64.riffSizeHigh = this.read_(buffer, this.uInt32_);
          this.ds64.riffSizeLow = this.read_(buffer, this.uInt32_);
          this.ds64.dataSizeHigh = this.read_(buffer, this.uInt32_);
          this.ds64.dataSizeLow = this.read_(buffer, this.uInt32_);
          this.ds64.originationTime = this.read_(buffer, this.uInt32_);
          this.ds64.sampleCountHigh = this.read_(buffer, this.uInt32_);
          this.ds64.sampleCountLow = this.read_(buffer, this.uInt32_);
          //if (this.ds64.chunkSize > 28) {
          //  this.ds64.tableLength = unpack(
          //    chunkData.slice(28, 32), this.uInt32_);
          //  this.ds64.table = chunkData.slice(
          //     32, 32 + this.ds64.tableLength); 
          //}
        } else {
          if (this.container == 'RF64') {
            throw Error('Could not find the "ds64" chunk');
          }
        }
      }

      /**
       * Read the 'LIST' chunks of a wave file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @private
       */

    }, {
      key: 'readLISTChunk_',
      value: function readLISTChunk_(buffer, signature) {
        /** @type {?Object} */
        var listChunks = this.findChunk_(signature, 'LIST', true);
        if (listChunks === null) {
          return;
        }
        for (var j = 0; j < listChunks.length; j++) {
          /** @type {!Object} */
          var subChunk = listChunks[j];
          this.LIST.push({
            chunkId: subChunk.chunkId,
            chunkSize: subChunk.chunkSize,
            format: subChunk.format,
            subChunks: [] });
          for (var x = 0; x < subChunk.subChunks.length; x++) {
            this.readLISTSubChunks_(subChunk.subChunks[x], subChunk.format, buffer);
          }
        }
      }

      /**
       * Read the sub chunks of a 'LIST' chunk.
       * @param {!Object} subChunk The 'LIST' subchunks.
       * @param {string} format The 'LIST' format, 'adtl' or 'INFO'.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @private
       */

    }, {
      key: 'readLISTSubChunks_',
      value: function readLISTSubChunks_(subChunk, format, buffer) {
        if (format == 'adtl') {
          if (['labl', 'note', 'ltxt'].indexOf(subChunk.chunkId) > -1) {
            this.head_ = subChunk.chunkData.start;
            /** @type {!Object<string, string|number>} */
            var item = {
              chunkId: subChunk.chunkId,
              chunkSize: subChunk.chunkSize,
              dwName: this.read_(buffer, this.uInt32_)
            };
            if (subChunk.chunkId == 'ltxt') {
              item.dwSampleLength = this.read_(buffer, this.uInt32_);
              item.dwPurposeID = this.read_(buffer, this.uInt32_);
              item.dwCountry = this.read_(buffer, this.uInt16_);
              item.dwLanguage = this.read_(buffer, this.uInt16_);
              item.dwDialect = this.read_(buffer, this.uInt16_);
              item.dwCodePage = this.read_(buffer, this.uInt16_);
            }
            item.value = this.readZSTR_(buffer, this.head_);
            this.LIST[this.LIST.length - 1].subChunks.push(item);
          }
          // RIFF INFO tags like ICRD, ISFT, ICMT
        } else if (format == 'INFO') {
          this.head_ = subChunk.chunkData.start;
          this.LIST[this.LIST.length - 1].subChunks.push({
            chunkId: subChunk.chunkId,
            chunkSize: subChunk.chunkSize,
            value: this.readZSTR_(buffer, this.head_)
          });
        }
      }

      /**
       * Read the 'junk' chunk of a wave file.
       * @param {!Uint8Array} buffer The wav file buffer.
       * @param {!Object} signature The file signature.
       * @private
       */

    }, {
      key: 'readJunkChunk_',
      value: function readJunkChunk_(buffer, signature) {
        /** @type {?Object} */
        var chunk = this.findChunk_(signature, 'junk');
        if (chunk) {
          this.junk = {
            chunkId: chunk.chunkId,
            chunkSize: chunk.chunkSize,
            chunkData: [].slice.call(buffer.slice(chunk.chunkData.start, chunk.chunkData.end))
          };
        }
      }

      /**
       * Read bytes as a ZSTR string.
       * @param {!Uint8Array} bytes The bytes.
       * @return {string} The string.
       * @private
       */

    }, {
      key: 'readZSTR_',
      value: function readZSTR_(bytes) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        /** @type {string} */
        var str = '';
        for (var i = index; i < bytes.length; i++) {
          this.head_++;
          if (bytes[i] === 0) {
            break;
          }
          str += unpackString(bytes, i, 1);
        }
        return str;
      }

      /**
       * Read bytes as a string from a RIFF chunk.
       * @param {!Uint8Array} bytes The bytes.
       * @param {number} maxSize the max size of the string.
       * @return {string} The string.
       * @private
       */

    }, {
      key: 'readString_',
      value: function readString_(bytes, maxSize) {
        /** @type {string} */
        var str = '';
        for (var i = 0; i < maxSize; i++) {
          str += unpackString(bytes, this.head_, 1);
          this.head_++;
        }
        return str;
      }

      /**
       * Read a number from a chunk.
       * @param {!Uint8Array} bytes The chunk bytes.
       * @param {!Object} bdType The type definition.
       * @return {number} The number.
       * @private
       */

    }, {
      key: 'read_',
      value: function read_(bytes, bdType) {
        /** @type {number} */
        var size = bdType.bits / 8;
        /** @type {number} */
        var value = unpackFrom(bytes, bdType, this.head_);
        this.head_ += size;
        return value;
      }

      /**
       * Truncate float samples on over and underflow.
       * @private
       */

    }, {
      key: 'truncateSamples',
      value: function truncateSamples(samples) {
        if (this.fmt.audioFormat === 3) {
          /** @type {number} */
          var len = samples.length;
          for (var i = 0; i < len; i++) {
            if (samples[i] > 1) {
              samples[i] = 1;
            } else if (samples[i] < -1) {
              samples[i] = -1;
            }
          }
        }
      }
    }]);
    return WavIO;
  }(WavStruct);

  /*
   * Copyright (c) 2017-2018 Rafael da Silva Rocha.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   *
   */

  /**
   * Class representing a wav file.
   * @extends WavIO
   */

  var WaveFile = function (_WavIO) {
    inherits(WaveFile, _WavIO);

    /**
     * @param {?Uint8Array} bytes A wave file buffer.
     * @throws {Error} If no 'RIFF' chunk is found.
     * @throws {Error} If no 'fmt ' chunk is found.
     * @throws {Error} If no 'data' chunk is found.
     */
    function WaveFile() {
      var bytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      classCallCheck(this, WaveFile);

      // Load a file from the buffer if one was passed
      // when creating the object
      var _this = possibleConstructorReturn(this, (WaveFile.__proto__ || Object.getPrototypeOf(WaveFile)).call(this));

      if (bytes) {
        _this.fromBuffer(bytes);
      }
      return _this;
    }

    /**
     * Set up the WaveFile object based on the arguments passed.
     * @param {number} numChannels The number of channels
     *    (Integer numbers: 1 for mono, 2 stereo and so on).
     * @param {number} sampleRate The sample rate.
     *    Integer numbers like 8000, 44100, 48000, 96000, 192000.
     * @param {string} bitDepthCode The audio bit depth code.
     *    One of '4', '8', '8a', '8m', '16', '24', '32', '32f', '64'
     *    or any value between '8' and '32' (like '12').
     * @param {!Array<number>|!Array<!Array<number>>|!ArrayBufferView} samples
     *    The samples. Must be in the correct range according to the bit depth.
     * @param {?Object} options Optional. Used to force the container
     *    as RIFX with {'container': 'RIFX'}
     * @throws {Error} If any argument does not meet the criteria.
     */


    createClass(WaveFile, [{
      key: 'fromScratch',
      value: function fromScratch(numChannels, sampleRate, bitDepthCode, samples) {
        var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

        if (!options.container) {
          options.container = 'RIFF';
        }
        this.container = options.container;
        this.bitDepth = bitDepthCode;
        samples = this.interleave_(samples);
        /** @type {number} */
        var numBytes = ((parseInt(bitDepthCode, 10) - 1 | 7) + 1) / 8;
        this.updateDataType_();
        this.data.samples = new Uint8Array(samples.length * numBytes);
        packArrayTo(samples, this.dataType, this.data.samples);
        /** @type {!Object} */
        var header = wavHeader(bitDepthCode, numChannels, sampleRate, numBytes, this.data.samples.length, options);
        this.clearHeader_();
        this.chunkSize = header.chunkSize;
        this.format = header.format;
        this.fmt = header.fmt;
        if (header.fact) {
          this.fact = header.fact;
        }
        this.data.chunkId = 'data';
        this.data.chunkSize = this.data.samples.length;
        this.validateHeader_();
        this.LEorBE_();
      }

      /**
       * Set up the WaveFile object from a byte buffer.
       * @param {!Uint8Array} bytes The buffer.
       * @param {boolean=} samples True if the samples should be loaded.
       * @throws {Error} If container is not RIFF, RIFX or RF64.
       * @throws {Error} If no 'fmt ' chunk is found.
       * @throws {Error} If no 'data' chunk is found.
       */

    }, {
      key: 'fromBuffer',
      value: function fromBuffer(bytes) {
        var samples = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        this.readWavBuffer(bytes, samples);
      }

      /**
       * Return a byte buffer representig the WaveFile object as a .wav file.
       * The return value of this method can be written straight to disk.
       * @return {!Uint8Array} A .wav file.
       * @throws {Error} If any property of the object appears invalid.
       */

    }, {
      key: 'toBuffer',
      value: function toBuffer() {
        this.validateHeader_();
        return this.createWaveFile_();
      }

      /**
       * Use a .wav file encoded as a base64 string to load the WaveFile object.
       * @param {string} base64String A .wav file as a base64 string.
       * @throws {Error} If any property of the object appears invalid.
       */

    }, {
      key: 'fromBase64',
      value: function fromBase64(base64String) {
        this.fromBuffer(new Uint8Array(decode$2(base64String)));
      }

      /**
       * Return a base64 string representig the WaveFile object as a .wav file.
       * @return {string} A .wav file as a base64 string.
       * @throws {Error} If any property of the object appears invalid.
       */

    }, {
      key: 'toBase64',
      value: function toBase64() {
        /** @type {!Uint8Array} */
        var buffer = this.toBuffer();
        return encode$2(buffer, 0, buffer.length);
      }

      /**
       * Return a DataURI string representig the WaveFile object as a .wav file.
       * The return of this method can be used to load the audio in browsers.
       * @return {string} A .wav file as a DataURI.
       * @throws {Error} If any property of the object appears invalid.
       */

    }, {
      key: 'toDataURI',
      value: function toDataURI() {
        return 'data:audio/wav;base64,' + this.toBase64();
      }

      /**
       * Use a .wav file encoded as a DataURI to load the WaveFile object.
       * @param {string} dataURI A .wav file as DataURI.
       * @throws {Error} If any property of the object appears invalid.
       */

    }, {
      key: 'fromDataURI',
      value: function fromDataURI(dataURI) {
        this.fromBase64(dataURI.replace('data:audio/wav;base64,', ''));
      }

      /**
       * Force a file as RIFF.
       */

    }, {
      key: 'toRIFF',
      value: function toRIFF() {
        if (this.container == 'RF64') {
          this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, this.bitDepth, unpackArray(this.data.samples, this.dataType));
        } else {
          this.dataType.be = true;
          this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, this.bitDepth, unpackArray(this.data.samples, this.dataType));
        }
      }

      /**
       * Force a file as RIFX.
       */

    }, {
      key: 'toRIFX',
      value: function toRIFX() {
        if (this.container == 'RF64') {
          this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, this.bitDepth, unpackArray(this.data.samples, this.dataType), { container: 'RIFX' });
        } else {
          this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, this.bitDepth, unpackArray(this.data.samples, this.dataType), { container: 'RIFX' });
        }
      }

      /**
       * Change the bit depth of the samples.
       * @param {string} newBitDepth The new bit depth of the samples.
       *    One of '8' ... '32' (integers), '32f' or '64' (floats)
       * @param {boolean} changeResolution A boolean indicating if the
       *    resolution of samples should be actually changed or not.
       * @throws {Error} If the bit depth is not valid.
       */

    }, {
      key: 'toBitDepth',
      value: function toBitDepth(newBitDepth) {
        var changeResolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        // @type {string}
        var toBitDepth = newBitDepth;
        // @type {string}
        var thisBitDepth = this.bitDepth;
        if (!changeResolution) {
          toBitDepth = this.realBitDepth_(newBitDepth);
          thisBitDepth = this.realBitDepth_(this.bitDepth);
        }
        this.assureUncompressed_();
        // @type {number}
        var sampleCount = this.data.samples.length / (this.dataType.bits / 8);
        // @type {!Float64Array}
        var typedSamplesInput = new Float64Array(sampleCount + 1);
        // @type {!Float64Array}
        var typedSamplesOutput = new Float64Array(sampleCount + 1);
        unpackArrayTo(this.data.samples, this.dataType, typedSamplesInput);
        this.truncateSamples(typedSamplesInput);
        bitDepth(typedSamplesInput, thisBitDepth, toBitDepth, typedSamplesOutput);
        this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, newBitDepth, typedSamplesOutput, { container: this.correctContainer_() });
      }

      /**
       * Encode a 16-bit wave file as 4-bit IMA ADPCM.
       * @throws {Error} If sample rate is not 8000.
       * @throws {Error} If number of channels is not 1.
       */

    }, {
      key: 'toIMAADPCM',
      value: function toIMAADPCM() {
        if (this.fmt.sampleRate !== 8000) {
          throw new Error('Only 8000 Hz files can be compressed as IMA-ADPCM.');
        } else if (this.fmt.numChannels !== 1) {
          throw new Error('Only mono files can be compressed as IMA-ADPCM.');
        } else {
          this.assure16Bit_();
          var output = new Int16Array(this.data.samples.length / 2);
          unpackArrayTo(this.data.samples, this.dataType, output);
          this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, '4', encode(output), { container: this.correctContainer_() });
        }
      }

      /**
       * Decode a 4-bit IMA ADPCM wave file as a 16-bit wave file.
       * @param {string} bitDepthCode The new bit depth of the samples.
       *    One of '8' ... '32' (integers), '32f' or '64' (floats).
       *    Optional. Default is 16.
       */

    }, {
      key: 'fromIMAADPCM',
      value: function fromIMAADPCM() {
        var bitDepthCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '16';

        this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, '16', decode(this.data.samples, this.fmt.blockAlign), { container: this.correctContainer_() });
        if (bitDepthCode != '16') {
          this.toBitDepth(bitDepthCode);
        }
      }

      /**
       * Encode a 16-bit wave file as 8-bit A-Law.
       */

    }, {
      key: 'toALaw',
      value: function toALaw() {
        this.assure16Bit_();
        var output = new Int16Array(this.data.samples.length / 2);
        unpackArrayTo(this.data.samples, this.dataType, output);
        this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, '8a', alaw.encode(output), { container: this.correctContainer_() });
      }

      /**
       * Decode a 8-bit A-Law wave file into a 16-bit wave file.
       * @param {string} bitDepthCode The new bit depth of the samples.
       *    One of '8' ... '32' (integers), '32f' or '64' (floats).
       *    Optional. Default is 16.
       */

    }, {
      key: 'fromALaw',
      value: function fromALaw() {
        var bitDepthCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '16';

        this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, '16', alaw.decode(this.data.samples), { container: this.correctContainer_() });
        if (bitDepthCode != '16') {
          this.toBitDepth(bitDepthCode);
        }
      }

      /**
       * Encode 16-bit wave file as 8-bit mu-Law.
       */

    }, {
      key: 'toMuLaw',
      value: function toMuLaw() {
        this.assure16Bit_();
        var output = new Int16Array(this.data.samples.length / 2);
        unpackArrayTo(this.data.samples, this.dataType, output);
        this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, '8m', mulaw.encode(output), { container: this.correctContainer_() });
      }

      /**
       * Decode a 8-bit mu-Law wave file into a 16-bit wave file.
       * @param {string} bitDepthCode The new bit depth of the samples.
       *    One of '8' ... '32' (integers), '32f' or '64' (floats).
       *    Optional. Default is 16.
       */

    }, {
      key: 'fromMuLaw',
      value: function fromMuLaw() {
        var bitDepthCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '16';

        this.fromScratch(this.fmt.numChannels, this.fmt.sampleRate, '16', mulaw.decode(this.data.samples), { container: this.correctContainer_() });
        if (bitDepthCode != '16') {
          this.toBitDepth(bitDepthCode);
        }
      }

      /**
       * Write a RIFF tag in the INFO chunk. If the tag do not exist,
       * then it is created. It if exists, it is overwritten.
       * @param {string} tag The tag name.
       * @param {string} value The tag value.
       * @throws {Error} If the tag name is not valid.
       */

    }, {
      key: 'setTag',
      value: function setTag(tag, value) {
        tag = this.fixTagName_(tag);
        /** @type {!Object} */
        var index = this.getTagIndex_(tag);
        if (index.TAG !== null) {
          this.LIST[index.LIST].subChunks[index.TAG].chunkSize = value.length + 1;
          this.LIST[index.LIST].subChunks[index.TAG].value = value;
        } else if (index.LIST !== null) {
          this.LIST[index.LIST].subChunks.push({
            chunkId: tag,
            chunkSize: value.length + 1,
            value: value });
        } else {
          this.LIST.push({
            chunkId: 'LIST',
            chunkSize: 8 + value.length + 1,
            format: 'INFO',
            subChunks: [] });
          this.LIST[this.LIST.length - 1].subChunks.push({
            chunkId: tag,
            chunkSize: value.length + 1,
            value: value });
        }
      }

      /**
       * Return the value of a RIFF tag in the INFO chunk.
       * @param {string} tag The tag name.
       * @return {?string} The value if the tag is found, null otherwise.
       */

    }, {
      key: 'getTag',
      value: function getTag(tag) {
        /** @type {!Object} */
        var index = this.getTagIndex_(tag);
        if (index.TAG !== null) {
          return this.LIST[index.LIST].subChunks[index.TAG].value;
        }
        return null;
      }

      /**
       * Remove a RIFF tag in the INFO chunk.
       * @param {string} tag The tag name.
       * @return {boolean} True if a tag was deleted.
       */

    }, {
      key: 'deleteTag',
      value: function deleteTag(tag) {
        /** @type {!Object} */
        var index = this.getTagIndex_(tag);
        if (index.TAG !== null) {
          this.LIST[index.LIST].subChunks.splice(index.TAG, 1);
          return true;
        }
        return false;
      }

      /**
       * Create a cue point in the wave file.
       * @param {number} position The cue point position in milliseconds.
       * @param {string} labl The LIST adtl labl text of the marker. Optional.
       */

    }, {
      key: 'setCuePoint',
      value: function setCuePoint(position) {
        var labl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        this.cue.chunkId = 'cue ';
        position = position * this.fmt.sampleRate / 1000;
        /** @type {!Array<!Object>} */
        var existingPoints = this.getCuePoints_();
        this.clearLISTadtl_();
        /** @type {number} */
        var len = this.cue.points.length;
        this.cue.points = [];
        /** @type {boolean} */
        var hasSet = false;
        if (len === 0) {
          this.setCuePoint_(position, 1, labl);
        } else {
          for (var i = 0; i < len; i++) {
            if (existingPoints[i].dwPosition > position && !hasSet) {
              this.setCuePoint_(position, i + 1, labl);
              this.setCuePoint_(existingPoints[i].dwPosition, i + 2, existingPoints[i].label);
              hasSet = true;
            } else {
              this.setCuePoint_(existingPoints[i].dwPosition, i + 1, existingPoints[i].label);
            }
          }
          if (!hasSet) {
            this.setCuePoint_(position, this.cue.points.length + 1, labl);
          }
        }
        this.cue.dwCuePoints = this.cue.points.length;
      }

      /**
       * Remove a cue point from a wave file.
       * @param {number} index the index of the point. First is 1,
       *    second is 2, and so on.
       */

    }, {
      key: 'deleteCuePoint',
      value: function deleteCuePoint(index) {
        this.cue.chunkId = 'cue ';
        /** @type {!Array<!Object>} */
        var existingPoints = this.getCuePoints_();
        this.clearLISTadtl_();
        /** @type {number} */
        var len = this.cue.points.length;
        this.cue.points = [];
        for (var i = 0; i < len; i++) {
          if (i + 1 !== index) {
            this.setCuePoint_(existingPoints[i].dwPosition, i + 1, existingPoints[i].label);
          }
        }
        this.cue.dwCuePoints = this.cue.points.length;
        if (this.cue.dwCuePoints) {
          this.cue.chunkId = 'cue ';
        } else {
          this.cue.chunkId = '';
          this.clearLISTadtl_();
        }
      }

      /**
       * Update the label of a cue point.
       * @param {number} pointIndex The ID of the cue point.
       * @param {string} label The new text for the label.
       */

    }, {
      key: 'updateLabel',
      value: function updateLabel(pointIndex, label) {
        /** @type {?number} */
        var adtlIndex = this.getAdtlChunk_();
        if (adtlIndex !== null) {
          for (var i = 0; i < this.LIST[adtlIndex].subChunks.length; i++) {
            if (this.LIST[adtlIndex].subChunks[i].dwName == pointIndex) {
              this.LIST[adtlIndex].subChunks[i].value = label;
            }
          }
        }
      }

      /**
       * Make the file 16-bit if it is not.
       * @private
       */

    }, {
      key: 'assure16Bit_',
      value: function assure16Bit_() {
        this.assureUncompressed_();
        if (this.bitDepth != '16') {
          this.toBitDepth('16');
        }
      }

      /**
       * Uncompress the samples in case of a compressed file.
       * @private
       */

    }, {
      key: 'assureUncompressed_',
      value: function assureUncompressed_() {
        if (this.bitDepth == '8a') {
          this.fromALaw();
        } else if (this.bitDepth == '8m') {
          this.fromMuLaw();
        } else if (this.bitDepth == '4') {
          this.fromIMAADPCM();
        }
      }

      /**
       * Set up the WaveFile object from a byte buffer.
       * @param {!Array<number>|!Array<!Array<number>>|!ArrayBufferView} samples The samples.
       * @private
       */

    }, {
      key: 'interleave_',
      value: function interleave_(samples) {
        if (samples.length > 0) {
          if (samples[0].constructor === Array) {
            /** @type {!Array<number>} */
            var finalSamples = [];
            for (var i = 0; i < samples[0].length; i++) {
              for (var j = 0; j < samples.length; j++) {
                finalSamples.push(samples[j][i]);
              }
            }
            samples = finalSamples;
          }
        }
        return samples;
      }

      /**
       * Push a new cue point in this.cue.points.
       * @param {number} position The position in milliseconds.
       * @param {number} dwName the dwName of the cue point
       * @private
       */

    }, {
      key: 'setCuePoint_',
      value: function setCuePoint_(position, dwName, label) {
        this.cue.points.push({
          dwName: dwName,
          dwPosition: position,
          fccChunk: 'data',
          dwChunkStart: 0,
          dwBlockStart: 0,
          dwSampleOffset: position
        });
        this.setLabl_(dwName, label);
      }

      /**
       * Return an array with the position of all cue points in the file.
       * @return {!Array<!Object>}
       * @private
       */

    }, {
      key: 'getCuePoints_',
      value: function getCuePoints_() {
        /** @type {!Array<!Object>} */
        var points = [];
        for (var i = 0; i < this.cue.points.length; i++) {
          points.push({
            dwPosition: this.cue.points[i].dwPosition,
            label: this.getLabelForCuePoint_(this.cue.points[i].dwName) });
        }
        return points;
      }

      /**
       * Return the label of a cue point.
       * @param {number} pointDwName The ID of the cue point.
       * @return {string}
       * @private
       */

    }, {
      key: 'getLabelForCuePoint_',
      value: function getLabelForCuePoint_(pointDwName) {
        /** @type {?number} */
        var adtlIndex = this.getAdtlChunk_();
        if (adtlIndex !== null) {
          for (var i = 0; i < this.LIST[adtlIndex].subChunks.length; i++) {
            if (this.LIST[adtlIndex].subChunks[i].dwName == pointDwName) {
              return this.LIST[adtlIndex].subChunks[i].value;
            }
          }
        }
        return '';
      }

      /**
       * Clear any LIST chunk labeled as 'adtl'.
       * @private
       */

    }, {
      key: 'clearLISTadtl_',
      value: function clearLISTadtl_() {
        for (var i = 0; i < this.LIST.length; i++) {
          if (this.LIST[i].format == 'adtl') {
            this.LIST.splice(i);
          }
        }
      }

      /**
       * Create a new 'labl' subchunk in a 'LIST' chunk of type 'adtl'.
       * @param {number} dwName The ID of the cue point.
       * @param {string} label The label for the cue point.
       * @private
       */

    }, {
      key: 'setLabl_',
      value: function setLabl_(dwName, label) {
        /** @type {?number} */
        var adtlIndex = this.getAdtlChunk_();
        if (adtlIndex === null) {
          this.LIST.push({
            chunkId: 'LIST',
            chunkSize: 4,
            format: 'adtl',
            subChunks: [] });
          adtlIndex = this.LIST.length - 1;
        }
        this.setLabelText_(adtlIndex === null ? 0 : adtlIndex, dwName, label);
      }

      /**
       * Create a new 'labl' subchunk in a 'LIST' chunk of type 'adtl'.
       * @param {number} adtlIndex The index of the 'adtl' LIST in this.LIST.
       * @param {number} dwName The ID of the cue point.
       * @param {string} label The label for the cue point.
       * @private
       */

    }, {
      key: 'setLabelText_',
      value: function setLabelText_(adtlIndex, dwName, label) {
        this.LIST[adtlIndex].subChunks.push({
          chunkId: 'labl',
          chunkSize: label.length,
          dwName: dwName,
          value: label
        });
        this.LIST[adtlIndex].chunkSize += label.length + 4 + 4 + 4 + 1;
      }

      /**
       * Return the index of the 'adtl' LIST in this.LIST.
       * @return {?number}
       * @private
       */

    }, {
      key: 'getAdtlChunk_',
      value: function getAdtlChunk_() {
        for (var i = 0; i < this.LIST.length; i++) {
          if (this.LIST[i].format == 'adtl') {
            return i;
          }
        }
        return null;
      }

      /**
       * Return the index of a tag in a FILE chunk.
       * @param {string} tag The tag name.
       * @return {!Object<string, ?number>}
       *    Object.LIST is the INFO index in LIST
       *    Object.TAG is the tag index in the INFO
       * @private
       */

    }, {
      key: 'getTagIndex_',
      value: function getTagIndex_(tag) {
        /** @type {!Object<string, ?number>} */
        var index = { LIST: null, TAG: null };
        for (var i = 0; i < this.LIST.length; i++) {
          if (this.LIST[i].format == 'INFO') {
            index.LIST = i;
            for (var j = 0; j < this.LIST[i].subChunks.length; j++) {
              if (this.LIST[i].subChunks[j].chunkId == tag) {
                index.TAG = j;
                break;
              }
            }
            break;
          }
        }
        return index;
      }

      /**
       * Fix a RIFF tag format if possible, throw an error otherwise.
       * @param {string} tag The tag name.
       * @return {string} The tag name in proper fourCC format.
       * @private
       */

    }, {
      key: 'fixTagName_',
      value: function fixTagName_(tag) {
        if (tag.constructor !== String) {
          throw new Error('Invalid tag name.');
        } else if (tag.length < 4) {
          for (var i = 0; i < 4 - tag.length; i++) {
            tag += ' ';
          }
        }
        return tag;
      }

      /**
       * Validate the header of the file.
       * @throws {Error} If any property of the object appears invalid.
       * @private
       */

    }, {
      key: 'validateHeader_',
      value: function validateHeader_() {
        this.validateBitDepth_();
        this.validateNumChannels_();
        this.validateSampleRate_();
      }

      /**
       * Validate the bit depth.
       * @return {boolean} True is the bit depth is valid.
       * @throws {Error} If bit depth is invalid.
       * @private
       */

    }, {
      key: 'validateBitDepth_',
      value: function validateBitDepth_() {
        if (!AUDIO_FORMATS[this.bitDepth]) {
          if (parseInt(this.bitDepth, 10) > 8 && parseInt(this.bitDepth, 10) < 54) {
            return true;
          }
          throw new Error('Invalid bit depth.');
        }
        return true;
      }

      /**
       * Validate the number of channels.
       * @return {boolean} True is the number of channels is valid.
       * @throws {Error} If the number of channels is invalid.
       * @private
       */

    }, {
      key: 'validateNumChannels_',
      value: function validateNumChannels_() {
        /** @type {number} */
        var blockAlign = this.fmt.numChannels * this.fmt.bitsPerSample / 8;
        if (this.fmt.numChannels < 1 || blockAlign > 65535) {
          throw new Error('Invalid number of channels.');
        }
        return true;
      }

      /**
       * Validate the sample rate value.
       * @return {boolean} True is the sample rate is valid.
       * @throws {Error} If the sample rate is invalid.
       * @private
       */

    }, {
      key: 'validateSampleRate_',
      value: function validateSampleRate_() {
        /** @type {number} */
        var byteRate = this.fmt.numChannels * (this.fmt.bitsPerSample / 8) * this.fmt.sampleRate;
        if (this.fmt.sampleRate < 1 || byteRate > 4294967295) {
          throw new Error('Invalid sample rate.');
        }
        return true;
      }
    }]);
    return WaveFile;
  }(WavIO);

  return WaveFile;

})));
