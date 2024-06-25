---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: reactuse 🚀
  tagline: the largest and most useful hook library
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/siberiacancode/reactuse 

features:
- title: useBattery
  details: Hook for getting information about battery status
  link: /functions/hooks/useBattery
- title: useBoolean
  details: Hook provides a boolean state and a function to toggle the boolean value
  link: /functions/hooks/useBoolean
- title: useBrowserLanguage
  details: Hook that returns the current browser language
  link: /functions/hooks/useBrowserLanguage
- title: useClickOutside
  details: Hook to handle click events outside the specified target element(s)
  link: /functions/hooks/useClickOutside
- title: useCopyToClipboard
  details: Hook that manages a copy to clipboard
  link: /functions/hooks/useCopyToClipboard
- title: useCounter
  details: Hook that manages a counter with increment, decrement, reset, and set functionalities
  link: /functions/hooks/useCounter
- title: useDebouncedCallback
  details: Hook that creates a debounced callback and returns a stable reference of it
  link: /functions/hooks/useDebouncedCallback
- title: useDebouncedValue
  details: Hook that creates a debounced value and returns a stable reference of it
  link: /functions/hooks/useDebouncedValue
- title: useDefault
  details: Hook that returns the default value
  link: /functions/hooks/useDefault
- title: useDidUpdate
  details: Hook that behaves like useEffect, but skips the effect on the initial render
  link: /functions/hooks/useDidUpdate
- title: useDisclosure
  details: Hook that allows you to open and close a modal
  link: /functions/hooks/useDisclosure
- title: useDocumentEvent
  details: Hook attaches an event listener to the document object for the specified event
  link: /functions/hooks/useDocumentEvent
- title: useDocumentTitle
  details: Hook that manages the document title and allows updating it
  link: /functions/hooks/useDocumentTitle
- title: useDocumentVisibility
  details: Hook that provides the current visibility state of the document
  link: /functions/hooks/useDocumentVisibility
- title: useEvent
  details: Hook that creates an event and returns a stable reference of it
  link: /functions/hooks/useEvent
- title: useEyeDropper
  details: Hook that gives you access to the eye dropper
  link: /functions/hooks/useEyeDropper
- title: useFavicon
  details: Hook that manages the favicon
  link: /functions/hooks/useFavicon
- title: useField
  details: Hook to manage a form field
  link: /functions/hooks/useField
- title: useFullscreen
  details: Hook to handle fullscreen events
  link: /functions/hooks/useFullscreen
- title: useFps
  details: Hook that measures frames per second
  link: /functions/hooks/useFps
- title: useHash
  details: Hook that manages the hash value
  link: /functions/hooks/useHash
- title: useHotkeys
  details: Hook that listens for hotkeys
  link: /functions/hooks/useHotkeys
- title: useHover
  details: Hook that defines the logic when hovering an element
  link: /functions/hooks/useHover
- title: useIdle
  details: Hook that defines the logic when the user is idle
  link: /functions/hooks/useIdle
- title: useInterval
  details: Hook that makes and interval and returns controlling functions
  link: /functions/hooks/useInterval
- title: useIsFirstRender
  details: Hook that returns true if the component is first render
  link: /functions/hooks/useIsFirstRender
- title: useIsomorphicLayoutEffect
  details: Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment
  link: /functions/hooks/useIsomorphicLayoutEffect
- title: useKeyboard
  details: Hook that help to listen for keyboard events
  link: /functions/hooks/useKeyboard
- title: useKeyPress
  details: Hook that listens for key press events
  link: /functions/hooks/useKeyPress
- title: useKeysPressed
  details: Hook for get keys that were pressed
  link: /functions/hooks/useKeysPressed
- title: useList
  details: Hook that defines the logic when unmounting a component
  link: /functions/hooks/useList
- title: useLocalStorage
  details: Hook that manages local storage value
  link: /functions/hooks/useLocalStorage
- title: useLogger
  details: Hook that defines the logic when long pressing an element
  link: /functions/hooks/useLogger
- title: useLongPress
  details: Hook for debugging lifecycle
  link: /functions/hooks/useLongPress
- title: useMap
  details: Hook that manages a map structure
  link: /functions/hooks/useMap
- title: useMediaQuery
  details: Hook that manages a media query
  link: /functions/hooks/useMediaQuery
- title: useMount
  details: Hook that executes a callback when the component mounts
  link: /functions/hooks/useMount
- title: useMouse
  details: Hook that manages a mouse position
  link: /functions/hooks/useMouse
- title: useMutation
  details: Hook that defines the logic when mutate data
  link: /functions/hooks/useMutation
- title: useNetwork
  details: Hook to track network status
  link: /functions/hooks/useNetwork
- title: useOnline
  details: Hook that manages if the user is online
  link: /functions/hooks/useOnline
- title: useOperatingSystem
  details: Hook that returns the operating system of the current browser
  link: /functions/hooks/useOperatingSystem
- title: useOrientation
  details: Hook that returns the current screen orientation
  link: /functions/hooks/useOrientation
- title: usePaint
  details: Hook that allows you to draw in a specific area
  link: /functions/hooks/usePaint
- title: usePageLeave
  details: Hook what calls given function when mouse leaves the page
  link: /functions/hooks/usePageLeave
- title: usePreferredColorScheme
  details: Hook that returns user preferred color scheme
  link: /functions/hooks/usePreferredColorScheme
- title: usePreferredLanguages
  details: Hook that returns a browser preferred languages from navigator
  link: /functions/hooks/usePreferredLanguages
- title: usePrevious
  details: Hook that returns the previous value
  link: /functions/hooks/usePrevious
# - title: useQRCode
#   details: Hook that generates a QR code
#   link: /functions/hooks/useQRCode
- title: useQuery
  details: Hook that defines the logic when query data
  link: /functions/hooks/useQuery
- title: useQueue
  details: Hook that manages a queue
  link: /functions/hooks/useQueue
- title: useRenderCount
  details: Hook returns count component render times
  link: /functions/hooks/useRenderCount
- title: useRerender
  details: Hook that defines the logic to force rerender a component
  link: /functions/hooks/useRerender
- title: useScript
  details: Hook that manages a script with onLoad, onError, and removeOnUnmount functionalities
  link: /functions/hooks/useScript
- title: useStopwatch
  details: Hook that creates a stopwatch functionality
  link: /functions/hooks/useStopwatch
- title: useSessionStorage
  details: Hook that manages session storage value
  link: /functions/hooks/useSessionStorage
- title: useSet
  details: Hook that manages a set structure
  link: /functions/hooks/useSet
- title: useShare
  details: Hook that utilize the Web Share API
  link: /functions/hooks/useShare
- title: useTextSelection
  details: Hook that manages the text selection
  link: /functions/hooks/useTextSelection 
- title: useTime
  details: Hook that gives you current time in different values
  link: /functions/hooks/useTime
- title: useTimeout
  details: Hook that executes a callback function after a specified delay
  link: /functions/hooks/useTimeout
- title: useToggle
  details: Hook that create toggle
  link: /functions/hooks/useToggle
- title: useUnmount
  details: Hook that defines the logic when unmounting a component
  link: /functions/hooks/useUnmount
- title: useWebSocket
  details: Hook that connects to a WebSocket server and handles incoming and outgoing messages
  link: /functions/hooks/useWebSocket
- title: useWindowEvent
  details: Hook attaches an event listener to the window object for the specified event
  link: /functions/hooks/useWindowEvent
- title: useWindowSize
  details: Hook that manages a window size
  link: /functions/hooks/useWindowSize
---


