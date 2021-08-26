import axios from 'axios';
import axios0 from 'axios/lib/adapters/http.js';
import tough from 'tough-cookie';
import { Category, EndPoint } from './enums.js';
import { utils } from './utils.js';
import { IllegalArgumentError, IllegalStateError } from './resources/errors/index.js';
import { URLSearchParams } from 'url';
import { GeneralParser } from './parsers/generalParser.js';
import { GetPlaylistParser } from './parsers/getPlaylistParser.js';
import { GetArtistParser } from './parsers/getArtistParser.js';
import { SearchSuggestions } from './resources/resultTypes/searchSuggestions.js';
import { GetAlbumParser } from './parsers/getAlbumParser.js';
import { AsyncConstructor } from './blocks/asyncConstructor.js';
axios.defaults.adapter = axios0;
// you found a kitten, please collect it
// Binding for functions later on
// Probably wont work but see how
// const bindAndCloneToContext = (
// 	from: Record<string | number | symbol, any>,
// 	ctx: Record<string | number | symbol, any>,
// ) => {
// 	Object.entries(from).forEach(([key, value]) => {
// 		if (typeof value === 'function') {
// 			ctx[key] = (value as (...args: any[]) => any).bind(ctx);
// 		}
// 	});
// };
export class MooSick extends AsyncConstructor {
    client;
    cookies;
    config;
    async new() {
        this.cookies = new tough.CookieJar();
        this.client = axios.create({
            baseURL: 'https://music.youtube.com/',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            withCredentials: true,
        });
        this.client.interceptors.request.use((req) => {
            if (!req.baseURL
                || !req.headers) {
                throw new IllegalStateError('Incomplete `req`');
            }
            const cookies = this.cookies.getCookieStringSync(req.baseURL);
            if (cookies && cookies.length > 0) {
                req.headers.Cookie = cookies;
            }
            return req;
        }, async (err) => Promise.reject(err));
        this.client.interceptors.response.use((res) => {
            if (!res.config?.baseURL
                || (typeof res.headers !== 'object')) {
                throw new IllegalStateError('Incomplete `req`');
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { headers } = res;
            if (headers['set-cookie'] == null) {
                return res;
            }
            if (headers['set-cookie'] instanceof Array) {
                headers['set-cookie'].forEach((value) => {
                    this.parseAndSetCookie(value, res.config.baseURL);
                });
            }
            else {
                this.parseAndSetCookie(headers['set-cookie'], res.config.baseURL);
            }
            return res;
        });
        const res = await this.client.get('/');
        const dataString = /(?<=ytcfg\.set\().+(?=\);)/.exec(res.data)?.[0];
        if (dataString == null) {
            throw new IllegalStateError('API initialization returned a nullish value');
        }
        const dataJSON = JSON.parse(dataString);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        this.config = {};
        // eslint-disable-next-line guard-for-in
        for (const dataJSONPart in dataJSON) {
            if (typeof dataJSONPart !== 'object') {
                return;
            }
            Object
                .entries(dataJSONPart)
                .forEach(([key, value]) => {
                // @ts-expect-error obj[string]
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                this.config[key] = value;
            });
        }
        return this;
    }
    static async new() {
        void super.new();
        return new MooSick().new();
    }
    parseAndSetCookie(cookieString, baseURL) {
        const cookie = tough.Cookie.parse(cookieString);
        if (cookie == null) {
            throw new IllegalArgumentError(`"${String(cookieString)}" is not a cookie`, 'cookieString');
        }
        this.cookies.setCookieSync(cookie, baseURL);
    }
    // Soonner or later destructure functions into individual files
    // TODO: probably define each api req's input vars & input queries,
    // then make this func generic so it's type safe
    async #createApiRequest(endpointName, inputVariables = {}, inputQuery = {}) {
        const res = await this.client.post(`youtubei/${this.config.INNERTUBE_API_VERSION}/${endpointName}?${
        // eslint is drunk
        // eslint-disable-next-line
        new URLSearchParams({
            alt: 'json',
            key: this.config.INNERTUBE_API_KEY,
            ...inputQuery,
        })
            .toString()}`, {
            ...inputVariables,
            ...utils.createApiContext(this.config),
        }, {
            responseType: 'json',
            headers: {
                'x-origin': this.client.defaults.baseURL ?? '',
                'X-Goog-Visitor-Id': this.config.VISITOR_DATA ?? '',
                'X-YouTube-Client-Name': this.config.INNERTUBE_CONTEXT_CLIENT_NAME,
                'X-YouTube-Client-Version': this.config.INNERTUBE_CLIENT_VERSION,
                'X-YouTube-Device': this.config.DEVICE,
                'X-YouTube-Page-CL': this.config.PAGE_CL,
                'X-YouTube-Page-Label': this.config.PAGE_BUILD_LABEL,
                'X-YouTube-Utc-Offset': String(-new Date().getTimezoneOffset()),
                'X-YouTube-Time-Zone': new Intl.DateTimeFormat().resolvedOptions().timeZone,
                ...this.client.defaults.headers,
            },
        });
        if (res.data?.responseContext != null) {
            return res.data;
        }
        throw new IllegalStateError('Youtube Music API request failed (`res.data?.responseContext` was nullish)');
    }
    /**
     * Get search suggestions from Youtube Music
     * @param query String query text to search
     * @returns An object formatted with utils class
     */
    async getSearchSuggestions(query) {
        const res = await this.#createApiRequest(EndPoint.SUGGESTIONS, {
            input: query,
        });
        if (res.contents == null) {
            throw new IllegalStateError('No results found');
        }
        const { contents } = res.contents[0].searchSuggestionsSectionRenderer;
        if (!contents) {
            throw new IllegalStateError('Results array not found');
        }
        return contents
            .map((searchSuggestionRenderer) => SearchSuggestions
            .from({
            title: searchSuggestionRenderer.searchSuggestionRenderer.suggestion.runs[0]?.text ?? '',
            artist: searchSuggestionRenderer.searchSuggestionRenderer.suggestion.runs[1]?.text ?? '',
        }));
    }
    /**
     * Searches for songs using the Youtube Music API
     * @param query String query text to search
     * @param categoryName Type of category to search
     * @param _pageLimit Max pages to obtain
     * @returns An object formatted by parsers.js
     */
    async search(query, categoryName, _pageLimit = 1) {
        const URI = categoryName ? utils.mapCategoryToURL(categoryName) : '';
        const ctx = await this.#createApiRequest(EndPoint.SEARCH, {
            query,
            params: URI,
        });
        // The cases are probably broken, tests might fail catastrophically
        return GeneralParser.parseSearchResult(ctx, categoryName);
    }
    /**
     * Gets the album details
     * @param browseId The Id of the album, without the https nonsense
     */
    async getAlbum(browseId) {
        if (!browseId.startsWith('MPREb')) {
            throw new IllegalArgumentError('Album browse IDs must start with "MPREb"', 'browseId');
        }
        const ctx = await this.#createApiRequest(EndPoint.SEARCH, utils.buildEndpointContext(Category.ALBUM, browseId));
        return GetAlbumParser.parseAlbumURLPage(ctx);
    }
    /**
     * Gets the playlist using the Youtube Music API
     * @param browseId The playlist ID, sanitized
     * @param contentLimit Maximum content to get
     * @returns An object formatted by the parser
     */
    async getPlaylist(browseId, contentLimit = 100) {
        if (!browseId.startsWith('VL')
            && !browseId.startsWith('PL')) {
            throw new IllegalArgumentError('Playlist browse IDs must start with "VL" or "PL"', 'browseId');
        }
        if (browseId.startsWith('PL')) {
            browseId = 'VL' + browseId;
        }
        const ctx = this.#createApiRequest(EndPoint.BROWSE, utils.buildEndpointContext(Category.PLAYLIST, browseId));
        const result = GetPlaylistParser.parsePlaylistURL(ctx);
        while (contentLimit > result.playlistContents.length
            && result.continuation) {
            const { continuation, clickTrackingParams } = result.continuation;
            const ctx = this.#createApiRequest(EndPoint.BROWSE, {}, {
                ctoken: continuation,
                continuation,
                itct: clickTrackingParams,
            });
            const continuationResult = GetPlaylistParser.parsePlaylistURL(ctx);
            // FIXME: in stale/index.js, they reference `.content` instead. is this a conscious change?
            // I think i forgotten to change it, but i dont have faith on this system working,
            // it relies on the old structure which i have modified
            if (!Array.isArray(continuationResult.playlistContents)) {
                throw new IllegalStateError('Browse API responded with non-array `playlistContents`');
            }
            result.playlistContents.push(...continuationResult.playlistContents);
            result.continuation = continuationResult.continuation;
        }
        return result;
    }
    /**
     * Gets the artist details from Youtube Music
     * @param browseId The artist ID, sanitized
     * @returns An object formatted by the artist page
     */
    async getArtist(browseId) {
        if (!browseId.startsWith('UC')) {
            throw new IllegalArgumentError('Artist browse IDs must start with "UC"', 'browseId');
        }
        const ctx = await this.#createApiRequest(EndPoint.BROWSE, utils.buildEndpointContext(Category.ARTIST, browseId));
        return GetArtistParser.parseArtistURLPage(ctx);
    }
}
//# sourceMappingURL=index.js.map