---
title: useBatchedCallback
description: Hook that batches calls and forwards them to a callback
category: utilities
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1773475680000
---

import metadata from './useBatchedCallback.meta.json';

<FunctionSource variant='demo' type='hook' file='useBatchedCallback' language="tsx" />

## Installation

<FunctionTabs>
  <TabsList>
    <TabsTrigger value='library'>Library</TabsTrigger>
    <TabsTrigger value='cli'>CLI</TabsTrigger>
    <TabsTrigger value='manual'>Manual</TabsTrigger>
  </TabsList>
  <TabsContent value='library'>
    ```tsx
    import { useBatchedCallback } from '@siberiacancode/reactuse';
    ```
  </TabsContent>
  <TabsContent value='cli'>
    ```bash
    npx useverse@latest add useBatchedCallback
    ```
  </TabsContent>
  <TabsContent value='manual'>
    <Steps>
     <Step>
      Copy and paste the following code into your project.
    </Step>
      <FunctionSource variant='code' type='hook' file='useBatchedCallback' language="ts" />
    <Step>
      Update the import paths to match your project setup.
    </Step>
  </Steps>
  </TabsContent>
</FunctionTabs>

## Usage

```tsx
const batched = useBatchedCallback((batch) => console.log(batch), 5);
```

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Type Declarations

<FunctionSource variant='type-declarations' type='hook' file='useBatchedCallback' language='ts' />

## Contributors

<FunctionContributors contributors={metadata.contributors} />
