"use client";

import MapBlock from './map-block';
import MapTooltip from './map-tooltip';
import StoreComponent from './store-component';
import VisitaPlaceholder from './visita-placeholder';
import { createClient } from "@/utils/supabase/client";
import { mapData } from './assets/background-images/map';
import React, { useState, useEffect, useRef } from 'react';
import { useMapSearch } from '@/components/map-search-context';
import { colors } from '@/components/assets/background-images/map';


type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

type Store = {
  storeid: string;
  owner: string;
  storestatus: string;
  name: string;
  datecreated: string;
  isarchived: boolean;
};

type MapBlockData = {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  defaultColor: string;
  viewBox: string;
  icon: string;
  storeId: string | null;
  tooltipPosition?: TooltipPosition; // Added tooltipPosition property
};

export default function MapComponent() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const targetRef = useRef<HTMLDivElement>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("User");
  const [storeStatusMap, setStoreStatusMap] = useState<Record<string, boolean>>({});
  const [subscription, setSubscription] = useState<ReturnType<typeof supabase.channel> | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'right' | 'bottom' | 'left'>('top');
  const [selectedBlockCoords, setSelectedBlockCoords] = useState<{
    rowStart?: number;
    rowEnd?: number;
    colStart?: number;
    colEnd?: number;
  }>({});
  const { 
    selectedStoreId,  // Read from context
    setSelectedStoreId, // Call this to change selection
    storeName,          // Read from context (set by SearchBar or this component after fetch)
    setStoreName,       // Context setter
    isOpen,             // Read from context
    setIsOpen,          // Context setter
    lastSelectionOrigin // Read the origin
  } = useMapSearch();

  const handleToolTipPositionChange = (newPosition: 'top' | 'right' | 'bottom' | 'left') => {
    // Function still not working, tooltip only ever displays at the bottom
    if (newPosition === 'top') {
      setTooltipPosition('top');
    } else if (newPosition === 'right') {
      setTooltipPosition('right');
    } else if (newPosition === 'bottom') {
      setTooltipPosition('bottom');
    } else if (newPosition === 'left') {
      setTooltipPosition('left');
    }
  };

  const fetchStores = async (): Promise<{storeData: Store[], storeStatusMap: Record<string, boolean>}> => {
    try {
      // Joined the tables and selected everything from both tables
      const { data: stores, error } = await supabase.from('store').select(`*, storestatus:storestatus(*)`);
  
      if (error) {
        return { storeData: [], storeStatusMap: {} };
      }
  
      // Create a map of store IDs to their status
      const storeStatusMap: Record<string, boolean> = {};
      
      stores?.forEach(store => {
        const isOpen = store.storestatus?.status === true;
        storeStatusMap[store.storeid] = isOpen;
      });
      return { storeData: stores || [], storeStatusMap };
    } catch (error) {
      return { storeData: [], storeStatusMap: {} };
    }
  };

  useEffect(() => {
    // Get the current user when component mounts
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        // Use email or id as the user identifier
        setCurrentUser(data.user.id);
      }
    };
    fetchUser();
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    // First load all stores
    const loadAllStores = async () => {
      try {
        const { storeData, storeStatusMap } = await fetchStores();
        setStoreStatusMap(storeStatusMap);
        setLoading(false);
      } catch (error) {
        console.log('Error loading stores:', error);
        setError('Failed to load stores');
        setLoading(false);
      }
    };
    loadAllStores();

    // Set up realtime subscription to storestatus table
    const storeStatusChannel = supabase.channel('store-status-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'storestatus',
      },
      async (payload) => {
        console.log('Realtime update received:', payload);
        
        // More efficient approach: only update the specific store that changed
        if (payload.new && 'storeid' in payload.new) {
          const storeId = payload.new.storeid;
          const isStoreOpen = payload.new.status === true;
          
          // Update the store status map for just this store
          setStoreStatusMap(prev => ({
            ...prev,
            [storeId]: isStoreOpen
          }));
          
          // If the currently selected store was updated, update its details
          if (selectedStoreId && storeId === selectedStoreId) {
            setIsOpen(isStoreOpen);
          }
        }
      }
    )
    .subscribe((status) => {
      console.log('Realtime store subscription status:', status);
    });
    setSubscription(storeStatusChannel);

    // Clean up subscription when component unmounts
    return () => {
      if (storeStatusChannel) {
        supabase.removeChannel(storeStatusChannel);
      } 
    };
  }, [selectedStoreId]);

  // useEffect for handling custom 'storeSelected' event from search bar
  useEffect(() => {
    const handleStoreSelectedEvent = (event: CustomEvent) => {
      const { storeId: newStoreIdFromEvent, origin } = event.detail; // Get origin
      
      console.log(`MapComponent: Received 'storeSelected' event for ID: ${newStoreIdFromEvent}, Origin: ${origin}. Current selectedStoreId: ${selectedStoreId}`);

      // If the event originated from the map itself, MapComponent already handled it in handleMapBlockClick.
      // Or, if the ID is already the current one.
      if (origin === 'map' || newStoreIdFromEvent === selectedStoreId) {
      const selectedBlock = mapData.find((block: MapBlockData) => block.storeId === newStoreIdFromEvent);
        return;
      }

      // Event came from SearchBar or another source
      // Update local state based on this new selection
      // The context's selectedStoreIdState will already be updated by the time this event is handled.
      // We need to ensure MapComponent's own UI reflects this (e.g., tooltip, fetched data for StoreComponent if it relies on MapComponent's fetch)
      
      console.log(`MapComponent: Processing 'storeSelected' event from non-map origin for ID: ${newStoreIdFromEvent}`);
      fetchStoreData(newStoreIdFromEvent); // Fetch data for the store selected via search
        
      const selectedBlock = mapData.find(block => block.storeId === newStoreIdFromEvent);
      if (selectedBlock) {
        setSelectedBlockCoords({
          rowStart: selectedBlock.rowStart,
          rowEnd: selectedBlock.rowEnd,
          colStart: selectedBlock.colStart,
          colEnd: selectedBlock.colEnd,
        });
        if ('tooltipPosition' in selectedBlock && selectedBlock.tooltipPosition) { // Check if tooltipPosition exists
            // Calculate tooltip position based on block location
            const position = 
              selectedBlock.rowStart <= 5 ? 'bottom' :
              selectedBlock.colStart >= 35 ? 'left' :
              selectedBlock.colStart <= 5 ? 'right' : 'top';
            handleToolTipPositionChange(position);
        }
      } else {
        setSelectedBlockCoords({}); // Clear if no block found (e.g. store not on map)
      }
    };
  
    window.addEventListener('storeSelected', handleStoreSelectedEvent as EventListener);
    return () => window.removeEventListener('storeSelected', handleStoreSelectedEvent as EventListener);
  }, [selectedStoreId, mapData]); // Simpler dependencies, primarily reacts to context ID

  useEffect(() => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' }); // or 'auto'
  }, []);

  const handleMapBlockClick = (storeIdClicked: string, tooltipPositionValue?: TooltipPosition) => {
    const newSelectedStoreId = (selectedStoreId === storeIdClicked) ? null : storeIdClicked;
    
    console.log(`MapComponent: handleMapBlockClick for store ${storeIdClicked}. New target: ${newSelectedStoreId}`);

    // Call context's setSelectedStoreId, indicating origin is 'map'
    // The context will update its state and dispatch the 'storeSelected' event.
    setSelectedStoreId(newSelectedStoreId, 'map'); 

    if (newSelectedStoreId) {
      // Fetch data for the newly selected store and update local state for UI
      fetchStoreData(newSelectedStoreId); 
      
      const selectedBlock = mapData.find(block => block.storeId === newSelectedStoreId);
      if (selectedBlock) {
        setSelectedBlockCoords({ /* ... */ });
        if (tooltipPositionValue) handleToolTipPositionChange(tooltipPositionValue);
      }
    } else {
      // Deselection via map click
      setSelectedBlockCoords({});
      // storeName and isOpen will be cleared by context if id is null,
      // or by fetchStoreData if it fetches for a null ID (which it shouldn't).
      // The event listener will also pick up the null ID if context dispatches for it (it currently doesn't).
      // For deselection, the context should handle clearing storeName/isOpen when its internal ID becomes null.
    }
  };

  // Fetch specific store data when a store is selected
  const fetchStoreData = async (storeId: string | null) => { // Allow null for deselection
    if (!storeId) {
        setStoreName(null);
        setIsOpen(null);
        setStoreData(null); // Clear local store data
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      setError(null);
  
      // Joined the tables and selected everything from both tables
      const { data: store, error } = await supabase
      .from('store')
      .select(`*, 
              storestatus:storestatus(*)`)
      .eq('storeid', storeId);
  
      let fetchedStoreData = store ? store[0] : null;

      // Create store statuts if null then update the clicked store with that newly created status
      if (fetchedStoreData && !fetchedStoreData.storestatus && currentUser) {
        const { data: statusData, error: insertErr } = await supabase
        .from('storestatus')
        .insert({ contributor: currentUser, status: false })
        .select();
        const statusId = statusData? statusData[0] : null;
        if (statusId) {
          const { error } = await supabase
          .from('store')
          .update({ storestatus: statusId.storestatusid })
          .eq('storeid', fetchedStoreData.storeid);
        }
        const { data: store, error } = await supabase
        .from('store')
        .select(`*, 
                storestatus:storestatus(*)`)
        .eq('storeid', storeId);

        fetchedStoreData = store ? store[0] : null;
      }
      
      if (fetchedStoreData && fetchedStoreData.storestatus) {
        setStoreName(fetchedStoreData.name || 'No Name');
        setIsOpen(fetchedStoreData.storestatus.status === true);
        setStoreData(fetchedStoreData);
        
        // Update the store status map
        setStoreStatusMap(prev => ({
          ...prev,
          [storeId]: fetchedStoreData.storestatus.status === true
        }));
      } else {
        // Handle the case when fetchedStoreData is null or missing storestatus
        setStoreName('No Data');
        setIsOpen(false);
        setStoreData(null);
        
        // Update the store status map to show as closed
        setStoreStatusMap(prev => ({
          ...prev,
          [storeId]: false
        }));
      }
    } catch (error) {
      setError('Failed to load store');
      console.log('Error fetching store:', error);
      
      // Set fallback values in case of error
      setStoreName('Error Loading Data');
      setIsOpen(false);
      setStoreData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    // #13783e #F07474
      <main className="touch-auto bg-white flex items-center justify-center overflow-auto absolute top-16 inset-x-0 bottom-0">
        <div
          className="w-full max-w-[95vw] aspect-[40/20] grid place-items-center gap-[2px] relative"
          style={{
            gridTemplateRows: "repeat(20, 1fr)",
            gridTemplateColumns: "repeat(40, 1fr)",
          }}
        >
        {/* Roads and Walkways */}
        <MapBlock rowStart={1} rowEnd={22} colStart={18} colEnd={19} defaultColor={colors.f} pointerEvents={false}/>
        <MapBlock rowStart={3} rowEnd={4} colStart={4} colEnd={19} height={30} defaultColor={colors.f} pointerEvents={false}/>
        <MapBlock rowStart={3} rowEnd={5} colStart={18} colEnd={38} height={50} defaultColor={colors.f} pointerEvents={false}/>
        <MapBlock rowStart={4} rowEnd={22} colStart={37} colEnd={38} defaultColor={colors.f} pointerEvents={false}/>
        <MapBlock rowStart={5} rowEnd={21} colStart={24} colEnd={25} width={30} defaultColor={colors.f} pointerEvents={false}/>
        <MapBlock rowStart={13} rowEnd={21} colStart={33} colEnd={34} width={30} defaultColor={colors.f} pointerEvents={false}/>
        <MapBlock rowStart={13} rowEnd={18} colStart={36} colEnd={37} width={30} defaultColor={colors.f} pointerEvents={false}/>
        <MapBlock rowStart={17} rowEnd={18} colStart={24} colEnd={37} height={30} defaultColor={colors.f} pointerEvents={false}/>
        <MapBlock rowStart={20} rowEnd={21} colStart={24} colEnd={34} height={30} defaultColor={colors.f} pointerEvents={false}/>
        
        {/* Map all store blocks from mapData */}
        {mapData.map((block, index) => (
          <MapBlock
            // id={block.storeId} // add this if you want to debug
            key={index}
            storeId={block.storeId || ''}
            rowStart={block.rowStart}
            rowEnd={block.rowEnd}
            colStart={block.colStart}
            colEnd={block.colEnd}
            defaultColor={block.defaultColor}
            icon={block.icon}
            viewBox={block.viewBox}
            clickBlock={(id, tooltipPosition) => handleMapBlockClick(id, tooltipPosition as TooltipPosition)}
            tooltipPosition="bottom"
          />
        ))}
        {/* Selected Store Tooltip */}
        {selectedStoreId && selectedBlockCoords.rowStart && (
          <MapTooltip
            // id={selectedStoreId} // add this if you want to debug
            name={storeName || "Unknown Store"}
            position={tooltipPosition}
            rowStart={selectedBlockCoords.rowStart}
            rowEnd={selectedBlockCoords.rowEnd}
            colStart={selectedBlockCoords.colStart}
            colEnd={selectedBlockCoords.colEnd}
          />
        )}
        <div 
          ref={targetRef}
          style={{
            gridRowStart: 3,
            gridRowEnd: 4,
            gridColumnStart: 16,
            gridColumnEnd: 17,
          }}
        />
        {selectedStoreId ? (
            <div 
              className="rounded-[15px] h-full w-full"
              style={{
                gridRowStart: 5,
                gridRowEnd: 20,
                gridColumnStart: 5,
                gridColumnEnd: 16,
              }}
            >
              <StoreComponent 
                storeId={selectedStoreId}
                isSelected={!!selectedStoreId}
                storeName={storeName || ''}
              />
            </div>
        ) : (
          <VisitaPlaceholder/>
        )}
      </div>
    </main>
  )
}