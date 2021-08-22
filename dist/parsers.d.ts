import { categoryType } from './enums';
import { PlaylistURL } from './resources/resultTypes/playlistURL';
export declare class parsers {
    static parseSearchResult(context: any, searchType?: categoryType): any;
    /**
     * Build the song item
     * @private
     * @param sectionContext
     */
    private static parseSongSearchResult;
    private static parseVideoSearchResult;
    private static parsePlaylistSearchResult;
    static parsePlaylistURL(context: any): PlaylistURL;
    private static playlistURLHeaderParser;
}
