---
title: useBattery
description: Hook for getting information about battery status
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1755779687000
---

import metadata from './useBattery.meta.json';

<FunctionSource variant='demo' type='hook' file='useBattery' language="tsx" />

## Installation

<FunctionTabs>
  <TabsList>
    <TabsTrigger value='library'>Library</TabsTrigger>
    <TabsTrigger value='cli'>CLI</TabsTrigger>
    <TabsTrigger value='manual'>Manual</TabsTrigger>
  </TabsList>
  <TabsContent value='library'>
    ```tsx
    import { useBattery } from '@siberiacancode/reactuse';
    ```
  </TabsContent>
  <TabsContent value='cli'>
    ```bash
    npx useverse@latest add useBattery
    ```
  </TabsContent>
  <TabsContent value='manual'>
    <Steps>
     <Step>
      Copy and paste the following code into your project.
    </Step>
      <FunctionSource variant='code' type='hook' file='useBattery' language="ts" />
    <Step>
      Update the import paths to match your project setup.
    </Step>
  </Steps>
  </TabsContent>
</FunctionTabs>

## Usage

```tsx
const { supported, loading, charging, chargingTime, dischargingTime, level } = useBattery();
```

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Type Declarations

<FunctionSource variant='type-declarations' type='hook' file='useBattery' language='ts' />

## Contributors

<FunctionContributors contributors={metadata.contributors} />
