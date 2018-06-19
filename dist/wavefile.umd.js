(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==="object"&&typeof module==="object")module.exports=factory();else if(typeof define==="function"&&define.amd)define([],factory);else if(typeof exports==="object")exports["WaveFile"]=factory();else root["WaveFile"]=factory()})(typeof self!=="undefined"?self:this,function(){return function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;
var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name))Object.defineProperty(exports,name,{configurable:false,enumerable:true,get:getter})};__webpack_require__.n=function(module){var getter=module&&module.__esModule?
function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";return __webpack_require__(__webpack_require__.s=1)}([function(module,exports,__webpack_require__){/** @private @const @type {!Object} */ var packer=__webpack_require__(4);/**
 @param {(number|string)} value
 @param {!Object} theType
 @return {!Array<number>}
 @throws {Error}
 */
function pack(value,theType){packer.setUp(theType);return packer.toBytes([value],theType)}/**
 @param {(!Array<number>|!Uint8Array)} buffer
 @param {!Object} theType
 @return {(number|string)}
 @throws {Error}
 */
function unpack(buffer,theType){packer.setUp(theType);var values=packer.fromBytes(buffer.slice(0,theType["offset"]),theType);return values?values[0]:theType["char"]?"":null}/**
 @param {!Array<(number|string)>} values
 @param {!Object} theType
 @return {!Array<number>}
 @throws {Error}
 */
function packArray(values,theType){packer.setUp(theType);return packer.toBytes(values,theType)}/**
 @param {(!Array<number>|!Uint8Array)} buffer
 @param {!Object} theType
 @return {!Array<(number|string)>}
 @throws {Error}
 */
function unpackArray(buffer,theType){packer.setUp(theType);return packer.fromBytes(buffer,theType)}/** @export */ module.exports.pack=pack;/** @export */ module.exports.unpack=unpack;/** @export */ module.exports.packArray=packArray;/** @export */ module.exports.unpackArray=unpackArray;/** @export */ module.exports.types=__webpack_require__(7)},function(module,exports,__webpack_require__){/** @private @const @type {!Function} */ var bitdepthlib_=__webpack_require__(2);/** @private @const @type {!Object} */ var riffChunks_=
__webpack_require__(3);/** @private @const @type {!Object} */ var imaadpcm_=__webpack_require__(8);/** @private @const @type {!Object} */ var alawmulaw_=__webpack_require__(9);/** @private @const @type {!Object} */ var b64_=__webpack_require__(12);/** @private @const @type {!Object} */ var byteData_=__webpack_require__(0);/** @private @type {!Object} */ var uInt16_={"bits":16};/** @private @type {!Object} */ var uInt32_={"bits":32};/**
 @struct
 @constructor
 @param {?Uint8Array} bytes
 @throws {Error}
 */
var WaveFile=function(bytes){bytes=bytes===undefined?null:bytes;/** @export @type {string} */ this.container="";/** @export @type {number} */ this.chunkSize=0;/** @export @type {string} */ this.format="";/** @export @type {!Object<string,*>} */ this.fmt={/** @export @type {string} */ "chunkId":"",/** @export @type {number} */ "chunkSize":0,/** @export @type {number} */ "audioFormat":0,/** @export @type {number} */ "numChannels":0,/** @export @type {number} */ "sampleRate":0,/** @export @type {number} */ "byteRate":0,
/** @export @type {number} */ "blockAlign":0,/** @export @type {number} */ "bitsPerSample":0,/** @export @type {number} */ "cbSize":0,/** @export @type {number} */ "validBitsPerSample":0,/** @export @type {number} */ "dwChannelMask":0,/** @export @type {!Array<number>} */ "subformat":[]};/** @export @type {!Object<string,*>} */ this.fact={/** @export @type {string} */ "chunkId":"",/** @export @type {number} */ "chunkSize":0,/** @export @type {number} */ "dwSampleLength":0};/** @export @type {!Object<string,*>} */ this.cue=
{/** @export @type {string} */ "chunkId":"",/** @export @type {number} */ "chunkSize":0,/** @export @type {number} */ "dwCuePoints":0,/** @export @type {!Array<!Object>} */ "points":[]};/** @export @type {!Object<string,*>} */ this.smpl={/** @export @type {string} */ "chunkId":"",/** @export @type {number} */ "chunkSize":0,/** @export @type {number} */ "dwManufacturer":0,/** @export @type {number} */ "dwProduct":0,/** @export @type {number} */ "dwSamplePeriod":0,/** @export @type {number} */ "dwMIDIUnityNote":0,
/** @export @type {number} */ "dwMIDIPitchFraction":0,/** @export @type {number} */ "dwSMPTEFormat":0,/** @export @type {number} */ "dwSMPTEOffset":0,/** @export @type {number} */ "dwNumSampleLoops":0,/** @export @type {number} */ "dwSamplerData":0,/** @export @type {!Array<!Object>} */ "loops":[]};/** @export @type {!Object<string,*>} */ this.bext={/** @export @type {string} */ "chunkId":"",/** @export @type {number} */ "chunkSize":0,/** @export @type {string} */ "description":"",/** @export @type {string} */ "originator":"",
/** @export @type {string} */ "originatorReference":"",/** @export @type {string} */ "originationDate":"",/** @export @type {string} */ "originationTime":"",/** @export @type {!Array<number>} */ "timeReference":[0,0],/** @export @type {number} */ "version":0,/** @export @type {string} */ "UMID":"",/** @export @type {number} */ "loudnessValue":0,/** @export @type {number} */ "loudnessRange":0,/** @export @type {number} */ "maxTruePeakLevel":0,/** @export @type {number} */ "maxMomentaryLoudness":0,
/** @export @type {number} */ "maxShortTermLoudness":0,/** @export @type {string} */ "reserved":"",/** @export @type {string} */ "codingHistory":""};/** @export @type {!Object<string,*>} */ this.ds64={/** @type {string} */ "chunkId":"",/** @export @type {number} */ "chunkSize":0,/** @export @type {number} */ "riffSizeHigh":0,/** @export @type {number} */ "riffSizeLow":0,/** @export @type {number} */ "dataSizeHigh":0,/** @export @type {number} */ "dataSizeLow":0,/** @export @type {number} */ "originationTime":0,
/** @export @type {number} */ "sampleCountHigh":0,/** @export @type {number} */ "sampleCountLow":0};/** @export @type {!Object<string,*>} */ this.data={/** @export @type {string} */ "chunkId":"",/** @export @type {number} */ "chunkSize":0,/** @export @type {!Array<number>} */ "samples":[]};/** @export @type {!Array<!Object>} */ this.LIST=[];/** @export @type {!Object<string,*>} */ this.junk={/** @export @type {string} */ "chunkId":"",/** @export @type {number} */ "chunkSize":0,/** @export @type {!Array<number>} */ "chunkData":[]};
/** @export @type {boolean} */ this.isInterleaved=true;/** @export @type {string} */ this.bitDepth="0";/** @private @enum {number} */ this.audioFormats_={4:17,8:1,"8a":6,"8m":7,16:1,24:1,32:1,"32f":3,64:3};/** @private @type {number} */ this.head_=0;if(bytes)this.fromBuffer(bytes)};/**
 @export
 @param {number} numChannels
 @param {number} sampleRate
 @param {string} bitDepth
 @param {!Array<number>} samples
 @param {?Object} options
 @throws {Error}
 */
WaveFile.prototype.fromScratch=function(numChannels,sampleRate,bitDepth,samples,options){options=options===undefined?{}:options;if(!options["container"])options["container"]="RIFF";this.bitDepth=bitDepth;this.data.samples=samples;if(samples.length>0)if(samples[0].constructor===Array){this.isInterleaved=false;this.assureInterleaved_()}/** @type {number} */ var numBytes=((parseInt(bitDepth,10)-1|7)+1)/8;this.createPCMHeader_(bitDepth,numChannels,sampleRate,numBytes,options);if(bitDepth=="4")this.createADPCMHeader_(bitDepth,
numChannels,sampleRate,numBytes,options);else if(bitDepth=="8a"||bitDepth=="8m")this.createALawMulawHeader_(bitDepth,numChannels,sampleRate,numBytes,options);else if(Object.keys(this.audioFormats_).indexOf(bitDepth)==-1||this.fmt.numChannels>2)this.createExtensibleHeader_(bitDepth,numChannels,sampleRate,numBytes,options);this.data.chunkId="data";this.data.chunkSize=this.data.samples.length*numBytes;this.validateHeader_();this.LEorBE_()};/**
 @export
 @param {!Uint8Array} bytes
 @throws {Error}
 */
WaveFile.prototype.fromBuffer=function(bytes){this.clearHeader_();this.readRIFFChunk_(bytes);/** @type {!Object} */ var chunk=riffChunks_.read(bytes);this.readDs64Chunk_(chunk["subChunks"]);this.readFmtChunk_(chunk["subChunks"]);this.readFactChunk_(chunk["subChunks"]);this.readBextChunk_(chunk["subChunks"]);this.readCueChunk_(chunk["subChunks"]);this.readSmplChunk_(chunk["subChunks"]);this.readDataChunk_(chunk["subChunks"]);this.readLISTChunk_(chunk["subChunks"]);this.readJunkChunk_(chunk["subChunks"]);
this.bitDepthFromFmt_()};/**
 @export
 @return {!Uint8Array}
 @throws {Error}
 */
WaveFile.prototype.toBuffer=function(){this.validateHeader_();this.assureInterleaved_();return this.createWaveFile_()};/**
 @export
 @param {string} base64String
 @throws {Error}
 */
WaveFile.prototype.fromBase64=function(base64String){this.fromBuffer(new Uint8Array(b64_.decode(base64String)))};/**
 @export
 @return {string}
 @throws {Error}
 */
WaveFile.prototype.toBase64=function(){return b64_.encode(this.toBuffer())};/**
 @export
 @return {string}
 @throws {Error}
 */
WaveFile.prototype.toDataURI=function(){return"data:audio/wav;base64,"+this.toBase64()};/**
 @export
 @param {string} dataURI
 @throws {Error}
 */
WaveFile.prototype.fromDataURI=function(dataURI){this.fromBase64(dataURI.replace("data:audio/wav;base64,",""))};/** @export */ WaveFile.prototype.toRIFF=function(){if(this.container=="RF64")this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,this.bitDepth,this.data.samples);else{this.container="RIFF";this.LEorBE_()}};/** @export */ WaveFile.prototype.toRIFX=function(){if(this.container=="RF64")this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,this.bitDepth,this.data.samples,{"container":"RIFX"});
else{this.container="RIFX";this.LEorBE_()}};/**
 @export
 @param {string} bitDepth
 @param {boolean} changeResolution
 @throws {Error}
 */
