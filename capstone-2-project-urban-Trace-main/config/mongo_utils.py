"""
MongoDB utility functions for UrbanTrace.
Provides helpers for database operations and data management.
"""

import logging
from django.db import connections
from django.conf import settings
from pymongo import MongoClient

logger = logging.getLogger(__name__)


def get_mongo_connection():
    """
    Get MongoDB connection instance.
    
    Returns:
        pymongo.MongoClient: MongoDB client instance
    """
    try:
        client = MongoClient(settings.DATABASES['default']['HOST'])
        return client
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise


def test_mongodb_connection():
    """
    Test if MongoDB is accessible.
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        connection = connections['default']
        connection.ensure_connection()
        return True, "✅ MongoDB connection successful"
    except Exception as e:
        return False, f"❌ MongoDB connection failed: {e}"


def get_database_stats():
    """
    Get MongoDB database statistics.
    
    Returns:
        dict: Database statistics
    """
    try:
        client = get_mongo_connection()
        db = client[settings.DATABASES['default']['NAME']]
        
        stats = {
            'database': db.name,
            'collections': db.list_collection_names(),
            'size': db.command('dbStats')['dataSize'],
        }
        
        # Get collection stats
        collections_info = {}
        for collection_name in stats['collections']:
            collection = db[collection_name]
            collections_info[collection_name] = {
                'count': collection.count_documents({}),
                'size': db.command('collStats', collection_name).get('size', 0),
            }
        
        stats['collections_info'] = collections_info
        return stats
    except Exception as e:
        logger.error(f"Failed to get database stats: {e}")
        return {'error': str(e)}


def delete_all_data():
    """
    DANGER: Delete all data from the database.
    Use only for development/testing.
    
    Returns:
        dict: Deletion results
    """
    if not settings.DEBUG:
        raise PermissionError("Cannot delete data in production")
    
    try:
        client = get_mongo_connection()
        db = client[settings.DATABASES['default']['NAME']]
        
        results = {}
        for collection_name in db.list_collection_names():
            result = db[collection_name].delete_many({})
            results[collection_name] = {
                'deleted_count': result.deleted_count,
            }
        
        logger.warning("⚠️  All data has been deleted from database!")
        return results
    except Exception as e:
        logger.error(f"Failed to delete data: {e}")
        return {'error': str(e)}


def create_indexes():
    """
    Ensure all recommended indexes exist on MongoDB collections.
    """
    try:
        client = get_mongo_connection()
        db = client[settings.DATABASES['default']['NAME']]
        
        # Issues indexes
        issues_collection = db['issues_issue']
        issues_collection.create_index([('status', 1), ('created_at', -1)])
        issues_collection.create_index([('category', 1), ('status', 1)])
        issues_collection.create_index([('created_by', 1)])
        issues_collection.create_index([('assigned_to', 1)])
        
        # Notifications indexes
        notifications_collection = db['dashboard_notification']
        notifications_collection.create_index([('user', 1), ('created_at', -1)])
        notifications_collection.create_index([('user', 1), ('is_read', 1)])
        
        logger.info("✅ MongoDB indexes created successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")
        return False


def export_collection_to_json(collection_name):
    """
    Export a MongoDB collection to JSON format.
    
    Args:
        collection_name (str): Name of the collection
    
    Returns:
        str: JSON representation of collection
    """
    import json
    from bson import ObjectId
    
    try:
        client = get_mongo_connection()
        db = client[settings.DATABASES['default']['NAME']]
        collection = db[collection_name]
        
        documents = list(collection.find())
        
        # Custom JSON encoder for ObjectId
        class ObjectIdEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, ObjectId):
                    return str(obj)
                return super().default(obj)
        
        return json.dumps(documents, cls=ObjectIdEncoder, indent=2, default=str)
    except Exception as e:
        logger.error(f"Failed to export collection: {e}")
        return None


class MongoDBHealthCheck:
    """Health check utility for MongoDB."""
    
    @staticmethod
    def check():
        """
        Perform a health check on MongoDB.
        
        Returns:
            dict: Health check results
        """
        success, message = test_mongodb_connection()
        
        return {
            'status': 'healthy' if success else 'unhealthy',
            'message': message,
            'database': settings.DATABASES['default']['NAME'],
            'host': settings.DATABASES['default']['HOST'],
        }
