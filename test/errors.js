/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let chai = require("chai");
let expect = chai.expect;

describe('errors', function() {
    
    let fs = require("fs");
    const WaveFile = require("../test/loader.js");
    let path = "test/files/";
    let testFunc;
        
    it("should throw an error if not a RIFF or RIFX file",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "RF64-64-bit-8kHz--mono-bext.wav");
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
        };
        expect(testFunc).to.throw("Not a supported format.");
    });

    it("should throw an error if there is no 'WAVE' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav");
            wBytes[10] = 0;
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);

        };
        expect(testFunc).to.throw("Could not find the 'WAVE' format identifier");
    });

    it("should throw an error if there is no 'fmt ' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav");
            wBytes[14] = 0;
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
        };
        expect(testFunc).to.throw("Could not find the 'fmt ' chunk");
    });

    it("should throw an error if there is no 'data' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            wBytes[36] = 0;
            let wav = new WaveFile(wBytes);
        };
        expect(testFunc).to.throw("Could not find the 'data' chunk");
    });

    it("should throw an error if the sample rate is < 1",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
            wav.fmt.sampleRate = 0;
            wav.toBuffer();
        };
        expect(testFunc).to.throw("Invalid sample rate.");
    });

    it("should throw an error if the number of channels is < 1",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
            wav.fmt.numChannels = 0;
            wav.toBuffer();
        };
        expect(testFunc).to.throw("Invalid number of channels.");
    });

    it("should throw an error if enforceFact is true and there is not 'fact' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new WaveFile();
            wav.enforceFact_ = true;
            wav.fromBuffer(wBytes);
            wav.toBuffer();
        };
        expect(testFunc).to.throw("Could not find the 'fact' chunk");
    });

    it("should throw an error if the bit depth is not valid",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
            wav.bitDepth = 3;
            wav.toBuffer();
        };
        expect(testFunc).to.throw("Invalid bit depth.");
    });

    it("should throw an error for toIMAADPCM() and sample rate != 8000 Hz",
            function () {
        testFunc = function() {
            let wav = new WaveFile(fs.readFileSync(path + "16bit-16kHz-markers-mono.wav"));
            wav.toIMAADPCM();
        };
        expect(testFunc).to.throw("Only 8000 Hz files can be compressed as IMA-ADPCM.");
    });

    it("should throw an error for toIMAADPCM() and numChannels != 1",
            function () {
        testFunc = function() {
            let wav = new WaveFile(fs.readFileSync(path + "16bit-8kHz-stereo.wav"));
            wav.toIMAADPCM();
        };
        expect(testFunc).to.throw("Only mono files can be compressed as IMA-ADPCM.");
    });
});