WaveFile.prototype.toBitDepth=function(bitDepth,changeResolution){changeResolution=changeResolution===undefined?true:changeResolution;var toBitDepth=bitDepth;var thisBitDepth=this.bitDepth;if(!changeResolution){toBitDepth=this.realBitDepth_(bitDepth);thisBitDepth=this.realBitDepth_(this.bitDepth)}this.assureInterleaved_();this.assureUncompressed_();this.truncateSamples();bitdepthlib_(this.data.samples,thisBitDepth,toBitDepth);this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,bitDepth,this.data.samples,
{"container":this.correctContainer_()})};/** @export */ WaveFile.prototype.interleave=function(){if(!this.isInterleaved){/** @type {!Array<number>} */ var finalSamples=[];for(var i=0;i<this.data.samples[0].length;i++)for(var j=0;j<this.data.samples.length;j++)finalSamples.push(this.data.samples[j][i]);this.data.samples=finalSamples;this.isInterleaved=true}};/** @export */ WaveFile.prototype.deInterleave=function(){if(this.isInterleaved){/** @type {!Array<!Array<number>>} */ var finalSamples=[];for(var i=
0;i<this.fmt.numChannels;i++)finalSamples[i]=[];/** @type {number} */ var len=this.data.samples.length;for(var i$0=0;i$0<len;i$0+=this.fmt.numChannels)for(var j=0;j<this.fmt.numChannels;j++)finalSamples[j].push(this.data.samples[i$0+j]);this.data.samples=finalSamples;this.isInterleaved=false}};/** @export @throws {Error} */ WaveFile.prototype.toIMAADPCM=function(){if(this.fmt.sampleRate!=8E3)throw new Error("Only 8000 Hz files can be compressed as IMA-ADPCM.");else if(this.fmt.numChannels!=1)throw new Error("Only mono files can be compressed as IMA-ADPCM.");
else{this.assure16Bit_();this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"4",imaadpcm_.encode(this.data.samples),{"container":this.correctContainer_()})}};/**
 @export
 @param {string} bitDepth
 */
WaveFile.prototype.fromIMAADPCM=function(bitDepth){bitDepth=bitDepth===undefined?"16":bitDepth;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",imaadpcm_.decode(this.data.samples,this.fmt.blockAlign),{"container":this.correctContainer_()});if(bitDepth!="16")this.toBitDepth(bitDepth)};/** @export */ WaveFile.prototype.toALaw=function(){this.assure16Bit_();this.assureInterleaved_();this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"8a",alawmulaw_.alaw.encode(this.data.samples),
{"container":this.correctContainer_()})};/**
 @export
 @param {string} bitDepth
 */
