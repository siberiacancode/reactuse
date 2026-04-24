---
title: useAudio
description: Hook that manages audio playback with sprite support
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1762758339000
---

import metadata from './useAudio.meta.json';

<FunctionSource variant='demo' type='hook' file='useAudio' language="tsx" />

## Installation

<FunctionTabs>
  <TabsList>
    <TabsTrigger value='library'>Library</TabsTrigger>
    <TabsTrigger value='cli'>CLI</TabsTrigger>
    <TabsTrigger value='manual'>Manual</TabsTrigger>
  </TabsList>
  <TabsContent value='library'>
    ```tsx
    import { useAudio } from '@siberiacancode/reactuse';
    ```
  </TabsContent>
  <TabsContent value='cli'>
    ```bash
    npx useverse@latest add useAudio
    ```
  </TabsContent>
  <TabsContent value='manual'>
    <Steps>
     <Step>
      Copy and paste the following code into your project.
    </Step>
      <FunctionSource variant='code' type='hook' file='useAudio' language="ts" />
    <Step>
      Update the import paths to match your project setup.
    </Step>
  </Steps>
  </TabsContent>
</FunctionTabs>

## Usage

```tsx
const audio = useAudio("/path/to/sound.mp3");
```

## API

<FunctionApi apiParameters={metadata.apiParameters} />

## Type Declarations

<FunctionSource variant='type-declarations' type='hook' file='useAudio' language='ts' />

## Contributors

<FunctionContributors contributors={metadata.contributors} />