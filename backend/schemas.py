from pydantic import BaseModel, EmailStr
from typing import List, Optional
from decimal import Decimal

class CustomerData(BaseModel):
    name: str
    phone: str
    email: EmailStr

class OrderItem(BaseModel):
    id: int
    name: str
    price: Decimal
    quantity: int

class OrderCreate(BaseModel):
    customer: CustomerData
    items: List[OrderItem]
    total: Decimal
    status: str
    paymentMethod: str

class ContactCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    message: str
