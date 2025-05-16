// map-search-context.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

type MapSearchContextType = {
  selectedStoreId: string | null;
  setSelectedStoreId: (id: string | null, selectionOrigin: 'map' | 'search' | 'other') => void; // Added origin
  storeName: string | null;
  setStoreName: (name: string | null) => void;
  isOpen: boolean | null;
  setIsOpen: (isOpen: boolean | null) => void;
  selectedProductName: string | null;
  setSelectedProductName: (name: string | null) => void;
  // Flag to indicate the origin of the most recent selection
  // This can be read by listeners if they need to behave differently.
  lastSelectionOrigin: 'map' | 'search' | 'other' | null;
};

const MapSearchContext = createContext<MapSearchContextType>({
  selectedStoreId: null,
  setSelectedStoreId: () => {},
  storeName: null,
  setStoreName: () => {},
  isOpen: null,
  setIsOpen: () => {},
  selectedProductName: null,
  setSelectedProductName: () => {},
  lastSelectionOrigin: null,
});

export const useMapSearch = () => useContext(MapSearchContext);

export const MapSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStoreIdState, setSelectedStoreIdState] = useState<string | null>(null);
  const [storeNameState, setStoreNameState] = useState<string | null>(null); // Renamed for clarity
  const [isOpenState, setIsOpenState] = useState<boolean | null>(null);       // Renamed
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  const [lastSelectionOrigin, setLastSelectionOrigin] = useState<'map' | 'search' | 'other' | null>(null);
  const isEventDispatchInProgressRef = useRef<boolean>(false);

  const handleSetSelectedStoreId = useCallback((id: string | null, selectionOrigin: 'map' | 'search' | 'other') => {
    const currentSelectedStoreId = selectedStoreIdState; // Capture at call time
    
    console.log(`Context: setSelectedStoreId called. New ID: ${id}, Origin: ${selectionOrigin}, Current ID State: ${currentSelectedStoreId}`);

    // Update the origin state immediately
    setLastSelectionOrigin(selectionOrigin);

    // Only proceed if the ID is actually changing
    if (id === currentSelectedStoreId) {
        console.log("Context: ID is the same as current state. No state change or event dispatch needed.");
        return; 
    }

    setSelectedStoreIdState(id);

    if (id === null) {
      setStoreNameState(null); // Use the specific state setter
      setIsOpenState(null);   // Use the specific state setter
    }
    // Note: setStoreName and setIsOpen will be called by components listening to the event,
    // or by the component that initiated the selection (e.g., SearchBar fetching store details).
    // The context primarily manages the ID and dispatches the event.

    if (
      typeof window !== 'undefined' && 
      id !== null && // Only dispatch for actual selections, not deselection (null)
      !isEventDispatchInProgressRef.current
    ) {
      console.log(`Context: Dispatching 'storeSelected' event for ID: ${id}, Origin: ${selectionOrigin}`);
      isEventDispatchInProgressRef.current = true;
      
      const storeSelectedEvent = new CustomEvent('storeSelected', {
        detail: { storeId: id, origin: selectionOrigin } // Pass origin in event detail
      });
      window.dispatchEvent(storeSelectedEvent);
      
      setTimeout(() => {
        isEventDispatchInProgressRef.current = false;
      }, 0);
    }
  }, [selectedStoreIdState]); // Removed other state setters from deps, they are handled by listeners
  
  return (
    <MapSearchContext.Provider
      value={{
        selectedStoreId: selectedStoreIdState,
        setSelectedStoreId: handleSetSelectedStoreId,
        storeName: storeNameState,
        setStoreName: setStoreNameState, // Provide direct setters for components that need them
        isOpen: isOpenState,
        setIsOpen: setIsOpenState,       // Provide direct setters
        selectedProductName,
        setSelectedProductName,
        lastSelectionOrigin,
        // No longer need to expose isMapSelectionInProgress or setIsMapSelectionInProgress from context
        // isEventDispatchInProgress is internal to this provider
      }}
    >
      {children}
    </MapSearchContext.Provider>
  );
};