WaveFile.prototype.fromALaw=function(bitDepth){bitDepth=bitDepth===undefined?"16":bitDepth;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",alawmulaw_.alaw.decode(this.data.samples),{"container":this.correctContainer_()});if(bitDepth!="16")this.toBitDepth(bitDepth)};/** @export */ WaveFile.prototype.toMuLaw=function(){this.assure16Bit_();this.assureInterleaved_();this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"8m",alawmulaw_.mulaw.encode(this.data.samples),{"container":this.correctContainer_()})};
/**
 @export
 @param {string} bitDepth
 */
WaveFile.prototype.fromMuLaw=function(bitDepth){bitDepth=bitDepth===undefined?"16":bitDepth;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",alawmulaw_.mulaw.decode(this.data.samples),{"container":this.correctContainer_()});if(bitDepth!="16")this.toBitDepth(bitDepth)};/**
 @export
 @param {string} tag
 @param {string} value
 @throws {Error}
 */
WaveFile.prototype.setTag=function(tag,value){tag=this.fixTagName_(tag);/** @type {!Object} */ var index=this.getTagIndex_(tag);if(index.TAG!==null){this.LIST[index.LIST]["subChunks"][index.TAG]["chunkSize"]=value.length+1;this.LIST[index.LIST]["subChunks"][index.TAG]["value"]=value}else if(index.LIST!==null)this.LIST[index.LIST]["subChunks"].push({"chunkId":tag,"chunkSize":value.length+1,"value":value});else{this.LIST.push({"chunkId":"LIST","chunkSize":8+value.length+1,"format":"INFO","chunkData":[],
"subChunks":[]});this.LIST[this.LIST.length-1]["subChunks"].push({"chunkId":tag,"chunkSize":value.length+1,"value":value})}};/**
 @export
 @param {string} tag
 @return {?string}
 */
WaveFile.prototype.getTag=function(tag){/** @type {!Object} */ var index=this.getTagIndex_(tag);if(index.TAG!==null)return this.LIST[index.LIST]["subChunks"][index.TAG]["value"];return null};/**
 @export
 @param {string} tag
 @return {boolean}
 */
WaveFile.prototype.deleteTag=function(tag){/** @type {!Object} */ var index=this.getTagIndex_(tag);if(index.TAG!==null){this.LIST[index.LIST]["subChunks"].splice(index.TAG,1);return true}return false};/**
 @export
 @param {number} position
 @param {string} labl
 */
WaveFile.prototype.setCuePoint=function(position,labl){labl=labl===undefined?"":labl;this.cue.chunkId="cue ";position=position*this.fmt.sampleRate/1E3;/** @type {!Array<!Object>} */ var existingPoints=this.getCuePoints_();this.clearLISTadtl_();/** @type {number} */ var len=this.cue.points.length;this.cue.points=[];/** @type {boolean} */ var hasSet=false;if(len==0)this.setCuePoint_(position,1,labl);else{for(var i=0;i<len;i++)if(existingPoints[i]["dwPosition"]>position&&!hasSet){this.setCuePoint_(position,
i+1,labl);this.setCuePoint_(existingPoints[i]["dwPosition"],i+2,existingPoints[i]["label"]);hasSet=true}else this.setCuePoint_(existingPoints[i]["dwPosition"],i+1,existingPoints[i]["label"]);if(!hasSet)this.setCuePoint_(position,this.cue.points.length+1,labl)}this.cue.dwCuePoints=this.cue.points.length};/**
 @export
 @param {number} index
 */
WaveFile.prototype.deleteCuePoint=function(index){this.cue.chunkId="cue ";/** @type {!Array<!Object>} */ var existingPoints=this.getCuePoints_();this.clearLISTadtl_();/** @type {number} */ var len=this.cue.points.length;this.cue.points=[];for(var i=0;i<len;i++)if(i+1!=index)this.setCuePoint_(existingPoints[i]["dwPosition"],i+1,existingPoints[i]["label"]);this.cue.dwCuePoints=this.cue.points.length;if(this.cue.dwCuePoints)this.cue.chunkId="cue ";else{this.cue.chunkId="";this.clearLISTadtl_()}};/**
 @export
 @param {number} pointIndex
 @param {string} label
 */
WaveFile.prototype.updateLabel=function(pointIndex,label){/** @type {?number} */ var adtlIndex=this.getAdtlChunk_();if(adtlIndex!==null)for(var i=0;i<this.LIST[adtlIndex]["subChunks"].length;i++)if(this.LIST[adtlIndex]["subChunks"][i]["dwName"]==pointIndex)this.LIST[adtlIndex]["subChunks"][i]["value"]=label};/**
 @private
 @param {number} position
 @param {number} dwName
 */
WaveFile.prototype.setCuePoint_=function(position,dwName,label){this.cue.points.push({"dwName":dwName,"dwPosition":position,"fccChunk":"data","dwChunkStart":0,"dwBlockStart":0,"dwSampleOffset":position});this.setLabl_(dwName,label)};/**
 @private
 @return {!Array<!Object>}
 */
WaveFile.prototype.getCuePoints_=function(){/** @type {!Array<!Object>} */ var points=[];for(var i=0;i<this.cue.points.length;i++)points.push({"dwPosition":this.cue.points[i]["dwPosition"],"label":this.getLabelForCuePoint_(this.cue.points[i]["dwName"])});return points};/**
 @private
 @param {number} pointDwName
 @return {string}
 */
WaveFile.prototype.getLabelForCuePoint_=function(pointDwName){/** @type {?number} */ var adtlIndex=this.getAdtlChunk_();if(adtlIndex!==null)for(var i=0;i<this.LIST[adtlIndex]["subChunks"].length;i++)if(this.LIST[adtlIndex]["subChunks"][i]["dwName"]==pointDwName)return this.LIST[adtlIndex]["subChunks"][i]["value"];return""};/** @private */ WaveFile.prototype.clearLISTadtl_=function(){for(var i=0;i<this.LIST.length;i++)if(this.LIST[i]["format"]=="adtl")this.LIST.splice(i)};/**
 @private
 @param {number} dwName
 @param {string} label
 */
WaveFile.prototype.setLabl_=function(dwName,label){/** @type {?number} */ var adtlIndex=this.getAdtlChunk_();if(adtlIndex===null){this.LIST.push({"chunkId":"LIST","chunkSize":4,"format":"adtl","chunkData":[],"subChunks":[]});adtlIndex=this.LIST.length-1}this.setLabelText_(adtlIndex===null?0:adtlIndex,dwName,label)};/**
 @private
 @param {number} adtlIndex
 @param {number} dwName
 @param {string} label
 */
WaveFile.prototype.setLabelText_=function(adtlIndex,dwName,label){this.LIST[adtlIndex]["subChunks"].push({"chunkId":"labl","chunkSize":label.length,"dwName":dwName,"value":label});this.LIST[adtlIndex]["chunkSize"]+=label.length+4+4+4+1};/**
 @private
 @return {?number}
 */
WaveFile.prototype.getAdtlChunk_=function(){for(var i=0;i<this.LIST.length;i++)if(this.LIST[i]["format"]=="adtl")return i;return null};/**
 @private
 @param {string} tag
 @return {!Object<string,?number>}
 */
WaveFile.prototype.getTagIndex_=function(tag){/** @type {!Object<string,?number>} */ var index={LIST:null,TAG:null};for(var i=0;i<this.LIST.length;i++)if(this.LIST[i]["format"]=="INFO"){index.LIST=i;for(var j=0;j<this.LIST[i]["subChunks"].length;j++)if(this.LIST[i]["subChunks"][j]["chunkId"]==tag){index.TAG=j;break}break}return index};/**
 @private
 @param {string} tag
 @return {string}
 */
WaveFile.prototype.fixTagName_=function(tag){if(tag.constructor!==String)throw new Error("Invalid tag name.");else if(tag.length<4)for(var i=0;i<4-tag.length;i++)tag+=" ";return tag};/**
 @private
 @param {string} bitDepth
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {!Object} options
 */
WaveFile.prototype.createADPCMHeader_=function(bitDepth,numChannels,sampleRate,numBytes,options){this.createPCMHeader_(bitDepth,numChannels,sampleRate,numBytes,options);this.chunkSize=40+this.data.samples.length;this.fmt.chunkSize=20;this.fmt.byteRate=4055;this.fmt.blockAlign=256;this.fmt.bitsPerSample=4;this.fmt.cbSize=2;this.fmt.validBitsPerSample=505;this.fact.chunkId="fact";this.fact.chunkSize=4;this.fact.dwSampleLength=this.data.samples.length*2;this.data.chunkSize=this.data.samples.length};
/**
 @private
 @param {string} bitDepth
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {!Object} options
 */
WaveFile.prototype.createExtensibleHeader_=function(bitDepth,numChannels,sampleRate,numBytes,options){this.createPCMHeader_(bitDepth,numChannels,sampleRate,numBytes,options);this.chunkSize=36+24+this.data.samples.length*numBytes;this.fmt.chunkSize=40;this.fmt.bitsPerSample=(parseInt(bitDepth,10)-1|7)+1;this.fmt.cbSize=22;this.fmt.validBitsPerSample=parseInt(bitDepth,10);this.fmt.dwChannelMask=this.getDwChannelMask_();this.fmt.subformat=[1,1048576,2852126848,1905997824]};/**
 @private
 @return {number}
 */
WaveFile.prototype.getDwChannelMask_=function(){/** @type {number} */ var dwChannelMask=0;if(this.fmt.numChannels==1)dwChannelMask=4;else if(this.fmt.numChannels==2)dwChannelMask=3;else if(this.fmt.numChannels==4)dwChannelMask=51;else if(this.fmt.numChannels==6)dwChannelMask=63;else if(this.fmt.numChannels==8)dwChannelMask=1599;return dwChannelMask};/**
 @private
 @param {string} bitDepth
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {!Object} options
 */
WaveFile.prototype.createALawMulawHeader_=function(bitDepth,numChannels,sampleRate,numBytes,options){this.createPCMHeader_(bitDepth,numChannels,sampleRate,numBytes,options);this.chunkSize=40+this.data.samples.length;this.fmt.chunkSize=20;this.fmt.cbSize=2;this.fmt.validBitsPerSample=8;this.fact.chunkId="fact";this.fact.chunkSize=4;this.fact.dwSampleLength=this.data.samples.length};/**
 @private
 @param {string} bitDepth
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {!Object} options
 */
WaveFile.prototype.createPCMHeader_=function(bitDepth,numChannels,sampleRate,numBytes,options){this.clearHeader_();this.container=options["container"];this.chunkSize=36+this.data.samples.length*numBytes;this.format="WAVE";this.fmt.chunkId="fmt ";this.fmt.chunkSize=16;this.fmt.byteRate=numChannels*numBytes*sampleRate;this.fmt.blockAlign=numChannels*numBytes;this.fmt.audioFormat=this.audioFormats_[bitDepth]?this.audioFormats_[bitDepth]:65534;this.fmt.numChannels=numChannels;this.fmt.sampleRate=sampleRate;
this.fmt.bitsPerSample=parseInt(bitDepth,10);this.fmt.cbSize=0;this.fmt.validBitsPerSample=0};/**
 @private
 @param {string} bitDepth
 @return {string}
 */
WaveFile.prototype.realBitDepth_=function(bitDepth){if(bitDepth!="32f")bitDepth=((parseInt(bitDepth,10)-1|7)+1).toString();return bitDepth};/** @private @throws {Error} */ WaveFile.prototype.validateHeader_=function(){this.validateBitDepth_();this.validateNumChannels_();this.validateSampleRate_()};/**
 @private
 @return {boolean}
 @throws {Error}
 */
WaveFile.prototype.validateBitDepth_=function(){if(!this.audioFormats_[this.bitDepth]){if(parseInt(this.bitDepth,10)>8&&parseInt(this.bitDepth,10)<54)return true;throw new Error("Invalid bit depth.");}return true};/**
 @private
 @return {boolean}
 @throws {Error}
 */
WaveFile.prototype.validateNumChannels_=function(){/** @type {number} */ var blockAlign=this.fmt.numChannels*this.fmt.bitsPerSample/8;if(this.fmt.numChannels<1||blockAlign>65535)throw new Error("Invalid number of channels.");return true};/**
 @private
 @return {boolean}
 @throws {Error}
 */
WaveFile.prototype.validateSampleRate_=function(){/** @type {number} */ var byteRate=this.fmt.numChannels*(this.fmt.bitsPerSample/8)*this.fmt.sampleRate;if(this.fmt.sampleRate<1||byteRate>4294967295)throw new Error("Invalid sample rate.");return true};/** @private */ WaveFile.prototype.clearHeader_=function(){this.fmt.cbSize=0;this.fmt.validBitsPerSample=0;this.fact.chunkId="";this.ds64.chunkId=""};/** @private */ WaveFile.prototype.assure16Bit_=function(){this.assureUncompressed_();if(this.bitDepth!=
"16")this.toBitDepth("16")};/** @private */ WaveFile.prototype.assureUncompressed_=function(){if(this.bitDepth=="8a")this.fromALaw();else if(this.bitDepth=="8m")this.fromMuLaw();else if(this.bitDepth=="4")this.fromIMAADPCM()};/** @private */ WaveFile.prototype.assureInterleaved_=function(){if(!this.isInterleaved)this.interleave()};/**
 @private
 @return {boolean}
 */
WaveFile.prototype.LEorBE_=function(){/** @type {boolean} */ var bigEndian=this.container==="RIFX";uInt16_["be"]=bigEndian;uInt32_["be"]=bigEndian;return bigEndian};/**
 @private
 @param {!Array<!Object>} chunks
 @param {string} chunkId
 @param {boolean} multiple
 @return {(Object|Array<!Object>|null)}
 */
WaveFile.prototype.findChunk_=function(chunks,chunkId,multiple){multiple=multiple===undefined?false:multiple;/** @type {!Array<!Object>} */ var chunk=[];for(var i=0;i<chunks.length;i++)if(chunks[i]["chunkId"]==chunkId)if(multiple)chunk.push(chunks[i]);else return chunks[i];if(chunkId=="LIST")return chunk.length?chunk:null;return null};/**
 @private
 @param {!Uint8Array} bytes
 @throws {Error}
 */
WaveFile.prototype.readRIFFChunk_=function(bytes){this.head_=0;this.container=this.readString_(bytes,4);if(["RIFF","RIFX","RF64"].indexOf(this.container)===-1)throw Error("Not a supported format.");this.LEorBE_();this.chunkSize=this.read_(bytes,uInt32_);this.format=this.readString_(bytes,4);if(this.format!="WAVE")throw Error("Could not find the 'WAVE' format identifier");};/**
 @private
 @param {!Array<!Object>} chunks
 @throws {Error}
 */
WaveFile.prototype.readFmtChunk_=function(chunks){/** @type {?Object} */ var chunk=this.findChunk_(chunks,"fmt ");if(chunk){this.head_=0;/** @type {!Array<number>} */ var chunkData=chunk["chunkData"];this.fmt.chunkId=chunk["chunkId"];this.fmt.chunkSize=chunk["chunkSize"];this.fmt.audioFormat=this.read_(chunkData,uInt16_);this.fmt.numChannels=this.read_(chunkData,uInt16_);this.fmt.sampleRate=this.read_(chunkData,uInt32_);this.fmt.byteRate=this.read_(chunkData,uInt32_);this.fmt.blockAlign=this.read_(chunkData,
uInt16_);this.fmt.bitsPerSample=this.read_(chunkData,uInt16_);this.readFmtExtension_(chunkData)}else throw Error("Could not find the 'fmt ' chunk");};/**
 @private
 @param {!Array<number>} chunkData
 */
WaveFile.prototype.readFmtExtension_=function(chunkData){if(this.fmt.chunkSize>16){this.fmt.cbSize=this.read_(chunkData,uInt16_);if(this.fmt.chunkSize>18){this.fmt.validBitsPerSample=this.read_(chunkData,uInt16_);if(this.fmt.chunkSize>20){this.fmt.dwChannelMask=this.read_(chunkData,uInt32_);this.fmt.subformat=[this.read_(chunkData,uInt32_),this.read_(chunkData,uInt32_),this.read_(chunkData,uInt32_),this.read_(chunkData,uInt32_)]}}}};/**
 @private
 @param {!Array<!Object>} chunks
 */
WaveFile.prototype.readFactChunk_=function(chunks){/** @type {?Object} */ var chunk=this.findChunk_(chunks,"fact");if(chunk){this.head_=0;this.fact.chunkId=chunk["chunkId"];this.fact.chunkSize=chunk["chunkSize"];this.fact.dwSampleLength=this.read_(chunk["chunkData"],uInt32_)}};/**
 @private
 @param {!Array<!Object>} chunks
 */
WaveFile.prototype.readCueChunk_=function(chunks){/** @type {?Object} */ var chunk=this.findChunk_(chunks,"cue ");if(chunk){this.head_=0;/** @type {!Array<number>} */ var chunkData=chunk["chunkData"];this.cue.chunkId=chunk["chunkId"];this.cue.chunkSize=chunk["chunkSize"];this.cue.dwCuePoints=this.read_(chunkData,uInt32_);for(var i=0;i<this.cue.dwCuePoints;i++)this.cue.points.push({"dwName":this.read_(chunkData,uInt32_),"dwPosition":this.read_(chunkData,uInt32_),"fccChunk":this.readString_(chunkData,
4),"dwChunkStart":this.read_(chunkData,uInt32_),"dwBlockStart":this.read_(chunkData,uInt32_),"dwSampleOffset":this.read_(chunkData,uInt32_)})}};/**
 @private
 @param {!Array<!Object>} chunks
 */
WaveFile.prototype.readSmplChunk_=function(chunks){/** @type {?Object} */ var chunk=this.findChunk_(chunks,"smpl");if(chunk){this.head_=0;/** @type {!Array<number>} */ var chunkData=chunk["chunkData"];this.smpl.chunkId=chunk["chunkId"];this.smpl.chunkSize=chunk["chunkSize"];this.smpl.dwManufacturer=this.read_(chunkData,uInt32_);this.smpl.dwProduct=this.read_(chunkData,uInt32_);this.smpl.dwSamplePeriod=this.read_(chunkData,uInt32_);this.smpl.dwMIDIUnityNote=this.read_(chunkData,uInt32_);this.smpl.dwMIDIPitchFraction=
this.read_(chunkData,uInt32_);this.smpl.dwSMPTEFormat=this.read_(chunkData,uInt32_);this.smpl.dwSMPTEOffset=this.read_(chunkData,uInt32_);this.smpl.dwNumSampleLoops=this.read_(chunkData,uInt32_);this.smpl.dwSamplerData=this.read_(chunkData,uInt32_);for(var i=0;i<this.smpl.dwNumSampleLoops;i++)this.smpl.loops.push({"dwName":this.read_(chunkData,uInt32_),"dwType":this.read_(chunkData,uInt32_),"dwStart":this.read_(chunkData,uInt32_),"dwEnd":this.read_(chunkData,uInt32_),"dwFraction":this.read_(chunkData,
uInt32_),"dwPlayCount":this.read_(chunkData,uInt32_)})}};/**
 @private
 @param {!Array<!Object>} chunks
 @throws {Error}
 */
WaveFile.prototype.readDataChunk_=function(chunks){/** @type {?Object} */ var chunk=this.findChunk_(chunks,"data");if(chunk){this.data.chunkId="data";this.data.chunkSize=chunk["chunkSize"];this.samplesFromBytes_(chunk["chunkData"])}else throw Error("Could not find the 'data' chunk");};/**
 @private
 @param {!Array<!Object>} chunks
 */
WaveFile.prototype.readBextChunk_=function(chunks){/** @type {?Object} */ var chunk=this.findChunk_(chunks,"bext");if(chunk){this.head_=0;/** @type {!Array<number>} */ var chunkData=chunk["chunkData"];this.bext.chunkId=chunk["chunkId"];this.bext.chunkSize=chunk["chunkSize"];this.bext.description=this.readString_(chunkData,256);this.bext.originator=this.readString_(chunkData,32);this.bext.originatorReference=this.readString_(chunkData,32);this.bext.originationDate=this.readString_(chunkData,10);this.bext.originationTime=
this.readString_(chunkData,8);this.bext.timeReference=[this.read_(chunkData,uInt32_),this.read_(chunkData,uInt32_)];this.bext.version=this.read_(chunkData,uInt16_);this.bext.UMID=this.readString_(chunkData,64);this.bext.loudnessValue=this.read_(chunkData,uInt16_);this.bext.loudnessRange=this.read_(chunkData,uInt16_);this.bext.maxTruePeakLevel=this.read_(chunkData,uInt16_);this.bext.maxMomentaryLoudness=this.read_(chunkData,uInt16_);this.bext.maxShortTermLoudness=this.read_(chunkData,uInt16_);this.bext.reserved=
this.readString_(chunkData,180);this.bext.codingHistory=this.readString_(chunkData,this.bext.chunkSize-602)}};/**
 @private
 @param {!Array<!Object>} chunks
 @throws {Error}
 */
WaveFile.prototype.readDs64Chunk_=function(chunks){/** @type {?Object} */ var chunk=this.findChunk_(chunks,"ds64");if(chunk){this.head_=0;/** @type {!Array<number>} */ var chunkData=chunk["chunkData"];this.ds64.chunkId=chunk["chunkId"];this.ds64.chunkSize=chunk["chunkSize"];this.ds64.riffSizeHigh=this.read_(chunkData,uInt32_);this.ds64.riffSizeLow=this.read_(chunkData,uInt32_);this.ds64.dataSizeHigh=this.read_(chunkData,uInt32_);this.ds64.dataSizeLow=this.read_(chunkData,uInt32_);this.ds64.originationTime=
this.read_(chunkData,uInt32_);this.ds64.sampleCountHigh=this.read_(chunkData,uInt32_);this.ds64.sampleCountLow=this.read_(chunkData,uInt32_)}else if(this.container=="RF64")throw Error("Could not find the 'ds64' chunk");};/**
 @private
 @param {!Array<!Object>} chunks
 */
WaveFile.prototype.readLISTChunk_=function(chunks){/** @type {?Object} */ var listChunks=this.findChunk_(chunks,"LIST",true);if(listChunks===null)return;for(var j=0;j<listChunks.length;j++){/** @type {!Object} */ var subChunk=listChunks[j];this.LIST.push({"chunkId":subChunk["chunkId"],"chunkSize":subChunk["chunkSize"],"format":subChunk["format"],"chunkData":subChunk["chunkData"],"subChunks":[]});for(var x=0;x<subChunk["subChunks"].length;x++)this.readLISTSubChunks_(subChunk["subChunks"][x],subChunk["format"])}};
/**
 @private
 @param {!Object} subChunk
 @param {string} format
 */
WaveFile.prototype.readLISTSubChunks_=function(subChunk,format){this.head_=0;if(format=="adtl"){if(["labl","note","ltxt"].indexOf(subChunk["chunkId"])>-1){/** @type {!Object<string,(string|number)>} */ var item={"chunkId":subChunk["chunkId"],"chunkSize":subChunk["chunkSize"],"dwName":this.read_(subChunk["chunkData"],uInt32_)};if(subChunk["chunkId"]=="ltxt"){item["dwSampleLength"]=this.read_(subChunk["chunkData"],uInt32_);item["dwPurposeID"]=this.read_(subChunk["chunkData"],uInt32_);item["dwCountry"]=
this.read_(subChunk["chunkData"],uInt16_);item["dwLanguage"]=this.read_(subChunk["chunkData"],uInt16_);item["dwDialect"]=this.read_(subChunk["chunkData"],uInt16_);item["dwCodePage"]=this.read_(subChunk["chunkData"],uInt16_)}item["value"]=this.readZSTR_(subChunk["chunkData"].slice(this.head_));this.LIST[this.LIST.length-1]["subChunks"].push(item)}}else if(format=="INFO")this.LIST[this.LIST.length-1]["subChunks"].push({"chunkId":subChunk["chunkId"],"chunkSize":subChunk["chunkSize"],"value":this.readZSTR_(subChunk["chunkData"].slice(0))})};
/**
 @private
 @param {!Array<!Object>} chunks
 */
WaveFile.prototype.readJunkChunk_=function(chunks){/** @type {?Object} */ var chunk=this.findChunk_(chunks,"junk");if(chunk)this.junk={"chunkId":chunk["chunkId"],"chunkSize":chunk["chunkSize"],"chunkData":chunk["chunkData"]}};/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @return {string}
 */
WaveFile.prototype.readZSTR_=function(bytes){/** @type {string} */ var str="";for(var i=0;i<bytes.length;i++){if(bytes[i]===0)break;str+=byteData_.unpack([bytes[i]],byteData_.types.chr)}return str};/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} maxSize
 @return {string}
 */
WaveFile.prototype.readString_=function(bytes,maxSize){/** @type {string} */ var str="";for(var i=0;i<maxSize;i++){str+=byteData_.unpack([bytes[this.head_]],byteData_.types.chr);this.head_++}return str};/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {!Object} bdType
 @return {number}
 */
WaveFile.prototype.read_=function(bytes,bdType){/** @type {number} */ var size=bdType["bits"]/8;/** @type {number} */ var value=byteData_.unpack(bytes.slice(this.head_,this.head_+size),bdType);this.head_+=size;return value};/**
 @private
 @param {string} str
 @param {number} maxSize
 @return {!Array<number>}
 */
WaveFile.prototype.writeString_=function(str,maxSize,push){push=push===undefined?true:push;/** @type {!Array<number>} */ var bytes=byteData_.packArray(str,byteData_.types.chr);if(push)for(var i=bytes.length;i<maxSize;i++)bytes.push(0);return bytes};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.samplesToBytes_=function(){return byteData_.packArray(this.data.samples,this.getSamplesType_())};/** @private */ WaveFile.prototype.truncateSamples=function(){if(this.fmt.audioFormat==3){/** @type {number} */ var len=this.data.samples.length;for(var i=0;i<len;i++)if(this.data.samples[i]>1)this.data.samples[i]=1;else if(this.data.samples[i]<-1)this.data.samples[i]=-1}};/**
 @private
 @param {!Array<number>} bytes
 */
WaveFile.prototype.samplesFromBytes_=function(bytes){this.data.samples=byteData_.unpackArray(bytes,this.getSamplesType_())};/**
 @private
 @return {!Object<string,(number|boolean)>}
 */
WaveFile.prototype.getSamplesType_=function(){/** @type {!Object<string,(number|boolean)>} */ var bdType={"be":this.container==="RIFX","bits":this.fmt.bitsPerSample==4?8:this.fmt.bitsPerSample,"float":this.fmt.audioFormat==3?true:false};bdType["signed"]=bdType["bits"]==8?false:true;return bdType};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getBextBytes_=function(){/** @type {!Array<number>} */ var bytes=[];this.enforceBext_();if(this.bext.chunkId)bytes=bytes.concat(byteData_.pack(this.bext.chunkId,byteData_.types.fourCC),byteData_.pack(602+this.bext.codingHistory.length,uInt32_),this.writeString_(this.bext.description,256),this.writeString_(this.bext.originator,32),this.writeString_(this.bext.originatorReference,32),this.writeString_(this.bext.originationDate,10),this.writeString_(this.bext.originationTime,8),byteData_.pack(this.bext.timeReference[0],
uInt32_),byteData_.pack(this.bext.timeReference[1],uInt32_),byteData_.pack(this.bext.version,uInt16_),this.writeString_(this.bext.UMID,64),byteData_.pack(this.bext.loudnessValue,uInt16_),byteData_.pack(this.bext.loudnessRange,uInt16_),byteData_.pack(this.bext.maxTruePeakLevel,uInt16_),byteData_.pack(this.bext.maxMomentaryLoudness,uInt16_),byteData_.pack(this.bext.maxShortTermLoudness,uInt16_),this.writeString_(this.bext.reserved,180),this.writeString_(this.bext.codingHistory,this.bext.codingHistory.length));
return bytes};/** @private */ WaveFile.prototype.enforceBext_=function(){for(var prop in this.bext)if(this.bext.hasOwnProperty(prop))if(this.bext[prop]&&prop!="timeReference"){this.bext.chunkId="bext";break}if(this.bext.timeReference[0]||this.bext.timeReference[1])this.bext.chunkId="bext"};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getDs64Bytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.ds64.chunkId)bytes=bytes.concat(byteData_.pack(this.ds64.chunkId,byteData_.types.fourCC),byteData_.pack(this.ds64.chunkSize,uInt32_),byteData_.pack(this.ds64.riffSizeHigh,uInt32_),byteData_.pack(this.ds64.riffSizeLow,uInt32_),byteData_.pack(this.ds64.dataSizeHigh,uInt32_),byteData_.pack(this.ds64.dataSizeLow,uInt32_),byteData_.pack(this.ds64.originationTime,uInt32_),byteData_.pack(this.ds64.sampleCountHigh,
uInt32_),byteData_.pack(this.ds64.sampleCountLow,uInt32_));return bytes};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getCueBytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.cue.chunkId){/** @type {!Array<number>} */ var cuePointsBytes=this.getCuePointsBytes_();bytes=bytes.concat(byteData_.pack(this.cue.chunkId,byteData_.types.fourCC),byteData_.pack(cuePointsBytes.length+4,uInt32_),byteData_.pack(this.cue.dwCuePoints,uInt32_),cuePointsBytes)}return bytes};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getCuePointsBytes_=function(){/** @type {!Array<number>} */ var points=[];for(var i=0;i<this.cue.dwCuePoints;i++)points=points.concat(byteData_.pack(this.cue.points[i]["dwName"],uInt32_),byteData_.pack(this.cue.points[i]["dwPosition"],uInt32_),byteData_.pack(this.cue.points[i]["fccChunk"],byteData_.types.fourCC),byteData_.pack(this.cue.points[i]["dwChunkStart"],uInt32_),byteData_.pack(this.cue.points[i]["dwBlockStart"],uInt32_),byteData_.pack(this.cue.points[i]["dwSampleOffset"],
uInt32_));return points};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getSmplBytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.smpl.chunkId){/** @type {!Array<number>} */ var smplLoopsBytes=this.getSmplLoopsBytes_();bytes=bytes.concat(byteData_.pack(this.smpl.chunkId,byteData_.types.fourCC),byteData_.pack(smplLoopsBytes.length+36,uInt32_),byteData_.pack(this.smpl.dwManufacturer,uInt32_),byteData_.pack(this.smpl.dwProduct,uInt32_),byteData_.pack(this.smpl.dwSamplePeriod,uInt32_),byteData_.pack(this.smpl.dwMIDIUnityNote,uInt32_),
byteData_.pack(this.smpl.dwMIDIPitchFraction,uInt32_),byteData_.pack(this.smpl.dwSMPTEFormat,uInt32_),byteData_.pack(this.smpl.dwSMPTEOffset,uInt32_),byteData_.pack(this.smpl.dwNumSampleLoops,uInt32_),byteData_.pack(this.smpl.dwSamplerData,uInt32_),smplLoopsBytes)}return bytes};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getSmplLoopsBytes_=function(){/** @type {!Array<number>} */ var loops=[];for(var i=0;i<this.smpl.dwNumSampleLoops;i++)loops=loops.concat(byteData_.pack(this.smpl.loops[i]["dwName"],uInt32_),byteData_.pack(this.smpl.loops[i]["dwType"],uInt32_),byteData_.pack(this.smpl.loops[i]["dwStart"],uInt32_),byteData_.pack(this.smpl.loops[i]["dwEnd"],uInt32_),byteData_.pack(this.smpl.loops[i]["dwFraction"],uInt32_),byteData_.pack(this.smpl.loops[i]["dwPlayCount"],uInt32_));return loops};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getFactBytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.fact.chunkId)bytes=bytes.concat(byteData_.pack(this.fact.chunkId,byteData_.types.fourCC),byteData_.pack(this.fact.chunkSize,uInt32_),byteData_.pack(this.fact.dwSampleLength,uInt32_));return bytes};/**
 @private
 @return {!Array<number>}
 @throws {Error}
 */
