<script setup>
import { ref } from 'vue';

import Meta from '../../../src/components/meta.vue'
import InstallTabs from '../../../src/components/install-tabs.vue'
import Badges from '../../../src/components/badges.vue'
import Api from '../../../src/components/api.vue'
import Demo from '../../../src/components/demo.vue'
import Source from '../../../src/components/source.vue'
import Contributors from '../../../src/components/contributors.vue'
import Code from '../../../src/components/code.vue'

const activeInstallTab = ref('library');
</script>

# {{ $params.name }}

{{ $params.description }}

<Badges :category="$params.category" :is-test="$params.isTest" />

<Meta :last-modified="$params.lastModified" />

<template v-if="$params.browserapi">

::: tip
This hook uses <a :href="$params.browserapi.description" target="_blank">**{{ $params.browserapi.name }}**</a> browser api to provide enhanced functionality. Make sure to check for compatibility with different browsers when using this api
:::

</template>

<template v-if="$params.warning">

::: warning
{{ $params.warning }}
:::

</template>

## Installation

<InstallTabs v-model="activeInstallTab" />

<template v-if="activeInstallTab === 'library'">

```typescript-vue
import { {{ $params.name }} } from '@siberiacancode/reactuse';
```

</template>

<template v-if="activeInstallTab === 'cli'">

::: code-group

```bash-vue [npm]
npx useverse@latest add {{ $params.name }}
```

```bash-vue [yarn]
yarn useverse@latest add {{ $params.name }}
```

```bash-vue [pnpm]
pnpm dlx useverse@latest add {{ $params.name }}
```

```bash-vue [bun]
bunx --bun useverse@latest add {{ $params.name }}
```

:::

</template>

<template v-if="activeInstallTab === 'manual'">
Copy and paste the following code into your project. Update the import paths to match your project setup.

<Code :value="$params.code" lang="typescript" />

</template>

## Usage

<Code :value="$params.usage" lang="typescript" />

## Demo

<Demo :type="$params.type" :name="$params.name" />

<template v-if="$params.apiParameters.length">

## Api

<Api :apiParameters="$params.apiParameters" />

</template>

<template v-if="$params.typeDeclarations">

## Type declaration

<Code :value="$params.typeDeclarations" lang="typescript" />

</template>

## Source

<Source :type="$params.type" :name="$params.name" />

## Contributors

<Contributors :items="$params.contributors" />
