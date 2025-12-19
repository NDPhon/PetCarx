export class Product {
  productId: number; // product_id
  productName: string; // product_name
  productType: string; // product_type
  unit: string; // unit
  price: number; // price
  expiryDate?: Date; // expiry_date, optional
  description?: string; // description, optional
  isActive: boolean; // is_active

  constructor(
    productId: number,
    productName: string,
    productType: string,
    unit: string,
    price: number,
    isActive: boolean = true,
    expiryDate?: Date,
    description?: string
  ) {
    this.productId = productId;
    this.productName = productName;
    this.productType = productType;
    this.unit = unit;
    this.price = price;
    this.isActive = isActive;
    this.expiryDate = expiryDate;
    this.description = description;
  }
}
