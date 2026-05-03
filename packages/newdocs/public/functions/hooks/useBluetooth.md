---
title: useBluetooth
description: Hook for getting information about bluetooth
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1756134040000
---

import metadata from './useBluetooth.meta.json';

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
    npx useverse@latest add useBluetooth
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
const { supported, connected, device, requestDevice, server } = useBluetooth(options);
```

## Type Declarations

<FunctionCode code={metadata.typeDeclarations} language="tsx" />
<FunctionApi apiParameters={metadata.apiParameters} />

## Contributors

<FunctionContributors contributors={metadata.contributors} />