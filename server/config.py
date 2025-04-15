import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    # Get the DATABASE_URL from environment
    DATABASE_URL = os.getenv('DATABASE_URL')
    
    # Debug: Print the DATABASE_URL to check if it's being loaded
    # print("Current DATABASE_URL:", DATABASE_URL)
    
    # Check if using internal Railway URL
    if DATABASE_URL and 'railway.internal' in DATABASE_URL:
        print("\nWARNING: You are using an internal Railway URL which won't work locally.")
        print("Please use the public Railway URL from your Railway dashboard.")
        print("Go to your Railway project -> PostgreSQL -> Connect -> External URL")
        exit(1)
    
    # If DATABASE_URL is not set, use a default local PostgreSQL URL
    if not DATABASE_URL:
        print("\nWARNING: DATABASE_URL not found in environment variables")
        print("Please create a .env file with your Railway PostgreSQL public URL")
        exit(1)
    
    # If DATABASE_URL starts with postgres://, replace it with postgresql://
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Secret key for session management
    SECRET_KEY = os.getenv('SECRET_KEY', '000')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-here'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    # Add production-specific settings here
    PROPAGATE_EXCEPTIONS = True
    # Configure logging
    LOG_TO_STDOUT = os.environ.get('LOG_TO_STDOUT')
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
