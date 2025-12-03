#!/bin/bash
# Script to create a test user for login

BASE_URL="http://localhost:3000"

echo "Creating test user (Dispatcher)..."
echo ""

curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dispatcher@example.com",
    "password": "password123",
    "firstName": "สมชาย",
    "lastName": "เจ้าหน้าที่",
    "role": "dispatcher",
    "phone": "+66812345678"
  }' | jq '.'

echo ""
echo "✅ User created! You can now login with:"
echo "   Email: dispatcher@example.com"
echo "   Password: password123"

