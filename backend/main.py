from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title='Fruit Shop Backend',
    description='FastAPI backend for orders and contact messages',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post('/api/orders')
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(
        customer_name=order.customer.name,
        customer_phone=order.customer.phone,
        customer_email=order.customer.email,
        items=[item.dict() for item in order.items],
        total=order.total,
        status=order.status,
        payment_method=order.paymentMethod
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return {'success': True, 'order_id': db_order.id}


@app.post('/api/contact')
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_contact = models.ContactMessage(
        name=contact.name,
        phone=contact.phone,
        email=contact.email,
        message=contact.message
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return {'success': True, 'message_id': db_contact.id}


@app.get('/api/orders')
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    return orders


@app.get('/api/contact')
def list_contact_messages(db: Session = Depends(get_db)):
    messages = db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()
    return messages
