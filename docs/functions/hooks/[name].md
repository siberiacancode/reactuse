<script setup>
import Meta from '../../src/components/meta.vue'
import Api from '../../src/components/api.vue'
import Demo from '../../src/components/demo.vue'
import Contributors from '../../src/components/contributors.vue'
import Code from '../../src/components/code.vue'
</script>

# {{ $params.name }}

<Meta :last-modified="$params.lastModified" :category="$params.category" />

{{ $params.description }}

<Code :code="$params.example" lang="typescript" />

## Usage

<Code :code="$params.usage" lang="typescript" />

## Demo

<Demo :hook="$params.name" />

## Api

<Api :apiParameters="$params.apiParameters" />

## Contributors

<Contributors :hook="$params.name" />
