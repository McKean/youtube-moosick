export interface SongResultRaw {
	responseContext: ResponseContext;
	trackingParams: string;
	contents: Contents;
}

export interface Contents {
	tabbedSearchResultsRenderer: TabbedSearchResultsRenderer;
}

export interface TabbedSearchResultsRenderer {
	tabs: Tab[];
}

export interface Tab {
	tabRenderer: TabRenderer;
}

export interface TabRenderer {
	title: string;
	selected: boolean;
	content: TabRendererContent;
	tabIdentifier: string;
	trackingParams: string;
}

export interface TabRendererContent {
	sectionListRenderer: SectionListRenderer;
}

export interface SectionListRenderer {
	contents: SectionListRendererContent[];
	trackingParams: string;
	header: Header;
}

export interface SectionListRendererContent {
	musicShelfRenderer: MusicShelfRenderer;
}

export interface MusicShelfRenderer {
	title: BottomText;
	contents: MusicShelfRendererContent[];
	trackingParams: string;
	shelfDivider: ShelfDivider;
	bottomText: BottomText;
	bottomEndpoint: Endpoint;
}

export interface Endpoint {
	clickTrackingParams: string;
	searchEndpoint: SearchEndpoint;
}

export interface SearchEndpoint {
	query: Query;
	params: string;
}

export enum Query {
	DoWhatWeLike = 'do what we like',
}

export interface BottomText {
	runs: BottomTextRun[];
}

export interface BottomTextRun {
	text: string;
}

export interface MusicShelfRendererContent {
	musicResponsiveListItemRenderer: MusicResponsiveListItemRenderer;
}

export interface MusicResponsiveListItemRenderer {
	trackingParams: string;
	thumbnail: MusicResponsiveListItemRendererThumbnail;
	overlay: Overlay;
	flexColumns: FlexColumn[];
	menu: Menu;
	playlistItemData: PlaylistItemData;
	flexColumnDisplayStyle: string;
	itemHeight: ItemHeight;
	navigationEndpoint: MusicResponsiveListItemRendererNavigationEndpoint;
	badges: Badge[];
}

export interface Badge {
	musicInlineBadgeRenderer: MusicInlineBadgeRenderer;
}

export interface MusicInlineBadgeRenderer {
	trackingParams: string;
	icon: Icon;
	accessibilityData: Accessibility;
}

export interface Accessibility {
	accessibilityData: AccessibilityData;
}

export interface AccessibilityData {
	label: string;
}

export interface Icon {
	iconType: string;
}

export interface FlexColumn {
	musicResponsiveListItemFlexColumnRenderer: MusicResponsiveListItemFlexColumnRenderer;
}

export interface MusicResponsiveListItemFlexColumnRenderer {
	text: Text;
	displayPriority: DisplayPriority;
}

export enum DisplayPriority {
	MusicResponsiveListItemColumnDisplayPriorityHigh = 'MUSIC_RESPONSIVE_LIST_ITEM_COLUMN_DISPLAY_PRIORITY_HIGH',
}

export interface Text {
	runs: PurpleRun[];
}

export interface PurpleRun {
	text: string;
	navigationEndpoint: RunNavigationEndpoint;
}

export interface RunNavigationEndpoint {
	clickTrackingParams: string;
	watchEndpoint: WatchEndpoint;
	browseEndpoint: BrowseEndpoint;
}

export interface BrowseEndpoint {
	browseId: string;
	browseEndpointContextSupportedConfigs: BrowseEndpointContextSupportedConfigs;
}

export interface BrowseEndpointContextSupportedConfigs {
	browseEndpointContextMusicConfig: BrowseEndpointContextMusicConfig;
}

export interface BrowseEndpointContextMusicConfig {
	pageType: PageType;
}

export enum PageType {
	MusicPageTypeAlbum = 'MUSIC_PAGE_TYPE_ALBUM',
	MusicPageTypeArtist = 'MUSIC_PAGE_TYPE_ARTIST',
	MusicPageTypePlaylist = 'MUSIC_PAGE_TYPE_PLAYLIST',
	MusicPageTypeUserChannel = 'MUSIC_PAGE_TYPE_USER_CHANNEL',
}

export interface WatchEndpoint {
	videoId: string;
	playlistId: string;
	loggingContext: LoggingContext;
	watchEndpointMusicSupportedConfigs: WatchEndpointMusicSupportedConfigs;
	params: Params;
}

export interface LoggingContext {
	vssLoggingContext: VssLoggingContext;
}

export interface VssLoggingContext {
	serializedContextData: string;
}

