"""
SQLAlchemy ORM Models for E-Commerce Application

This module contains all database models using SQLAlchemy's declarative_base.
These models replace the previous raw SQL table definitions.
"""

from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
import enum

Base = declarative_base()


# Enums for type safety
class ProductCategory(enum.Enum):
    man = "man"
    women = "women"
    kids = "kids"
    clothes = "clothes"
    accessoire = "accessoire"
    chaussures = "chaussures"
    accessories = "accessories"
    shoes = "shoes"


class OrderStatus(enum.Enum):
    Pending = "Pending"
    Completed = "Completed"
    Shipped = "Shipped"


class User(Base):
    """
    User model - Maps to 'utilisateurs' table
    Stores user authentication and profile information
    """
    __tablename__ = 'utilisateurs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text, nullable=True)
    email = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())
    
    # Relationships
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Product(Base):
    """
    Product model - Maps to 'products' table
    Stores product information including images, pricing, and inventory
    """
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    image_cover = Column(Text, nullable=True)
    # Store as JSON for portability across PostgreSQL/MySQL/SQLite.
    # Keeps the same API shape (lists) as the previous TEXT[] columns.
    image_details = Column(MutableList.as_mutable(JSON), nullable=True, default=list)
    colors = Column(MutableList.as_mutable(JSON), nullable=True, default=list)
    quantity = Column(Numeric(10, 2), nullable=False)
    category = Column(
        Enum(
            ProductCategory,
            native_enum=False,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())
    
    # Relationships
    offers = relationship("Offer", back_populates="product", cascade="all, delete-orphan")
    line_orders = relationship("LineOrder", back_populates="product")
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price) if self.price else 0,
            'image_cover': self.image_cover,
            'image_details': self.image_details,
            'colors': self.colors,
            'quantity': float(self.quantity) if self.quantity else 0,
            'category': self.category.value if isinstance(self.category, ProductCategory) else self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Offer(Base):
    """
    Offer model - Maps to 'offers' table
    Stores promotional offers with discount percentages and validity periods
    """
    __tablename__ = 'offers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    title = Column(Text, nullable=False)
    discount_percentage = Column(Numeric(5, 2), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())
    
    # Relationships
    product = relationship("Product", back_populates="offers")
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'product_id': self.product_id,
            'title': self.title,
            'discount_percentage': float(self.discount_percentage) if self.discount_percentage else 0,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Order(Base):
    """
    Order model - Maps to 'orders' table
    Stores order information including total price and status
    """
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    utilisateur_id = Column(Integer, ForeignKey('utilisateurs.id', ondelete='CASCADE'), nullable=False)
    total_price = Column(Numeric(12, 2), nullable=False)
    status = Column(
        Enum(
            OrderStatus,
            native_enum=False,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        default=OrderStatus.Pending,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())
    
    # Relationships
    user = relationship("User", back_populates="orders")
    line_orders = relationship("LineOrder", back_populates="order", cascade="all, delete-orphan")
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'utilisateur_id': self.utilisateur_id,
            'total_price': float(self.total_price) if self.total_price else 0,
            'status': self.status.value if isinstance(self.status, OrderStatus) else self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class LineOrder(Base):
    """
    LineOrder model - Maps to 'line_orders' table
    Stores individual line items for each order
    """
    __tablename__ = 'line_orders'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='RESTRICT'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    size = Column(String(20), nullable=True)
    color = Column(String(20), nullable=True)
    
    # Relationships
    order = relationship("Order", back_populates="line_orders")
    product = relationship("Product", back_populates="line_orders")
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'price': float(self.price) if self.price else 0,
            'size': self.size,
            'color': self.color
        }


class Blog(Base):
    """
    Blog model - Maps to 'blogs' table
    Stores blog posts with content and publication status
    """
    __tablename__ = 'blogs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.current_timestamp())
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'image_url': self.image_url,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
