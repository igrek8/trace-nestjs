[trace-nestjs](../README.md) / [Exports](../modules.md) / TracingModuleOptions

# Interface: TracingModuleOptions

## Table of contents

### Properties

- [excludedRoutes](TracingModuleOptions.md#excludedroutes)
- [routes](TracingModuleOptions.md#routes)

### Methods

- [onRequest](TracingModuleOptions.md#onrequest)

## Properties

### excludedRoutes

• `Optional` **excludedRoutes**: (`string` \| `RouteInfo`)[]

#### Defined in

[src/tracing.module-options.ts:6](https://github.com/igrek8/trace-nestjs/blob/83243c3/src/tracing.module-options.ts#L6)

___

### routes

• **routes**: (`string` \| `RouteInfo`)[]

#### Defined in

[src/tracing.module-options.ts:5](https://github.com/igrek8/trace-nestjs/blob/83243c3/src/tracing.module-options.ts#L5)

## Methods

### onRequest

▸ `Optional` **onRequest**(`uuid`, `next`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |
| `next` | `NextFunction` |

#### Returns

`void`

#### Defined in

[src/tracing.module-options.ts:7](https://github.com/igrek8/trace-nestjs/blob/83243c3/src/tracing.module-options.ts#L7)
