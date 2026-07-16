---
title: Usage
description: Browse functions by how commonly they are used in real projects.
---

## Groups

Explore the catalog grouped by practical usage level.

### Necessary

Core everyday primitives that cover the most common React tasks.

- [useBoolean](/functions/hooks/useBoolean): Hook provides opportunity to manage boolean state
- [useClickOutside](/functions/hooks/useClickOutside): Hook to handle click events outside the specified target element(s)
- [useDidUpdate](/functions/hooks/useDidUpdate): Hook that triggers the effect callback on updates
- [useDisclosure](/functions/hooks/useDisclosure): Hook that allows you to open and close a modal
- [useEventListener](/functions/hooks/useEventListener): Hook that attaches an event listener to the specified target
- [useMount](/functions/hooks/useMount): Hook that executes a callback when the component mounts
- [useUnmount](/functions/hooks/useUnmount): Hook that defines the logic when unmounting a component

### High

Frequently useful functions that fit naturally into many production features.

- [cn](/functions/helpers/cn): Combines class names from strings, arrays and objects into a single string
- [createContext](/functions/helpers/createContext): Creates a typed context with additional utilities
- [useConst](/functions/hooks/useConst): Hook that returns the constant value
- [useDebounceCallback](/functions/hooks/useDebounceCallback): Hook that creates a debounced callback
- [useDebounceEffect](/functions/hooks/useDebounceEffect): Hook that runs an effect after a delay when dependencies change
- [useDebounceState](/functions/hooks/useDebounceState): Hook that creates a debounced state
- [useDebounceValue](/functions/hooks/useDebounceValue): Hook that creates a debounced value
- [useEvent](/functions/hooks/useEvent): Hook that creates an event and returns a stable reference of it
- [useInterval](/functions/hooks/useInterval): Hook that makes and interval and returns controlling functions
- [useIsomorphicLayoutEffect](/functions/hooks/useIsomorphicLayoutEffect): Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment
- [useLocalStorage](/functions/hooks/useLocalStorage): Hook that manages local storage value
- [useMap](/functions/hooks/useMap): Hook that manages a map structure
- [useMutation](/functions/hooks/useMutation): Hook that defines the logic when mutate data
- [useQuery](/functions/hooks/useQuery): Hook that defines the logic when query data
- [useStopwatch](/functions/hooks/useStopwatch): Hook that creates a stopwatch functionality
- [useStorage](/functions/hooks/useStorage): Hook that manages storage value
- [useToggle](/functions/hooks/useToggle): Hook that create toggle
- [useUrlSearchParam](/functions/hooks/useUrlSearchParam): Hook that provides reactive URLSearchParams for a single key
- [useUrlSearchParams](/functions/hooks/useUrlSearchParams): Hook that provides reactive URLSearchParams

### Medium

Situational building blocks for recurring patterns and product-specific workflows.

