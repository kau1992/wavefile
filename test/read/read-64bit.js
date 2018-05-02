/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("64-bit reading", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wBytes = fs.readFileSync(path + "64bit-48kHz-noBext-mono.wav");
    let wav = new WaveFile(wBytes);

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16",
            function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 3 (IEEE)",
            function() {
        assert.equal(wav.fmt.audioFormat, 3);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 48000",
            function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it("byteRate should be 384000",
            function() {
        assert.equal(wav.fmt.byteRate, 384000);
    });
    it("blockAlign should be 8",
            function() {
        assert.equal(wav.fmt.blockAlign, 8);
    });
    it("bitsPerSample should be 64",
            function() {
        assert.equal(wav.fmt.bitsPerSample, 64);
    });
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav.data.samples.length > 0);
    });
});
