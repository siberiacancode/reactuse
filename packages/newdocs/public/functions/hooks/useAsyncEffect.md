---
title: useAsyncEffect
description: Hook that triggers the effect callback on updates
category: lifecycle
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1758638440000
---

import metadata from './useAsyncEffect.meta.json';

<FunctionSource variant='demo' type='hook' file='useAsyncEffect' language="tsx" />

## Installation

<FunctionTabs>
  <TabsList>
    <TabsTrigger value='library'>Library</TabsTrigger>
    <TabsTrigger value='cli'>CLI</TabsTrigger>
    <TabsTrigger value='manual'>Manual</TabsTrigger>
  </TabsList>
  <TabsContent value='library'>
    ```tsx
    import { useAsyncEffect } from '@siberiacancode/reactuse';
    ```
  </TabsContent>
  <TabsContent value='cli'>
    ```bash
    npx useverse@latest add useAsyncEffect
    ```
  </TabsContent>
  <TabsContent value='manual'>
    <Steps>
     <Step>
      Copy and paste the following code into your project.
    </Step>
      <FunctionSource variant='code' type='hook' file='useAsyncEffect' language="ts" />
    <Step>
      Update the import paths to match your project setup.
    </Step>
  </Steps>
  </TabsContent>
</FunctionTabs>

## Usage

```tsx
useAsyncEffect(async () => console.log('effect runs on updates'), deps);
```

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Type Declarations

<FunctionSource variant='type-declarations' type='hook' file='useAsyncEffect' language='ts' />

## Contributors

<FunctionContributors contributors={metadata.contributors} />
