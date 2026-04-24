---
title: useBreakpoints
description: Hook that manages breakpoints
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1766052966000
---

import metadata from './useBreakpoints.meta.json';

<FunctionSource variant='demo' type='hook' file='useBreakpoints' language="tsx" />

## Installation

<FunctionTabs>
  <TabsList>
    <TabsTrigger value='library'>Library</TabsTrigger>
    <TabsTrigger value='cli'>CLI</TabsTrigger>
    <TabsTrigger value='manual'>Manual</TabsTrigger>
  </TabsList>
  <TabsContent value='library'>
    ```tsx
    import { useBreakpoints } from '@siberiacancode/reactuse';
    ```
  </TabsContent>
  <TabsContent value='cli'>
    ```bash
    npx useverse@latest add useBreakpoints
    ```
  </TabsContent>
  <TabsContent value='manual'>
    <Steps>
     <Step>
      Copy and paste the following code into your project.
    </Step>
      <FunctionSource variant='code' type='hook' file='useBreakpoints' language="ts" />
    <Step>
      Update the import paths to match your project setup.
    </Step>
  </Steps>
  </TabsContent>
</FunctionTabs>

## Usage

```tsx
const { greater, smaller, between, current, active, ...breakpoints } = useBreakpoints({ mobile: 0, tablet: 640, laptop: 1024, desktop: 1280 });
```

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Type Declarations

<FunctionSource variant='type-declarations' type='hook' file='useBreakpoints' language='ts' />

## Contributors

<FunctionContributors contributors={metadata.contributors} />