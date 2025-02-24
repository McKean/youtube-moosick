[youtube-moosick](../README.md) / [index](../modules/index.md) / PlaylistURL

# Class: PlaylistURL

[index](../modules/index.md).PlaylistURL

## Hierarchy

- `Item`

  ↳ **`PlaylistURL`**

  ↳↳ [`ContinuablePlaylistURL`](index.ContinuablePlaylistURL.md)

## Table of contents

### Properties

- [continuation](index.PlaylistURL.md#continuation)
- [headers](index.PlaylistURL.md#headers)
- [playlistContents](index.PlaylistURL.md#playlistcontents)

### Methods

- [from](index.PlaylistURL.md#from)

## Properties

### continuation

• **continuation**: [`Continuation`](../interfaces/index.Continuation.md)

#### Defined in

[src/resources/resultTypes/playlistURL.ts:9](https://github.com/EvasiveXkiller/youtube-moosick/blob/c0cbc69/src/resources/resultTypes/playlistURL.ts#L9)

___

### headers

• `Optional` **headers**: [`PlaylistHeader`](index.PlaylistHeader.md)

#### Defined in

[src/resources/resultTypes/playlistURL.ts:7](https://github.com/EvasiveXkiller/youtube-moosick/blob/c0cbc69/src/resources/resultTypes/playlistURL.ts#L7)

___

### playlistContents

• **playlistContents**: [`PlaylistContent`](index.PlaylistContent.md)[]

#### Defined in

[src/resources/resultTypes/playlistURL.ts:8](https://github.com/EvasiveXkiller/youtube-moosick/blob/c0cbc69/src/resources/resultTypes/playlistURL.ts#L8)

## Methods

### from

▸ `Static` **from**<`T`\>(`this`, `options`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Item`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | () => `T` |
| `options` | `ItemOptions`<() => `T`\> |

#### Returns

`T`

#### Inherited from

Item.from

#### Defined in

[src/blocks/item.ts:25](https://github.com/EvasiveXkiller/youtube-moosick/blob/c0cbc69/src/blocks/item.ts#L25)