WaveFile.prototype.getFmtBytes_=function(){if(this.fmt.chunkId)return[].concat(byteData_.pack(this.fmt.chunkId,byteData_.types.fourCC),byteData_.pack(this.fmt.chunkSize,uInt32_),byteData_.pack(this.fmt.audioFormat,uInt16_),byteData_.pack(this.fmt.numChannels,uInt16_),byteData_.pack(this.fmt.sampleRate,uInt32_),byteData_.pack(this.fmt.byteRate,uInt32_),byteData_.pack(this.fmt.blockAlign,uInt16_),byteData_.pack(this.fmt.bitsPerSample,uInt16_),this.getFmtExtensionBytes_());throw Error("Could not find the 'fmt ' chunk");
};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getFmtExtensionBytes_=function(){/** @type {!Array<number>} */ var extension=[];if(this.fmt.chunkSize>16)extension=extension.concat(byteData_.pack(this.fmt.cbSize,uInt16_));if(this.fmt.chunkSize>18)extension=extension.concat(byteData_.pack(this.fmt.validBitsPerSample,uInt16_));if(this.fmt.chunkSize>20)extension=extension.concat(byteData_.pack(this.fmt.dwChannelMask,uInt32_));if(this.fmt.chunkSize>24)extension=extension.concat(byteData_.pack(this.fmt.subformat[0],uInt32_),byteData_.pack(this.fmt.subformat[1],
uInt32_),byteData_.pack(this.fmt.subformat[2],uInt32_),byteData_.pack(this.fmt.subformat[3],uInt32_));return extension};/**
 @export
 @return {!Array<number>}
 */
