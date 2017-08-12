"use strict";
var ApiClient = require('nativescript-apiclient');
var Enumerable = require('nativescript-enumerable');
var TypeUtils = require('utils/types');
/**
 * List of entry types.
 */
(function (EntryType) {
    /**
     * Folder
     */
    EntryType[EntryType["Folder"] = 0] = "Folder";
    /**
     * File
     */
    EntryType[EntryType["File"] = 1] = "File";
})(exports.EntryType || (exports.EntryType = {}));
var EntryType = exports.EntryType;
/**
 * A DropBox client.
 */
var DropBoxClient = (function () {
    /**
     * Initializes a new instance of that class.
     *
     * @param {string} token The access token to use.
     */
    function DropBoxClient(token) {
        this._accessToken = token;
    }
    Object.defineProperty(DropBoxClient.prototype, "accessToken", {
        /**
         * Gets the access token.
         */
        get: function () {
            return this._accessToken;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Lists a folder.
     *
     * @param {string} Path The path.
     * @param {Function} callback The result callback.
     */
    DropBoxClient.prototype.listFolder = function (path, callback) {
        if (path === void 0) { path = ''; }
        var me = this;
        var client = ApiClient.newClient({
            baseUrl: 'https://api.dropboxapi.com/2/files/list_folder',
            authorizer: new ApiClient.BearerAuth(this._accessToken),
        });
        var code = 1;
        var entries;
        var error;
        var hasMore;
        var finish = function () {
            callback({
                code: code,
                entries: entries,
                error: error,
                hasMore: hasMore,
                path: path,
            });
        };
        client.succeededRequest(function (result) {
            var jsonResp = result.getJSON();
            code = 0;
            hasMore = jsonResp.has_more;
            if (TypeUtils.isNullOrUndefined(jsonResp.entries)) {
                entries = [];
            }
            else {
                entries = Enumerable.fromArray(jsonResp.entries)
                    .where(function (x) { return !TypeUtils.isNullOrUndefined(x); })
                    .select(function (x) {
                    // IFolderEntry
                    var entry;
                    entry = {
                        delete: function (delCallback) {
                            var terminator = ApiClient.newClient({
                                authorizer: new ApiClient.BearerAuth(me.accessToken),
                                baseUrl: 'https://api.dropboxapi.com/2/files/delete',
                            });
                            var termCode = 1;
                            var termError;
                            var termFinish = function () {
                                if (!TypeUtils.isNullOrUndefined(delCallback)) {
                                    delCallback({
                                        code: termCode,
                                        error: termError,
                                    });
                                }
                            };
                            terminator.succeededRequest(function () {
                                termCode = 0;
                            }).clientOrServerError(function (delResult) {
                                termCode = -2;
                                termError = 'Server returned code: ' + delResult.code + ' => ' + delResult.getString();
                            }).error(function (delCtx) {
                                termCode = -1;
                                termError = delCtx.error;
                            }).complete(function () {
                                termFinish();
                            });
                            terminator.post({
                                content: {
                                    path: entry.path,
                                },
                                type: ApiClient.HttpRequestType.JSON,
                            });
                        },
                        id: x.id,
                        name: x.name,
                        path: x.path_display,
                    };
                    var tag = (TypeUtils.isNullOrUndefined(x['.tag']) ? '' : ('' + x['.tag'])).toLowerCase().trim();
                    switch (tag) {
                        case 'folder':
                            entry.type = EntryType.Folder;
                            entry.uploadFile = function (fileToUpload, ulCallback) {
                                me.uploadFileTo(fileToUpload, path, ulCallback);
                            };
                            break;
                        case 'file':
                            entry.type = EntryType.File;
                            entry.download = function (callback) {
                                var downloadClient = ApiClient.newClient({
                                    authorizer: new ApiClient.BearerAuth(me.accessToken),
                                    baseUrl: 'https://content.dropboxapi.com/2/files/download',
                                });
                                downloadClient.addLogger(function (dlMsg) {
                                    console.log('DropBoxDemo.DropBoxClient.download(' + entry.path + '): ' + dlMsg.message);
                                });
                                var dlCode = 1;
                                var dlError;
                                var dlFile;
                                var finishDownload = function () {
                                    callback({
                                        code: dlCode,
                                        file: entry,
                                        localFile: dlFile,
                                    });
                                };
                                downloadClient.succeededRequest(function (dlResult) {
                                    try {
                                        dlFile = dlResult.getFile();
                                        dlCode = 0;
                                    }
                                    catch (dlE) {
                                        dlCode = -3;
                                        dlError = dlE;
                                    }
                                }).clientOrServerError(function (dlResult) {
                                    dlCode = -2;
                                    dlError = 'Server returned code: ' + dlResult.code + ' => ' + dlResult.getString();
                                }).error(function (dlCtx) {
                                    dlCode = -1;
                                    dlError = dlCtx.error;
                                }).complete(function () {
                                    finishDownload();
                                });
                                var apiArgs = {
                                    path: entry.path,
                                };
                                downloadClient.post({
                                    headers: {
                                        'Content-Type': '',
                                        'Dropbox-API-Arg': JSON.stringify(apiArgs),
                                    },
                                });
                            };
                            break;
                    }
                    return entry;
                })
                    .orderBy(function (x) { return x.type; })
                    .thenBy(function (x) { return x.path.toLowerCase().trim(); })
                    .toArray();
            }
        }).clientOrServerError(function (result) {
            code = -2;
            error = 'Server returned code: ' + result.code;
        }).error(function (ctx) {
            code = -1;
            error = ctx.error;
        }).complete(function () {
            finish();
        });
        client.post({
            content: {
                path: path,
                recursive: false,
                include_media_info: true,
                include_deleted: false,
                include_has_explicit_shared_members: false
            },
            type: ApiClient.HttpRequestType.JSON,
        });
    };
    /**
     * Uploads a file.
     *
     * @param {FileSystem.File} localFile The file to upload.
     * @param {String} [targetFolder] The custom target folder.
     * @param {Function} [callback] The optional result callback.
     */
    DropBoxClient.prototype.uploadFileTo = function (localFile, targetPath, callback) {
        if (targetPath === void 0) { targetPath = ''; }
        var readError;
        var dataToUpload = localFile.readSync(function (fileErr) {
            readError = fileErr;
        });
        var code = 1;
        var error;
        var finish = function () {
            if (!TypeUtils.isNullOrUndefined(callback)) {
                callback({
                    code: code,
                    error: error,
                });
            }
        };
        if (!TypeUtils.isNullOrUndefined(readError)) {
            code = -2;
            error = readError;
            finish();
        }
        else {
            var client = ApiClient.newClient({
                authorizer: new ApiClient.BearerAuth(this.accessToken),
                baseUrl: 'https://content.dropboxapi.com/2/files/upload',
            });
            client.succeededRequest(function () {
                code = 0;
            }).clientOrServerError(function (ulResult) {
                code = -2;
                error = 'Server returned code: ' + ulResult.code + ' => ' + ulResult.getString();
            }).error(function (ulCtx) {
                code = -1;
                error = ulCtx.error;
            }).complete(function () {
                finish();
            });
            var args = {
                path: targetPath,
                mode: "overwrite",
                autorename: true,
                mute: false
            };
            client.post({
                content: dataToUpload,
                type: ApiClient.HttpRequestType.Binary,
                headers: {
                    'Dropbox-API-Arg': JSON.stringify(args),
                }
            });
        }
    };
    return DropBoxClient;
}());
exports.DropBoxClient = DropBoxClient;
//# sourceMappingURL=DropBox.js.map