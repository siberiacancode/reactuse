'use client';

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';

const Collapsible = ({ ...props }: CollapsiblePrimitive.Root.Props) => (
  <CollapsiblePrimitive.Root data-slot='collapsible' {...props} />
);

const CollapsibleTrigger = ({ ...props }: CollapsiblePrimitive.Trigger.Props) => (
  <CollapsiblePrimitive.Trigger data-slot='collapsible-trigger' {...props} />
);

type CollapsibleContentProps = CollapsiblePrimitive.Panel.Props & {
  forceMount?: boolean;
};

const CollapsibleContent = ({ forceMount, keepMounted, ...props }: CollapsibleContentProps) => (
  <CollapsiblePrimitive.Panel
    data-slot='collapsible-content'
    keepMounted={keepMounted ?? forceMount}
    {...props}
  />
);

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