- [createStore](/functions/helpers/createStore): Creates a store with state management capabilities
- [useAsync](/functions/hooks/useAsync): Hook that provides the state of an async callback
- [useAsyncEffect](/functions/hooks/useAsyncEffect): Hook that triggers the effect callback on updates
- [useBatchedCallback](/functions/hooks/useBatchedCallback): Hook that batches calls and forwards them to a callback
- [useBreakpoints](/functions/hooks/useBreakpoints): Hook that manages breakpoints
- [useBrowserLanguage](/functions/hooks/useBrowserLanguage): Hook that returns the current browser language
- [useBrowserLocation](/functions/hooks/useBrowserLocation): Hook that returns reactive browser location state with navigation controls
- [useClipboard](/functions/hooks/useClipboard): Hook that manages a copy to clipboard
- [useControllableState](/functions/hooks/useControllableState): Hook that manages both controlled and uncontrolled state patterns
- [useCookie](/functions/hooks/useCookie): Hook that manages cookie value
- [useCookies](/functions/hooks/useCookies): Hook that manages cookie values
- [useCopy](/functions/hooks/useCopy): Hook that manages copying text with status reset
- [useCycleList](/functions/hooks/useCycleList): Hook that cycles through a list of items
- [useDefault](/functions/hooks/useDefault): Hook that returns the default value
- [useDeviceList](/functions/hooks/useDeviceList): Hook that returns the list of available media devices
- [useDoubleClick](/functions/hooks/useDoubleClick): Hook that defines the logic when double clicking an element
- [useDropZone](/functions/hooks/useDropZone): Hook that provides drop zone functionality
- [useField](/functions/hooks/useField): Hook to manage a form field
- [useFocus](/functions/hooks/useFocus): Hook that allows you to focus on a specific element
- [useFocusTrap](/functions/hooks/useFocusTrap): Hook that traps focus within a given element
- [useForm](/functions/hooks/useForm): Hook to manage a form
- [useGeolocation](/functions/hooks/useGeolocation): Hook that returns the current geolocation
- [useHotkeys](/functions/hooks/useHotkeys): Hook that listens for hotkeys
- [useHover](/functions/hooks/useHover): Hook that defines the logic when hovering an element
- [useInfiniteScroll](/functions/hooks/useInfiniteScroll): Hook that defines the logic for infinite scroll
- [useIntersectionObserver](/functions/hooks/useIntersectionObserver): Hook that gives you intersection observer state
- [useKeyboard](/functions/hooks/useKeyboard): Hook that helps to listen for keyboard events
- [useKeyPress](/functions/hooks/useKeyPress): Hook that listens for key press events
- [useLatest](/functions/hooks/useLatest): Hook that returns the stable reference of the value
- [useList](/functions/hooks/useList): Hook that provides state and helper methods to manage a list of items
- [useLockCallback](/functions/hooks/useLockCallback): Hook that prevents a callback from being executed multiple times simultaneously
- [useLockScroll](/functions/hooks/useLockScroll): Hook that locks scroll on an element or document body
- [useLongPress](/functions/hooks/useLongPress): Hook that defines the logic when long pressing an element
- [useMask](/functions/hooks/useMask): Hook to apply an input mask
- [useMediaQuery](/functions/hooks/useMediaQuery): Hook that manages a media query
- [useMediaStream](/functions/hooks/useMediaStream): Hook that provides reactive access to a `mediaDevices.getUserMedia` stream
- [useMergedRef](/functions/hooks/useMergedRef): Hook that merges multiple refs into a single ref
- [useNotification](/functions/hooks/useNotification): Hook that provides a reactive wrapper around the browser Notifications API
- [useObject](/functions/hooks/useObject): Hook that provides state and helper methods to manage an object
- [useOffsetPagination](/functions/hooks/useOffsetPagination): Hook that defines the logic when pagination
- [useOnline](/functions/hooks/useOnline): Hook that manages if the user is online
- [useOptimistic](/functions/hooks/useOptimistic): Hook that allows get optimistic value before its update
- [usePermission](/functions/hooks/usePermission): Hook that gives you the state of permission
- [usePreferredColorScheme](/functions/hooks/usePreferredColorScheme): Hook that returns user preferred color scheme
- [usePreferredContrast](/functions/hooks/usePreferredContrast): Hook that returns the contrast preference
- [usePreferredDark](/functions/hooks/usePreferredDark): Hook that returns if the user prefers dark mode
- [usePreferredLanguages](/functions/hooks/usePreferredLanguages): that returns a browser preferred languages from navigator
- [useProgress](/functions/hooks/useProgress): Hook that creates a lightweight progress bar
- [useQueue](/functions/hooks/useQueue): Hook that manages a queue
- [useRerender](/functions/hooks/useRerender): Hook that defines the logic to force rerender a component
- [useSessionStorage](/functions/hooks/useSessionStorage): Hook that manages session storage value
- [useSet](/functions/hooks/useSet): Hook that manages a set structure
- [useShare](/functions/hooks/useShare): Hook that utilizes the share api
- [useStateHistory](/functions/hooks/useStateHistory): Hook that manages state with history functionality
- [useStep](/functions/hooks/useStep): Hook that create stepper
- [useTextareaAutosize](/functions/hooks/useTextareaAutosize): Hook that automatically adjusts textarea height based on content
- [useTextDirection](/functions/hooks/useTextDirection): Hook that can get and set the direction of the element
- [useThrottleCallback](/functions/hooks/useThrottleCallback): Hook that creates a throttled callback
- [useThrottleEffect](/functions/hooks/useThrottleEffect): Hook that runs an effect at most once per delay period when dependencies change
- [useThrottleState](/functions/hooks/useThrottleState): Hook that creates a throttled state
- [useThrottleValue](/functions/hooks/useThrottleValue): Hook that creates a throttled value
- [useTime](/functions/hooks/useTime): Hook that gives you current time in different values
- [useTimeout](/functions/hooks/useTimeout): Hook that executes a callback function after a specified delay
- [useTimer](/functions/hooks/useTimer): Hook that creates a timer functionality
- [useValidatedState](/functions/hooks/useValidatedState): Hook that manages a state value together with its validation result
- [useVisibility](/functions/hooks/useVisibility): Hook that gives you visibility observer state
- [useWebSocket](/functions/hooks/useWebSocket): Hook that connects to a WebSocket server and handles incoming and outgoing messages
- [useWizard](/functions/hooks/useWizard): Hook that manages a wizard

