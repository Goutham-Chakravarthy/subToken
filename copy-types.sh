#!/bin/bash

# Navigate to the project root
cd "$(dirname "$0")"

# Create target directories
mkdir -p frontend/src/contracts/typechain-types

# Copy all Typechain files
cp -r contracts/typechain-types/* frontend/src/contracts/typechain-types/

echo "Typechain types have been copied to frontend/src/contracts/typechain-types"
