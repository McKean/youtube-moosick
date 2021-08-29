/**
 * Different Endpoints for createNewApi method
 */
export enum EndPoint {
	/**
	 * Search Suggestions
	 */
	SUGGESTIONS = 'music/get_search_suggestions',
	/**
	 * Search
	 */
	SEARCH = 'search',
	/**
	 * Browse with the given Id
	 */
	BROWSE = 'browse',
	/**
	 * Used for continuation
	 */
	NEXT = 'next',
}

export enum Category {
	/**
	 * Category Song
	 */
	SONG = 'SONG',
	/**
	 * Category Video
	 */
	VIDEO = 'VIDEO',
	/**
	 * Category Album
	 */
	ALBUM = 'ALBUM',
	/**
	 * Category Artist
	 */
	ARTIST = 'ARTIST',
	/**
	 * Category Playlist
	 */
	PLAYLIST = 'PLAYLIST',
	/**
	 * Category Ep
	 */
	EP = 'EP',
	/**
	 * Category Single
	 */
	SINGLE = 'SINGLE',
}

export enum CategoryURIBase64 {
	SONG = 'RAAGAAgACgA',
	VIDEO = 'BABGAAgACgA',
	ALBUM = 'BAAGAEgACgA',
	ARTIST = 'BAAGAAgASgA',
	PLAYLIST = 'BAAGAAgACgB',
}

export enum ConstantURLs {
	VIDEOLINK = 'https://www.youtube.com/watch?v=',
	CHANNEL_URL = 'https://music.youtube.com/channel/',
}

export enum FlexColumnOffset {
	MAIN = 0,
	ALT = 1,
	ONLYRUN = 0,
}

export enum FlexSecondRowOffset {
	ARTIST = 0,
	OTHERS = 1,
}

