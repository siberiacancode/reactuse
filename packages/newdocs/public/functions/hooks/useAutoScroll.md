---
title: useAutoScroll
description: Hook that automatically scrolls a list element to the bottom
category: elements
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1775645190000
---

import metadata from './useAutoScroll.meta.json';

<FunctionBanner browserapi={metadata.browserapi} code={metadata.demo} type={metadata.type} name={metadata.name} language="tsx" />

## Installation

<FunctionTabs>
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
    npx useverse@latest add useAutoScroll
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
useAutoScroll(ref);
// or
const ref = useAutoScroll();
```

## Type Declarations

<FunctionCode code={metadata.typeDeclarations} language="tsx" />
<FunctionApi apiParameters={metadata.apiParameters} />

## Contributors

<FunctionContributors contributors={metadata.contributors} />