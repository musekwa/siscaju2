
export default {
    GenerateSW: options => {
        options.skipWaiting = true;
        return options;
    },
    InjecManifest: options => {

        options.maximumFileSizeToCacheInBytes = 10 * 1024 * 1024;
        return options;
    }
}