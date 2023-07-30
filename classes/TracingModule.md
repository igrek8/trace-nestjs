[trace-nestjs](../README.md) / [Exports](../modules.md) / TracingModule

# Class: TracingModule

## Hierarchy

- `ConfigurableModuleClass`

  ↳ **`TracingModule`**

## Implements

- `NestModule`

## Table of contents

### Methods

- [configure](TracingModule.md#configure)

### Constructors

- [constructor](TracingModule.md#constructor)

### Properties

- [register](TracingModule.md#register)
- [registerAsync](TracingModule.md#registerasync)

## Methods

### configure

▸ **configure**(`consumer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `consumer` | `MiddlewareConsumer` |

#### Returns

`void`

#### Implementation of

NestModule.configure

#### Defined in

[src/tracing.module.ts:11](https://github.com/igrek8/trace-nestjs/blob/83243c3/src/tracing.module.ts#L11)

## Constructors

### constructor

• **new TracingModule**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TracingModuleOptions`](../interfaces/TracingModuleOptions.md) & `Partial`<{}\> |

#### Overrides

ConfigurableModuleClass.constructor

#### Defined in

[src/tracing.module.ts:7](https://github.com/igrek8/trace-nestjs/blob/83243c3/src/tracing.module.ts#L7)

## Properties

### register

▪ `Static` **register**: (`options`: [`TracingModuleOptions`](../interfaces/TracingModuleOptions.md) & `Partial`<{}\>) => `DynamicModule`

#### Type declaration

▸ (`options`): `DynamicModule`

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TracingModuleOptions`](../interfaces/TracingModuleOptions.md) & `Partial`<{}\> |

##### Returns

`DynamicModule`

#### Inherited from

ConfigurableModuleClass.register

___

### registerAsync

▪ `Static` **registerAsync**: (`options`: `ConfigurableModuleAsyncOptions`<[`TracingModuleOptions`](../interfaces/TracingModuleOptions.md), ``"create"``\> & `Partial`<{}\>) => `DynamicModule`

#### Type declaration

▸ (`options`): `DynamicModule`

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ConfigurableModuleAsyncOptions`<[`TracingModuleOptions`](../interfaces/TracingModuleOptions.md), ``"create"``\> & `Partial`<{}\> |

##### Returns

`DynamicModule`

#### Inherited from

ConfigurableModuleClass.registerAsync
