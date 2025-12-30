from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    DATABASE_URL = os.environ.get("DATABASE_URL") or "sqlite:///./ecommerce.db"
    
    # SQLAlchemy configuration
    # Supports PostgreSQL, MySQL, and SQLite
    # Examples:
    # PostgreSQL: postgresql://user:password@localhost:5432/dbname
    # MySQL: mysql+pymysql://user:password@localhost:3306/dbname
    # SQLite: sqlite:///./ecommerce.db (relative path)
    # SQLite: sqlite:////absolute/path/to/ecommerce.db (absolute path)
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False  # Set to True to log all SQL statements
