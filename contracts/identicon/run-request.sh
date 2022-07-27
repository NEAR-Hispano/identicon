#!/bin/bash
#
# Use:'
#    ./run-request.sh NEAR_ACCOUNT_ID NUMBER 
#
# Example:
#   ./runall.sh yourname.testnet 354
#
# Notes: 
#  - Must call "near login" before running this command.
#  - Number must be a 3 digits number.
#
export PARENT=$1
export NID=$2
export CONTRACT=c1.identicon.testnet
export SUBJECT_ID=ar_dni_12488$NID
export REQUEST_UID="ABCD1234"

# Create a verification request
near call $CONTRACT request_verification '{"uid":"'$REQUEST_UID'", "is_type":"ProofOfLife", "subject_id":"'$SUBJECT_ID'", "payload":"Simulated encrypted PAYLOAD"}' --accountId $PARENT