WaveFile.prototype.getLISTBytes_=function(){/** @type {!Array<number>} */ var bytes=[];for(var i=0;i<this.LIST.length;i++){/** @type {!Array<number>} */ var subChunksBytes=this.getLISTSubChunksBytes_(this.LIST[i]["subChunks"],this.LIST[i]["format"]);bytes=bytes.concat(byteData_.pack(this.LIST[i]["chunkId"],byteData_.types.fourCC),byteData_.pack(subChunksBytes.length+4,uInt32_),byteData_.pack(this.LIST[i]["format"],byteData_.types.fourCC),subChunksBytes)}return bytes};/**
 @private
 @param {!Array<!Object>} subChunks
 @param {string} format
 @return {!Array<number>}
 */
WaveFile.prototype.getLISTSubChunksBytes_=function(subChunks,format){/** @type {!Array<number>} */ var bytes=[];for(var i=0;i<subChunks.length;i++){if(format=="INFO"){bytes=bytes.concat(byteData_.pack(subChunks[i]["chunkId"],byteData_.types.fourCC),byteData_.pack(subChunks[i]["value"].length+1,uInt32_),this.writeString_(subChunks[i]["value"],subChunks[i]["value"].length));bytes.push(0)}else if(format=="adtl")if(["labl","note"].indexOf(subChunks[i]["chunkId"])>-1){bytes=bytes.concat(byteData_.pack(subChunks[i]["chunkId"],
byteData_.types.fourCC),byteData_.pack(subChunks[i]["value"].length+4+1,uInt32_),byteData_.pack(subChunks[i]["dwName"],uInt32_),this.writeString_(subChunks[i]["value"],subChunks[i]["value"].length));bytes.push(0)}else if(subChunks[i]["chunkId"]=="ltxt")bytes=bytes.concat(this.getLtxtChunkBytes_(subChunks[i]));if(bytes.length%2)bytes.push(0)}return bytes};/**
 @private
 @param {!Object} ltxt
 @return {!Array<number>}
 */
WaveFile.prototype.getLtxtChunkBytes_=function(ltxt){return[].concat(byteData_.pack(ltxt["chunkId"],byteData_.types.fourCC),byteData_.pack(ltxt["value"].length+20,uInt32_),byteData_.pack(ltxt["dwName"],uInt32_),byteData_.pack(ltxt["dwSampleLength"],uInt32_),byteData_.pack(ltxt["dwPurposeID"],uInt32_),byteData_.pack(ltxt["dwCountry"],uInt16_),byteData_.pack(ltxt["dwLanguage"],uInt16_),byteData_.pack(ltxt["dwLanguage"],uInt16_),byteData_.pack(ltxt["dwCodePage"],uInt16_),this.writeString_(ltxt["value"],
ltxt["value"].length))};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getJunkBytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.junk.chunkId)return bytes.concat(byteData_.pack(this.junk.chunkId,byteData_.types.fourCC),byteData_.pack(this.junk.chunkData.length,uInt32_),this.junk.chunkData);return bytes};/**
 @private
 @return {string}
 */
WaveFile.prototype.correctContainer_=function(){return this.container=="RF64"?"RIFF":this.container};/** @private */ WaveFile.prototype.bitDepthFromFmt_=function(){if(this.fmt.audioFormat==3&&this.fmt.bitsPerSample==32)this.bitDepth="32f";else if(this.fmt.audioFormat==6)this.bitDepth="8a";else if(this.fmt.audioFormat==7)this.bitDepth="8m";else this.bitDepth=this.fmt.bitsPerSample.toString()};/**
 @private
 @return {!Uint8Array}
 */
