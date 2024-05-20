<script setup>
import Demo from '../../components/demo.vue'
</script>

# useRenderCount

<!-- Hook is useful for accessing and monitoring the battery status of the user's device in a React application -->

```typescript
import { useBattery } from '@sibericancode/reactuse';
```

## Usage
```typescript
const battery = useBattery()
```

## Type declaration

| Name            | Type               | Note                                                       |
|-----------------|--------------------|------------------------------------------------------------|
| isSupported     | `boolean`          | Indicates if the device don't support getBattery().        |
| loading         | `boolean`          | Indicates if the device don't fetch battery information.   |
| charging        | `boolean` ¦ `null` | Indicates if the battery is charging.                      |
| chargingTime    | `number` ¦ `null`  | Time until the device is fully charged.                    |
| dischargingTime | `number` ¦ `null`  | Time until the device is fully discharged.                 |
| level           | `number` ¦ `null`  | Battery charge level from 0 to 1. |


## Demo

<Demo hook="useBattery" />

### Returns
A state with information about the battery

## Contributors

[Source](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useBattery/useBattery.ts) • [Demo](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useBattery/useBattery.demo.ts) • [Docs](#)

[Suggest changes to this page](#)
