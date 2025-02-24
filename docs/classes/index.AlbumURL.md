[youtube-moosick](../README.md) / [index](../modules/index.md) / AlbumURL

# Class: AlbumURL

[index](../modules/index.md).AlbumURL

## Hierarchy

- `Item`

  ↳ **`AlbumURL`**

## Table of contents

### Properties

- [AlbumURLHeader](index.AlbumURL.md#albumurlheader)
- [tracks](index.AlbumURL.md#tracks)

### Methods

- [from](index.AlbumURL.md#from)

## Properties

### AlbumURLHeader

• **AlbumURLHeader**: [`AlbumURLHeader`](index.AlbumURLHeader.md)

#### Defined in

[src/resources/resultTypes/albumURL.ts:5](https://github.com/EvasiveXkiller/youtube-moosick/blob/c0cbc69/src/resources/resultTypes/albumURL.ts#L5)

___

### tracks

• **tracks**: [`Track`](index.Track.md)[]

#### Defined in

[src/resources/resultTypes/albumURL.ts:6](https://github.com/EvasiveXkiller/youtube-moosick/blob/c0cbc69/src/resources/resultTypes/albumURL.ts#L6)

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
