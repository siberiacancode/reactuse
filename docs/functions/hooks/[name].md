<script setup>
import Meta from '../../src/components/meta.vue'
import Api from '../../src/components/api.vue'
import Demo from '../../src/components/demo.vue'
import Contributors from '../../src/components/contributors.vue'
</script>

# {{ $params.name }}

<Meta :last-modified="$params.lastModified" :category="$params.category" />

{{ $params.description }}

```typescript-vue
import { {{ $params.name }} } from '@siberiacancode/reactuse';
```

## Usage

```typescript-vue
{{ $params.usage }}
```

## Demo

<Demo :hook="$params.name" />

## Api

<Api :apiParameters="$params.apiParameters" />

## Contributors

<Contributors :hook="$params.name" />

