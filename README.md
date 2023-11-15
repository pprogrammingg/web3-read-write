# GoTax
Tax software to process crypto transactions tax.

Supported sources:
- Metamask
- Kraken transactions

# Todo
- Go Tutorials - 
- Obtain and read CSV
    - Download Kraken transaciton CSVs (15 min) [done]
    - Read the CSV file, print first 5 lines (30 min) 
    -

- database_module
    - Create a database and connect to it (1 hr)
    - Create a transactions table schema to unify all transaction formats, include usd_price_asset_1, usd_price_asset_2 price(30 min)

- add_transactions_type_kraken based on CSV
    - read each line from transactions CSV, perform transforms, insert in Transactions table
        - transforms (2 hrs)

- usd_price_insert
    - Download historic prices of several major coins vs USD (BTC, ETH, ADA) (30 min)
    - put each price hisotry in prices table, have index on non-usd asset and on date, date stored in same format as 
    Transaction
    - Normalize with Transactions: Read each file, for each date find the corresponding date in transactions table and update usd_price_asset_1, usd_price_asset_2

- calculate_tax_args_year_method
    - calculate_tax_args_2022_ACB : read each row where date is in 2022 and calculate Average cost basis (3 hrs)
    - return result and link to download file

- add_transactions_type_metamask
    

