<script setup>
import Demo from '../../components/demo.vue'
</script>

# useDocumentTitle

Hook provides a boolean state and a function to toggle the boolean value

```ts
import { useDocumentTitle } from '@sibericancode/reactuse';
```

## Usage

```ts
const [title, setTitle] = useDocumentTitle()
```

## Demo

<Demo hook="useDocumentTitle" />

## Api

### Parameters

| Name          | Type                                                  | Default                                     | Note                                          |
|---------------|-------------------------------------------------------|---------------------------------------------|-----------------------------------------------|
| value?        | string                                                | `document.title`                            | The value to set the document title to.       |
| options?      | [`UseDocumentTitleOptions`](#usedocumenttitleoptions) | `undefined`                                 | The options for the `useDocumentTitle` hook.  |

### Returns

[`useDocumentTitleReturn`](#usedocumenttitlereturn)

## Type aliases

### UseDocumentTitleOptions

Type: `Object`\
Description: The options for the `useDocumentTitle` hook.

#### Type declaration

| Name             | Type                    | Note                                   |
|------------------|-------------------------|----------------------------------------|
| restoreOnUnmount | boolean                 | Restore the previous title on unmount. |

### useDocumentTitleReturn

Type: `Object`\
Description: An array containing the current title and a function to update the title.

#### Type declaration

| Name     | Type                    | Note                          |
|----------|-------------------------|-------------------------------|
| title    | string                  | The current title.            |
| setTitle | (title: string) => void | Function to update the title. |

## Source

[Source](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useDocumentTitle/useDocumentTitle.ts) • [Demo](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useDocumentTitle/useDocumentTitle.demo.ts) • [Docs](#)