WaveFile.prototype.createWaveFile_=function(){/** @type {!Array<number>} */ var samplesBytes=this.samplesToBytes_();/** @type {!Array<number>} */ var fileBody=[].concat(byteData_.pack(this.format,byteData_.types.fourCC),this.getJunkBytes_(),this.getDs64Bytes_(),this.getBextBytes_(),this.getFmtBytes_(),this.getFactBytes_(),byteData_.pack(this.data.chunkId,byteData_.types.fourCC),byteData_.pack(samplesBytes.length,uInt32_),samplesBytes,this.getCueBytes_(),this.getSmplBytes_(),this.getLISTBytes_());
return new Uint8Array([].concat(byteData_.pack(this.container,byteData_.types.fourCC),byteData_.pack(fileBody.length,uInt32_),fileBody))};module.exports=WaveFile},function(module,exports){/** @private @const */ var f64f32_=new Float32Array(1);/**
 @param {!Array<number>} samples
 @param {string} original
 @param {string} target
 @param {Array<number>=} outputArray
 */
function bitdepth(samples,original,target,outputArray){validateBitDepth_(original);validateBitDepth_(target);outputArray=outputArray||samples;/** @type {!Function} */ var toFunction=getBitDepthFunction_(original,target);/** @type {!Object} */ var options={oldMin:Math.pow(2,parseInt(original,10))/2,newMin:Math.pow(2,parseInt(target,10))/2,oldMax:Math.pow(2,parseInt(original,10))/2-1,newMax:Math.pow(2,parseInt(target,10))/2-1};/** @const @type {number} */ var len=samples.length;if(original=="8")for(var i=
0;i<len;i++)outputArray[i]=samples[i]-=128;for(var i$1=0;i$1<len;i$1++)outputArray[i$1]=toFunction(samples[i$1],options);if(target=="8")for(var i$2=0;i$2<len;i$2++)outputArray[i$2]=outputArray[i$2]+=128}/**
 @private
 @param {number} sample
 @param {!Object} args
 @return {number}
 */
function intToInt_(sample,args){if(sample>0)sample=parseInt(sample/args.oldMax*args.newMax,10);else sample=parseInt(sample/args.oldMin*args.newMin,10);return sample}/**
 @private
 @param {number} sample
 @param {!Object} args
 @return {number}
 */
function floatToInt_(sample,args){return parseInt(sample>0?sample*args.newMax:sample*args.newMin,10)}/**
 @private
 @param {number} sample
 @param {!Object} args
 @return {number}
 */
function intToFloat_(sample,args){return sample>0?sample/args.oldMax:sample/args.oldMin}/**
 @private
 @param {number} sample
 @return {number}
 */
function floatToFloat_(sample){f64f32_[0]=sample;return f64f32_[0]}/**
 @private
 @param {string} original
 @param {string} target
 @return {!Function}
 */
function getBitDepthFunction_(original,target){/** @type {!Function} */ var func=function(x){return x};if(original!=target)if(["32f","64"].includes(original))if(["32f","64"].includes(target))func=floatToFloat_;else func=floatToInt_;else if(["32f","64"].includes(target))func=intToFloat_;else func=intToInt_;return func}/**
 @private
 @param {string} bitDepth
 @throws {Error}
 */
function validateBitDepth_(bitDepth){if(bitDepth!="32f"&&bitDepth!="64"&&(parseInt(bitDepth,10)<"8"||parseInt(bitDepth,10)>"53"))throw new Error("Invalid bit depth.");}module.exports=bitdepth},function(module,exports,__webpack_require__){/** @private @const */ var byteData=__webpack_require__(0);/** @private @const */ var uInt32_={"bits":32};/** @private @const */ var fourCC_={"bits":32,"char":true};/**
 @param {!Object} chunks
 @param {boolean} list
 @return {(!Array<number>|!Uint8Array)}
 */
function write(chunks,list){list=list===undefined?false:list;uInt32_["be"]=chunks["chunkId"]=="RIFX";var bytes=byteData.pack(chunks["chunkId"],fourCC_).concat(byteData.pack(chunks["chunkSize"],uInt32_),byteData.pack(chunks["format"],fourCC_),writeSubChunks_(chunks["subChunks"]));if(!list)bytes=new Uint8Array(bytes);return bytes}/**
 @param {(!Uint8Array|!Array<number>)} buffer
 @return {!Object}
 */
function read(buffer){buffer=[].slice.call(buffer);var chunkId=getChunkId_(buffer,0);uInt32_["be"]=chunkId=="RIFX";return{"chunkId":chunkId,"chunkSize":getChunkSize_(buffer,0),"format":byteData.unpack(buffer.slice(8,12),fourCC_),"subChunks":getSubChunks_(buffer)}}/**
 @private
 @param {!Array<!Object>} chunks
 @return {!Array<number>}
 */
function writeSubChunks_(chunks){var subChunks=[];var i=0;while(i<chunks.length){if(chunks[i]["chunkId"]=="LIST")subChunks=subChunks.concat(write(chunks[i],true));else subChunks=subChunks.concat(byteData.pack(chunks[i]["chunkId"],fourCC_),byteData.pack(chunks[i]["chunkSize"],uInt32_),chunks[i]["chunkData"]);i++}return subChunks}/**
 @private
 @param {(!Uint8Array|!Array<number>)} buffer
 @return {!Array<Object>}
 */
function getSubChunks_(buffer){var chunks=[];var i=12;while(i<=buffer.length-8){chunks.push(getSubChunk_(buffer,i));i+=8+chunks[chunks.length-1]["chunkSize"];i=i%2?i+1:i}return chunks}/**
 @private
 @param {(!Uint8Array|!Array<number>)} buffer
 @param {number} index
 @return {!Object}
 */
function getSubChunk_(buffer,index){var chunk={"chunkId":getChunkId_(buffer,index),"chunkSize":getChunkSize_(buffer,index)};if(chunk["chunkId"]=="LIST"){chunk["format"]=byteData.unpack(buffer.slice(index+8,index+12),fourCC_);chunk["subChunks"]=getSubChunks_(buffer.slice(index))}else{var slc=chunk["chunkSize"]%2?chunk["chunkSize"]+1:chunk["chunkSize"];chunk["chunkData"]=buffer.slice(index+8,index+8+slc)}return chunk}/**
 @private
 @param {(!Uint8Array|!Array<number>)} buffer
 @param {number} index
 @return {string}
 */
function getChunkId_(buffer,index){return byteData.unpack(buffer.slice(index,index+4),fourCC_)}/**
 @private
 @param {(!Uint8Array|!Array<number>)} buffer
 @param {number} index
 @return {number}
 */
function getChunkSize_(buffer,index){return byteData.unpack(buffer.slice(index+4,index+8),uInt32_)}/** @export */ module.exports.read=read;/** @export */ module.exports.write=write},function(module,exports,__webpack_require__){/** @private @const @type {!Function} */ var endianness=__webpack_require__(5);/** @private @const @constructor */ var Integer=__webpack_require__(6);/** @private @const @type {!Int8Array} */ var int8_=new Int8Array(8);/** @private @const @type {!Uint32Array} */ var ui32_=
new Uint32Array(int8_.buffer);/** @private @const @type {!Float32Array} */ var f32_=new Float32Array(int8_.buffer);/** @private @const @type {!Float64Array} */ var f64_=new Float64Array(int8_.buffer);/** @private @type {Function} */ var reader_;/** @private @type {Function} */ var writer_;/** @private @type {Object} */ var gInt_={};/**
 @private
 @param {(!Array<(number|string)>|!Uint8Array)} buffer
 @param {!Object} theType
 @return {!Array<number>}
 */
function fromBytes(buffer,theType){if(theType["be"])endianness(buffer,theType["offset"]);var len=buffer.length;var values=[];len=len-(theType["offset"]-1);for(var i=0;i<len;i+=theType["offset"])values.push(reader_(buffer,i));return values}/**
 @private
 @param {!Array<(number|string)>} values
 @param {!Object} theType
 @return {!Array<(number|string)>}
 */
function toBytes(values,theType){var j=0;var bytes=[];var len=values.length;var validate=validateNotNull;if(theType["char"])validate=validateString;for(var i=0;i<len;i++){validate(values[i],theType);j=writer_(bytes,values[i],j)}if(theType["be"])endianness(bytes,theType["offset"]);return bytes}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} i
 @return {number}
 */
function readInt_(bytes,i){return gInt_.read(bytes,i)}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} i
 @return {number}
 */
function read16F_(bytes,i){var int=gInt_.read(bytes,i);var exponent=(int&31744)>>10;var fraction=int&1023;var floatValue;if(exponent)floatValue=Math.pow(2,exponent-15)*(1+fraction/1024);else floatValue=.00006103515625*(fraction/1024);return floatValue*(int>>15?-1:1)}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} i
 @return {number}
 */
function read32F_(bytes,i){ui32_[0]=gInt_.read(bytes,i);return f32_[0]}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} i
 @return {number}
 */
function read64F_(bytes,i){ui32_[0]=gInt_.read(bytes,i);ui32_[1]=gInt_.read(bytes,i+4);return f64_[0]}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} i
 @return {string}
 */
function readChar_(bytes,i){var chrs="";for(var j=0;j<gInt_.offset;j++)chrs+=String.fromCharCode(bytes[i+j]);return chrs}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} number
 @param {number} j
 @return {!number}
 */
function writeInt_(bytes,number,j){return gInt_.write(bytes,number,j)}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} number
 @param {number} j
 @return {number}
 */
function write16F_(bytes,number,j){f32_[0]=number;var x=ui32_[0];var bits=x>>16&32768;var m=x>>12&2047;var e=x>>23&255;if(e>=103){bits|=e-112<<10|m>>1;bits+=m&1}bytes[j++]=bits&255;bytes[j++]=bits>>>8&255;return j}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} number
 @param {number} j
 @return {number}
 */
function write32F_(bytes,number,j){f32_[0]=number;return gInt_.write(bytes,ui32_[0],j)}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number} number
 @param {number} j
 @return {number}
 */
function write64F_(bytes,number,j){f64_[0]=number;j=gInt_.write(bytes,ui32_[0],j);return gInt_.write(bytes,ui32_[1],j)}/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {string} str
 @param {number} j
 @return {number}
 */
function writeChar_(bytes,str,j){for(var i=0;i<str.length;i++)bytes[j++]=str.charCodeAt(i);return j}/**
 @private
 @param {!Object} theType
 */
function setReader_(theType){if(theType["float"])if(theType["bits"]==16)reader_=read16F_;else if(theType["bits"]==32)reader_=read32F_;else{if(theType["bits"]==64)reader_=read64F_}else if(theType["char"])reader_=readChar_;else reader_=readInt_}/**
 @private
 @param {!Object} theType
 */