export enum Params {
	WAEB = 'wAEB',
	WAEB8GECGAE3D = 'wAEB8gECGAE%3D',
	WAEB8GECKAE3D = 'wAEB8gECKAE%3D',
}

export interface WatchEndpointMusicSupportedConfigs {
	watchEndpointMusicConfig: WatchEndpointMusicConfig;
}

export interface WatchEndpointMusicConfig {
	musicVideoType: MusicVideoType;
}

export enum MusicVideoType {
	MusicVideoTypeAtv = 'MUSIC_VIDEO_TYPE_ATV',
	MusicVideoTypeUgc = 'MUSIC_VIDEO_TYPE_UGC',
}

export enum ItemHeight {
	MusicResponsiveListItemHeightTall = 'MUSIC_RESPONSIVE_LIST_ITEM_HEIGHT_TALL',
}

export interface Menu {
	menuRenderer: MenuRenderer;
}

export interface MenuRenderer {
	items: ItemElement[];
	trackingParams: string;
	accessibility: Accessibility;
}

export interface ItemElement {
	menuNavigationItemRenderer: MenuItemRenderer;
	menuServiceItemRenderer: MenuItemRenderer;
	toggleMenuServiceItemRenderer: ToggleMenuServiceItemRenderer;
}

export interface MenuItemRenderer {
	text: BottomText;
	icon: Icon;
	navigationEndpoint: MenuNavigationItemRendererNavigationEndpoint;
	trackingParams: string;
	serviceEndpoint: ServiceEndpoint;
}

export interface MenuNavigationItemRendererNavigationEndpoint {
	clickTrackingParams: string;
	watchEndpoint: WatchEndpoint;
	modalEndpoint: ModalEndpoint;
	browseEndpoint: BrowseEndpoint;
	shareEntityEndpoint: ShareEntityEndpoint;
	watchPlaylistEndpoint: WatchPlaylistEndpoint;
}

export interface ModalEndpoint {
	modal: Modal;
}

export interface Modal {
	modalWithTitleAndButtonRenderer: ModalWithTitleAndButtonRenderer;
}

export interface ModalWithTitleAndButtonRenderer {
	title: BottomText;
	content: BottomText;
	button: Button;
}

export interface Button {
	buttonRenderer: ButtonRenderer;
}

export interface ButtonRenderer {
	style: StyleEnum;
	isDisabled: boolean;
	text: BottomText;
	navigationEndpoint: ButtonRendererNavigationEndpoint;
	trackingParams: string;
}

export interface ButtonRendererNavigationEndpoint {
	clickTrackingParams: string;
	signInEndpoint: SignInEndpoint;
}

export interface SignInEndpoint {
	hack: boolean;
}

export enum StyleEnum {
	StyleBlueText = 'STYLE_BLUE_TEXT',
}

export interface ShareEntityEndpoint {
	serializedShareEntity: string;
}

export interface WatchPlaylistEndpoint {
	playlistId: string;
	params: Params;
}

export interface ServiceEndpoint {
	clickTrackingParams: string;
	queueAddEndpoint: QueueAddEndpoint;
}

export interface QueueAddEndpoint {
	queueTarget: QueueTarget;
	queueInsertPosition: QueueInsertPosition;
	commands: Command[];
}

export interface Command {
	clickTrackingParams: string;
	addToToastAction: AddToToastAction;
}

export interface AddToToastAction {
	item: AddToToastActionItem;
}

export interface AddToToastActionItem {
	notificationTextRenderer: NotificationTextRenderer;
}

export interface NotificationTextRenderer {
	successResponseText: BottomText;
	trackingParams: string;
}

export enum QueueInsertPosition {
	InsertAfterCurrentVideo = 'INSERT_AFTER_CURRENT_VIDEO',
	InsertAtEnd = 'INSERT_AT_END',
}

export interface QueueTarget {
	videoId: string;
	playlistId: string;
}

export interface ToggleMenuServiceItemRenderer {
	defaultText: BottomText;
	defaultIcon: Icon;
	defaultServiceEndpoint: DefaultServiceEndpoint;
	toggledText: BottomText;
	toggledIcon: Icon;
	trackingParams: string;
	toggledServiceEndpoint: ToggledServiceEndpoint;
}

export interface DefaultServiceEndpoint {
	clickTrackingParams: string;
	modalEndpoint: ModalEndpoint;
}

export interface ToggledServiceEndpoint {
	clickTrackingParams: string;
	likeEndpoint: LikeEndpoint;
}

export interface LikeEndpoint {
	status: string;
	target: Target;
}

export interface Target {
	playlistId: string;
}

