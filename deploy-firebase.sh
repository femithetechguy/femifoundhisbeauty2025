#!/bin/bash
# Script to deploy Firestore rules to Firebase

echo "=== Firebase Rules Deployment Script ==="
echo "This script will create and deploy your Firestore rules"

# Make sure we have the firebase.json
if [ ! -f firebase.json ]; then
  echo "Creating firebase.json..."
  
  cat > firebase.json << EOF
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/*.md",
      "firebase-*.html",
      "deploy-firebase.sh"
    ]
  }
}
EOF

  echo "Created firebase.json"
fi

# Create firestore.indexes.json if it doesn't exist
if [ ! -f firestore.indexes.json ]; then
  echo "Creating firestore.indexes.json..."
  
  cat > firestore.indexes.json << EOF
{
  "indexes": [],
  "fieldOverrides": []
}
EOF

  echo "Created firestore.indexes.json"
fi

# Create firestore.rules from our rules.js file
echo "Creating firestore.rules from rules.js..."

# Extract rules from rules.js (simple approach)
cat firebase/rules.js > firestore.rules

echo "Created firestore.rules"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
  echo "Firebase CLI not found. Please install it with:"
  echo "npm install -g firebase-tools"
  exit 1
fi

# Ask if user wants to deploy
echo ""
echo "Do you want to deploy these rules to Firebase now? (y/n)"
read -r deploy_answer

if [[ "$deploy_answer" =~ ^[Yy]$ ]]; then
  # Deploy rules to Firebase
  echo "Deploying rules to Firebase..."
  firebase deploy --only firestore:rules
  
  echo ""
  echo "=== Next steps ==="
  echo "1. Check the Firebase console to verify rules were deployed"
  echo "2. Test your RSVP form again"
  echo "3. If issues persist, try firebase-minimal-test.html"
else
  echo ""
  echo "=== Next steps ==="
  echo "1. Review the created firestore.rules file"
  echo "2. When ready, deploy manually with: firebase deploy --only firestore:rules"
fi

echo ""
echo "Done!"
