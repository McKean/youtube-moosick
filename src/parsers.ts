import { utils } from './utils';
import {
	CategoryType as Category,
	ConstantURLs,
	flexColumnDefinition,
	VideoOffset,
} from './enums';
import type {
	MusicResponsiveListItemFlexColumnRenderer,
	MusicResponsiveListItemRenderer,
	MusicShelfRendererContent,
	MusicThumbnailRenderer,
	Thumbnail,
} from './songresultRaw';
import objectScan from 'object-scan';
import { IllegalCategoryError } from './resources/errors';
import type { SongSearchResult } from './resources/resultTypes/songSearchResult';
import { VideoSearchResult } from './resources/resultTypes/videoSearchResult';
import { PlaylistSearchResult } from './resources/resultTypes/playlistSearchResult';
import {
	PlaylistContent,
	PlaylistHeader,
	PlaylistURL,
} from './resources/resultTypes/playlistURL';

// TODO: i'm making a lot of assumptions for text being at [0], probably stop
// TODO: objectScan's syntax is verbose as hell, write abstraction functions

export class parsers {
	// Make this one global function and call the other stuff
	// Probably other methods should be private
	static parseSearchResult(context: MusicShelfRendererContent, searchType?: Category): any {
		// Go to the part which i have no idea
		const musicResponsiveListItemRenderer = objectScan(
			['**.musicResponsiveListItemRenderer'],
			{ rtn: 'value' },
		)(context) as MusicResponsiveListItemRenderer;

		const flexColumn = objectScan(['**.musicResponsiveListItemFlexColumnRenderer'], {
			rtn: 'parent',
			reverse: false,
		})(musicResponsiveListItemRenderer) as MusicResponsiveListItemFlexColumnRenderer[];
		// probably insert a type here
		const type = searchType ?? flexColumn[1].text.runs[1].text as Category;
		// Is there a way to put this in map?, most likely will be more readable and u can separate into files
		// hello, you could do something like Handlers[Category.SONG](sectionContext),
		// or typescript signature overloading, where you can have 1 function that takes in many types
		// (however that's just a syntactic wrapper for the switch case below, since you can't
		// have different impl's for a function)
		switch (type) {
			case Category.SONG:
				parsers.parseSongSearchResult(flexColumn);
				break;

			case Category.VIDEO:
				parsers.parseVideoSearchResult(flexColumn);
				break;

			default:
		}
	}

	/**
	 * Build the song item
	 * @private
	 * @param sectionContext
	 */
	// Probably the type of sectionContext is wrong have to check on it more
	private static parseSongSearchResult(sectionContext: MusicResponsiveListItemFlexColumnRenderer[]): SongSearchResult {
		const flexColumn = objectScan(['**.musicResponsiveListItemFlexColumnRenderer'], {
			rtn: 'parent',
			reverse: false,
		})(sectionContext) as MusicResponsiveListItemFlexColumnRenderer[];
		const { runs } = flexColumn[flexColumnDefinition.SUPPLEMENT].text;

		if (runs[0].text as Category !== Category.SONG) {
			throw new IllegalCategoryError(`Type ${
				String(flexColumn[flexColumnDefinition.SUPPLEMENT].text)
			} cannot be applied to ${
				Category.SONG
			} function`);
		}

		// FIXME: shove the stuff into a song object
		const type = Category.SONG;
		const name = objectScan(['**.text'], { rtn: 'value', reverse: false, abort: true })(flexColumn[0]);
		const id = objectScan(['**.videoId'], { rtn: 'value', reverse: false, abort: true })(flexColumn[0]);
		const url = `https://www.youtube.com/watch?v=${id}`;
		// const playlistId (have no idea do we need it or not, seems like the auto suggestion feature on normal browsers)
		const artist = utils.artistParser(runs);
		const album = utils.albumParser(runs);
		const duration = utils.hms2ms(flexColumn[flexColumn.length - 1].text.runs[0].text);
		const thumbnail = utils.thumbnailParser(sectionContext);
		// What is this supposed to do?
		// const params = ??
	}

