---
title: useBoolean
description: Hook provides opportunity to manage boolean state
category: state
usage: necessary
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

import metadata from './useBoolean.meta.json';

<FunctionSource variant='demo' type='hook' file='useBoolean' language="tsx" />

## Installation

<FunctionTabs>
  <TabsList>
    <TabsTrigger value='library'>Library</TabsTrigger>
    <TabsTrigger value='cli'>CLI</TabsTrigger>
    <TabsTrigger value='manual'>Manual</TabsTrigger>
  </TabsList>
  <TabsContent value='library'>
    ```tsx
    import { useBoolean } from '@siberiacancode/reactuse';
    ```
  </TabsContent>
  <TabsContent value='cli'>
    ```bash
    npx useverse@latest add useBoolean
    ```
  </TabsContent>
  <TabsContent value='manual'>
    <Steps>
     <Step>
      Copy and paste the following code into your project.
    </Step>
      <FunctionSource variant='code' type='hook' file='useBoolean' language="ts" />
    <Step>
      Update the import paths to match your project setup.
    </Step>
  </Steps>
  </TabsContent>
</FunctionTabs>

## Usage

```tsx
const [on, toggle] = useBoolean();
```

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Type Declarations

<FunctionSource variant='type-declarations' type='hook' file='useBoolean' language='ts' />

## Contributors

<FunctionContributors contributors={metadata.contributors} />
