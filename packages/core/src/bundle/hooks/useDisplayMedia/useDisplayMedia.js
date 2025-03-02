import { useEffect, useRef, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useDisplayMedia
 * @description - Hook that provides screen sharing functionality
 * @category Browser
 *
 * @browserapi mediaDevices.getDisplayMedia https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
 *
 * @overload
 * @template Target The target video element
 * @param {Target} target The target video element to display the media stream
 * @param {boolean | MediaTrackConstraints} [options.audio] Whether to enable audio sharing
 * @param {boolean} [options.enabled=false] Whether to start immediately
 * @param {boolean | MediaTrackConstraints} [options.video] Whether to enable video sharing
 * @returns {UseDisplayMediaReturn} Object containing stream, sharing status and control methods
 *
 * @example
 * const { stream, sharing, start, stop } = useDisplayMedia(ref);
 *
 * @overload
 * @template Target The target video element
 * @param {boolean | MediaTrackConstraints} [options.audio] Whether to enable audio sharing
 * @param {boolean} [options.enabled=false] Whether to start immediately
 * @param {boolean | MediaTrackConstraints} [options.video] Whether to enable video sharing
 * @returns {UseDisplayMediaReturn & { ref: StateRef<HTMLVideoElement> }} Object containing stream, sharing status, control methods and ref
 *
 * @example
 * const { ref, stream, sharing, start, stop } = useDisplayMedia<HTMLVideoElement>();
 */
export const useDisplayMedia = ((...params) => {
    const supported = typeof navigator !== 'undefined' &&
        'mediaDevices' in navigator &&
        !!navigator.mediaDevices &&
        'getDisplayMedia' in navigator.mediaDevices;
    const target = (isTarget(params[0]) ? params[0] : undefined);
    const options = (params[1] ? params[1] : params[0]);
    const enabled = options?.enabled ?? false;
    const [sharing, setSharing] = useState(false);
    const streamRef = useRef(null);
    const internalRef = useRefState();
    const stop = () => {
        if (!streamRef.current || !supported)
            return;
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        setSharing(false);
        element.srcObject = null;
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    };
    const start = async () => {
        if (!supported)
            return;
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        const displayMedia = await navigator.mediaDevices.getDisplayMedia({
            video: options?.video,
            audio: options?.audio
        });
        setSharing(true);
        streamRef.current = displayMedia;
        element.srcObject = displayMedia;
        displayMedia.getTracks().forEach((track) => (track.onended = stop));
        return displayMedia;
    };
    useEffect(() => {
        if (!supported || !enabled)
            return;
        if (!target && !internalRef.state)
            return;
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        start();
        return () => {
            stop();
        };
    }, [target, internalRef.state]);
    if (target)
        return {
            stream: streamRef.current,
            sharing,
            supported,
            start,
            stop
        };
    return {
        stream: streamRef.current,
        sharing,
        supported,
        start,
        stop,
        ref: internalRef
    };
});