function setWriter_(theType){if(theType["float"])if(theType["bits"]==16)writer_=write16F_;else if(theType["bits"]==32)writer_=write32F_;else{if(theType["bits"]==64)writer_=write64F_}else if(theType["char"])writer_=writeChar_;else writer_=writeInt_}/**
 @private
 @param {!Object} theType
 @throws {Error}
 */
function setUp(theType){validateType_(theType);theType["offset"]=theType["bits"]<8?1:Math.ceil(theType["bits"]/8);setReader_(theType);setWriter_(theType);if(!theType["char"])gInt_=new Integer(theType["bits"]==64?32:theType["bits"],theType["float"]?false:theType["signed"]);else gInt_.offset=theType["bits"]<8?1:Math.ceil(theType["bits"]/8)}/**
 @private
 @param {!Object} theType
 @throws {Error}
 */
function validateType_(theType){if(!theType)throw new Error("Undefined type.");if(theType["float"])validateFloatType_(theType);else if(theType["char"])validateCharType_(theType);else validateIntType_(theType)}/**
 @private
 @param {!Object} theType
 @throws {Error}
 */
function validateFloatType_(theType){if([16,32,64].indexOf(theType["bits"])==-1)throw new Error("Not a supported float type.");}/**
 @private
 @param {!Object} theType
 @throws {Error}
 */
function validateCharType_(theType){if(theType["bits"]<8||theType["bits"]%2)throw new Error("Wrong offset for type char.");}/**
 @private
 @param {!Object} theType
 @throws {Error}
 */
function validateIntType_(theType){if(theType["bits"]<1||theType["bits"]>53)throw new Error("Not a supported type.");}/**
 @private
 @param {(string|number)} value
 @param {!Object} theType
 */
function validateString(value,theType){validateNotNull(value);if(value.length>theType["offset"])throw new Error("String is bigger than its type definition.");else if(value.length<theType["offset"])throw new Error("String is smaller than its type definition.");}/**
 @private
 @param {(string|number)} value
 */
