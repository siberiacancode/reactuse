---
title: useActiveElement
description: Hook for tracking the active element
category: elements
usage: low
type: hook
isTest: true
isDemo: true
---

<FunctionSource variant='demo' type='hook' file='useActiveElement' language="tsx" />
## Installation

<FunctionTabs>
  <TabsList>
    <TabsTrigger value='library'>Library</TabsTrigger>
    <TabsTrigger value='cli'>CLI</TabsTrigger>
    <TabsTrigger value='manual'>Manual</TabsTrigger>
  </TabsList>
  <TabsContent value='library'>
    ```tsx
    import { useActiveElement } from '@siberiacancode/reactuse';
    ```
  </TabsContent>
  <TabsContent value='cli'>
    ```bash
    npx useverse@latest add useActiveElement
    ```
  </TabsContent>
  <TabsContent value='manual'>
    <Steps>
     <Step>
      Copy and paste the following code into your project.
    </Step>
      <FunctionSource variant='code' type='hook' file='useActiveElement' language="ts" />
    <Step>
      Update the import paths to match your project setup.
    </Step>
  </Steps>
  </TabsContent>
</FunctionTabs>

## Usage

```tsx
const activeElement = useActiveElement(ref);
// or
const { ref, value } = useActiveElement();
```

Last changed: 1 hour ago