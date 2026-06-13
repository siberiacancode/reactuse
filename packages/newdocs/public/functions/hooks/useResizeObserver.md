---
title: useResizeObserver
description: Hook that gives you resize observer state
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1768553242000
---

import metadata from './useResizeObserver.meta.json';

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
    npx useverse@latest add useResizeObserver
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
const { entries, observer } = useResizeObserver(ref);
// or
const { ref, entries, observer } = useResizeObserver();
// or
const { ref, entries, observer } = useResizeObserver((entries) => console.log(entries));
// or
const { entries, observer } = useResizeObserver(ref, (entries) => console.log(entries));
```

## Type Declarations

<FunctionCode code={metadata.typeDeclarations} language="tsx" />

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Contributors

<FunctionContributors contributors={metadata.contributors} />