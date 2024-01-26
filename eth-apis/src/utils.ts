import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import axios from 'axios';

// transfer transaction from EtherScan
export interface InputJson {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

// formatted transfer transaction for Integral
export interface TransferTxOutput {
  id: string;
  accountId: string;
  toAddress: string;
  fromAddress: string;
  type: string;
  amount: string;
  symbol: string;
  decimal: number;
  timestamp: string;
  txnHash: string;
}

/**
 * Converts an inputJson representing transfer transaction records to desired formatted output.
 * @param inputJson 
 * @param accountAddress 
 * @returns 
 */
export function formatTransferTxJsonObject(inputJson: InputJson, accountAddress: string): TransferTxOutput {
  const id = uuidv4(); // Generate a random alphanumeric of 32 characters
  const accountId = uuidv4() + '-n1'; // generate a random id and post-fix it 

  const toAddress = inputJson.to;
  const fromAddress = inputJson.from;

  // figure out whether the transfer was deposit or withdrawal
  const type = toAddress === accountAddress ? 'deposit' : 'withdrawal';

  // Convert value to amount with 18 decimal places
  const decimal = Number(inputJson.tokenDecimal);
  const amount = convertToDecimalAmount(inputJson.value, decimal);

  const symbol = inputJson.tokenSymbol;

  // Convert timeStamp to UTC timestamp
  const timestamp = new Date(Number(inputJson.timeStamp) * 1000).toISOString();

  const txnHash = inputJson.hash;

  const output: TransferTxOutput = {
    id,
    accountId,
    toAddress,
    fromAddress,
    type,
    amount,
    symbol,
    decimal,
    timestamp,
    txnHash,
  };

  return output;
}

/**
 * Convert an array of transfer transactions to the desired output format.
 * @param inputJsonArray 
 * @param accountAddress 
 * @returns 
 */
export function formatTransferTxJsonArray(inputJsonArray: InputJson[], accountAddress: string): TransferTxOutput[] {
  return inputJsonArray.map((inputJson) => formatTransferTxJsonObject(inputJson, accountAddress));
}


// Given long integer formats along with decimal value output a correctly represented decimal number 
export function convertToDecimalAmount(inputString: string, decimalAmount: number): string {
    const stringValue = inputString.toString();
    const integerPart = stringValue.slice(0, -decimalAmount) || '0';
    const fractionalPart = stringValue.slice(-decimalAmount);

    const formattedAmount = `${integerPart}.${fractionalPart}`;
    return parseFloat(formattedAmount).toFixed(decimalAmount);
}

/**
 * Filter transfer transactions by token symbol
 */
export function filterByTokenSymbol(transactions: TransferTxOutput[], tokenSymbol: string): TransferTxOutput[] {
    if (typeof tokenSymbol === 'string') {
        return transactions.filter(transaction => transaction.symbol === tokenSymbol);
      } else {
        console.log("got here");
        // If tokenSymbol is undefined or not a string, return the original array
        return transactions;
      }
}

/**
 * fetch all transactions for an account
*/
// Internal function to fetch and write transfer transactions to a JSON file
// async function fetchAndWriteTransactions(page: number, accountAddress: string): Promise<void> {
//     const apiKey = '26Y7IBZ8M1IG48RZY1KH32PDZQZVF2VTSS';
//     const pageSize = 1000; // Number of transactions per page
  
//     try {
//       console.log(`Fetching transactions for page ${page}...`);
  
//       const response = await axios.get('https://api.etherscan.io/api', {
//         params: {
//           module: 'account',
//           action: 'tokentx',
//           address: accountAddress,
//           page,
//           offset: pageSize,
//           startblock: 0,
//           endblock: 27025780,
//           sort: 'desc',
//           apikey: apiKey,
//         },
//       });
  
//       console.log('Etherscan API response called by /get-token-transactions:', response.data);
//       const transactions = response.data.result;
  
//       if (transactions.length > 0) {
//         console.log(`Writing transactions for page ${page} to file...`);
  
//         const transactions = response.data.result;

//         // format the response json
//         let formattedTransactions = formatTransferTxJsonArray(transactions, accountAddress);


//         const fileName = 'account_transfer_records.json';
//         const fileData = fs.existsSync(fileName) ? JSON.parse(fs.readFileSync(fileName, 'utf-8')) : [];
//         fileData.push(...formattedTransactions);
//         fs.writeFileSync(fileName, JSON.stringify(fileData, null, 2));
  
//         console.log(`Transactions for page ${page} written to file.`);
//       } else {
//         console.log(`No more transactions for page ${page}. Stopping.`);
//       }
//     } catch (error: any) {
//       console.error(`Error fetching/writing transactions for page ${page}:`, error.message);
//     }
//   }
  
  // Function to fetch transactions for all pages and write to a JSON file
//   export async function fetchAllTransactions(accountAddress: string): Promise<void> {
//     let page = 1;
  
//     // Continue fetching and writing transactions until there are no more records
//     while (true) {
//       const hasMoreTransactions  = await fetchAndWriteTransactions(page, accountAddress);
//       page += 1;
      
//       // mitigate rate limit issue
//       await new Promise(resolve => setTimeout(resolve, 500));
//       // Check if there are more transactions
//     if (hasMoreTransactions ) {
//         console.log(`No more transactions for page ${page}. Stopping.`);
//         return false;
//       }
//     }
//   }
  