export interface MusicResponsiveListItemRendererNavigationEndpoint {
	clickTrackingParams: string;
	browseEndpoint: BrowseEndpoint;
}

export interface Overlay {
	musicItemThumbnailOverlayRenderer: MusicItemThumbnailOverlayRenderer;
}

export interface MusicItemThumbnailOverlayRenderer {
	background: Background;
	content: MusicItemThumbnailOverlayRendererContent;
	contentPosition: ContentPosition;
	displayStyle: DisplayStyle;
}

export interface Background {
	verticalGradient: VerticalGradient;
}

export interface VerticalGradient {
	gradientLayerColors: string[];
}

export interface MusicItemThumbnailOverlayRendererContent {
	musicPlayButtonRenderer: MusicPlayButtonRenderer;
}

export interface MusicPlayButtonRenderer {
	playNavigationEndpoint: PlayNavigationEndpoint;
	trackingParams: string;
	playIcon: Icon;
	pauseIcon: Icon;
	iconColor: number;
	backgroundColor: number;
	activeBackgroundColor: number;
	loadingIndicatorColor: number;
	playingIcon: Icon;
	iconLoadingColor: number;
	activeScaleFactor: number;
	buttonSize: ButtonSize;
	rippleTarget: RippleTarget;
	accessibilityPlayData: Accessibility;
	accessibilityPauseData: Accessibility;
}

export enum ButtonSize {
	MusicPlayButtonSizeSmall = 'MUSIC_PLAY_BUTTON_SIZE_SMALL',
}

export interface PlayNavigationEndpoint {
	clickTrackingParams: string;
	watchEndpoint: WatchEndpoint;
	watchPlaylistEndpoint: WatchPlaylistEndpoint;
}

export enum RippleTarget {
	MusicPlayButtonRippleTargetSelf = 'MUSIC_PLAY_BUTTON_RIPPLE_TARGET_SELF',
}

export enum ContentPosition {
	MusicItemThumbnailOverlayContentPositionCentered = 'MUSIC_ITEM_THUMBNAIL_OVERLAY_CONTENT_POSITION_CENTERED',
}

export enum DisplayStyle {
	MusicItemThumbnailOverlayDisplayStylePersistent = 'MUSIC_ITEM_THUMBNAIL_OVERLAY_DISPLAY_STYLE_PERSISTENT',
}

export interface PlaylistItemData {
	videoId: string;
}

export interface MusicResponsiveListItemRendererThumbnail {
	musicThumbnailRenderer: MusicThumbnailRenderer;
}

export interface MusicThumbnailRenderer {
	thumbnail: MusicThumbnailRendererThumbnail;
	thumbnailCrop: ThumbnailCrop;
	thumbnailScale: ThumbnailScale;
	trackingParams: string;
}

export interface MusicThumbnailRendererThumbnail {
	thumbnails: ThumbnailElement[];
}

export interface ThumbnailElement {
	url: string;
	width: number;
	height: number;
}

export enum ThumbnailCrop {
	MusicThumbnailCropCircle = 'MUSIC_THUMBNAIL_CROP_CIRCLE',
	MusicThumbnailCropUnspecified = 'MUSIC_THUMBNAIL_CROP_UNSPECIFIED',
}

export enum ThumbnailScale {
	MusicThumbnailScaleAspectFill = 'MUSIC_THUMBNAIL_SCALE_ASPECT_FILL',
	MusicThumbnailScaleAspectFit = 'MUSIC_THUMBNAIL_SCALE_ASPECT_FIT',
}

export interface ShelfDivider {
	musicShelfDividerRenderer: MusicShelfDividerRenderer;
}

export interface MusicShelfDividerRenderer {
	hidden: boolean;
}

export interface Header {
	chipCloudRenderer: ChipCloudRenderer;
}

export interface ChipCloudRenderer {
	chips: Chip[];
	collapsedRowCount: number;
	trackingParams: string;
	horizontalScrollable: boolean;
}

export interface Chip {
	chipCloudChipRenderer: ChipCloudChipRenderer;
}

export interface ChipCloudChipRenderer {
	style: StyleClass;
	text: BottomText;
	navigationEndpoint: Endpoint;
	trackingParams: string;
	accessibilityData: Accessibility;
	isSelected: boolean;
}

export interface StyleClass {
	styleType: string;
}

export interface ResponseContext {
	maxAgeSeconds: number;
	serviceTrackingParams: ServiceTrackingParam[];
}

export interface ServiceTrackingParam {
	service: string;
	params: Param[];
}

export interface Param {
	key: string;
	value: string;
}
