<script setup>
import Demo from '../../components/demo.vue'
</script>

# useNetwork

Hook provides the current network connection status and related details.

```typescript
import { useNetwork } from '@sibericancode/reactuse';
```

## Usage
```typescript
const network = useNetwork()
```

## Demo

<Demo hook="useNetwork" />


## Api

### Parameters

This hook does not accept any parameters.

### Returns

[`useNetworkReturn`](#usenetworkreturn)

## Type aliases

### useNetworkReturn

Type: Object  
Description: The use network return type

#### Type declaration

| Name          | Type                  | Note                                                    |
|---------------|-----------------------|---------------------------------------------------------|
| online        | `boolean`             | Indicates if the device is currently online.            |
| saveData      | `boolean \| undefined`| Indicates if the user has enabled data saving mode.     |
| type          | `string \| undefined` | The type of network connection (e.g., `wifi`, `cellular`). |
| downlink      | `number \| undefined` | The estimated downlink speed in megabits per second.    |
| downlinkMax   | `number \| undefined` | The maximum downlink speed, if available.               |
| effectiveType | `string \| undefined` | The effective type of connection (e.g., `2g`, `3g`, `4g`). |
| rtt           | `number \| undefined` | The estimated round-trip time in milliseconds.          |

## Contributors

[Source](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useNetwork/useNetwork.ts) • [Demo](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useNetwork/useNetwork.demo.ts) • [Docs](#)

[Suggest changes to this page](#)