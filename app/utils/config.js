
const _module = {
    getStorageAccountName: () => {
        const matches = /AccountName=(.*?);/.exec(process.env.AZURE_CONNECTION);
        return matches[1];
    }
};

module.exports = _module;