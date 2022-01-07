/* eslint-disable */
const sizeof = require('object-sizeof');

const FeatureExtractor = require('../../features/FeatureExtractor');
const logger = require('../../logging');
const { StatsFormat } = require('../../utils/stats-detection');
const { strict: assert } = require('assert');
const fs = require('fs');

async function simulateConnection(dumpPath, resultPath, statsFormat) {

    const dumpMeta = {
        endpointId: '1a404b1b',
        dumpPath: dumpPath,
        statsFormat: statsFormat
    };

    const featExtractor = new FeatureExtractor(dumpMeta);
    const results = await featExtractor.extract();

    const resultString = fs.readFileSync(resultPath);
    const resultList = JSON.parse(resultString);
    const resultTemplate = resultList.shift();

    assert.deepStrictEqual(results, resultTemplate.features);
}

describe('Feature extraction tests', () => {

    test('SFU dump feature extraction', async () => {
        await simulateConnection(
            './src/test/jest/sfu',
            '',
            StatsFormat.STANDARD
        );
    });

    test('SFU and P2P dump feature extraction', async () => {
        await simulateConnection(
            './src/test/jest/sfu-p2p',
            '',
            StatsFormat.STANDARD
        );
    });

    test('Chrome in a peer-to-peer call', async () => {
        await simulateConnection(
            './src/test/dumps/google-standard-stats-p2p',
            './src/test/results/google-standard-stats-p2p-result.json',
            StatsFormat.CHROME_STANDARD
        );
    });

    test('Chrome in a multi-party call', async () => {
        await simulateConnection(
            './src/test/dumps/google-standard-stats-sfu',
            './src/test/results/google-standard-stats-sfu-result.json',
            StatsFormat.CHROME_STANDARD
        );
    });

    test('Firefox in a multi-party call', async () => {
        await simulateConnection(
            './src/test/dumps/firefox-standard-stats-sfu',
            './src/test/results/firefox-standard-stats-sfu-result.json',
            StatsFormat.FIREFOX
        );
    });

    test('Safari in a peer-to-peer call', async () => {
        await simulateConnection(
            './src/test/dumps/safari-standard-stats',
            './src/test/results/safari-standard-stats-result.json',
            StatsFormat.SAFARI
        );
    });
});

