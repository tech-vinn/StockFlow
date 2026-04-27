export interface StockItem {
  id?: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  cost?: number;
  expiryDate?: string;
  lowStockThreshold: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransaction {
  id?: string;
  itemId: string;
  itemName?: string;
  type: 'add' | 'remove' | 'adjustment';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unitCost?: number;
  unitPrice?: number;
  reason: string;
  ownerId: string;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  businessName?: string;
  currency: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
