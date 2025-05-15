'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import BackgroundImage from '@/components/assets/background-images/Background.png';
import StoreStatusCard from './ui/store-status-card';
import { useMapSearch } from '@/components/map-search-context';
import { Button } from './ui/button';

// --- Types (from your functional code) ---
type ProductStatus = {
  productstatusid: string;
  price: number | string;
  isavailable: boolean;
  contributor: string;
};

type Product = {
  productid: string; 
  store: string;
  productstatus: ProductStatus | null | undefined; 
  contributor: string;
  brand: string;
  name: string;
  datecreated: string;
  isarchived: boolean;
  price: number | string; 
  description?: string;
  _isNew?: boolean;        
  _isUpdated?: boolean;    
  _isDeleted?: boolean;   
  _originalProduct?: Product; 
  _tempId?: string;       
  _isDeletedForever?: boolean; 
};

type StoreComponentProps = {
  storeId?: string,
  isSelected?: boolean,
  storeName?: string,
}

const StoreComponent: React.FC<StoreComponentProps> = ({ 
  storeId = "",
  isSelected = false,
  storeName = "",
}) => {
  const supabase = createClient();
  const {isOpen, setIsOpen} = useMapSearch();
  const [loading, setLoading] = useState(false); 
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isAnimating, setIsAnimating] = useState(false); 
  const [isSaving, setIsSaving] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [stagedProducts, setStagedProducts] = useState<Product[]>([]);

  const [isPaginating, setIsPaginating] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("User");
  const [storeType, setStoreType] = useState<string | null>(null); 
  const [storeDetailsLoading, setStoreDetailsLoading] = useState(false);
  const prevStoreIdRef = useRef<string | undefined>(undefined);
  const newProductsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setCurrentUser(data.user.id);
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => { 
    const handleResize = () => {
      if (window.innerWidth <= 881) setItemsPerPage(1);
      else if (window.innerWidth <= 991) setItemsPerPage(2);  
      else if (window.innerWidth <= 1083) setItemsPerPage(3);
      else if (window.innerWidth <= 1175) setItemsPerPage(4);
      else if (window.innerWidth <= 1265) setItemsPerPage(5);
      else if (window.innerWidth <= 1450) setItemsPerPage(6);
      else setItemsPerPage(8);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAllProductsCallback = useCallback(async (currentStoreId: string, currentIsEditingState: boolean) => {
    if (!currentStoreId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase 
        .from('product')
        .select('*, productstatus:productstatus(*)')
        .eq('store', currentStoreId)
        .order('name', { ascending: true });
      
      if (fetchError) throw fetchError;

      const processedProducts: Product[] = data?.map(product => ({
        ...product,
        price: product.productstatus?.price ?? 'N/A',
        productstatus: product.productstatus,
      })) || [];
      
      setProducts(processedProducts);
      if (!currentIsEditingState) { 
          setStagedProducts(JSON.parse(JSON.stringify(processedProducts))); 
      }
    } catch (err: any) {
      console.log('Error fetching products:', err.message);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [supabase]); 

  useEffect(() => {
    const hasStoreChanged = prevStoreIdRef.current !== storeId && storeId !== "";
    if (storeId) prevStoreIdRef.current = storeId;

    if (storeId && isSelected) {
      console.log(`StoreComponent: Now displaying store ${storeId}`);
      if (hasStoreChanged) {
        setProducts([]); 
        setStagedProducts([]); 
        setStoreType(null);
        setCurrentPage(1);
        setError(null);
        if (isEditing) setEditing(false);
      }

      const fetchStoreTypeData = async () => {
        setStoreDetailsLoading(true);
        try {
          const { data: storeData, error: storeError } = await supabase
            .from('store').select('store_type').eq('storeid', storeId).single();
          if (storeError) { console.log('Error fetching store type:', storeError.message); setStoreType('N/A');}
          else if (storeData) setStoreType(storeData.store_type);
          else setStoreType('N/A');
        } catch (err) { console.log('Exception fetching store type:', err); setStoreType('Error'); }
        setStoreDetailsLoading(false);
      };
      
      if (hasStoreChanged || (products.length === 0 && !loading) || (products.length > 0 && products[0].store !== storeId && !loading) ) {
        fetchStoreTypeData();
        fetchAllProductsCallback(storeId, isEditing); 
      }
    } else { 
      setProducts([]); setStagedProducts([]); setStoreType(null);
      if (isEditing) setEditing(false);
    }
  }, [storeId, isSelected, supabase, fetchAllProductsCallback, isEditing, loading, products]);

  useEffect(() => { 
    let sourceForPagination;
    if (isEditing) {
        sourceForPagination = stagedProducts.filter(p => !p._isNew && !p._isDeleted);
    } else {
        sourceForPagination = products;
    }
    const newTotalPages = Math.ceil(sourceForPagination.length / itemsPerPage) || 1;
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
    } else if (newTotalPages === 1 && currentPage !== 1) { // If only one page, reset to 1
        setCurrentPage(1);
    }
  }, [products, stagedProducts, isEditing, itemsPerPage, currentPage]);

  useEffect(() => { 
    if (!storeId || !isSelected) return;
    const handleRealtimeEvent = (payload: any) => {
        console.log('Realtime event received:', payload, '; Currently editing:', isEditing);
        if (!isEditing) {
            fetchAllProductsCallback(storeId, false); 
        } else {
            fetchAllProductsCallback(storeId, true); 
            console.log("Underlying product data changed during edit. Staged changes are preserved. Consider notifying user.");
        }
    };
    const productChannel = supabase.channel(`product-changes-${storeId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product', filter: `store=eq.${storeId}` }, handleRealtimeEvent)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productstatus' /* TODO: Add robust filter if possible */ }, 
        (payload) => {
            console.log('Product status changed:', payload);
            if (!isEditing) fetchAllProductsCallback(storeId, false);
            else fetchAllProductsCallback(storeId, true);
        }
      )
      .subscribe((status) => { if (status === 'SUBSCRIBED') console.log(`Subscribed to product changes for store ${storeId}`);});
    return () => { supabase.removeChannel(productChannel); };
  }, [storeId, isSelected, supabase, fetchAllProductsCallback, isEditing]);

  const handlePaginationCooldown = () => { setIsPaginating(true); setTimeout(() => setIsPaginating(false), 300);};
  const handlePrevPage = () => {if (currentPage > 1 && !isAnimating && !isPaginating) { setIsAnimating(true); setCurrentPage(currentPage - 1); handlePaginationCooldown(); setTimeout(() => setIsAnimating(false), 300);}};
  const handleNextPage = () => {if (currentPage < totalPages && !isAnimating && !isPaginating) { setIsAnimating(true); setCurrentPage(currentPage + 1); handlePaginationCooldown(); setTimeout(() => setIsAnimating(false), 300);}};

  const getPaginatedExistingStagedProducts = () => {
    const existing = stagedProducts.filter(p => !p._isNew && !p._isDeleted);
    existing.sort((a, b) => a.name.localeCompare(b.name));
    const startIndex = (currentPage - 1) * itemsPerPage;
    return existing.slice(startIndex, startIndex + itemsPerPage);
  };

  const getNewStagedProductsToDisplay = () => {
    return stagedProducts.filter(p => p._isNew && !p._isDeletedForever);
  };

  const getDisplayModeProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  };

  const toggleStoreStatus = async () => { /* ... same as your functional code ... */ 
    if (!storeId) return;
    const newStatus = !isOpen;
    const { data: statusData, error: insertErr } = await supabase
      .from('storestatus').insert({ contributor: currentUser, status: newStatus })
      .select('storestatusid').single();
    if (insertErr || !statusData) { console.log("Error creating new store status:", insertErr); return; }
    const { error: updateErr } = await supabase.from('store')
      .update({ storestatus: statusData.storestatusid }).eq('storeid', storeId);
    if (!updateErr) setIsOpen(newStatus);
    else console.log("Error updating store status:", updateErr);
  };

  const toggleEdit = () => {
    if (isEditing) { 
      setStagedProducts(JSON.parse(JSON.stringify(products))); 
      setEditing(false);
      setError(null);
    } else { 
      setStagedProducts(JSON.parse(JSON.stringify(products))); 
      setCurrentPage(1); 
      setEditing(true);
    }
  };

  const cancelEdit = () => {
    setStagedProducts(JSON.parse(JSON.stringify(products))); 
    setEditing(false);
    setError(null); 
  };

  const addProduct = () => { 
    const tempId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newProductEntry: Product = {
      _isNew: true, _tempId: tempId, productid: tempId, name: '', price: '', 
      store: storeId!, productstatus: { productstatusid: `temp-ps-${tempId}`, price: '', isavailable: true, contributor: currentUser }, 
      contributor: currentUser, brand: storeName || 'N/A', datecreated: new Date().toISOString(), isarchived: false,
    };
    setStagedProducts(prev => [...prev, newProductEntry]); // Appends to end
    setTimeout(() => {
        newProductsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };
  
  const handleStagedProductChange = (id: string, field: keyof Product, value: any) => { 
    setStagedProducts(prev => prev.map(p => {
      if (p.productid === id || p._tempId === id) {
        const updatedProduct = { ...p, [field]: value };
        if (!p._isNew) updatedProduct._isUpdated = true;
        if (field === 'price') {
            const currentProductStatus = p.productstatus || { productstatusid: `temp-ps-${p._tempId || p.productid}`, price: '', isavailable: true, contributor: currentUser };
            updatedProduct.productstatus = { ...currentProductStatus, price: value };
        }
        return updatedProduct;
      }
      return p;
    })
    // No global sort by name here to keep new items stable.
    );
  };
  
  const deleteProduct = (id: string) => { 
    setStagedProducts(prevStaged => {
        const productToDelete = prevStaged.find(p => p.productid === id || p._tempId === id);
        if (productToDelete?._isNew) {
            return prevStaged.filter(p => !(p._tempId === id && p._isNew));
        } else {
            return prevStaged.map(p => 
                (p.productid === id) ? { ...p, _isDeleted: true, _isUpdated: false } : p
            );
        }
    });
  };

  const saveEdit = async () => {
    if (!storeId) return;
    setIsSaving(true); setError(null); let anyError = false;
    try {
      const productsToDelete = stagedProducts.filter(p => p._isDeleted && !p._isNew && p.productid !== p._tempId);
      for (const p of productsToDelete) { 
        const { error: e1 } = await supabase.from('product').delete().eq('productid', p.productid); if(e1) {console.error("Delete product error:", e1); anyError=true; continue; }
        if (p.productstatus?.productstatusid) { 
            const { error: e2 } = await supabase.from('productstatus').delete().eq('productstatusid', p.productstatus.productstatusid);
            if(e2) console.warn("Delete productstatus error (product already deleted or cascade):", e2); // Warn instead of erroring out hard
        }
      }
      const productsToUpdate = stagedProducts.filter(p => p._isUpdated && !p._isNew && !p._isDeleted && p.productid !== p._tempId);
      for (const p of productsToUpdate) {
        const o = products.find(op => op.productid === p.productid); if (!o) continue;
        if (o.name !== p.name) {const {error}=await supabase.from('product').update({ name: p.name }).eq('productid', p.productid); if(error) {console.error("Update name error:", error);anyError=true; continue;}}
        
        const originalPrice = Number(o.productstatus?.price ?? o.price);
        const newPrice = Number(p.price); // Price from input is string, convert

        if (originalPrice !== newPrice && p.productstatus?.productstatusid) {
          const{error}=await supabase.from('productstatus').update({ price: newPrice, contributor: currentUser }).eq('productstatusid', p.productstatus.productstatusid); 
          if(error){console.error("Update price error:", error);anyError=true; continue;}
        } else if (originalPrice !== newPrice && !p.productstatus?.productstatusid && p._isNew) {
          // This case should be handled by product ADDITION if productstatus is new
          console.warn("Trying to update price on a new product without a productstatusid yet. This should be part of add.", p);
        }
      }
      const productsToAdd = stagedProducts.filter(p => p._isNew && !p._isDeleted);
      for (const p of productsToAdd) {
        const{data:sd,error:se}=await supabase.from('productstatus').insert({ contributor:currentUser,price:Number(p.price),isavailable:true}).select('productstatusid').single(); 
        if(se||!sd) {console.error("Insert productstatus error:", se); anyError=true; continue;}
        const{error:pe}=await supabase.from('product').insert({store:storeId,productstatus:sd.productstatusid,contributor:currentUser,brand:storeName||'N/A',name:p.name}); 
        if(pe){console.error("Insert product error:", pe);anyError=true; continue;}
      }
      if (anyError) throw new Error("One or more operations failed during save. Check console for details.");
      
      await fetchAllProductsCallback(storeId, false); 
      setEditing(false);
    } catch (err: any) { setError(err.message || "Failed to save changes. Please review."); console.error("Save error details:", err); } 
    finally { setIsSaving(false); }
  };
  
  const getStoreEmoji = (type: string | null): string => {
    if (!type) return "🏪"; const lowerType = type.toLowerCase();
    switch (lowerType) {
      case 'eatery': return "🍴"; case 'pie': return "🥧"; case 'restroom': return "🚻";
      case 'clothing': return "👕"; case 'pizza': return "🍕"; case 'cookie': return "🍪";
      case 'notebook': return "📓"; case 'printer': return "🖨️"; case 'basket': return "🧺";
      case 'veggie': return "🥕"; case 'meat': return "🥩"; case 'personnel': return "👥";
      case 'park': return "🌳"; case 'water': return "💧"; case 'haircut': return "✂️";
      case 'mail': return "✉️"; case 'money': return "💰"; case 'coffee': return "☕";
      case 'milk': return "🥛"; default: return "🏪";
    }
  };

  // Determine which products to show based on mode
  const currentVisibleExistingProducts = isEditing ? getPaginatedExistingStagedProducts() : getDisplayModeProducts();
  const currentVisibleNewProducts = isEditing ? getNewStagedProductsToDisplay() : [];

  return (
    <AnimatePresence mode="wait" key={storeId || 'no-store-selected'}> 
      {isSelected && storeId && (
        <motion.div
          className="bg-white grid grid-rows-[100px_1fr] md:grid-rows-[120px_1fr] h-full rounded-[15px] shadow-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
        >
          {/* Header Section - FROM YOUR UI CODE */}
          <motion.div 
            className="w-full relative transition-all duration-500 ease-in-out"
            layoutId={`background-container-${storeId}`}
          >
            <motion.img layoutId={`background-image-${storeId}`} src={BackgroundImage.src} alt="Background" className="absolute z-0 w-full h-full object-cover rounded-t-[15px] md:rounded-[15px]" />
            <motion.div className="absolute z-1 bg-black bg-opacity-30 w-full h-full rounded-t-[15px] md:rounded-[15px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
            <motion.div className="pointer-events-auto absolute -right-16 top-0 z-10 touch-manipulation" initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 0.4 }} exit={{ opacity: 0, scale: 0.2 }} transition={{ delay: 1.7, duration: 0.3 }}>
              <Button className="bg-transparent w-[195px] h-[100px] p-0 pb-12 z-9 rounded-[30px]" onClick={toggleStoreStatus} aria-label={isOpen ? "Mark store as closed" : "Mark store as open"}>  
                <StoreStatusCard isOpen={isOpen || false} />
              </Button>
            </motion.div>
            <motion.div className="relative pt-1 pl-2 md:pt-2 md:pl-3 z-2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
              <h1 className="text-lg font-bold text-white line-clamp-2 w-[80%]">{storeName}</h1>
            </motion.div>          
            <motion.div className="absolute bottom-0 left-0 p-3 z-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }}>   
               <button className="bg-white text-emerald-700 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs rounded-full font-bold flex items-center shadow-md transition-all duration-300 hover:shadow-lg">
                <span className="mr-1 text-[10px] md:text-xs">{getStoreEmoji(storeType)}</span> 
                <span className="whitespace-nowrap">
                  {storeDetailsLoading ? "Loading..." : (storeType ? storeType.charAt(0).toUpperCase() + storeType.slice(1) : "Type")}
                </span>
              </button>
            </motion.div>  
          </motion.div>
          
          {/* Products Section - FROM YOUR UI CODE, with integrated logic */}
          <div className="w-full overflow-hidden flex flex-col justify-between rounded-b-[15px] md:rounded-[15px]">
            <div className="mb-1 md:mb-2 text-left gap-x-2 md:gap-x-4 sticky top-0 bg-white z-10 mx-4 pt-2">
              <h2 className="text-l md:text-md font-semibold text-gray-800 text-left">Products/Services</h2>
            </div>
            <div
              className="overflow-y-auto flex-grow px-4
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300
                dark:[&::-webkit-scrollbar-track]:bg-[#F0F0F0] dark:[&::-webkit-scrollbar-thumb]:bg-neutral-400"
            >
              {(loading && !isEditing) && <div className="flex justify-center items-center h-full"><p>Loading products...</p></div>}
              {(error && !isEditing) && <div className="flex justify-center items-center h-full"><p className="text-red-500">{error}</p></div>}
              
              {(!loading && !error) && (
                 (isEditing ? (currentVisibleExistingProducts.length + currentVisibleNewProducts.length) : products.length) === 0 && !isEditing ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        <p>No products found for this store.{isEditing ? " Add one below!" : ""}</p>
                    </div>
                 ) : (
                    <>
                      {/* Product Table Header */}
                      {(currentVisibleExistingProducts.length > 0 || currentVisibleNewProducts.length > 0) && (
                        <div className="flex mb-1 md:mb-2 text-left gap-x-2 md:gap-x-4 sticky top-0 bg-white z-10 py-2 border-b border-gray-200">
                          <div className="font-medium text-gray-600 flex-grow text-xs md:text-sm basis-2/5 md:basis-1/2">Name</div>
                          <div className="font-medium text-gray-600 text-xs md:text-sm basis-2/5 md:basis-1/4 text-right">Price</div>
                          {isEditing && <div className="w-[25px] basis-1/5 md:basis-1/4 flex-shrink-0"></div>} {/* Spacer */}
                        </div>
                      )}

                      {/* List of Existing/Paginated Products */}
                      <AnimatePresence mode="popLayout">
                        <motion.div 
                            key={currentPage + (isEditing ? '-edit-existing' : '-disp')} 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="space-y-2"
                        >
                          {currentVisibleExistingProducts.map((product) => (
                            <motion.div 
                              key={product.productid} // Existing products have stable productid
                              layout 
                              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className={`flex items-center pb-1 border-b border-gray-100 gap-x-2 md:gap-[10px] ${isEditing && product._isDeleted ? 'opacity-60 italic bg-red-50 rounded-md' : ''}`}
                            >
                              {isEditing && !product._isDeleted ? (
                                <>
                                  <input 
                                    type="text" 
                                    value={product.name}
                                    placeholder="Product Name"
                                    className="bg-white text-black text-left text-sm flex-grow p-1 border rounded-[10px] min-w-0 basis-2/5 md:basis-1/2 disabled:bg-gray-100 disabled:text-gray-400"
                                    onChange={(e) => handleStagedProductChange(product.productid, 'name', e.target.value)}
                                    disabled={isSaving}
                                    required
                                  />
                                  <div className="relative basis-2/5 md:basis-1/4">
                                    <span className={`absolute left-2 top-1/2 -translate-y-1/2 text-gray-400`}>₱</span>
                                    <input 
                                      type="number"
                                      value={product.price as string} 
                                      placeholder="0.00"
                                      className="bg-white text-black text-right text-sm w-full pl-6 pr-1 py-1 border rounded-[10px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                                      onChange={(e) => handleStagedProductChange(product.productid, 'price', e.target.value)}
                                      disabled={isSaving}
                                      required step="0.01" 
                                    />
                                  </div>
                                  <div className="w-[25px] basis-1/5 md:basis-1/4 flex-shrink-0 flex justify-end">
                                    <button 
                                      onClick={() => deleteProduct(product.productid)}
                                      className="p-1.5 bg-[#F07474] hover:bg-red-600 rounded-full transition-colors disabled:bg-gray-300"
                                      aria-label="Mark product for deletion"
                                      disabled={isSaving}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-[10px] h-[10px]" fill="white"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
                                    </button>
                                  </div>
                                </>
                              ) : isEditing && product._isDeleted ? (
                                <>
                                  <span className="text-gray-500 text-sm flex-grow basis-2/5 md:basis-1/2 line-through">{product.name}</span>
                                  <span className="text-gray-500 text-sm basis-2/5 md:basis-1/4 text-right line-through">₱{product.price}</span>
                                  <div className="w-[25px] basis-1/5 md:basis-1/4 flex-shrink-0"></div>
                                </>
                              ) : (
                                <> 
                                  <div className="text-gray-800 text-sm flex-grow basis-2/3 md:basis-1/2 truncate" title={product.name}>{product.name}</div>
                                  <div className="text-gray-800 font-medium text-sm basis-1/3 md:basis-auto w-16 md:w-fit text-right">₱{product.price}</div>
                                </>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      </AnimatePresence>

                      {/* Area for NEWLY ADDED products, rendered below existing ones */}
                      {isEditing && (
                        <div ref={newProductsContainerRef} className={`space-y-2 ${currentVisibleNewProducts.length > 0 ? 'mt-4 pt-2 border-t border-dashed border-gray-300' : ''}`}>
                          <AnimatePresence mode="popLayout">
                            {currentVisibleNewProducts.map((newProduct, index) => (
                              <motion.div 
                                key={newProduct._tempId!} 
                                layout 
                                initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y:0 }} exit={{opacity:0, y:-10}}
                                transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.2 }}
                                className="flex items-center pb-1 border-b border-gray-100 gap-x-2 md:gap-[10px] mt-2 first:mt-0"
                              >
                                  <input 
                                    type="text" 
                                    value={newProduct.name}
                                    placeholder="New Product Name"
                                    className="bg-gray-50 text-black text-left text-sm flex-grow p-1 border rounded-[10px] min-w-0 basis-2/5 md:basis-1/2"
                                    onChange={(e) => handleStagedProductChange(newProduct._tempId!, 'name', e.target.value)}
                                    disabled={isSaving}
                                    required
                                    autoFocus={index === currentVisibleNewProducts.length - 1} // Autofocus only the last new item
                                  />
                                  <div className="relative basis-2/5 md:basis-1/4">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">₱</span>
                                    <input 
                                      type="number"
                                      value={newProduct.price as string} 
                                      placeholder="0.00"
                                      className="bg-gray-50 text-black text-right text-sm w-full pl-6 pr-1 py-1 border rounded-[10px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      onChange={(e) => handleStagedProductChange(newProduct._tempId!, 'price', e.target.value)}
                                      disabled={isSaving}
                                      required step="0.01" 
                                    />
                                  </div>
                                  <div className="w-[25px] basis-1/5 md:basis-1/4 flex-shrink-0 flex justify-end">
                                    <button 
                                      onClick={() => deleteProduct(newProduct._tempId!)}
                                      className="p-1.5 bg-gray-300 hover:bg-gray-400 rounded-full transition-colors disabled:bg-gray-200"
                                      aria-label="Remove new product"
                                      disabled={isSaving}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-[10px] h-[10px]" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                                    </button>
                                  </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                      
                      {isEditing && (
                        <button 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center justify-center gap-1 w-full py-1.5 px-2 rounded-lg mt-3 mb-1 transition-colors disabled:bg-emerald-300" // Added mt-3
                          onClick={addProduct}
                          disabled={isSaving}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-[10px] h-[10px]" fill="white"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                          Add Product
                        </button>
                      )}
                    </>
                 )
              )}
            </div>

            {/* Footer: Pagination and Edit/Save/Cancel Controls - FROM YOUR UI CODE, adapted for new logic */}
            <div className="border-t border-gray-200">
              <div className="flex justify-between items-center w-full px-2 py-2">
                <button
                  className={`flex items-center justify-center min-w-[40px] sm:min-w-[60px] md:min-w-[70px] py-1 px-1 sm:px-2 rounded-md transition-colors ${
                    currentPage === 1 || isAnimating || isPaginating || 
                    (isEditing ? getPaginatedExistingStagedProducts().length === 0 && currentPage === 1 && currentVisibleNewProducts.length === 0 : products.length === 0) // More precise disabled logic
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || isAnimating || isPaginating || (isEditing ? getPaginatedExistingStagedProducts().length === 0 && currentPage === 1 && currentVisibleNewProducts.length === 0 : products.length === 0)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  <span className="ml-1 hidden px1100:inline-block text-xs md:text-sm">Prev</span>
                </button>
                
                <div className="flex-grow flex justify-center items-center px-1 sm:px-2">
                  {isEditing ? (
                    <div className="grid grid-cols-1 px1100:grid-cols-2 gap-1 px1100:gap-2 w-full max-w-xs sm:max-w-[240px] mx-auto">
                      <Button variant="default" onClick={saveEdit} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] md:text-xs w-full h-7 md:h-8 flex items-center justify-center px-1 md:px-2 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed">
                        {isSaving ? (<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div> ): (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 flex-shrink-0 hidden sm:inline-block"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>)}
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} disabled={isSaving} className="bg-red-100 hover:bg-red-200 border-red-300 text-red-700 text-[10px] md:text-xs w-full h-7 md:h-8 flex items-center justify-center px-1 md:px-2 transition-colors disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 flex-shrink-0 hidden sm:inline-block"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button className="text-gray-600 !bg-transparent text-[10px] md:text-xs h-7 md:h-8 flex items-center justify-center" onClick={toggleEdit} aria-label="Edit Products">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="flex-shrink-0 px1100:mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                      <span className="hidden px1100:inline-block ml-1">Edit Products</span>
                    </Button>
                  )}
                </div>

                <button
                  className={`flex items-center justify-center min-w-[40px] sm:min-w-[60px] md:min-w-[70px] py-1 px-1 sm:px-2 rounded-md transition-colors ${
                    currentPage === totalPages || totalPages <= 1 || (isEditing ? getPaginatedExistingStagedProducts().length === 0 && currentVisibleNewProducts.length === 0 && currentPage === totalPages : products.length === 0) || isAnimating || isPaginating
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages <= 1 || (isEditing ? getPaginatedExistingStagedProducts().length === 0 && currentVisibleNewProducts.length === 0 && currentPage === totalPages : products.length === 0) || isAnimating || isPaginating}
                >
                  <span className="mr-1 hidden px1100:inline-block text-xs md:text-sm">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              {error && isEditing && <p className="text-red-500 text-xs text-center pb-1">{error}</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoreComponent;