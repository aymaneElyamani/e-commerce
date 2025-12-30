"""
Database Configuration and Session Management

This module provides database engine creation, session management,
and utilities for database operations using SQLAlchemy.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.pool import StaticPool
from contextlib import contextmanager
from config import Config

# Import Base from models to ensure all models are registered
from app.models import Base

# Create the SQLAlchemy engine
# The engine is configured based on the DATABASE_URL from config
_db_url = Config.DATABASE_URL or ""

engine_kwargs = {
    "echo": getattr(Config, "SQLALCHEMY_ECHO", False),
    "pool_pre_ping": True,
}

# For SQLite, we need special configuration to handle threading.
if _db_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
    # Only use StaticPool for in-memory SQLite.
    if ":memory:" in _db_url or _db_url in {"sqlite://", "sqlite:///:memory:"}:
        engine_kwargs["poolclass"] = StaticPool

engine = create_engine(_db_url, **engine_kwargs)

# Create a configured "Session" class
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create a scoped session for thread-safe operations
db_session = scoped_session(SessionLocal)


def init_db():
    """
    Initialize the database by creating all tables.
    This replaces the old init_db() function that used raw SQL.
    """
    # Import all models to ensure they are registered with Base
    from app.models import User, Product, Offer, Order, LineOrder, Blog
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully using SQLAlchemy ORM")


def get_db():
    """
    Get a database session.
    This is a dependency that should be used in route handlers.
    
    Usage in Flask routes:
        db = get_db()
        try:
            # Your database operations
            db.commit()
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()
    """
    return db_session()


@contextmanager
def get_db_context():
    """
    Context manager for database sessions.
    Automatically handles commit/rollback and cleanup.
    
    Usage:
        with get_db_context() as db:
            user = db.query(User).filter_by(email='test@example.com').first()
            # Session is automatically committed on success
            # or rolled back on exception
    """
    db = db_session()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def close_db():
    """
    Remove the database session.
    This should be called at the end of each request or when the application shuts down.
    """
    db_session.remove()


# Example query helpers for common operations
class DBHelper:
    """Helper class with common database operations"""
    
    @staticmethod
    def get_or_404(db, model, id):
        """
        Get a record by ID or return None
        
        Args:
            db: Database session
            model: SQLAlchemy model class
            id: Record ID
            
        Returns:
            Model instance or None
        """
        return db.query(model).filter(model.id == id).first()
    
    @staticmethod
    def get_all(db, model, limit=None, offset=None, order_by=None):
        """
        Get all records with optional pagination and ordering
        
        Args:
            db: Database session
            model: SQLAlchemy model class
            limit: Maximum number of records to return
            offset: Number of records to skip
            order_by: Column to order by (default: id desc)
            
        Returns:
            List of model instances
        """
        query = db.query(model)
        
        if order_by is not None:
            query = query.order_by(order_by)
        else:
            query = query.order_by(model.id.desc())
        
        if offset:
            query = query.offset(offset)
        if limit:
            query = query.limit(limit)
            
        return query.all()
    
    @staticmethod
    def delete_by_id(db, model, id):
        """
        Delete a record by ID
        
        Args:
            db: Database session
            model: SQLAlchemy model class
            id: Record ID
            
        Returns:
            True if deleted, False if not found
        """
        record = db.query(model).filter(model.id == id).first()
        if record:
            db.delete(record)
            db.commit()
            return True
        return False
