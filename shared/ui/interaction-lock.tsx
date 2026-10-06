'use client';
import { createContext, useContext } from 'react';

const InteractionLock = createContext(false);
export const InteractionLockProvider = InteractionLock.Provider;
/** Shared controls inherit the lock through portals as well as normal DOM children. */
export const useInteractionLock = () => useContext(InteractionLock);
