import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StockItem, StockTransaction, OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';

export function useInventory(userId: string | undefined) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Test connection on mount
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const qItems = query(
      collection(db, 'inventory'),
      where('ownerId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribeItems = onSnapshot(qItems, 
      (snapshot) => {
        const inventoryItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StockItem[];
        setItems(inventoryItems);
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'inventory')
    );

    const qTransactions = query(
      collection(db, 'transactions'),
      where('ownerId', '==', userId),
      orderBy('timestamp', 'desc')
      // limit(50) // Optional limit
    );

    const unsubscribeTransactions = onSnapshot(qTransactions,
      (snapshot) => {
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StockTransaction[];
        setTransactions(history);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'transactions')
    );

    return () => {
      unsubscribeItems();
      unsubscribeTransactions();
    };
  }, [userId]);

  const addItem = async (item: Omit<StockItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return;
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'inventory'), {
        ...item,
        ownerId: userId,
        createdAt: now,
        updatedAt: now
      });
      
      // Initial transaction
      await addDoc(collection(db, 'transactions'), {
        itemId: docRef.id,
        itemName: item.name,
        type: 'add',
        quantity: item.quantity,
        previousQuantity: 0,
        newQuantity: item.quantity,
        reason: 'Initial stock',
        ownerId: userId,
        timestamp: now
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inventory');
    }
  };

  const updateItem = async (itemId: string, updates: Partial<StockItem>) => {
    if (!userId) return;
    try {
      const itemRef = doc(db, 'inventory', itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inventory/${itemId}`);
    }
  };

  const adjustStock = async (item: StockItem, amount: number, reason: string) => {
    if (!userId || !item.id) return;
    try {
      const newQuantity = Math.max(0, item.quantity + amount);
      const type = amount >= 0 ? 'add' : 'remove';
      const now = new Date().toISOString();

      const itemRef = doc(db, 'inventory', item.id);
      await updateDoc(itemRef, {
        quantity: newQuantity,
        updatedAt: now
      });

      await addDoc(collection(db, 'transactions'), {
        itemId: item.id,
        itemName: item.name,
        type,
        quantity: Math.abs(amount),
        previousQuantity: item.quantity,
        newQuantity: newQuantity,
        reason,
        ownerId: userId,
        timestamp: now
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inventory/${item.id}`);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'inventory', itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inventory/${itemId}`);
    }
  };

  return { items, transactions, loading, addItem, updateItem, adjustStock, removeItem };
}