### Low

Niche utilities for targeted browser APIs, edge cases, and specialized interactions.

- [createEventEmitter](/functions/helpers/createEventEmitter): Creates a type-safe event emitter
- [createReactiveContext](/functions/helpers/createReactiveContext): Creates a typed context selector with optimized updates for state selection
- [makeDestructurable](/functions/helpers/makeDestructurable): Makes an object also iterable for array-style destructuring
- [useActiveElement](/functions/hooks/useActiveElement): Hook for tracking the active element
- [useAudio](/functions/hooks/useAudio): Hook that manages audio playback with sprite support
- [useAutoScroll](/functions/hooks/useAutoScroll): Hook that automatically scrolls a list element to the bottom
- [useBattery](/functions/hooks/useBattery): Hook for getting information about battery status
- [useBluetooth](/functions/hooks/useBluetooth): Hook for getting information about bluetooth
- [useBroadcastChannel](/functions/hooks/useBroadcastChannel): Hook that provides cross-tab/window communication
- [useContextMenu](/functions/hooks/useContextMenu): Hook that handles custom context menus on desktop and long press on touch devices
- [useCounter](/functions/hooks/useCounter): Hook that manages a counter
- [useCssVar](/functions/hooks/useCssVar): Hook that returns the value of a css variable
- [useDeviceMotion](/functions/hooks/useDeviceMotion): Hook that work with device motion
- [useDeviceOrientation](/functions/hooks/useDeviceOrientation): Hook that provides the current device orientation
- [useDevicePixelRatio](/functions/hooks/useDevicePixelRatio): Hook that returns the device's pixel ratio
- [useDisplayMedia](/functions/hooks/useDisplayMedia): Hook that provides screen sharing functionality
- [useDocumentEvent](/functions/hooks/useDocumentEvent): Hook attaches an event listener to the document object for the specified event
- [useDocumentTitle](/functions/hooks/useDocumentTitle): Hook that manages the document title and allows updating it
- [useDocumentVisibility](/functions/hooks/useDocumentVisibility): Hook that provides the current visibility state of the document
- [useDraggable](/functions/hooks/useDraggable): Hook that makes an element draggable
- [useEventSource](/functions/hooks/useEventSource): Hook that provides a reactive wrapper for event source
- [useEyeDropper](/functions/hooks/useEyeDropper): Hook that gives you access to the eye dropper
- [useFavicon](/functions/hooks/useFavicon): Hook that manages the favicon
- [useFileDialog](/functions/hooks/useFileDialog): Hook to handle file input
- [useFileSystemAccess](/functions/hooks/useFileSystemAccess): Hook for reading and writing local files via the File System Access API
- [useFps](/functions/hooks/useFps): Hook that measures frames per second
- [useFul](/functions/hooks/useFul): Hook that can be so useful
- [useFullscreen](/functions/hooks/useFullscreen): Hook to handle fullscreen events
- [useGamepad](/functions/hooks/useGamepad): Hook for getting information about gamepad
- [useHash](/functions/hooks/useHash): Hook that manages the hash value
- [useIdle](/functions/hooks/useIdle): Hook that defines the logic when the user is idle
- [useImage](/functions/hooks/useImage): Hook that load an image in the browser
- [useIsFirstRender](/functions/hooks/useIsFirstRender): Hook that returns true if the component is first render
- [useKeysPressed](/functions/hooks/useKeysPressed): Hook that tracks all currently pressed keyboard keys and their codes
- [useLastChanged](/functions/hooks/useLastChanged): Hook for records the timestamp of the last change
- [useLess](/functions/hooks/useLess): Hook that can be so useless
- [useLogger](/functions/hooks/useLogger): Hook for debugging lifecycle
- [useMeasure](/functions/hooks/useMeasure): Hook to measure the size and position of an element
- [useMediaControls](/functions/hooks/useMediaControls): Hook that provides controls for HTML media elements (audio/video)
- [useMemory](/functions/hooks/useMemory): Hook that gives you current memory usage
- [useMouse](/functions/hooks/useMouse): Hook that manages a mouse position
- [useMutationObserver](/functions/hooks/useMutationObserver): Hook that gives you mutation observer state
- [useNetwork](/functions/hooks/useNetwork): Hook to track network status
- [useObjectUrl](/functions/hooks/useObjectUrl): Hook that creates and revokes an object URL for a Blob or MediaSource
- [useOnce](/functions/hooks/useOnce): Hook that runs an effect only once. Please do not use it in production code!
- [useOperatingSystem](/functions/hooks/useOperatingSystem): Hook that returns the operating system of the current browser
- [useOrientation](/functions/hooks/useOrientation): Hook that provides the current screen orientation
- [useOtpCredential](/functions/hooks/useOtpCredential): Hook that creates an otp credential
- [usePageLeave](/functions/hooks/usePageLeave): Hook what calls given function when mouse leaves the page
- [usePaint](/functions/hooks/usePaint): Hook that allows you to draw in a specific area
- [useParallax](/functions/hooks/useParallax): Hook to help create parallax effect
- [usePerformanceObserver](/functions/hooks/usePerformanceObserver): Hook that allows you to observe performance entries
- [usePictureInPicture](/functions/hooks/usePictureInPicture): Hook that provides Picture-in-Picture functionality for video elements
- [usePointerLock](/functions/hooks/usePointerLock): Hook that provides reactive pointer lock
- [usePostMessage](/functions/hooks/usePostMessage): Hook that allows you to receive messages from other origins
- [usePreferredReducedMotion](/functions/hooks/usePreferredReducedMotion): Hook that returns the reduced motion preference
- [usePrevious](/functions/hooks/usePrevious): Hook that returns the previous value
- [useRaf](/functions/hooks/useRaf): Hook that defines the logic for raf callback
- [useRafState](/functions/hooks/useRafState): Hook that returns the value and a function to set the value
- [useRefState](/functions/hooks/useRefState): Hook that returns the state reference of the value
- [useRenderCount](/functions/hooks/useRenderCount): Hook returns count component render times
- [useRenderInfo](/functions/hooks/useRenderInfo): Hook for getting information about component rerender
- [useResizeObserver](/functions/hooks/useResizeObserver): Hook that gives you resize observer state
- [useScript](/functions/hooks/useScript): Hook that manages a script with onLoad, onError, and removeOnUnmount functionalities
- [useScroll](/functions/hooks/useScroll): Hook that allows you to control scroll a element
- [useScrollIntoView](/functions/hooks/useScrollIntoView): Hook that provides functionality to scroll an element into view
- [useScrollTo](/functions/hooks/useScrollTo): Hook for scrolling to a specific element
- [useShallowEffect](/functions/hooks/useShallowEffect): Hook that executes an effect only when dependencies change shallowly or deeply
- [useSize](/functions/hooks/useSize): Hook that observes and returns the width and height of element
- [useSpeechRecognition](/functions/hooks/useSpeechRecognition): Hook that provides a streamlined interface for incorporating speech-to-text functionality
- [useSpeechSynthesis](/functions/hooks/useSpeechSynthesis): Hook that provides speech synthesis functionality
- [useSticky](/functions/hooks/useSticky): Hook that allows you to detect that your sticky component is stuck
- [useSwipe](/functions/hooks/useSwipe): Hook that tracks swipe gestures for touch and pointer events
- [useTextSelection](/functions/hooks/useTextSelection): Hook that manages the text selection
- [useVibrate](/functions/hooks/useVibrate): Hook that provides vibrate api
- [useVirtualKeyboard](/functions/hooks/useVirtualKeyboard): Hook that manages virtual keyboard state
- [useWakeLock](/functions/hooks/useWakeLock): Hook that provides a wake lock functionality
- [useWebWorker](/functions/hooks/useWebWorker): Hook that provides a reactive wrapper for a web worker
- [useWindowEvent](/functions/hooks/useWindowEvent): Hook attaches an event listener to the window object for the specified event
- [useWindowFocus](/functions/hooks/useWindowFocus): Hook that provides the current focus state of the window
- [useWindowScroll](/functions/hooks/useWindowScroll): Hook that manages the window scroll position
- [useWindowSize](/functions/hooks/useWindowSize): Hook that manages a window size