/*
 * riff
 * Get the chunks of a RIFF file.
 * TODO: This should be a npm package on its own.
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */

const byteData = require("byte-data");

/**
 * Get the chunks of a RIFF file.
 * @param {Uint8Array|!Array<number>} buffer the RIFF file bytes.
 * @param {boolean} bigEndian true if its RIFX.
 * @return {Object}
 */
function getChunks(buffer, bigEndian) {
    
    // RIFF container
    let chunkId = byteData.fromBytes(
            buffer.slice(0, 4), 8, {"char": true}
        );
    let chunkSize = byteData.fromBytes(
            buffer.slice(4, 8), 32, {'be': bigEndian}
        )[0];
    let format = byteData.fromBytes(
            buffer.slice(8, 12), 8, {"char": true}
        );

    let chunks = [];
    let len = buffer.length;
    let i = 12;
    while(i < len) {
        let subChunkSize = byteData.fromBytes(
            buffer.slice(i + 4, i + 8), 32, {'be': bigEndian})[0];
        chunks.push({
                "subChunkId": byteData.fromBytes(buffer.slice(i, i + 4), 8, {"char": true}),
                "subChunkSize": subChunkSize,
                "subChunkData": buffer.slice(i + 8, i + 8 + subChunkSize)
            });
        i = i + 8 + subChunkSize;
    }
    return {
        "chunkId": chunkId,
        "chunkSize": chunkSize,
        "format": format,
        "subChunks": chunks
    }
}

module.exports.getChunks = getChunks;