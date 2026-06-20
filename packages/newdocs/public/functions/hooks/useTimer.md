---
title: useTimer
description: Hook that creates a timer functionality
category: time
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

import metadata from './useTimer.meta.json';

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
    npx useverse@latest add useTimer
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
const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer();
// or
const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer(1000, () => console.log('ready'));
// or
const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer(1000);
```

## Type Declarations

<FunctionCode code={metadata.typeDeclarations} language="tsx" />

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Contributors

<FunctionContributors contributors={metadata.contributors} />