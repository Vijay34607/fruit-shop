from sqlalchemy import Column, Integer, String, Numeric, DateTime, Text, JSON
from sqlalchemy.sql import func
from .database import Base

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(150), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    customer_email = Column(String(150), nullable=False)
    items = Column(JSON, nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), nullable=False)
    payment_method = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ContactMessage(Base):
    __tablename__ = 'contact_messages'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
