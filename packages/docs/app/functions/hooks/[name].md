<script setup>
import Meta from '../../../src/components/meta.vue'
import Badges from '../../../src/components/badges.vue'
import Api from '../../../src/components/api.vue'
import Demo from '../../../src/components/demo.vue'
import Source from '../../../src/components/source.vue'
import Contributors from '../../../src/components/contributors.vue'
import Code from '../../../src/components/code.vue'
</script>

# {{ $params.name }}

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

{{ $params.description }}

<Code :code="$params.example" lang="typescript" />

## Usage

<Code :code="$params.usage" lang="typescript" />

## Demo

<Demo :type="$params.type" :name="$params.name" />

<template v-if="$params.apiParameters.length">

## Api

<Api :apiParameters="$params.apiParameters" />

</template>

## Source

<Source :type="$params.type" :name="$params.name" />

## Contributors

<Contributors :contributors="$params.contributors" />
