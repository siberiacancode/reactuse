---
title: createSharedHook
description: One shared instance of the hook globally. First subscriber's args are used; when subscribers hit zero, the runner unmounts.
category: helpers
usage: low
type: helper
isTest: false
isDemo: false
lastModifiedTime: 1772547351000
---

import metadata from './createSharedHook.meta.json';


<Callout title='Warning' variant='warning' className='my-5'>
  {metadata.warning}
</Callout>
<FunctionBanner browserapi={metadata.browserapi} code={metadata.demo} type={metadata.type} name={metadata.name} language="tsx" />

## Installation

<FunctionTabs className='space-y-2'>
  <TabsList>
    <TabsTrigger value='library'>Library</TabsTrigger>
    <TabsTrigger value='cli'>CLI</TabsTrigger>
    <TabsTrigger value='manual'>Manual</TabsTrigger>
  </TabsList>
  <TabsContent value='library'>
    ```packages-install
    npm install @siberiacancode/reactuse
    ```
  </TabsContent>
  <TabsContent value='cli'>
    ```packages-install
    npx useverse@latest add createSharedHook
    ```
  </TabsContent>
  <TabsContent value='manual'>
    <Steps>
     <Step>
      Copy and paste the following code into your project.
    </Step>
      <FunctionCode code={metadata.code} language="tsx" />
    <Step>
      Update the import paths to match your project setup.
    </Step>
  </Steps>
  </TabsContent>
</FunctionTabs>

## Usage

```tsx
const useSharedMediaQuery = createSharedHook(useMediaQuery); const matches = useSharedMediaQuery("(max-width: 768px)");
```

## Type Declarations

<FunctionCode code={metadata.typeDeclarations} language="tsx" />

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Contributors

<FunctionContributors contributors={metadata.contributors} />