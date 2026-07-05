---
title: cn
description: Combines class names from strings, arrays and objects into a single string
category: helpers
usage: high
type: helper
isTest: true
isDemo: true
lastModifiedTime: 1782218362000
---

import metadata from './cn.meta.json';

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
    npx useverse@latest add cn
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
cn('btn', ['btn-primary', { 'btn-disabled': disabled }]);
```

## Type Declarations

<FunctionCode code={metadata.typeDeclarations} language="tsx" />

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Contributors

<FunctionContributors contributors={metadata.contributors} />