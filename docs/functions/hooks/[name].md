<script setup>
import Api from '../../src/components/api.vue'
import Demo from '../../src/components/demo.vue'
import Contributors from '../../src/components/contributors.vue'
</script>

# {{ $params.name }}

{{ $params.description }}

```typescript-vue
import { {{ $params.name }} } from '@sibericancode/reactuse';
```

## Usage

```typescript-vue
{{ $params.usage }}
```

## Demo

<Demo :hook="$params.name" />

## Api

<Api :apiParameters="$params.apiParameters" :hook="$params.name" />

## Contributors

<Contributors :hook="$params.name" />