function validateNotNull(value){if(value===null||value===undefined)throw new Error("Cannot pack null or undefined values.");}module.exports.setUp=setUp;module.exports.toBytes=toBytes;module.exports.fromBytes=fromBytes},function(module,exports){/**
 @param {(!Array<(number|string)>|!Uint8Array)} bytes
 @param {number} offset
 @throws {Error}
 */
function endianness(bytes,offset){var len=bytes.length;if(len%offset)throw new Error("Not enough bytes.");var i=0;while(i<len){swap(bytes,offset,i);i+=offset}}/**
 @private
 @param {(!Array<(number|string)>|!Uint8Array)} bytes
 @param {number} offset
 @param {number} index
 */
function swap(bytes,offset,index){var x=0;var y=offset-1;var limit=parseInt(offset/2,10);while(x<limit){var theByte=bytes[index+x];bytes[index+x]=bytes[index+y];bytes[index+y]=theByte;x++;y--}}module.exports=endianness},function(module,exports){/**
 @struct
 @constructor
 @param {number} bits
 @param {boolean} signed
 @throws {Error}
 */
var Integer=function(bits,signed){/** @type {number} */ this.bits=bits;/** @type {boolean} */ this.signed=signed;/** @type {number} */ this.offset=0;/** @type {number} */ this.min=-Infinity;/** @type {number} */ this.max=Infinity;/** @private @type {number} */ this.realBits_=this.bits;/** @private @type {number} */ this.lastByteMask_=255;this.build_()};/**
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number=} i
 @return {number}
 */
Integer.prototype.read=function(bytes,i){i=i===undefined?0:i;var num=0;var x=this.offset-1;while(x>0){num=bytes[x+i]<<x*8|num;x--}num=(bytes[i]|num)>>>0;return this.overflow_(this.sign_(num))};/**
 @param {!Array<number>} bytes
 @param {number} number
 @param {number=} j
 @return {number}
 */
Integer.prototype.write=function(bytes,number,j){j=j===undefined?0:j;number=this.overflow_(number);bytes[j++]=number&255;for(var i=2;i<=this.offset;i++)bytes[j++]=Math.floor(number/Math.pow(2,(i-1)*8))&255;return j};/**
 @private
 @param {!Array<number>} bytes
 @param {number} number
 @param {number=} j
 @return {number}
 */
Integer.prototype.writeEsoteric_=function(bytes,number,j){j=j===undefined?0:j;number=this.overflow_(number);j=this.writeFirstByte_(bytes,number,j);for(var i=2;i<this.offset;i++)bytes[j++]=Math.floor(number/Math.pow(2,(i-1)*8))&255;if(this.bits>8)bytes[j++]=Math.floor(number/Math.pow(2,(this.offset-1)*8))&this.lastByteMask_;return j};/**
 @private
 @param {(!Array<number>|!Uint8Array)} bytes
 @param {number=} i
 @return {number}
 */
Integer.prototype.readBits_=function(bytes,i){i=i===undefined?0:i;var binary="";var j=0;while(j<this.offset){var bits=bytes[i+j].toString(2);binary=(new Array(9-bits.length)).join("0")+bits+binary;j++}return this.overflow_(this.sign_(parseInt(binary,2)))};/** @private @throws {Error} */ Integer.prototype.build_=function(){this.setRealBits_();this.setLastByteMask_();this.setMinMax_();this.offset=this.bits<8?1:Math.ceil(this.realBits_/8);if(this.realBits_!=this.bits||this.bits<8||this.bits>32){this.write=
this.writeEsoteric_;this.read=this.readBits_}};/**
 @private
 @param {number} num
 @return {number}
 */
Integer.prototype.sign_=function(num){if(num>this.max)num-=this.max*2+2;return num};/**
 @private
 @param {number} value
 @return {number}
 */
Integer.prototype.overflow_=function(value){if(value>this.max)throw new Error("Overflow.");else if(value<this.min)throw new Error("Underflow.");return value};/** @private */ Integer.prototype.setMinMax_=function(){var max=Math.pow(2,this.bits);if(this.signed){this.max=max/2-1;this.min=-max/2}else{this.max=max-1;this.min=0}};/** @private */ Integer.prototype.setRealBits_=function(){if(this.bits>8)this.realBits_=(this.bits-1|7)+1};/** @private */ Integer.prototype.setLastByteMask_=function(){var r=
8-(this.realBits_-this.bits);this.lastByteMask_=Math.pow(2,r>0?r:8)-1};/**
 @private
 @param {!Array<number>} bytes
 @param {number} number
 @param {number} j
 @return {number}
 */
Integer.prototype.writeFirstByte_=function(bytes,number,j){if(this.bits<8)bytes[j++]=number<0?number+Math.pow(2,this.bits):number;else bytes[j++]=number&255;return j};module.exports=Integer},function(module,exports){/** @type {!Object} */ module.exports={/** @export @type {!Object} */ chr:{"bits":8,"char":true},/** @export @type {!Object} */ fourCC:{"bits":32,"char":true},/** @export @type {!Object} */ bool:{"bits":1},/** @export @type {!Object} */ int2:{"bits":2,"signed":true},/** @export @type {!Object} */ uInt2:{"bits":2},
/** @export @type {!Object} */ int4:{"bits":4,"signed":true},/** @export @type {!Object} */ uInt4:{"bits":4},/** @export @type {!Object} */ int8:{"bits":8,"signed":true},/** @export @type {!Object} */ uInt8:{"bits":8},/** @export @type {!Object} */ int16:{"bits":16,"signed":true},/** @export @type {!Object} */ uInt16:{"bits":16},/** @export @type {!Object} */ float16:{"bits":16,"float":true},/** @export @type {!Object} */ int24:{"bits":24,"signed":true},/** @export @type {!Object} */ uInt24:{"bits":24},
/** @export @type {!Object} */ int32:{"bits":32,"signed":true},/** @export @type {!Object} */ uInt32:{"bits":32},/** @export @type {!Object} */ float32:{"bits":32,"float":true},/** @export @type {!Object} */ int40:{"bits":40,"signed":true},/** @export @type {!Object} */ uInt40:{"bits":40},/** @export @type {!Object} */ int48:{"bits":48,"signed":true},/** @export @type {!Object} */ uInt48:{"bits":48},/** @export @type {!Object} */ float64:{"bits":64,"float":true},/** @export @type {!Object} */ int16BE:{"bits":16,
"signed":true,"be":true},/** @export @type {!Object} */ uInt16BE:{"bits":16,"be":true},/** @export @type {!Object} */ float16BE:{"bits":16,"float":true,"be":true},/** @export @type {!Object} */ int24BE:{"bits":24,"signed":true,"be":true},/** @export @type {!Object} */ uInt24BE:{"bits":24,"be":true},/** @export @type {!Object} */ int32BE:{"bits":32,"signed":true,"be":true},/** @export @type {!Object} */ uInt32BE:{"bits":32,"be":true},/** @export @type {!Object} */ float32BE:{"bits":32,"float":true,
"be":true},/** @export @type {!Object} */ int40BE:{"bits":40,"signed":true,"be":true},/** @export @type {!Object} */ uInt40BE:{"bits":40,"be":true},/** @export @type {!Object} */ int48BE:{"bits":48,"signed":true,"be":true},/** @export @type {!Object} */ uInt48BE:{"bits":48,"be":true},/** @export @type {!Object} */ float64BE:{"bits":64,"float":true,"be":true}}},function(module,exports){/** @private @const @type {!Array<number>} */ var INDEX_TABLE=[-1,-1,-1,-1,2,4,6,8,-1,-1,-1,-1,2,4,6,8];/** @private @const @type {!Array<number>} */ var STEP_TABLE=
[7,8,9,10,11,12,13,14,16,17,19,21,23,25,28,31,34,37,41,45,50,55,60,66,73,80,88,97,107,118,130,143,157,173,190,209,230,253,279,307,337,371,408,449,494,544,598,658,724,796,876,963,1060,1166,1282,1411,1552,1707,1878,2066,2272,2499,2749,3024,3327,3660,4026,4428,4871,5358,5894,6484,7132,7845,8630,9493,10442,11487,12635,13899,15289,16818,18500,20350,22385,24623,27086,29794,32767];/** @private @type {number} */ var encoderPredicted_=0;/** @private @type {number} */ var encoderIndex_=0;/** @private @type {number} */ var encoderStep_=
7;/** @private @type {number} */ var decoderPredicted_=0;/** @private @type {number} */ var decoderIndex_=0;/** @private @type {number} */ var decoderStep_=7;/**
 @param {!Array<number>} samples
 @return {!Array<number>}
 */
function encode(samples){/** @type {!Array<number>} */ var adpcmSamples=[];/** @type {Array<number>} */ var block=[];for(var i=0;i<samples.length;i++){block.push(samples[i]);if(i%505==0&&i!=0||i==samples.length-1){adpcmSamples=adpcmSamples.concat(encodeBlock(block));block=[]}}return adpcmSamples}/**
 @param {!Array<number>} adpcmSamples
 @param {number} blockAlign
 @return {!Array<number>}
 */
function decode(adpcmSamples,blockAlign){blockAlign=blockAlign===undefined?256:blockAlign;/** @type {!Array<number>} */ var samples=[];/** @type {!Array<number>} */ var block=[];for(var i=0;i<adpcmSamples.length;i++){if(i%blockAlign==0&&i!=0){samples=samples.concat(decodeBlock(block));block=[]}block.push(adpcmSamples[i])}return samples}/**
 @param {!Array<number>} block
 @return {!Array<number>}
 */
function encodeBlock(block){/** @type {!Array<number>} */ var adpcmSamples=blockHead_(block[0]);for(var i=3;i<block.length;i+=2){/** @type {number} */ var sample2=encodeSample_(block[i]);/** @type {number} */ var sample=encodeSample_(block[i+1]);adpcmSamples.push(sample<<4|sample2)}while(adpcmSamples.length<256)adpcmSamples.push(0);return adpcmSamples}/**
 @param {!Array<number>} block
 @return {!Array<number>}
 */
function decodeBlock(block){decoderPredicted_=sign_(block[1]<<8|block[0]);decoderIndex_=block[2];decoderStep_=STEP_TABLE[decoderIndex_];/** @type {!Array<number>} */ var result=[decoderPredicted_,sign_(block[3]<<8|block[2])];for(var i=4;i<block.length;i++){/** @type {number} */ var original_sample=block[i];/** @type {number} */ var second_sample=original_sample>>4;/** @type {number} */ var first_sample=second_sample<<4^original_sample;result.push(decodeSample_(first_sample));result.push(decodeSample_(second_sample))}return result}
/**
 @private
 @param {number} num
 @return {number}
 */
function sign_(num){return num>32768?num-65536:num}/**
 @private
 @param {number} sample
 @return {number}
 */
function encodeSample_(sample){/** @type {number} */ var delta=sample-encoderPredicted_;/** @type {number} */ var value=0;if(delta>=0)value=0;else{value=8;delta=-delta}/** @type {number} */ var step=STEP_TABLE[encoderIndex_];/** @type {number} */ var diff=step>>3;if(delta>step){value|=4;delta-=step;diff+=step}step>>=1;if(delta>step){value|=2;delta-=step;diff+=step}step>>=1;if(delta>step){value|=1;diff+=step}updateEncoder_(value,diff);return value}/**
 @private
 @param {number} value
 @param {number} diff
 */
function updateEncoder_(value,diff){if(value&8)encoderPredicted_-=diff;else encoderPredicted_+=diff;if(encoderPredicted_<-32768)encoderPredicted_=-32768;else if(encoderPredicted_>32767)encoderPredicted_=32767;encoderIndex_+=INDEX_TABLE[value&7];if(encoderIndex_<0)encoderIndex_=0;else if(encoderIndex_>88)encoderIndex_=88}/**
 @private
 @param {number} nibble
 @return {number}
 */
function decodeSample_(nibble){/** @type {number} */ var difference=0;if(nibble&4)difference+=decoderStep_;if(nibble&2)difference+=decoderStep_>>1;if(nibble&1)difference+=decoderStep_>>2;difference+=decoderStep_>>3;if(nibble&8)difference=-difference;decoderPredicted_+=difference;if(decoderPredicted_>32767)decoderPredicted_=32767;else if(decoderPredicted_<-32767)decoderPredicted_=-32767;updateDecoder_(nibble);return decoderPredicted_}/**
 @private
 @param {number} nibble
 */
function updateDecoder_(nibble){decoderIndex_+=INDEX_TABLE[nibble];if(decoderIndex_<0)decoderIndex_=0;else if(decoderIndex_>88)decoderIndex_=88;decoderStep_=STEP_TABLE[decoderIndex_]}/**
 @private
 @param {number} sample
 @return {!Array<number>}
 */
function blockHead_(sample){encodeSample_(sample);/** @type {!Array<number>} */ var adpcmSamples=[];adpcmSamples.push(sample&255);adpcmSamples.push(sample>>8&255);adpcmSamples.push(encoderIndex_);adpcmSamples.push(0);return adpcmSamples}/** @export */ module.exports.encode=encode;/** @export */ module.exports.decode=decode;/** @export */ module.exports.encodeBlock=encodeBlock;/** @export */ module.exports.decodeBlock=decodeBlock},function(module,exports,__webpack_require__){/** @export */ module.exports.alaw=
__webpack_require__(10);/** @export */ module.exports.mulaw=__webpack_require__(11)},function(module,exports){/** @const @type {!Array<number>} */ var LOG_TABLE=[1,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7];/**
 @param {number} sample
 @return {number}
 */
function encodeSample(sample){/** @type {number} */ var compandedValue;sample=sample==-32768?-32767:sample;/** @type {number} */ var sign=~sample>>8&128;if(!sign)sample=sample*-1;if(sample>32635)sample=32635;if(sample>=256){/** @type {number} */ var exponent=LOG_TABLE[sample>>8&127];/** @type {number} */ var mantissa=sample>>exponent+3&15;compandedValue=exponent<<4|mantissa}else compandedValue=sample>>4;return compandedValue^(sign^85)}/**
 @param {number} aLawSample
 @return {number}
 */
function decodeSample(aLawSample){/** @type {number} */ var sign=0;aLawSample^=85;if(aLawSample&128){aLawSample&=~(1<<7);sign=-1}/** @type {number} */ var position=((aLawSample&240)>>4)+4;/** @type {number} */ var decoded=0;if(position!=4)decoded=1<<position|(aLawSample&15)<<position-4|1<<position-5;else decoded=aLawSample<<1|1;decoded=sign===0?decoded:-decoded;return decoded*8*-1}/**
 @param {!Array<number>} samples
 @return {!Array<number>}
 */
function encode(samples){/** @type {!Array<number>} */ var aLawSamples=[];for(var i=0;i<samples.length;i++)aLawSamples.push(encodeSample(samples[i]));return aLawSamples}/**
 @param {!Array<number>} samples
 @return {!Array<number>}
 */
function decode(samples){/** @type {!Array<number>} */ var pcmSamples=[];for(var i=0;i<samples.length;i++)pcmSamples.push(decodeSample(samples[i]));return pcmSamples}/** @export */ module.exports.encodeSample=encodeSample;/** @export */ module.exports.decodeSample=decodeSample;/** @export */ module.exports.encode=encode;/** @export */ module.exports.decode=decode},function(module,exports){/** @private @const @type {number} */ var BIAS=132;/**
 @param {number} pcmSample
 @return {number}
 */
function encodeSample(pcmSample){/** @type {number} */ var mask=255;if(pcmSample<0){pcmSample=BIAS-pcmSample;mask=127}else pcmSample+=BIAS;if(pcmSample>32767)pcmSample=32767;/** @type {number} */ var seg=segmentValue_(pcmSample);/** @type {number} */ var uval=seg<<4|pcmSample>>seg+3&15;return uval^mask}/**
 @param {number} muLawSample
 @return {number}
 */
function decodeSample(muLawSample){muLawSample=~muLawSample;/** @type {number} */ var t=((muLawSample&15)<<3)+BIAS;t<<=(muLawSample&112)>>4;return muLawSample&128?BIAS-t:t-BIAS}/**
 @param {!Array<number>} samples
 @return {!Array<number>}
 */
function encode(samples){/** @type {!Array<number>} */ var muLawSamples=[];for(var i=0;i<samples.length;i++)muLawSamples.push(encodeSample(samples[i]));return muLawSamples}/**
 @param {!Array<number>} samples
 @return {!Array<number>}
 */
function decode(samples){/** @type {!Array<number>} */ var pcmSamples=[];for(var i=0;i<samples.length;i++)pcmSamples.push(decodeSample(samples[i]));return pcmSamples}/**
 @private
 @param {number} sample
 @return {number}
 */
function segmentValue_(sample){/** @type {number} */ var segment=0;sample>>=7;if(sample&240){sample>>=4;segment+=4}if(sample&12){sample>>=2;segment+=2}if(sample&2)segment+=1;return segment}/** @export */ module.exports.encodeSample=encodeSample;/** @export */ module.exports.decodeSample=decodeSample;/** @export */ module.exports.encode=encode;/** @export */ module.exports.decode=decode},function(module,exports){(function(){var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup=new Uint8Array(256);for(var i=0;i<chars.length;i++)lookup[chars.charCodeAt(i)]=i;exports.encode=function(arraybuffer){var bytes=new Uint8Array(arraybuffer),i,len=bytes.length,base64="";for(i=0;i<len;i+=3){base64+=chars[bytes[i]>>2];base64+=chars[(bytes[i]&3)<<4|bytes[i+1]>>4];base64+=chars[(bytes[i+1]&15)<<2|bytes[i+2]>>6];base64+=chars[bytes[i+2]&63]}if(len%3===2)base64=base64.substring(0,base64.length-1)+"\x3d";else if(len%3===1)base64=base64.substring(0,base64.length-2)+"\x3d\x3d";return base64};
exports.decode=function(base64){var bufferLength=base64.length*.75,len=base64.length,i,p=0,encoded1,encoded2,encoded3,encoded4;if(base64[base64.length-1]==="\x3d"){bufferLength--;if(base64[base64.length-2]==="\x3d")bufferLength--}var arraybuffer=new ArrayBuffer(bufferLength),bytes=new Uint8Array(arraybuffer);for(i=0;i<len;i+=4){encoded1=lookup[base64.charCodeAt(i)];encoded2=lookup[base64.charCodeAt(i+1)];encoded3=lookup[base64.charCodeAt(i+2)];encoded4=lookup[base64.charCodeAt(i+3)];bytes[p++]=encoded1<<
2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63}return arraybuffer}})()}])});