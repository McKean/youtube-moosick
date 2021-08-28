import { $$, $ } from '../resources/utilities/objectScan.utility.js';
import { Category, ConstantURLs, FlexColumnOffset } from '../enums.js';
import { Song } from '../resources/generalTypes/song.js';
import { Video } from '../resources/generalTypes/video.js';
import { Playlist } from '../resources/generalTypes/playlist.js';
import { ArtistExtended } from '../resources/generalTypes/artist.js';
import { ParsersExtended } from './parsersExtended.js';
import { Results } from '../resources/resultTypes/results.js';
import { WatchEndpointParams } from '../resources/rawResultTypes/common.js';
export class GeneralParser {
    // eslint-disable-next-line complexity
    static parseSearchResult(context, searchType) {
        // prep all the parts
        const albums = [];
        const videos = [];
        const playlists = [];
        const artist = [];
        const songs = [];
        const continuation = searchType ? $$('.nextContinuationData')(context)[0] : undefined;
        const musicShelf = $$('.musicShelfRenderer')(context);
        for (const shelfItem of musicShelf) {
            const shelfContent = $$('.musicResponsiveListItemRenderer')(shelfItem);
            for (const item of shelfContent) {
                const flexColumnRenderer = $$('.musicResponsiveListItemFlexColumnRenderer')(item);
                const category = searchType ?? (flexColumnRenderer[FlexColumnOffset.ALT].text.runs[0].text).toUpperCase();
                switch (category) {
                    case 'SONG': {
                        const display = $('.musicResponsiveListItemFlexColumnRenderer')(item);
                        songs.push(Song.from({
                            ...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[FlexColumnOffset.ALT].text.runs, Category.SONG, Boolean(searchType)),
                            ...GeneralParser.musicResponsiveListItemRendererParser(item),
                            thumbnails: ParsersExtended.thumbnailParser(item),
                            playlistId: $('.playlistId')(display),
                            params: WatchEndpointParams.WAEB,
                        }));
                        break;
                    }
                    case 'VIDEO': {
                        videos.push(Video.from({
                            ...GeneralParser.musicResponsiveListItemRendererParser(item),
                            ...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[FlexColumnOffset.ALT].text.runs, Category.VIDEO, Boolean(searchType)),
                            thumbnails: ParsersExtended.thumbnailParser(item),
                        }));
                        break;
                    }
                    case 'PLAYLIST': {
                        playlists.push(Playlist.from({
                            name: $('.text')(flexColumnRenderer),
                            browseId: item.navigationEndpoint?.browseEndpoint?.browseId ?? '',
                            ...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[FlexColumnOffset.ALT].text.runs, Category.PLAYLIST, Boolean(searchType)),
                        }));
                        break;
                    }
                    case 'ARTIST': {
                        artist.push(ArtistExtended.from({
                            name: flexColumnRenderer[FlexColumnOffset.MAIN].text.runs[FlexColumnOffset.ONLYRUN].text,
                            browseId: item.navigationEndpoint?.browseEndpoint?.browseId ?? '',
                            thumbnails: ParsersExtended.thumbnailParser(item),
                            url: `${ConstantURLs.CHANNEL_URL}${item.navigationEndpoint?.browseEndpoint?.browseId ?? ''}`,
                            ...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[FlexColumnOffset.ALT].text.runs, Category.ARTIST, Boolean(searchType)),
                        }));
                        break;
                    }
                    case 'ALBUM':
                    case 'SINGLE':
                    case 'EP': {
                        albums.push({
                            ...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[FlexColumnOffset.ALT].text.runs, Category.ARTIST, Boolean(searchType)),
                            name: flexColumnRenderer[FlexColumnOffset.MAIN].text.runs[FlexColumnOffset.ONLYRUN].text,
                            browseId: item.navigationEndpoint?.browseEndpoint?.browseId ?? '',
                            url: `${ConstantURLs.CHANNEL_URL}${item.navigationEndpoint?.browseEndpoint?.browseId ?? ''}`,
                            thumbnails: ParsersExtended.thumbnailParser(item),
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
        switch (searchType) {
            case undefined: {
                const unsorted = {
                    albums,
                    videos,
                    playlists,
                    artist, songs,
                };
                return Results.from({
                    result: unsorted,
                });
            }
            case Category.SONG: {
                return Results.from({
                    result: songs,
                    continuation: continuation,
                });
            }
            case Category.VIDEO: {
                return Results.from({
                    result: videos,
                    continuation: continuation,
                });
            }
            case Category.ALBUM: {
                return Results.from({
                    result: albums,
                    continuation: continuation,
                });
            }
            case Category.ARTIST: {
                return Results.from({
                    result: artist,
                    continuation: continuation,
                });
            }
            case Category.PLAYLIST: {
                return Results.from({
                    result: playlists,
                    continuation: continuation,
                });
            }
            default: {
                const unsorted = {
                    albums,
                    videos,
                    playlists,
                    artist, songs,
                };
                return Results.from({
                    result: unsorted,
                });
            }
        }
    }
    /**
     * Only works for video and song
     * @param musicResponsiveListItemRenderer
     */
    static musicResponsiveListItemRendererParser(musicResponsiveListItemRenderer) {
        const display = $('.musicResponsiveListItemFlexColumnRenderer')(musicResponsiveListItemRenderer);
        const name = $('.text')(display);
        const id = $('.videoId')(display);
        const url = `https://www.youtube.com/watch?v=${id}`;
        return { name, url, videoId: id };
    }
}
//# sourceMappingURL=generalParser.js.map