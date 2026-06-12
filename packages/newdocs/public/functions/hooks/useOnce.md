---
title: useOnce
description: Hook that runs an effect only once. Please do not use it in production code!
category: humor
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

import metadata from './useOnce.meta.json';

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
    npx useverse@latest add useOnce
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
useOnce(() => console.log('effect once'));
```

## Type Declarations

<FunctionCode code={metadata.typeDeclarations} language="tsx" />

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Contributors

<FunctionContributors contributors={metadata.contributors} />
