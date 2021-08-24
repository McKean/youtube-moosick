import { Category, CategoryURIBase64 } from '../enums';
import objectScan from 'object-scan';
import type { Song } from '../resources/generalTypes/song';
import type {
	GeneralFull,
	MusicResponsiveListItemFlexColumnRenderer,
	MusicResponsiveListItemRenderer,
	MusicShelfRenderer,
} from '../resources/rawResultTypes/general/generalFull';
import type { AlbumExtended } from '../resources/generalTypes/album';
import { Video } from '../resources/generalTypes/video';
import { Playlist } from '../resources/generalTypes/playlist';
import { ArtistExtended } from '../resources/generalTypes/artist';
import { ParsersExtended } from './parsersExtended';
import { Results } from '../resources/resultTypes/results';

// TODO: i'm making a lot of assumptions for text being at [0], probably stop
// TODO: objectScan's syntax is verbose as hell, write abstraction functions

export class GeneralParser {
	// Make this one global function and call the other stuff
	// Probably other methods should be private
	static parseSearchResult(context: GeneralFull, searchType?: CategoryURIBase64): Results {
		// prep all the parts
		let albums: AlbumExtended[];
		let videos: Video[];
		let playlists: Playlist[];
		let artist: ArtistExtended[];
		let songs: Song[];
		const musicShelf = objectScan(['**.musicShelfRenderer'], {
			rtn: 'value',
			reverse: false,
		})(context) as MusicShelfRenderer[];
		for (const shelfItem of musicShelf) {
			const shelfContent = objectScan(['**.musicResponsiveListItemRenderer'], {
				rtn: 'value',
				reverse: false,
			})(shelfItem) as MusicResponsiveListItemRenderer[];
			for (const item of shelfContent) {
				const flexColumnRenderer = objectScan(['**.musicResponsiveListItemFlexColumnRenderer'], {
					rtn: 'parent',
					reverse: false,
				})(item) as MusicResponsiveListItemFlexColumnRenderer[];
				const category = flexColumnRenderer[0].text.runs[0].text as Category;
				switch (category) {
					case Category.SONG:
						songs.push(Song.from({
							...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[1].text.runs, Category.SONG, Boolean(searchType)),
							...GeneralParser.musicResponsiveListItemRendererParser(item),
							thumbnails: ParsersExtended.thumbnailParser(item),
						}));
						break;
					case Category.VIDEO:
						videos.push(Video.from({
							...GeneralParser.musicResponsiveListItemRendererParser(item),
							...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[1].text.runs, Category.VIDEO, Boolean(searchType)),
							thumbnails: ParsersExtended.thumbnailParser(item),
						}));
						GeneralParser.parseVideoSearchResult(item);
						break;
					case Category.PLAYLISTS:
						playlists.push(Playlist.from({
							name: objectScan(['**.text'], {
								rtn: 'value',
								reverse: false,
								abort: true,
							})(flexColumnRenderer) as string,
							browseId: flexColumnRenderer.navigationEndpoint.browseEndpoint.browseId,
							...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[1].text.runs, Category.PLAYLISTS, Boolean(searchType)),
						}));
						break;
					case Category.ARTIST:
						artist.push(ArtistExtended.from({
							name: objectScan(['**.text'], {
								rtn: 'value',
								reverse: false,
								abort: true,
							})(flexColumnRenderer),
							browseId: item.navigationEndpoint.browseEndpoint.browseId,
							thumbnails: ParsersExtended.thumbnailParser(item),
							...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[1].text.runs, Category.ARTIST, Boolean(searchType)),
						}));
					// eslint is drunk here
					// eslint-disable-next-line no-fallthrough
					case Category.ALBUM:
					case Category.SINGLE:
					case Category.EP:
						albums.push({
							...ParsersExtended.flexSecondRowComplexParser(flexColumnRenderer[1].text.runs, Category.ARTIST, Boolean(searchType)),
							name: objectScan(['**.text'], {
								rtn: 'value',
								reverse: false,
								abort: true,
							})(flexColumnRenderer),
							browseId: item.navigationEndpoint.browseEndpoint.browseId,
						});
						break;
					default:
				}
			}
		}

		const unsorted = {
			albums,
			videos,
			playlists,
			artist, songs,
		};

		return Results.from({
			results: unsorted,
			continuation: undefined,
		});
	}

	/**
	 * Only works for video and song
	 * @param musicResponsiveListItemRenderer
	 */
	static musicResponsiveListItemRendererParser(musicResponsiveListItemRenderer: MusicResponsiveListItemRenderer): Partial<Song> {
		const display = objectScan(['**.musicResponsiveListItemFlexColumnRenderer'], {
			rtn: 'value',
			reverse: false,
		})(musicResponsiveListItemRenderer) as MusicResponsiveListItemFlexColumnRenderer;
		const name = objectScan(['**.text'], { rtn: 'value', reverse: false, abort: true })(display) as string;
		const id = objectScan(['**.videoId'], { rtn: 'value', reverse: false, abort: true })(display) as string;
		const url = `https://www.youtube.com/watch?v=${id}`;
		return { name, url, videoId: id };
	}
}