	private static parseVideoSearchResult(sectionContext: MusicResponsiveListItemFlexColumnRenderer[]): VideoSearchResult {
		const flexColumn = objectScan(['**.musicResponsiveListItemFlexColumnRenderer'], {
			rtn: 'parent',
			reverse: false,
		})(sectionContext) as MusicResponsiveListItemFlexColumnRenderer[];

		if (flexColumn[flexColumnDefinition.SUPPLEMENT].text.runs[0].text !== Category.VIDEO) {
			throw new IllegalCategoryError(
				`Type ${
					flexColumn[flexColumnDefinition.SUPPLEMENT].text.runs[0].text
				} cannot be applied to ${
					Category.VIDEO
				} function`);
		}

		const videoId = objectScan(['**.videoId'], { rtn: 'value', reverse: false, abort: true })(flexColumn[flexColumnDefinition.GENERAL]);
		return VideoSearchResult.from({
			type: Category.VIDEO,
			name: objectScan(['**.text'], { rtn: 'value', reverse: false, abort: true })(flexColumn[flexColumnDefinition.GENERAL]),
			videoId,
			url: ConstantURLs.CHANNEL_URL + videoId,
			author: utils.artistParser(flexColumn[flexColumnDefinition.SUPPLEMENT].text.runs),
			views: flexColumn[VideoOffset.VIEWS].text.runs[0].text,
			duration: utils.hms2ms(flexColumn[VideoOffset.DURATION].text.runs[0].text),
		});
	}

	private static parsePlaylistSearchResult(sectionContext: MusicResponsiveListItemFlexColumnRenderer[]): PlaylistSearchResult {
		const flexColumn = objectScan(['**.musicResponsiveListItemFlexColumnRenderer'], {
			rtn: 'parent',
			reverse: false,
		})(sectionContext) as MusicResponsiveListItemFlexColumnRenderer[];

		const { runs } = flexColumn[flexColumnDefinition.SUPPLEMENT].text;
		const { text, navigationEndpoint } = runs[0];

		if (text !== Category.PLAYLISTS) {
			throw new IllegalCategoryError(
				`Category ${
					text
				} cannot be applied to ${
					Category.PLAYLISTS
				} function`);
		}

		return PlaylistSearchResult.from({
			type: Category.PLAYLISTS,
			playlistId: navigationEndpoint.browseEndpoint.browseId,
			title: objectScan(['**.text'], { rtn: 'value', reverse: false, abort: true })(sectionContext),
			url: ConstantURLs.CHANNEL_URL + navigationEndpoint.browseEndpoint.browseId,
			author: utils.artistParser(runs),
			count: utils.playlistCountExtractor(runs),
		});
	}

	public static parsePlaylistURL(context: any): PlaylistURL {
		// Gets the entire flexColumn, and filter those with empty members
		const flexColumn = (objectScan(['**.musicResponsiveListItemFlexColumnRenderer'], {
			rtn: 'value',
			reverse: false,
		})(context) as MusicResponsiveListItemFlexColumnRenderer[])
			.filter((item) => item.text?.runs != null);
		const unprocessedHeader = (objectScan(['**.musicDetailHeaderRenderer'], {
			rtn: 'value',
			reverse: false,
		})(context));
		const allThumbnailRenderers = (objectScan(['**.musicThumbnailRenderer'], {
			rtn: 'value',
			reverse: false,
		})(context)) as MusicThumbnailRenderer[];

		const playlistContents: PlaylistContent[] = [];

		for (let i = 0; i < Math.floor(flexColumn.length / 2); ++i) {
			const flexColumnPart = flexColumn[i * 2];

			playlistContents.push({
				trackTitle: objectScan(['**.text'], { rtn: 'value', reverse: false, abort: true })(flexColumnPart),
				trackId: objectScan(['**.videoId'], { rtn: 'value', reverse: false, abort: true })(flexColumnPart),
				artist: utils.artistParser(flexColumnPart.text.runs),
				thumbnail: allThumbnailRenderers[i].thumbnail.thumbnails,
			});
		}

		return PlaylistURL.from({
			headers: parsers.playlistURLHeaderParser(unprocessedHeader),
			playlistContents,
		});
	}

	private static playlistURLHeaderParser(header: any[]): PlaylistHeader {
		return PlaylistHeader.from({
			playlistName: header[0].title.runs[0].text as string,
			owner: header[0].subtitle.runs[2].text as string,
			createdYear: parseInt(header[0].subtitle.runs[4].text, 10)!,
			thumbnail: header[0].thumbnail.croppedSquareThumbnailRenderer.thumbnail.thumbnail as Thumbnail[],
			songCount: header[0].secondSubtitle.runs[0].text as number,
			approxRunTime: header[0].secondSubtitle.runs[2].text as string,
		});
	}
}
