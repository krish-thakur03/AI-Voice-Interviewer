"""Quick MongoDB connection test script."""
import ssl
import certifi
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://krish0309thakur_db_user:u2JHDqLB7k6ggHDN@cluster0.khymxdr.mongodb.net/?appName=Cluster0"

print("=" * 50)
print("MongoDB Connection Test")
print("=" * 50)

# --- Test 1: With certifi CA bundle ---
print("\n[Test 1] certifi CA bundle...")
try:
    c = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())
    c.admin.command("ping")
    print("  ✅ SUCCESS")
    c.close()
except Exception as e:
    print(f"  ❌ FAILED: {e}")

# --- Test 2: Allow invalid certs ---
print("\n[Test 2] tlsAllowInvalidCertificates=True...")
try:
    c = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tls=True, tlsAllowInvalidCertificates=True)
    c.admin.command("ping")
    print("  ✅ SUCCESS")
    c.close()
except Exception as e:
    print(f"  ❌ FAILED: {e}")

# --- Test 3: Custom SSL context (no verify) ---
print("\n[Test 3] Custom SSL context (CERT_NONE)...")
try:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    c = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)
    c.admin.command("ping")
    print("  ✅ SUCCESS")
    c.close()
except Exception as e:
    print(f"  ❌ FAILED: {e}")

# --- Test 4: Direct connection string without SRV ---
print("\n[Test 4] Without TLS (tls=False)...")
try:
    c = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tls=False)
    c.admin.command("ping")
    print("  ✅ SUCCESS")
    c.close()
except Exception as e:
    print(f"  ❌ FAILED: {e}")

# --- Test 5: PyOpenSSL ---
print("\n[Test 5] With PyOpenSSL (if installed)...")
try:
    import pymongo
    c = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000,
        tls=True,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True,
        tlsAllowInvalidHostnames=True,
    )
    c.admin.command("ping")
    print("  ✅ SUCCESS")
    c.close()
except Exception as e:
    print(f"  ❌ FAILED: {e}")

print("\n" + "=" * 50)
print("Python SSL version:", ssl.OPENSSL_VERSION)
print("=" * 50)
