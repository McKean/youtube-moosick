import axios, {AxiosInstance} from "axios";
// no idea how to import these

import axios0 from "axios/lib/adapters/http";

axios.defaults.adapter = axios0;
import tough from "tough-cookie";
import _ from "lodash";
import {readdir} from "readdir-enhanced";
import * as enums from "./enums";
import {utils} from "./utils"
import {endPointType, categoryType, categoryURIBase64} from "./enums";

// no idea is this correct, probably is wrong
// query string is deprecated, use the modern one instead
//const querystring = require('querystring')

// you found a kitten, please collect it


// Binding for functions later on
// Probably wont work but see how
const BindToClass = (functionsObject, thisClass) => {
    for (let [functionKey, functionValue] of Object.entries(functionsObject)) {
        thisClass[functionKey] = functionValue.bind(thisClass);
    }
};

// ASYNC AWAIT SUPPORT EVERYWHERE, CALLBACK HELL IT IS NOW

export class ytMooSick {
    client: AxiosInstance;
    cookies: tough;
    ytCfg: any;

    constructor() {
        this.cookies = new tough.CookieJar()
        this.client = axios.create({
            baseURL: 'https://music.youtube.com/',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            withCredentials: true
        })

        this.client.interceptors.request.use(req => {
            const cookies = this.cookies.getCookieStringSync(req.baseURL)
            if (cookies && cookies.length > 0) {
                req.headers['Cookie'] = cookies
            }
            return req
        }, err => {
            return Promise.reject(err)
        })

        this.client.interceptors.response.use(res => {
            if (res.headers.hasOwnProperty('set-cookie')) {
                if (res.headers['set-cookie'] instanceof Array) {
                    res.headers['set-cookie'].map(value => {
                        this.cookies.setCookieSync(tough.Cookie.parse(value), res.config.baseURL)
                    })
                } else {
                    this.cookies.setCookieSync(tough.Cookie.parse(res.headers['set-cookie']), res.config.baseURL)
                }
            }
            return res
        })
    }

    // Soonner or later destructure functions into individual files

