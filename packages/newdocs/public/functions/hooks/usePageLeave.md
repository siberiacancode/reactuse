---
title: usePageLeave
description: Hook what calls given function when mouse leaves the page
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

import metadata from './usePageLeave.meta.json';

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
    npx useverse@latest add usePageLeave
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
const isLeft = usePageLeave(() => console.log('on leave'));
```

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Contributors

<FunctionContributors contributors={metadata.contributors} />
