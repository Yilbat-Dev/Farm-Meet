#!/bin/sh
url="https://api.paystack.co/transferrecipient"
authorization="Authorization: Bearer sk_test_c769538a9967bf72da362d64b106778ee21d61b1"
content_type="Content-Type: application/json"
data='{
  "type": "nuban",
  "name": "Zenith Test",
  "account_number": "0000000000",
  "bank_code": "057",
  "currency": "NGN"
}'

curl "$url" -H "$authorization" -H "$content_type" -d "$data" -X POST
  # Replace with your actual secret key
#