    _createApiRequest(endpointName: endPointType, inputVariables, inputQuery = {}) {
        const headers = Object.assign({
            'x-origin': this.client.defaults.baseURL,
            'X-Goog-Visitor-Id': this.ytCfg.VISITOR_DATA || '',
            'X-YouTube-Client-Name': this.ytCfg.INNERTUBE_CONTEXT_CLIENT_NAME,
            'X-YouTube-Client-Version': this.ytCfg.INNERTUBE_CLIENT_VERSION,
            'X-YouTube-Device': this.ytCfg.DEVICE,
            'X-YouTube-Page-CL': this.ytCfg.PAGE_CL,
            'X-YouTube-Page-Label': this.ytCfg.PAGE_BUILD_LABEL,
            'X-YouTube-Utc-Offset': String(-new Date().getTimezoneOffset()),
            'X-YouTube-Time-Zone': new Intl.DateTimeFormat().resolvedOptions().timeZone
        }, this.client.defaults.headers)

        return new Promise((resolve, reject) => {
            this.client.post(`youtubei/${this.ytCfg.INNERTUBE_API_VERSION}/${endpointName}?${querystring.stringify(Object.assign({
                alt: 'json',
                key: this.ytCfg.INNERTUBE_API_KEY
            }, inputQuery))}`, Object.assign(inputVariables, utils.createApiContext(this.ytCfg)), {
                responseType: 'json',
                headers: headers
            })
                .then(res => {
                    if (res.data.hasOwnProperty('responseContext')) {
                        resolve(res.data)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /**
     * Initialize the client for usage
     * @returns {Promise<unknown>} A ready to use API object
     */
    initialize() {
        return new Promise((resolve, reject) => {
            this.client.get('/')
                .then(res => {
                    try {
                        res.data.split('ytcfg.set(').map(v => {
                            try {
                                return JSON.parse(v.split(');')[0])
                            } catch (_) {
                            }
                        }).filter(Boolean).forEach(cfg => (this.ytCfg = Object.assign(cfg, this.ytCfg)))
                        resolve({
                            locale: this.ytCfg.LOCALE,
                            logged_in: this.ytCfg.LOGGED_IN
                        })
                    } catch (err) {
                        reject(err)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }


    /**
     * Get search suggestions from Youtube Music
     * @param query String query text to search
     * @returns {Promise<unknown>} An object formatted with utils class
     */
    getSearchSuggestions(query: String) {
        return new Promise((resolve, reject) => {
            this._createApiRequest('music/get_search_suggestions', {
                input: query
            })
                .then(content => {
                    try {
                        resolve(utils.fv(
                            content, 'searchSuggestionRenderer:navigationEndpoint:query'
                        ))
                    } catch (error) {
                        reject(error)
                    }
                })
                .catch(error => reject(error))
        })
    }


    /**
     * Searches for songs using the Youtube Music API
     * @param query String query text to search
     * @param categoryName Type of category to search
     * @param _pageLimit Max pages to obtain
     * @returns {Promise<unknown>} An object formatted by parsers.js
     */
    search(query: String, categoryName?: categoryType, _pageLimit: number = 1) {
        return new Promise((resolve, reject) => {
            let result = {};
            this._createApiRequest(endPointType.SEARCH, {
                query: query,
                params: utils.getCategoryURI(categoryName)
            })
                .then(context => {
                    try {
                        switch (_.upperCase(categoryName)) {
                            case categoryType.SONG:
                                result = parsers.parseSongSearchResult(context)
                                break
                            case categoryType.VIDEO:
                                result = parsers.parseVideoSearchResult(context)
                                break
                            case categoryType.ALBUM:
                                result = parsers.parseAlbumSearchResult(context)
                                break
                            case categoryType.ARTIST:
                                result = parsers.parseArtistSearchResult(context)
                                break
                            case categoryType.PLAYLISTS:
                                result = parsers.parsePlaylistSearchResult(context)
                                break
                            default:
                                result = parsers.parseSearchResult(context)
                                break
                        }
                        resolve(result)
                    } catch (error) {
                        return resolve({
                            error: error.message
                        })
                    }
                })
                .catch(error => reject(error))
        })
    }

    getAlbum(browseId: string) {
        if (_.startsWith(browseId, 'MPREb')) {
            return new Promise((resolve, reject) => {
                this._createApiRequest(endPointType.SEARCH, utils.buildEndpointContext(categoryType.ALBUM, browseId))
                    .then(context => {
                        try {
                            const result = parsers.parseAlbumPage(context)
                            resolve(result)
                        } catch (error) {
                            return resolve({
                                error: error.message
                            })
                        }
                    })
                    .catch(error => reject(error))
            })
        } else {
            throw new Error('invalid album browse id.')
        }
    }

    /**
     * Gets the playlist using the Youtube Music API
     * @param browseId The playlist ID, sanitized
     * @param contentLimit Maximum content to get
     * @returns {Promise<unknown>} An object formatted by the parser
     */
    getPlaylist(browseId: string, contentLimit: number = 100) {
        if (_.startsWith(browseId, 'VL') || _.startsWith(browseId, 'PL')) {
            _.startsWith(browseId, 'PL') && (browseId = 'VL' + browseId)
            return new Promise((resolve, reject) => {
                this._createApiRequest(endPointType.BROWSE, utils.buildEndpointContext(categoryType.PLAYLISTS, browseId))
                    .then(context => {
                        try {
                            var result = parsers.parsePlaylistPage(context)
                            const getContinuations = params => {
                                this._createApiRequest(endPointType.BROWSE, {}, {
                                    ctoken: params.continuation,
                                    continuation: params.continuation,
                                    itct: params.continuation.clickTrackingParams
                                })
                                    .then(context => {
                                        const continuationResult = parsers.parsePlaylistPage(context)
                                        if (Array.isArray(continuationResult.content)) {
                                            result.content = _.concat(result.content, continuationResult.content)
                                            result.continuation = continuationResult.continuation
                                        }
                                        if (!Array.isArray(continuationResult.continuation) && result.continuation instanceof Object) {
                                            if (contentLimit > result.content.length) {
                                                getContinuations(continuationResult.continuation)
                                            } else {
                                                return resolve(result)
                                            }
                                        } else {
                                            return resolve(result)
                                        }
                                    })
                            }

                            if (contentLimit > result.content.length && (!Array.isArray(result.continuation) && result.continuation instanceof Object)) {
                                getContinuations(result.continuation)
                            } else {
                                return resolve(result)
                            }
                        } catch (error) {
                            return resolve({
                                error: error.message
                            })
                        }
                    })
                    .catch(error => reject(error))
            })
        } else {
            throw new Error('invalid playlist id.')
        }
    }

    /**
     * Gets the artist details from Youtube Music
     * @param browseId The artist ID, sanitized
     * @returns {Promise<unknown>} An object formatted by the artist page
     */
    getArtist(browseId) {
        if (_.startsWith(browseId, 'UC')) {
            return new Promise((resolve, reject) => {
                this._createApiRequest(endPointType.BROWSE, utils.buildEndpointContext(categoryType.ARTIST, browseId))
                    .then(context => {
                        try {
                            const result = parsers.parseArtistPage(context)
                            resolve(result)
                        } catch (error) {
                            resolve({
                                error: error.message
                            })
                        }
                    })
                    .catch(error => reject(error))
            })
        } else {
            throw new Error('invalid artist browse id.')
        }
    }


}